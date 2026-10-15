import {readFile,writeFile,mkdir} from 'node:fs/promises';
import vm from 'node:vm';
const base='https://belvia-transport.detweilerdevelopment.chatgpt.site';
let html=await readFile('dist/index.html','utf8');
html=html.replace(/<link rel="canonical"[^>]*>/g,'').replace(/<link rel="alternate"[^>]*>/g,'');
html=html.replace(/<meta (?:property="og:[^"]+"|name="twitter:[^"]+")[^>]*>/g,'');
html=html.replace('href="#about"','href="/about/"');
const source=await readFile('dist/app.js','utf8');
const values=Object.fromEntries([...html.matchAll(/<([a-z0-9]+)[^>]*data-i="([^"]+)"[^>]*>([\s\S]*?)<\/\1>/gi)].map(m=>[m[2],m[3]]));
const dictionarySource=source.slice(source.indexOf('const translations='),source.indexOf('const serviceNames='));
const translations=vm.runInNewContext(dictionarySource+';translations',{en:values});
const descriptions={en:'Road transport and logistics in Belgium and across Europe. Full truckload, part-load and distribution solutions. Prepare your transport request.',nl:'Wegtransport en logistiek in België en Europa. Volle vrachten, deelladingen en distributie. Bereid uw transportaanvraag voor.',fr:'Transport routier et logistique en Belgique et en Europe. Lots complets, groupage et distribution. Préparez votre demande de transport.'};
const titles={en:'Belvia — Road transport in Belgium & Europe',nl:'Belvia — Wegtransport in België & Europa',fr:'Belvia — Transport routier en Belgique et en Europe'};
const pages=[];
for(const lang of ['en','nl','fr']){
 for(const page of ['','about/']){
  const route=(lang==='en'?'/':`/${lang}/`)+page;
  let out=html.replace('<html lang="en">',`<html lang="${lang}">`);
  out=out.replace(/<([a-z0-9]+)([^>]*data-i="([^"]+)"[^>]*)>([\s\S]*?)<\/\1>/gi,(full,tag,attrs,key,content)=>`<${tag}${attrs}>${translations[lang][key]||content}</${tag}>`);
  out=out.replace(/<title>.*?<\/title>/,`<title>${page?({en:'About us',nl:'Over ons',fr:'À propos'}[lang]+' | '):''}${titles[lang]}</title>`).replace(/<meta name="description" content="[^"]*">/,`<meta name="description" content="${descriptions[lang]}">`);
  if(page){const sections=[...out.matchAll(/<section\b[\s\S]*?<\/section>/g)].map(m=>m[0]).filter(s=>/id="(about|team|quote)"/.test(s));out=out.replace(/<main>[\s\S]*?<\/main>/,`<main>${sections.join('')}</main>`);out=out.replace(/href="#(home|services|coverage|fleet)"/g,'href="/#$1"');}
  out=out.replace('href="/about/"',`href="${lang==='en'?'/':`/${lang}/`}about/"`);
  if(page)out=out.replace('<h2 data-i="aboutTitle">','<h1 class="aboutPageTitle" data-i="aboutTitle">').replace(/(<h1 class="aboutPageTitle"[\s\S]*?)<\/h2>/,'$1</h1>');
  const alternates=['en','nl','fr'].map(l=>`<link rel="alternate" hreflang="${l}" href="${base}${l==='en'?'/':`/${l}/`}${page}">`).join('');
  out=out.replace('</head>',`<link rel="canonical" href="${base}${route}">${alternates}<meta property="og:title" content="${titles[lang]}"><meta property="og:description" content="${descriptions[lang]}"><meta property="og:type" content="website"><meta property="og:url" content="${base}${route}"><meta property="og:image" content="${base}/assets/hero-europe.png"><meta name="twitter:card" content="summary_large_image"></head>`);
  const dir='dist'+route;await mkdir(dir,{recursive:true});await writeFile(dir+'index.html',out);pages.push(route);
 }
}
await writeFile('dist/robots.txt',`User-agent: *\nAllow: /\nSitemap: ${base}/sitemap.xml\n`);
await writeFile('dist/sitemap.xml',`<?xml version="1.0" encoding="UTF-8"?><urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">${pages.map(p=>`<url><loc>${base}${p}</loc></url>`).join('')}</urlset>`);
console.log(`Built ${pages.length} pages, sitemap and robots.txt.`);
