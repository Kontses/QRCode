if(!self.define){let e,s={};const n=(n,t)=>(n=new URL(n+".js",t).href,s[n]||new Promise((s=>{if("document"in self){const e=document.createElement("script");e.src=n,e.onload=s,document.head.appendChild(e)}else e=n,importScripts(n),s()})).then((()=>{let e=s[n];if(!e)throw new Error(`Module ${n} didn’t register its module`);return e})));self.define=(t,a)=>{const i=e||("document"in self?document.currentScript.src:"")||location.href;if(s[i])return;let c={};const o=e=>n(e,i),r={module:{uri:i},exports:c,require:o};s[i]=Promise.all(t.map((e=>r[e]||o(e)))).then((e=>(a(...e),c)))}}define(["./workbox-4754cb34"],(function(e){"use strict";importScripts(),self.skipWaiting(),e.clientsClaim(),e.precacheAndRoute([{url:"/_next/app-build-manifest.json",revision:"eea177f11e7eaa110d3f545203aa1c56"},{url:"/_next/static/VV0wRYpCdKz8rtVoJ9oP_/_buildManifest.js",revision:"c155cce658e53418dec34664328b51ac"},{url:"/_next/static/VV0wRYpCdKz8rtVoJ9oP_/_ssgManifest.js",revision:"b6652df95db52feb4daf4eca35380933"},{url:"/_next/static/chunks/117-f7020c0271209f3d.js",revision:"VV0wRYpCdKz8rtVoJ9oP_"},{url:"/_next/static/chunks/496-514e39e72f3a3886.js",revision:"VV0wRYpCdKz8rtVoJ9oP_"},{url:"/_next/static/chunks/app/_not-found/page-6947129080bafc00.js",revision:"VV0wRYpCdKz8rtVoJ9oP_"},{url:"/_next/static/chunks/app/layout-cbd3ebdc4ecc5247.js",revision:"VV0wRYpCdKz8rtVoJ9oP_"},{url:"/_next/static/chunks/app/page-bcbb5ce5c3a5708a.js",revision:"VV0wRYpCdKz8rtVoJ9oP_"},{url:"/_next/static/chunks/fd9d1056-72ef1b92e01f1388.js",revision:"VV0wRYpCdKz8rtVoJ9oP_"},{url:"/_next/static/chunks/framework-f66176bb897dc684.js",revision:"VV0wRYpCdKz8rtVoJ9oP_"},{url:"/_next/static/chunks/main-538939c17bcd42c4.js",revision:"VV0wRYpCdKz8rtVoJ9oP_"},{url:"/_next/static/chunks/main-app-93cc215d29bb7c7e.js",revision:"VV0wRYpCdKz8rtVoJ9oP_"},{url:"/_next/static/chunks/pages/_app-72b849fbd24ac258.js",revision:"VV0wRYpCdKz8rtVoJ9oP_"},{url:"/_next/static/chunks/pages/_error-7ba65e1336b92748.js",revision:"VV0wRYpCdKz8rtVoJ9oP_"},{url:"/_next/static/chunks/polyfills-42372ed130431b0a.js",revision:"846118c33b2c0e922d7b3a7676f81f6f"},{url:"/_next/static/chunks/webpack-7a4134fa3dd010ca.js",revision:"VV0wRYpCdKz8rtVoJ9oP_"},{url:"/icon-192x192.png",revision:"e44c48944cf5875d83e4a43822a3b87e"},{url:"/icon-192x192.svg",revision:"84195870bb9e91c775129a1c22455177"},{url:"/icon-512x512.png",revision:"1320d7f4a63f680bfa7b49d7c1a1f210"},{url:"/icon-512x512.svg",revision:"84c18a29beb36f63d97c31992f922c4d"},{url:"/manifest.json",revision:"7c66bd202c6a0ec0391f45fa3a2a19a7"}],{ignoreURLParametersMatching:[]}),e.cleanupOutdatedCaches(),e.registerRoute("/",new e.NetworkFirst({cacheName:"start-url",plugins:[{cacheWillUpdate:async({request:e,response:s,event:n,state:t})=>s&&"opaqueredirect"===s.type?new Response(s.body,{status:200,statusText:"OK",headers:s.headers}):s}]}),"GET"),e.registerRoute(/^https:\/\/fonts\.(?:gstatic)\.com\/.*/i,new e.CacheFirst({cacheName:"google-fonts-webfonts",plugins:[new e.ExpirationPlugin({maxEntries:4,maxAgeSeconds:31536e3})]}),"GET"),e.registerRoute(/^https:\/\/fonts\.(?:googleapis)\.com\/.*/i,new e.StaleWhileRevalidate({cacheName:"google-fonts-stylesheets",plugins:[new e.ExpirationPlugin({maxEntries:4,maxAgeSeconds:604800})]}),"GET"),e.registerRoute(/\.(?:eot|otf|ttc|ttf|woff|woff2|font.css)$/i,new e.StaleWhileRevalidate({cacheName:"static-font-assets",plugins:[new e.ExpirationPlugin({maxEntries:4,maxAgeSeconds:604800})]}),"GET"),e.registerRoute(/\.(?:jpg|jpeg|gif|png|svg|ico|webp)$/i,new e.StaleWhileRevalidate({cacheName:"static-image-assets",plugins:[new e.ExpirationPlugin({maxEntries:64,maxAgeSeconds:86400})]}),"GET"),e.registerRoute(/\/_next\/image\?url=.+$/i,new e.StaleWhileRevalidate({cacheName:"next-image",plugins:[new e.ExpirationPlugin({maxEntries:64,maxAgeSeconds:86400})]}),"GET"),e.registerRoute(/\.(?:mp3|wav|ogg)$/i,new e.CacheFirst({cacheName:"static-audio-assets",plugins:[new e.RangeRequestsPlugin,new e.ExpirationPlugin({maxEntries:32,maxAgeSeconds:86400})]}),"GET"),e.registerRoute(/\.(?:mp4)$/i,new e.CacheFirst({cacheName:"static-video-assets",plugins:[new e.RangeRequestsPlugin,new e.ExpirationPlugin({maxEntries:32,maxAgeSeconds:86400})]}),"GET"),e.registerRoute(/\.(?:js)$/i,new e.StaleWhileRevalidate({cacheName:"static-js-assets",plugins:[new e.ExpirationPlugin({maxEntries:32,maxAgeSeconds:86400})]}),"GET"),e.registerRoute(/\.(?:css|less)$/i,new e.StaleWhileRevalidate({cacheName:"static-style-assets",plugins:[new e.ExpirationPlugin({maxEntries:32,maxAgeSeconds:86400})]}),"GET"),e.registerRoute(/\/_next\/data\/.+\/.+\.json$/i,new e.StaleWhileRevalidate({cacheName:"next-data",plugins:[new e.ExpirationPlugin({maxEntries:32,maxAgeSeconds:86400})]}),"GET"),e.registerRoute(/\.(?:json|xml|csv)$/i,new e.NetworkFirst({cacheName:"static-data-assets",plugins:[new e.ExpirationPlugin({maxEntries:32,maxAgeSeconds:86400})]}),"GET"),e.registerRoute((({url:e})=>{if(!(self.origin===e.origin))return!1;const s=e.pathname;return!s.startsWith("/api/auth/")&&!!s.startsWith("/api/")}),new e.NetworkFirst({cacheName:"apis",networkTimeoutSeconds:10,plugins:[new e.ExpirationPlugin({maxEntries:16,maxAgeSeconds:86400})]}),"GET"),e.registerRoute((({url:e})=>{if(!(self.origin===e.origin))return!1;return!e.pathname.startsWith("/api/")}),new e.NetworkFirst({cacheName:"others",networkTimeoutSeconds:10,plugins:[new e.ExpirationPlugin({maxEntries:32,maxAgeSeconds:86400})]}),"GET"),e.registerRoute((({url:e})=>!(self.origin===e.origin)),new e.NetworkFirst({cacheName:"cross-origin",networkTimeoutSeconds:10,plugins:[new e.ExpirationPlugin({maxEntries:32,maxAgeSeconds:3600})]}),"GET")}));
