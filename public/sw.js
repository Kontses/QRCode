if(!self.define){let e,s={};const t=(t,a)=>(t=new URL(t+".js",a).href,s[t]||new Promise((s=>{if("document"in self){const e=document.createElement("script");e.src=t,e.onload=s,document.head.appendChild(e)}else e=t,importScripts(t),s()})).then((()=>{let e=s[t];if(!e)throw new Error(`Module ${t} didn’t register its module`);return e})));self.define=(a,n)=>{const c=e||("document"in self?document.currentScript.src:"")||location.href;if(s[c])return;let i={};const r=e=>t(e,c),o={module:{uri:c},exports:i,require:r};s[c]=Promise.all(a.map((e=>o[e]||r(e)))).then((e=>(n(...e),i)))}}define(["./workbox-bcda3973"],(function(e){"use strict";importScripts(),self.skipWaiting(),e.clientsClaim(),e.precacheAndRoute([{url:"/_next/static/WeoeV2vDZQXJJC2-75xay/_buildManifest.js",revision:"c155cce658e53418dec34664328b51ac"},{url:"/_next/static/WeoeV2vDZQXJJC2-75xay/_ssgManifest.js",revision:"b6652df95db52feb4daf4eca35380933"},{url:"/_next/static/chunks/430-249cdbd7ae7764c7.js",revision:"WeoeV2vDZQXJJC2-75xay"},{url:"/_next/static/chunks/7cb1fa1f-2943c685993502a3.js",revision:"WeoeV2vDZQXJJC2-75xay"},{url:"/_next/static/chunks/918-f060f69859c82407.js",revision:"WeoeV2vDZQXJJC2-75xay"},{url:"/_next/static/chunks/app/_not-found/page-7e5e3203abddd208.js",revision:"WeoeV2vDZQXJJC2-75xay"},{url:"/_next/static/chunks/app/layout-1615688ab66589f0.js",revision:"WeoeV2vDZQXJJC2-75xay"},{url:"/_next/static/chunks/app/page-85d63024f8baf6d5.js",revision:"WeoeV2vDZQXJJC2-75xay"},{url:"/_next/static/chunks/fd9d1056-cf48984c1108c87a.js",revision:"WeoeV2vDZQXJJC2-75xay"},{url:"/_next/static/chunks/framework-f66176bb897dc684.js",revision:"WeoeV2vDZQXJJC2-75xay"},{url:"/_next/static/chunks/main-1db2251ca39caefa.js",revision:"WeoeV2vDZQXJJC2-75xay"},{url:"/_next/static/chunks/main-app-ab999d4580889777.js",revision:"WeoeV2vDZQXJJC2-75xay"},{url:"/_next/static/chunks/pages/_app-72b849fbd24ac258.js",revision:"WeoeV2vDZQXJJC2-75xay"},{url:"/_next/static/chunks/pages/_error-7ba65e1336b92748.js",revision:"WeoeV2vDZQXJJC2-75xay"},{url:"/_next/static/chunks/polyfills-42372ed130431b0a.js",revision:"846118c33b2c0e922d7b3a7676f81f6f"},{url:"/_next/static/chunks/webpack-7ad7955ccc6ff898.js",revision:"WeoeV2vDZQXJJC2-75xay"},{url:"/_next/static/css/65385be4a4e1a7af.css",revision:"65385be4a4e1a7af"}],{ignoreURLParametersMatching:[]}),e.cleanupOutdatedCaches(),e.registerRoute("/",new e.NetworkFirst({cacheName:"start-url",plugins:[{cacheWillUpdate:async({response:e})=>e&&"opaqueredirect"===e.type?new Response(e.body,{status:200,statusText:"OK",headers:e.headers}):e}]}),"GET"),e.registerRoute(/^https:\/\/qr-code-.*\.vercel\.app\/api\/(users\/login|users\/me)/,new e.NetworkOnly,"GET"),e.registerRoute(/^https:\/\/qr-code-.*\.vercel\.app\/api\/.*/,new e.StaleWhileRevalidate({cacheName:"api-cache",plugins:[new e.ExpirationPlugin({maxEntries:32,maxAgeSeconds:86400})]}),"GET"),e.registerRoute(/^https?.*/,new e.StaleWhileRevalidate({cacheName:"others",plugins:[new e.ExpirationPlugin({maxEntries:32,maxAgeSeconds:86400})]}),"GET")}));
