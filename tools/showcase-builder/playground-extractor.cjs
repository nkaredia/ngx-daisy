const ts = require('typescript');
const { extractExampleFiles } = require('./example-source-extractor.cjs');
const { basename, resolve } = require('node:path');

const START = '/**  Generate props during build  */';
const END = '/** End generated props */';

function property(object, name) {
  return object.properties.find(
    (item) => ts.isPropertyAssignment(item) && item.name.getText() === name,
  );
}

function literal(node) {
  if (!node) return { known: true, value: undefined };
  if (node.kind === ts.SyntaxKind.TrueKeyword) return { known: true, value: true };
  if (node.kind === ts.SyntaxKind.FalseKeyword) return { known: true, value: false };
  if (node.kind === ts.SyntaxKind.NullKeyword) return { known: true, value: null };
  if (ts.isStringLiteralLike(node)) return { known: true, value: node.text };
  if (ts.isNumericLiteral(node)) return { known: true, value: Number(node.text) };
  if (ts.isIdentifier(node) && node.text === 'undefined') return { known: true, value: undefined };
  if (
    ts.isPrefixUnaryExpression(node) &&
    node.operator === ts.SyntaxKind.MinusToken &&
    ts.isNumericLiteral(node.operand)
  ) {
    return { known: true, value: -Number(node.operand.text) };
  }
  return { known: false };
}

function resolveClass(checker, reference) {
  let symbol = checker.getSymbolAtLocation(reference);
  if (symbol?.flags & ts.SymbolFlags.Alias) symbol = checker.getAliasedSymbol(symbol);
  const declaration = symbol?.declarations?.find(ts.isClassDeclaration);
  if (!declaration || declaration.getSourceFile().isDeclarationFile) {
    throw new Error(`Cannot resolve source class for ${reference.getText()}.`);
  }
  return declaration;
}

/** Classify resolved value types, not display strings or accepted transform types. */
function actionForType(type) {
  const parts = (type.isUnion() ? type.types : [type]).filter(
    (part) => !(part.flags & (ts.TypeFlags.Null | ts.TypeFlags.Undefined)),
  );
  const booleans = parts.length && parts.every((part) => part.flags & ts.TypeFlags.BooleanLike);
  if (booleans) {
    const options = parts.flatMap((part) =>
      part.flags & ts.TypeFlags.BooleanLiteral ? [part.intrinsicName === 'true'] : [false, true],
    );
    return { kind: 'toggle', options: [...new Set(options)].sort() };
  }
  const literals =
    parts.length &&
    parts.every(
      (part) =>
        part.isStringLiteral() ||
        part.isNumberLiteral() ||
        part.flags & ts.TypeFlags.BooleanLiteral,
    );
  if (literals)
    return {
      kind: 'select',
      options: parts.map((part) =>
        part.flags & ts.TypeFlags.BooleanLiteral ? part.intrinsicName === 'true' : part.value,
      ),
    };
  if (parts.length && parts.every((part) => part.flags & ts.TypeFlags.StringLike))
    return { kind: 'text' };
  if (parts.length && parts.every((part) => part.flags & ts.TypeFlags.NumberLike))
    return { kind: 'number' };
  return { kind: 'unsupported', reason: 'This type requires a specialized action component.' };
}

function extractProps(checker, declaration) {
  const props = [];
  for (const member of checker.getPropertiesOfType(checker.getTypeAtLocation(declaration))) {
    const node = member.valueDeclaration;
    if (
      !node ||
      !ts.isPropertyDeclaration(node) ||
      !node.initializer ||
      !ts.isCallExpression(node.initializer)
    )
      continue;
    const call = node.initializer;
    const signalType = checker.getTypeAtLocation(call);
    const signalName = signalType.getSymbol()?.getName();
    if (!['InputSignal', 'InputSignalWithTransform', 'ModelSignal'].includes(signalName)) continue;
    // Verify the signal type comes from Angular, not a same-named application type.
    if (
      !signalType
        .getSymbol()
        .declarations?.some((item) =>
          item.getSourceFile().fileName.replaceAll('\\', '/').includes('/@angular/core/'),
        )
    )
      continue;
    const [valueType, writeType] = checker.getTypeArguments(signalType);
    if (!valueType) throw new Error(`Cannot resolve input type for ${member.getName()}.`);
    const required =
      ts.isPropertyAccessExpression(call.expression) && call.expression.name.text === 'required';
    const options = call.arguments[required ? 0 : 1];
    const alias =
      options && ts.isObjectLiteralExpression(options)
        ? literal(property(options, 'alias')?.initializer).value
        : undefined;
    const parts = valueType.isUnion() ? valueType.types : [valueType];
    const values = parts
      .filter((part) => part.isStringLiteral() || part.isNumberLiteral())
      .map((part) => part.value);
    const result = {
      name: alias ?? member.getName(),
      property: member.getName(),
      kind: signalName === 'ModelSignal' ? 'model' : 'input',
      type: checker.typeToString(valueType, node, ts.TypeFormatFlags.NoTruncation),
      required,
      optional: parts.some((part) => part.flags & ts.TypeFlags.Undefined),
      nullable: parts.some((part) => part.flags & ts.TypeFlags.Null),
      action: actionForType(valueType),
    };
    if (writeType)
      result.acceptedType = checker.typeToString(writeType, node, ts.TypeFormatFlags.NoTruncation);
    if (values.length) result.values = values;
    const description = ts.displayPartsToString(member.getDocumentationComment(checker));
    if (description) result.description = description;
    if (!required) {
      const initial = literal(call.arguments[0]);
      result.defaultExpression = call.arguments[0]?.getText() ?? 'undefined';
      if (initial.known && initial.value !== undefined) result.default = initial.value;
    }
    props.push(result);
  }
  return props;
}

async function extractPlaygrounds(tsConfig, workspaceRoot, logger) {
  const configPath = resolve(workspaceRoot, tsConfig);
  const loaded = ts.readConfigFile(configPath, ts.sys.readFile);
  if (loaded.error)
    throw new Error(ts.flattenDiagnosticMessageText(loaded.error.messageText, '\n'));
  const config = ts.parseJsonConfigFileContent(
    loaded.config,
    ts.sys,
    resolve(configPath, '..'),
    undefined,
    configPath,
  );
  if (config.errors.length)
    throw new Error(
      config.errors
        .map((error) => ts.flattenDiagnosticMessageText(error.messageText, '\n'))
        .join('\n'),
    );
  const paths = config.fileNames.filter((path) => basename(path) === 'playground.ts');
  if (!paths.length) return { modules: new Map(), watchFiles: [configPath] };
  // Resolve this workspace's library references to authored source, not stale dist declarations.
  const options = {
    ...config.options,
    strictNullChecks: true,
    paths: {
      ...config.options.paths,
      'ngx-daisy': [resolve(workspaceRoot, 'projects/ngx-daisy/public-api.ts')],
      'ngx-daisy/*': [resolve(workspaceRoot, 'projects/ngx-daisy/*/public-api.ts')],
    },
  };
  const program = ts.createProgram(paths, options);
  const checker = program.getTypeChecker();
  const transformed = new Map();
  const watchFiles = new Set([
    configPath,
    ...program.getSourceFiles().map((file) => file.fileName),
  ]);
  for (const path of paths) {
    const source = program.getSourceFile(path);
    const variable = source.statements
      .filter(ts.isVariableStatement)
      .flatMap((statement) => statement.declarationList.declarations)
      .find((item) => item.name.getText(source) === 'playground');
    if (!variable?.initializer || !ts.isObjectLiteralExpression(variable.initializer))
      throw new Error(`${path}: expected a playground object.`);
    const components = property(variable.initializer, 'components')?.initializer;
    if (!components || !ts.isArrayLiteralExpression(components))
      throw new Error(`${path}: expected playground.components array.`);
    const edits = [];
    for (const entry of components.elements) {
      if (!ts.isObjectLiteralExpression(entry))
        throw new Error(`${path}: component entries must be object literals.`);
      const reference = property(entry, 'class')?.initializer;
      if (!reference) throw new Error(`${path}: component entry is missing class.`);
      const declaration = resolveClass(checker, reference);
      const props = extractProps(checker, declaration);
      const entryText = source.text.slice(entry.getStart(source), entry.getEnd());
      const marker = /\/\*\*\s*Generate props during build\s*\*\//.exec(entryText);
      if (!marker)
        throw new Error(
          `${path}: ${reference.getText()} is missing the generated props placeholder.`,
        );
      const start = entry.getStart(source) + marker.index;
      const afterMarker = start + marker[0].length;
      const endMarker = source.text.indexOf(END, afterMarker);
      const end =
        endMarker >= 0 && endMarker < entry.getEnd() ? endMarker + END.length : afterMarker;
      if (property(entry, 'props') && end === afterMarker)
        throw new Error(`${path}: props already exists outside a generated region.`);
      const prefix = source.text.slice(entry.getStart(source), start);
      const separator = `${prefix.trimEnd().endsWith(',') ? '' : ','}${/\n[ \t]*$/.test(prefix) ? '' : '\n'}`;
      edits.push({
        start,
        end,
        text: `${separator}${START}\nname: ${JSON.stringify(declaration.name.text)},\nprops: ${JSON.stringify(props, null, 2)},\n${END}`,
      });
    }
    const previewReferences = [];
    const previews = property(variable.initializer, 'previews')?.initializer;
    if (previews) {
      if (!ts.isArrayLiteralExpression(previews))
        throw new Error(`${path}: previews must be a static array.`);
      previewReferences.push(...previews.elements);
    }
    const inlinePreviews = property(variable.initializer, 'inlinePreviews')?.initializer;
    if (inlinePreviews) {
      if (!ts.isArrayLiteralExpression(inlinePreviews))
        throw new Error(`${path}: inlinePreviews must be a static array.`);
      for (const entry of inlinePreviews.elements) {
        const reference =
          ts.isObjectLiteralExpression(entry) && property(entry, 'component')?.initializer;
        if (!reference)
          throw new Error(`${path}: inline preview must contain a component reference.`);
        previewReferences.push(reference);
      }
    }
    if (previewReferences.length) {
      if (property(variable.initializer, 'exampleSources'))
        throw new Error(`${path}: exampleSources is generated in memory; do not author it.`);
      const seen = new Set();
      const sources = [];
      for (const reference of previewReferences) {
        const declaration = resolveClass(checker, reference);
        const identity = `${declaration.getSourceFile().fileName}:${declaration.pos}`;
        if (seen.has(identity)) continue;
        seen.add(identity);
        const files = await extractExampleFiles(checker, declaration, watchFiles);
        sources.push(
          `{ component: ${reference.getText(source)}, files: ${JSON.stringify(files)} }`,
        );
      }
      const object = variable.initializer;
      const position = object.getEnd() - 1;
      const separator = object.properties.length && !object.properties.hasTrailingComma ? ',' : '';
      edits.push({
        start: position,
        end: position,
        text: `${separator}\nexampleSources: [${sources.join(',')}],\n`,
      });
    }
    let output = source.text;
    for (const edit of edits.sort((a, b) => b.start - a.start))
      output = output.slice(0, edit.start) + edit.text + output.slice(edit.end);
    const prettier = await import('prettier');
    const formatting = await prettier.resolveConfig(path);
    output = await prettier.format(output, { ...formatting, filepath: path });
    transformed.set(resolve(path), output);
  }
  logger.info(`[ngx-daisy-playground] prepared ${paths.length} playground module(s) in memory.`);
  return { modules: transformed, watchFiles: [...watchFiles] };
}

module.exports = { extractPlaygrounds, extractProps, actionForType };
