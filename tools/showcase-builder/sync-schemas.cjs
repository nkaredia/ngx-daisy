const { readFileSync, writeFileSync } = require('node:fs');
const { dirname, join } = require('node:path');

const angularRoot = dirname(require.resolve('@angular/build/package.json'));
for (const name of ['application', 'dev-server']) {
  writeFileSync(
    join(__dirname, `${name}.schema.json`),
    readFileSync(join(angularRoot, 'src', 'builders', name, 'schema.json')),
  );
}
