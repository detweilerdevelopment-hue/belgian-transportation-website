import {readFile,writeFile,mkdir,copyFile} from 'node:fs/promises';
const base='https://belvia-transport.detweilerdevelopment.chatgpt.site';
const previous=await readFile('src/sections.html','utf8');
let template=await readFile('src/index.html','utf8');
for(const id of ['about','fleet','team','quote']){
 let section=[...previous.matchAll(/<section\b[\s\S]*?<\/section>/g)].find(m=>m[0].includes(`id="${id}"`))?.[0];
 if(!section)throw Error(`Missing ${id}`);
 template=template.replace(`{{${id.toUpperCase()}}}`,section);
}
const geo=JSON.parse(await readFile('src/countries.geojson','utf8'));
const mercator=lat=>Math.log(Math.tan(Math.PI/4+Math.max(-80,Math.min(80,lat))*Math.PI/360));
const project=([lon,lat])=>[(lon+17)*600/57,(mercator(65)-mercator(lat))*410];
let land='';
for(const feature of geo.features){const p=feature.properties;if(p.CONTINENT!=='Europe'&&!['Turkey','Morocco','Algeria','Tunisia'].includes(p.ADMIN))continue;const polys=feature.geometry.type==='Polygon'?[feature.geometry.coordinates]:feature.geometry.coordinates;for(const rings of polys){const ring=rings[0];if(!ring.some(([x,y])=>x>-18&&x<41&&y>32&&y<66))continue;land+=`<path class="mapLand" d="${ring.map((c,i)=>`${i?'L':'M'}${project(c).map(n=>n.toFixed(1)).join(',')}`).join('')}Z"/>`;}}
const hub=project([4.35,50.85]);
const destinations=[[-.12,51.5,'LONDON'],[2.35,48.86,'PARIS'],[4.9,52.37,'AMSTERDAM'],[13.4,52.52,'BERLIN'],[9.19,45.46,'MILAN'],[2.17,41.38,'BARCELONA'],[21.01,52.23,'WARSAW']];
const routes=destinations.map(([lon,lat,name],i)=>{const [x,y]=project([lon,lat]);return `<path class="mapRoute" d="M${hub[0]},${hub[1]} Q${(hub[0]+x)/2},${(hub[1]+y)/2-(i%2?22:12)} ${x},${y}"/><circle class="mapPoint" cx="${x}" cy="${y}" r="3.5"/>${['PARIS','BERLIN','LONDON'].includes(name)?`<text class="mapLabel" x="${x+7}" y="${y-6}">${name}</text>`:''}`}).join('');
template=template.replace('{{MAP}}',`<svg class="europeMap" viewBox="0 0 600 440" role="img" aria-labelledby="mapTitle"><title id="mapTitle">Belgium connected to European destinations</title><defs><clipPath id="mapClip"><rect width="600" height="440"/></clipPath></defs><g clip-path="url(#mapClip)">${land}${routes}<circle class="mapPoint" cx="${hub[0]}" cy="${hub[1]}" r="6"/><circle class="hubRing" cx="${hub[0]}" cy="${hub[1]}" r="13"/><text class="mapLabel" x="${hub[0]+15}" y="${hub[1]+17}" font-weight="bold">BELGIUM</text></g></svg>`);
const originals=JSON.parse(await readFile('src/translations.json','utf8'));
const overrides=JSON.parse(await readFile('src/overrides.json','utf8'));
const descriptions={en:'Belgian road transport and European logistics. Full truckload, groupage and distribution with a personal approach.',nl:'Belgisch wegtransport en Europese logistiek. Volle vrachten, groupage en distributie met een persoonlijke aanpak.',fr:'Transport routier belge et logistique européenne. Lots complets, groupage et distribution avec une approche humaine.'};
const titles={en:'Belvia — Europe, within reach.',nl:'Belvia — Europa, binnen bereik.',fr:'Belvia — L’Europe, à votre portée.'};
const pages=[];
for(const lang of ['en','nl','fr'])for(const page of ['','about/']){
 const home=lang==='en'?'/':`/${lang}/`,route=home+page,dict={...originals[lang],...overrides[lang]};
 let out=template.replace('<html lang="en">',`<html lang="${lang}">`);
 out=out.replace(/<([a-z0-9]+)([^>]*data-i="([^"]+)"[^>]*)>([\s\S]*?)<\/\1>/gi,(full,tag,attrs,key)=>{if(!dict[key])throw Error(`Missing ${lang}: ${key}`);return `<${tag}${attrs}>${dict[key]}</${tag}>`});
 if(page){const sections=[...out.matchAll(/<section\b[\s\S]*?<\/section>/g)].map(m=>m[0]).filter(s=>/id="(about|fleet|team|quote)"/.test(s));out=out.replace(/<main id="main">[\s\S]*?<\/main>/,`<main id="main" class="companyPage">${sections.join('')}</main>`).replace('<h2 data-i="aboutTitle">','<h1 class="aboutPageTitle" data-i="aboutTitle">').replace(/(<h1 class="aboutPageTitle"[\s\S]*?)<\/h2>/,'$1</h1>');}
 out=out.replace(/href="\/#/g,`href="${home}#`).replace(/href="\/about\/"/g,`href="${home}about/"`).replace(/href="\/" aria-label="Belvia home"/g,`href="${home}" aria-label="Belvia home"`).replace('<a class="brand" href="/">',`<a class="brand" href="${home}">`);
 out=out.replace(/<a href="[^"]+" lang="(en|nl|fr)" data-lang="\1">/g,(_,l)=>`<a href="${l==='en'?'/':`/${l}/`}${page}" lang="${l}" data-lang="${l}"${l===lang?' aria-current="true"':''}>`);
 out=out.replace('<nav aria-label="Main navigation">','<nav id="mainNav" aria-label="Main navigation">');
 out=out.replace(/<title>.*?<\/title>/,`<title>${page?({en:'Company',nl:'Onderneming',fr:'Entreprise'}[lang]+' | '):''}${titles[lang]}</title>`).replace(/<meta name="description" content="[^"]*">/,`<meta name="description" content="${descriptions[lang]}">`);
 const alternatives=['en','nl','fr'].map(l=>`<link rel="alternate" hreflang="${l}" href="${base}${l==='en'?'/':`/${l}/`}${page}">`).join('');
 out=out.replace('</head>',`<link rel="canonical" href="${base}${route}">${alternatives}<meta property="og:title" content="${titles[lang]}"><meta property="og:description" content="${descriptions[lang]}"><meta property="og:type" content="website"><meta property="og:url" content="${base}${route}"><meta property="og:image" content="${base}/assets/meridian-hero.png"><meta name="twitter:card" content="summary_large_image"></head>`);
 await mkdir('dist'+route,{recursive:true});await writeFile('dist'+route+'index.html',out);pages.push(route);
}
await copyFile('src/style.css','dist/style.css');await copyFile('src/app.js','dist/app.js');
await writeFile('dist/robots.txt',`User-agent: *\nAllow: /\nSitemap: ${base}/sitemap.xml\n`);
await writeFile('dist/sitemap.xml',`<?xml version="1.0" encoding="UTF-8"?><urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">${pages.map(p=>`<url><loc>${base}${p}</loc></url>`).join('')}</urlset>`);
console.log(`Built ${pages.length} Meridian pages in EN/NL/FR, geographic map, metadata and sitemap.`);
