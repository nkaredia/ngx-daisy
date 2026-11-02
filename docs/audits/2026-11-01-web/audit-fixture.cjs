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
const themeSource = fs.readFileSync(
  'projects/showcase/src/app/theme-builder/showcase-themes.ts',
  'utf8',
);
const shippedThemes = [
  ...themeSource
    .split('export const daisyThemes = [')[1]
    .split('] as const')[0]
    .matchAll(/'([a-z]+)'/g),
].map((match) => match[1]);
const definitions = require(path.resolve('node_modules/daisyui/theme/object')).default;
if (
  shippedThemes.length !== 35 ||
  shippedThemes.some((name) => !definitions[name]) ||
  Object.keys(definitions).some((name) => !shippedThemes.includes(name))
)
  throw new Error('Showcase preset inventory differs from installed daisyUI');
const aaaMode = process.env.AUDIT_AAA === '1';
const catalogRoutes = [
  ...fs
    .readFileSync('projects/showcase/src/app/showcase-pages.ts', 'utf8')
    .matchAll(/path: '([^']+)'/g),
].map((match) => '/' + match[1]);
const runner = `(async()=>{
const aaaMode=${JSON.stringify(aaaMode)}; const catalogRoutes=${JSON.stringify(catalogRoutes)};
const params=new URLSearchParams(location.search); const requested=params.get('auditTheme')||'light';
const themes=requested==='all'?${JSON.stringify(shippedThemes)}:[requested];
let tries=0;while(!document.querySelector('demo-playground .playground-preview')&&tries++<200)await new Promise(r=>setTimeout(r,100));
await document.fonts.ready; await new Promise(r=>setTimeout(r,350));
const shell=document.querySelector('.showcase-shell');
if(requested==='all'||params.has('auditMenus')){
 const stable=document.createElement('style');stable.textContent='*,*::before,*::after{transition:none!important;animation:none!important;scroll-behavior:auto!important}';document.head.append(stable);
}
const compact=items=>items.map(rule=>({id:rule.id,impact:rule.impact,tags:rule.tags,help:rule.help,helpUrl:rule.helpUrl,count:rule.nodes.length,nodes:rule.nodes.map(node=>({target:node.target,html:node.html,failureSummary:node.failureSummary,checks:[...node.any,...node.all,...node.none].map(check=>({id:check.id,data:check.data,message:check.message}))}))}));
const options=aaaMode?{runOnly:{type:'tag',values:['wcag2a','wcag2aa','wcag2aaa','wcag21a','wcag21aa','wcag21aaa','wcag22aa','wcag22aaa']}}:requested==='all'?{runOnly:{type:'rule',values:['color-contrast','target-size']}}:{runOnly:{type:'tag',values:['wcag2a','wcag2aa','wcag21a','wcag21aa','wcag22aa','best-practice']}};
const summaries=[];
for(const theme of themes){
if(shell)shell.setAttribute('data-theme',theme);
await new Promise(r=>requestAnimationFrame(()=>requestAnimationFrame(r)));
if(requested!=='all')await new Promise(r=>setTimeout(r,1000));
const start=performance.now();
const result=await axe.run({exclude:[['demo-example-code pre code']]},options);
const report={route:location.pathname,theme,width:innerWidth,height:innerHeight,title:document.title,axeVersion:axe.version,mode:aaaMode?'aaa-static-all-levels':requested==='all'?'preset-static-color-and-target':'standard',state:params.has('auditMenus')?'menu-session-baseline':undefined,viewportOverflow:document.documentElement.scrollWidth-innerWidth,violations:compact(result.violations),incomplete:compact(result.incomplete),passes:result.passes.map(rule=>rule.id),durationMs:Math.round(performance.now()-start)};
if(aaaMode){
 const candidates=[...document.querySelectorAll('button,a[href],input:not([type=hidden]),select,textarea,[role=button],[role=tab],[role=radio],[role=slider],[role=checkbox],[role=switch]')].filter(e=>!e.closest('[hidden],[inert],[aria-hidden=true]')&&!e.disabled&&e.getAttribute('aria-disabled')!=='true'&&getComputedStyle(e).visibility==='visible'&&e.getClientRects().length);
 report.target44={checked:candidates.length,review:candidates.map(e=>{const r=e.getBoundingClientRect();return {tag:e.tagName,id:e.id,className:e.className,name:e.getAttribute('aria-label')||e.textContent.trim().slice(0,80),width:r.width,height:r.height,scope:e.closest('demo-playground')?'playground':e.closest('#showcase-content')?'example-or-docs':'shell'};}).filter(r=>r.width<44||r.height<44)};
}
if(location.pathname==='/ratings')report.ratingTargets=[...document.querySelectorAll('dsy-rating input')].map(e=>{const r=e.getBoundingClientRect();return {width:r.width,height:r.height}});
await fetch('/__audit/results',{method:'POST',headers:{'content-type':'application/json'},body:JSON.stringify(report)});
summaries.push({theme,violations:report.violations.map(rule=>({id:rule.id,count:rule.count})),incomplete:report.incomplete.length});
}
const output=document.createElement('pre');output.id='web-audit-result';output.hidden=true;output.textContent=JSON.stringify({done:true,route:location.pathname,width:innerWidth,themes:summaries.length,cases:summaries});document.body.append(output);
if(aaaMode&&params.has('auditBatch')){
 const next=catalogRoutes[catalogRoutes.indexOf(location.pathname)+1];
 if(next){location.assign(next+location.search);return;}
}
if(params.has('auditMenus')){
 let busy=false;
 document.addEventListener('focusin',async event=>{
 if(busy||!event.target.matches('.dsy-dropdown-item')||event.target.textContent.trim()!=='Open project')return;
 busy=true;
 try{
 await new Promise(r=>requestAnimationFrame(()=>requestAnimationFrame(r)));
 const e=event.target,panel=e.closest('[role="menu"]');if(!panel||document.activeElement!==e)return;
 const css=getComputedStyle(e),rect=panel.getBoundingClientRect();
 const result=await axe.run(panel,{runOnly:{type:'rule',values:['color-contrast','target-size']}});
 const report={route:location.pathname,theme:shell.getAttribute('data-theme'),width:innerWidth,state:'focused-menu',focus:e.textContent.trim(),outlineColor:css.outlineColor,outlineStyle:css.outlineStyle,outlineWidth:css.outlineWidth,outlineOffset:css.outlineOffset,background:css.backgroundColor,panelBackground:getComputedStyle(panel).backgroundColor,panelBounds:{left:rect.left,right:rect.right,width:rect.width},violations:compact(result.violations),incomplete:compact(result.incomplete)};
 await fetch('/__audit/results',{method:'POST',headers:{'content-type':'application/json'},body:JSON.stringify(report)});
 let node=document.getElementById('web-audit-menu-result');if(!node){node=document.createElement('pre');node.id='web-audit-menu-result';node.hidden=true;document.body.append(node);}node.setAttribute('data-theme',report.theme);node.textContent=JSON.stringify(report);
 }finally{busy=false;}
 });
}
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
            data.route.replaceAll('/', '') +
              '-' +
              data.theme +
              '-' +
              data.width +
              (data.state ? '-' + data.state : '') +
              '.json',
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
