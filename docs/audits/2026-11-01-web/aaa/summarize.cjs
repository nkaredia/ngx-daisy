// Run from repository root after the browser batch. Raw input is never app code.
const fs = require('node:fs');
const path = require('node:path');
const zlib = require('node:zlib');
const input = process.env.AUDIT_RESULTS;
if (!input) throw new Error('Set AUDIT_RESULTS to the AAA browser result directory');
const output = __dirname;
const routes = [
  ...fs
    .readFileSync('projects/showcase/src/app/showcase-pages.ts', 'utf8')
    .matchAll(/path: '([^']+)'/g),
].map((m) => '/' + m[1]);
const themes = [
  ...fs
    .readFileSync('projects/showcase/src/app/theme-builder/showcase-themes.ts', 'utf8')
    .split('export const daisyThemes = [')[1]
    .split('] as const')[0]
    .matchAll(/'([a-z]+)'/g),
].map((m) => m[1]);
const reports = fs
  .readdirSync(input)
  .filter((f) => f.endsWith('.json'))
  .map((f) => JSON.parse(fs.readFileSync(path.join(input, f), 'utf8')))
  .filter((r) => r.mode === 'aaa-static-all-levels' && [1440, 320].includes(r.width));
reports.sort(
  (a, b) => a.route.localeCompare(b.route) || a.theme.localeCompare(b.theme) || a.width - b.width,
);
const keys = new Set(reports.map((r) => `${r.route}|${r.theme}|${r.width}`));
const missing = routes.flatMap((route) =>
  themes.flatMap((theme) =>
    [1440, 320]
      .filter((width) => !keys.has(`${route}|${theme}|${width}`))
      .map((width) => ({ route, theme, width })),
  ),
);
const byTheme = themes.map((theme) => {
  const cases = reports.filter((r) => r.theme === theme);
  return {
    theme,
    cases: cases.length,
    aaaContrastCases: cases.filter((r) =>
      r.violations.some((v) => v.id === 'color-contrast-enhanced'),
    ).length,
    aaContrastCases: cases.filter((r) => r.violations.some((v) => v.id === 'color-contrast'))
      .length,
    incompleteCases: cases.filter((r) => r.incomplete.length).length,
    target44ReviewCases: cases.filter((r) => r.target44.review.length).length,
    overflowCases: cases.filter((r) => r.viewportOverflow > 0).length,
  };
});
const rules = {};
for (const report of reports)
  for (const rule of report.violations) {
    const entry = (rules[rule.id] ||= { cases: 0, nodeOccurrences: 0 });
    entry.cases++;
    entry.nodeOccurrences += rule.count;
  }
const grouped = new Map();
for (const report of reports) {
  for (const disposition of ['violations', 'incomplete']) {
    for (const rule of report[disposition]) {
      for (const node of rule.nodes) {
        const key = JSON.stringify([report.route, disposition, rule.id, node.target]);
        let group = grouped.get(key);
        if (!group) {
          group = {
            route: report.route,
            disposition,
            rule: rule.id,
            target: node.target,
            html: node.html,
            themes: new Set(),
            widths: new Set(),
            occurrences: 0,
            ratios: [],
          };
          grouped.set(key, group);
        }
        group.themes.add(report.theme);
        group.widths.add(report.width);
        group.occurrences++;
        for (const check of node.checks) {
          const ratio = check.data?.contrastRatio;
          if (typeof ratio === 'number' && ratio > 0) group.ratios.push(ratio);
        }
      }
    }
  }
}
const findings = [...grouped.values()].map((group) => ({
  ...group,
  themes: [...group.themes].sort(),
  widths: [...group.widths].sort(),
  ratios: undefined,
  minimumReportedRatio: group.ratios.length ? Math.min(...group.ratios) : null,
}));
fs.writeFileSync(
  path.join(output, 'findings.json.gz'),
  zlib.gzipSync(JSON.stringify(findings), { level: 9 }),
);
const summary = {
  sourceRevision: '972cb26',
  expectedCases: routes.length * themes.length * 2,
  completedCases: reports.length,
  uniqueCases: keys.size,
  coverageComplete: missing.length === 0,
  missing,
  byTheme,
  rules,
  notes: [
    'Default settled states only; no all-state or manual AT conformance claim.',
    'Target44 entries are candidates for exception review, not automatic failures.',
    'Syntax-highlighted text excluded; viewer controls included.',
    'AAA color-contrast-enhanced may omit pairs already failing AA; inspect both rules.',
  ],
};
fs.writeFileSync(path.join(output, 'summary.json'), JSON.stringify(summary, null, 2) + '\n');
fs.writeFileSync(
  path.join(output, 'browser-results.json.gz'),
  zlib.gzipSync(JSON.stringify(reports), { level: 9 }),
);
fs.writeFileSync(
  path.join(output, 'case-matrix.csv'),
  'route,theme,width,aaaContrastNodes,aaContrastNodes,incompleteRules,target44Candidates,overflow\n' +
    reports
      .map((r) =>
        [
          r.route,
          r.theme,
          r.width,
          r.violations.find((v) => v.id === 'color-contrast-enhanced')?.count || 0,
          r.violations.find((v) => v.id === 'color-contrast')?.count || 0,
          r.incomplete.length,
          r.target44.review.length,
          r.viewportOverflow,
        ].join(','),
      )
      .join('\n') +
    '\n',
);
fs.writeFileSync(
  path.join(output, 'theme-results.md'),
  '| Theme | Cases | AAA contrast flags | AA contrast flags | Incomplete | Target candidates | Overflow |\n| --- | ---: | ---: | ---: | ---: | ---: | ---: |\n' +
    byTheme
      .map(
        (r) =>
          `| ${r.theme} | ${r.cases} | ${r.aaaContrastCases} | ${r.aaContrastCases} | ${r.incompleteCases} | ${r.target44ReviewCases} | ${r.overflowCases} |`,
      )
      .join('\n') +
    '\n',
);
console.log(
  JSON.stringify({
    completed: reports.length,
    expected: summary.expectedCases,
    missing: missing.length,
    rules,
  }),
);
if (missing.length || keys.size !== reports.length) process.exitCode = 1;
