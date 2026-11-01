// Local, test-only instrumentation. Never include this server in the application.
const http = require('node:http'),
  fs = require('node:fs'),
  path = require('node:path');
const root = path.resolve(process.env.AUDIT_ROOT || 'dist/showcase/browser');
const axe = process.env.AXE_PATH;
if (!axe) throw new Error('Set AXE_PATH to axe-core 4.14.0 axe.min.js');
const results = path.resolve(
  process.env.AUDIT_RESULTS || '/private/tmp/ngx-daisy-web-audit/results',
);
fs.mkdirSync(results, { recursive: true });
const runner = `(async()=>{
const params=new URLSearchParams(location.search); const theme=params.get('auditTheme')||'light';
let tries=0;while(!document.querySelector('demo-playground .playground-preview')&&tries++<200)await new Promise(r=>setTimeout(r,100));
await document.fonts.ready; await new Promise(r=>setTimeout(r,350));
const shell=document.querySelector('.showcase-shell');if(shell)shell.setAttribute('data-theme',theme);
await new Promise(r=>requestAnimationFrame(()=>requestAnimationFrame(r)));
await new Promise(r=>setTimeout(r,1000));
const result=await axe.run({exclude:[['demo-example-code pre code']]},{runOnly:{type:'tag',values:['wcag2a','wcag2aa','wcag21a','wcag21aa','wcag22aa','best-practice']}});
const compact=items=>items.map(rule=>({id:rule.id,impact:rule.impact,tags:rule.tags,help:rule.help,helpUrl:rule.helpUrl,count:rule.nodes.length,nodes:rule.nodes.slice(0,60).map(node=>({target:node.target,html:node.html,failureSummary:node.failureSummary,checks:[...node.any,...node.all,...node.none].map(check=>({id:check.id,data:check.data,message:check.message}))}))}));
const report={route:location.pathname,theme,width:innerWidth,height:innerHeight,title:document.title,axeVersion:axe.version,viewportOverflow:document.documentElement.scrollWidth-innerWidth,violations:compact(result.violations),incomplete:compact(result.incomplete),passes:result.passes.map(rule=>rule.id),duplicateIds:[...document.querySelectorAll('[id]')].map(e=>e.id).filter((id,i,all)=>id&&all.indexOf(id)!==i)};
await fetch('/__audit/results',{method:'POST',headers:{'content-type':'application/json'},body:JSON.stringify(report)});
const output=document.createElement('pre');output.id='web-audit-result';output.hidden=true;output.textContent=JSON.stringify({done:true,route:report.route,theme,width:innerWidth,violations:report.violations.map(rule=>({id:rule.id,count:rule.count})),incomplete:report.incomplete.length,overflow:report.viewportOverflow});document.body.append(output);
})().catch(error=>{const node=document.createElement('pre');node.id='web-audit-result';node.textContent=JSON.stringify({error:String(error)});document.body.append(node);});`;
const mime = {
  '.js': 'text/javascript',
  '.css': 'text/css',
  '.html': 'text/html',
  '.svg': 'image/svg+xml',
  '.json': 'application/json',
  '.png': 'image/png',
  '.webp': 'image/webp',
  '.woff2': 'font/woff2',
};
http
  .createServer((req, res) => {
    const url = new URL(req.url, 'http://127.0.0.1:4507');
    if (url.pathname === '/__audit/axe.js') {
      res.setHeader('content-type', 'text/javascript');
      return res.end(fs.readFileSync(axe));
    }
    if (url.pathname === '/__audit/runner.js') {
      res.setHeader('content-type', 'text/javascript');
      return res.end(runner);
    }
    if (url.pathname === '/__audit/results' && req.method === 'POST') {
      let body = '';
      req.on('data', (part) => (body += part));
      req.on('end', () => {
        const data = JSON.parse(body);
        fs.writeFileSync(
          path.join(
            results,
            data.route.replaceAll('/', '') + '-' + data.theme + '-' + data.width + '.json',
          ),
          JSON.stringify(data, null, 2),
        );
        res.end('ok');
      });
      return;
    }
    let file = path.join(root, decodeURIComponent(url.pathname));
    if (!file.startsWith(root + path.sep)) {
      res.statusCode = 403;
      return res.end();
    }
    if (!fs.existsSync(file) || fs.statSync(file).isDirectory())
      file = path.join(root, 'index.html');
    res.setHeader('content-type', mime[path.extname(file)] || 'application/octet-stream');
    let content = fs.readFileSync(file);
    if (file.endsWith('index.html'))
      content = content
        .toString()
        .replace(
          '</head>',
          '<script defer src="/__audit/axe.js"></script><script defer src="/__audit/runner.js"></script></head>',
        );
    res.end(content);
  })
  .listen(4507, '127.0.0.1', () =>
    process.stdout.write('Audit fixture ready at http://127.0.0.1:4507\n'),
  );
