// Local disposable UI server. Tests intercept submissions; no mail credentials.
import {createServer} from 'node:http';
import {readFile} from 'node:fs/promises';
import path from 'node:path';
import {default as worker} from '../dist/server/index.js';
const assets=path.resolve('dist/client');
const types={'.js':'text/javascript','.css':'text/css','.svg':'image/svg+xml','.png':'image/png','.webp':'image/webp','.woff2':'font/woff2','.ico':'image/x-icon','.json':'application/json'};
const ASSETS={async fetch(request){const file=path.resolve(assets,'.'+decodeURIComponent(new URL(request.url).pathname));if(!file.startsWith(assets+path.sep))return new Response('Not found',{status:404});try{return new Response(await readFile(file),{headers:{'content-type':types[path.extname(file)]||'application/octet-stream'}});}catch{return new Response('Not found',{status:404});}}};
const server=createServer(async(req,res)=>{try{const chunks=[];for await(const chunk of req)chunks.push(chunk);const request=new Request('http://localhost:4180'+req.url,{method:req.method,headers:req.headers,...(!['GET','HEAD'].includes(req.method)?{body:Buffer.concat(chunks)}:{})});let response=await ASSETS.fetch(request);if(response.status===404)response=await worker.fetch(request,{ASSETS},{waitUntil(){},passThroughOnException(){}});res.writeHead(response.status,Object.fromEntries(response.headers));res.end(Buffer.from(await response.arrayBuffer()));}catch(e){res.writeHead(500);res.end(String(e));}});
server.listen(4180,'127.0.0.1',()=>console.log('Website fixture ready'));
for(const s of ['SIGINT','SIGTERM'])process.on(s,()=>server.close(()=>process.exit(0)));
