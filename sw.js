(()=>{"use strict";var e={136:()=>{try{self["workbox:core:6.5.4"]&&_()}catch(e){}},447:()=>{try{self["workbox:precaching:6.5.4"]&&_()}catch(e){}},227:()=>{try{self["workbox:routing:6.5.4"]&&_()}catch(e){}},390:()=>{try{self["workbox:strategies:6.5.4"]&&_()}catch(e){}}},t={};function s(a){var n=t[a];if(void 0!==n)return n.exports;var r=t[a]={exports:{}};return e[a](r,r.exports,s),r.exports}(()=>{s(136);class e extends Error{constructor(e,t){super(((e,...t)=>{let s=e;return t.length>0&&(s+=` :: ${JSON.stringify(t)}`),s})(e,t)),this.name=e,this.details=t}}const t={googleAnalytics:"googleAnalytics",precache:"precache-v2",prefix:"workbox",runtime:"runtime",suffix:"undefined"!=typeof registration?registration.scope:""},a=e=>[t.prefix,e,t.suffix].filter((e=>e&&e.length>0)).join("-"),n=e=>e||a(t.precache);function r(e,t){const s=t();return e.waitUntil(s),s}function i(t){if(!t)throw new e("add-to-cache-list-unexpected-type",{entry:t});if("string"==typeof t){const e=new URL(t,location.href);return{cacheKey:e.href,url:e.href}}const{revision:s,url:a}=t;if(!a)throw new e("add-to-cache-list-unexpected-type",{entry:t});if(!s){const e=new URL(a,location.href);return{cacheKey:e.href,url:e.href}}const n=new URL(a,location.href),r=new URL(a,location.href);return n.searchParams.set("__WB_REVISION__",s),{cacheKey:n.href,url:r.href}}s(447);class c{constructor(){this.updatedURLs=[],this.notUpdatedURLs=[],this.handlerWillStart=async({request:e,state:t})=>{t&&(t.originalRequest=e)},this.cachedResponseWillBeUsed=async({event:e,state:t,cachedResponse:s})=>{if("install"===e.type&&t&&t.originalRequest&&t.originalRequest instanceof Request){const e=t.originalRequest.url;s?this.notUpdatedURLs.push(e):this.updatedURLs.push(e)}return s}}}class o{constructor({precacheController:e}){this.cacheKeyWillBeUsed=async({request:e,params:t})=>{const s=(null==t?void 0:t.cacheKey)||this._precacheController.getCacheKeyForURL(e.url);return s?new Request(s,{headers:e.headers}):e},this._precacheController=e}}let h;function l(e,t){const s=new URL(e);for(const e of t)s.searchParams.delete(e);return s.href}class u{constructor(){this.promise=new Promise(((e,t)=>{this.resolve=e,this.reject=t}))}}const d=new Set;function f(e){return"string"==typeof e?new Request(e):e}s(390);class p{constructor(e,t){this._cacheKeys={},Object.assign(this,t),this.event=t.event,this._strategy=e,this._handlerDeferred=new u,this._extendLifetimePromises=[],this._plugins=[...e.plugins],this._pluginStateMap=new Map;for(const e of this._plugins)this._pluginStateMap.set(e,{});this.event.waitUntil(this._handlerDeferred.promise)}async fetch(t){const{event:s}=this;let a=f(t);if("navigate"===a.mode&&s instanceof FetchEvent&&s.preloadResponse){const e=await s.preloadResponse;if(e)return e}const n=this.hasCallback("fetchDidFail")?a.clone():null;try{for(const e of this.iterateCallbacks("requestWillFetch"))a=await e({request:a.clone(),event:s})}catch(t){if(t instanceof Error)throw new e("plugin-error-request-will-fetch",{thrownErrorMessage:t.message})}const r=a.clone();try{let e;e=await fetch(a,"navigate"===a.mode?void 0:this._strategy.fetchOptions);for(const t of this.iterateCallbacks("fetchDidSucceed"))e=await t({event:s,request:r,response:e});return e}catch(e){throw n&&await this.runCallbacks("fetchDidFail",{error:e,event:s,originalRequest:n.clone(),request:r.clone()}),e}}async fetchAndCachePut(e){const t=await this.fetch(e),s=t.clone();return this.waitUntil(this.cachePut(e,s)),t}async cacheMatch(e){const t=f(e);let s;const{cacheName:a,matchOptions:n}=this._strategy,r=await this.getCacheKey(t,"read"),i=Object.assign(Object.assign({},n),{cacheName:a});s=await caches.match(r,i);for(const e of this.iterateCallbacks("cachedResponseWillBeUsed"))s=await e({cacheName:a,matchOptions:n,cachedResponse:s,request:r,event:this.event})||void 0;return s}async cachePut(t,s){const a=f(t);await(0,new Promise((e=>setTimeout(e,0))));const n=await this.getCacheKey(a,"write");if(!s)throw new e("cache-put-with-no-response",{url:(r=n.url,new URL(String(r),location.href).href.replace(new RegExp(`^${location.origin}`),""))});var r;const i=await this._ensureResponseSafeToCache(s);if(!i)return!1;const{cacheName:c,matchOptions:o}=this._strategy,h=await self.caches.open(c),u=this.hasCallback("cacheDidUpdate"),p=u?await async function(e,t,s,a){const n=l(t.url,s);if(t.url===n)return e.match(t,a);const r=Object.assign(Object.assign({},a),{ignoreSearch:!0}),i=await e.keys(t,r);for(const t of i)if(n===l(t.url,s))return e.match(t,a)}(h,n.clone(),["__WB_REVISION__"],o):null;try{await h.put(n,u?i.clone():i)}catch(e){if(e instanceof Error)throw"QuotaExceededError"===e.name&&await async function(){for(const e of d)await e()}(),e}for(const e of this.iterateCallbacks("cacheDidUpdate"))await e({cacheName:c,oldResponse:p,newResponse:i.clone(),request:n,event:this.event});return!0}async getCacheKey(e,t){const s=`${e.url} | ${t}`;if(!this._cacheKeys[s]){let a=e;for(const e of this.iterateCallbacks("cacheKeyWillBeUsed"))a=f(await e({mode:t,request:a,event:this.event,params:this.params}));this._cacheKeys[s]=a}return this._cacheKeys[s]}hasCallback(e){for(const t of this._strategy.plugins)if(e in t)return!0;return!1}async runCallbacks(e,t){for(const s of this.iterateCallbacks(e))await s(t)}*iterateCallbacks(e){for(const t of this._strategy.plugins)if("function"==typeof t[e]){const s=this._pluginStateMap.get(t),a=a=>{const n=Object.assign(Object.assign({},a),{state:s});return t[e](n)};yield a}}waitUntil(e){return this._extendLifetimePromises.push(e),e}async doneWaiting(){let e;for(;e=this._extendLifetimePromises.shift();)await e}destroy(){this._handlerDeferred.resolve(null)}async _ensureResponseSafeToCache(e){let t=e,s=!1;for(const e of this.iterateCallbacks("cacheWillUpdate"))if(t=await e({request:this.request,response:t,event:this.event})||void 0,s=!0,!t)break;return s||t&&200!==t.status&&(t=void 0),t}}class g{constructor(e={}){this.cacheName=e.cacheName||a(t.runtime),this.plugins=e.plugins||[],this.fetchOptions=e.fetchOptions,this.matchOptions=e.matchOptions}handle(e){const[t]=this.handleAll(e);return t}handleAll(e){e instanceof FetchEvent&&(e={event:e,request:e.request});const t=e.event,s="string"==typeof e.request?new Request(e.request):e.request,a="params"in e?e.params:void 0,n=new p(this,{event:t,request:s,params:a}),r=this._getResponse(n,s,t);return[r,this._awaitComplete(r,n,s,t)]}async _getResponse(t,s,a){let n;await t.runCallbacks("handlerWillStart",{event:a,request:s});try{if(n=await this._handle(s,t),!n||"error"===n.type)throw new e("no-response",{url:s.url})}catch(e){if(e instanceof Error)for(const r of t.iterateCallbacks("handlerDidError"))if(n=await r({error:e,event:a,request:s}),n)break;if(!n)throw e}for(const e of t.iterateCallbacks("handlerWillRespond"))n=await e({event:a,request:s,response:n});return n}async _awaitComplete(e,t,s,a){let n,r;try{n=await e}catch(r){}try{await t.runCallbacks("handlerDidRespond",{event:a,request:s,response:n}),await t.doneWaiting()}catch(e){e instanceof Error&&(r=e)}if(await t.runCallbacks("handlerDidComplete",{event:a,request:s,response:n,error:r}),t.destroy(),r)throw r}}class y extends g{constructor(e={}){e.cacheName=n(e.cacheName),super(e),this._fallbackToNetwork=!1!==e.fallbackToNetwork,this.plugins.push(y.copyRedirectedCacheableResponsesPlugin)}async _handle(e,t){return await t.cacheMatch(e)||(t.event&&"install"===t.event.type?await this._handleInstall(e,t):await this._handleFetch(e,t))}async _handleFetch(t,s){let a;const n=s.params||{};if(!this._fallbackToNetwork)throw new e("missing-precache-entry",{cacheName:this.cacheName,url:t.url});{const e=n.integrity,r=t.integrity,i=!r||r===e;a=await s.fetch(new Request(t,{integrity:"no-cors"!==t.mode?r||e:void 0})),e&&i&&"no-cors"!==t.mode&&(this._useDefaultCacheabilityPluginIfNeeded(),await s.cachePut(t,a.clone()))}return a}async _handleInstall(t,s){this._useDefaultCacheabilityPluginIfNeeded();const a=await s.fetch(t);if(!await s.cachePut(t,a.clone()))throw new e("bad-precaching-response",{url:t.url,status:a.status});return a}_useDefaultCacheabilityPluginIfNeeded(){let e=null,t=0;for(const[s,a]of this.plugins.entries())a!==y.copyRedirectedCacheableResponsesPlugin&&(a===y.defaultPrecacheCacheabilityPlugin&&(e=s),a.cacheWillUpdate&&t++);0===t?this.plugins.push(y.defaultPrecacheCacheabilityPlugin):t>1&&null!==e&&this.plugins.splice(e,1)}}y.defaultPrecacheCacheabilityPlugin={cacheWillUpdate:async({response:e})=>!e||e.status>=400?null:e},y.copyRedirectedCacheableResponsesPlugin={cacheWillUpdate:async({response:t})=>t.redirected?await async function(t,s){let a=null;if(t.url&&(a=new URL(t.url).origin),a!==self.location.origin)throw new e("cross-origin-copy-response",{origin:a});const n=t.clone(),r={headers:new Headers(n.headers),status:n.status,statusText:n.statusText},i=s?s(r):r,c=function(){if(void 0===h){const e=new Response("");if("body"in e)try{new Response(e.body),h=!0}catch(e){h=!1}h=!1}return h}()?n.body:await n.blob();return new Response(c,i)}(t):t};class w{constructor({cacheName:e,plugins:t=[],fallbackToNetwork:s=!0}={}){this._urlsToCacheKeys=new Map,this._urlsToCacheModes=new Map,this._cacheKeysToIntegrities=new Map,this._strategy=new y({cacheName:n(e),plugins:[...t,new o({precacheController:this})],fallbackToNetwork:s}),this.install=this.install.bind(this),this.activate=this.activate.bind(this)}get strategy(){return this._strategy}precache(e){this.addToCacheList(e),this._installAndActiveListenersAdded||(self.addEventListener("install",this.install),self.addEventListener("activate",this.activate),this._installAndActiveListenersAdded=!0)}addToCacheList(t){const s=[];for(const a of t){"string"==typeof a?s.push(a):a&&void 0===a.revision&&s.push(a.url);const{cacheKey:t,url:n}=i(a),r="string"!=typeof a&&a.revision?"reload":"default";if(this._urlsToCacheKeys.has(n)&&this._urlsToCacheKeys.get(n)!==t)throw new e("add-to-cache-list-conflicting-entries",{firstEntry:this._urlsToCacheKeys.get(n),secondEntry:t});if("string"!=typeof a&&a.integrity){if(this._cacheKeysToIntegrities.has(t)&&this._cacheKeysToIntegrities.get(t)!==a.integrity)throw new e("add-to-cache-list-conflicting-integrities",{url:n});this._cacheKeysToIntegrities.set(t,a.integrity)}if(this._urlsToCacheKeys.set(n,t),this._urlsToCacheModes.set(n,r),s.length>0){const e=`Workbox is precaching URLs without revision info: ${s.join(", ")}\nThis is generally NOT safe. Learn more at https://bit.ly/wb-precache`;console.warn(e)}}}install(e){return r(e,(async()=>{const t=new c;this.strategy.plugins.push(t);for(const[t,s]of this._urlsToCacheKeys){const a=this._cacheKeysToIntegrities.get(s),n=this._urlsToCacheModes.get(t),r=new Request(t,{integrity:a,cache:n,credentials:"same-origin"});await Promise.all(this.strategy.handleAll({params:{cacheKey:s},request:r,event:e}))}const{updatedURLs:s,notUpdatedURLs:a}=t;return{updatedURLs:s,notUpdatedURLs:a}}))}activate(e){return r(e,(async()=>{const e=await self.caches.open(this.strategy.cacheName),t=await e.keys(),s=new Set(this._urlsToCacheKeys.values()),a=[];for(const n of t)s.has(n.url)||(await e.delete(n),a.push(n.url));return{deletedURLs:a}}))}getURLsToCacheKeys(){return this._urlsToCacheKeys}getCachedURLs(){return[...this._urlsToCacheKeys.keys()]}getCacheKeyForURL(e){const t=new URL(e,location.href);return this._urlsToCacheKeys.get(t.href)}getIntegrityForCacheKey(e){return this._cacheKeysToIntegrities.get(e)}async matchPrecache(e){const t=e instanceof Request?e.url:e,s=this.getCacheKeyForURL(t);if(s)return(await self.caches.open(this.strategy.cacheName)).match(s)}createHandlerBoundToURL(t){const s=this.getCacheKeyForURL(t);if(!s)throw new e("non-precached-url",{url:t});return e=>(e.request=new Request(t),e.params=Object.assign({cacheKey:s},e.params),this.strategy.handle(e))}}let m;const _=()=>(m||(m=new w),m);s(227);const R=e=>e&&"object"==typeof e?e:{handle:e};class v{constructor(e,t,s="GET"){this.handler=R(t),this.match=e,this.method=s}setCatchHandler(e){this.catchHandler=R(e)}}class C extends v{constructor(e,t,s){super((({url:t})=>{const s=e.exec(t.href);if(s&&(t.origin===location.origin||0===s.index))return s.slice(1)}),t,s)}}class b{constructor(){this._routes=new Map,this._defaultHandlerMap=new Map}get routes(){return this._routes}addFetchListener(){self.addEventListener("fetch",(e=>{const{request:t}=e,s=this.handleRequest({request:t,event:e});s&&e.respondWith(s)}))}addCacheListener(){self.addEventListener("message",(e=>{if(e.data&&"CACHE_URLS"===e.data.type){const{payload:t}=e.data,s=Promise.all(t.urlsToCache.map((t=>{"string"==typeof t&&(t=[t]);const s=new Request(...t);return this.handleRequest({request:s,event:e})})));e.waitUntil(s),e.ports&&e.ports[0]&&s.then((()=>e.ports[0].postMessage(!0)))}}))}handleRequest({request:e,event:t}){const s=new URL(e.url,location.href);if(!s.protocol.startsWith("http"))return;const a=s.origin===location.origin,{params:n,route:r}=this.findMatchingRoute({event:t,request:e,sameOrigin:a,url:s});let i=r&&r.handler;const c=e.method;if(!i&&this._defaultHandlerMap.has(c)&&(i=this._defaultHandlerMap.get(c)),!i)return;let o;try{o=i.handle({url:s,request:e,event:t,params:n})}catch(e){o=Promise.reject(e)}const h=r&&r.catchHandler;return o instanceof Promise&&(this._catchHandler||h)&&(o=o.catch((async a=>{if(h)try{return await h.handle({url:s,request:e,event:t,params:n})}catch(e){e instanceof Error&&(a=e)}if(this._catchHandler)return this._catchHandler.handle({url:s,request:e,event:t});throw a}))),o}findMatchingRoute({url:e,sameOrigin:t,request:s,event:a}){const n=this._routes.get(s.method)||[];for(const r of n){let n;const i=r.match({url:e,sameOrigin:t,request:s,event:a});if(i)return n=i,(Array.isArray(n)&&0===n.length||i.constructor===Object&&0===Object.keys(i).length||"boolean"==typeof i)&&(n=void 0),{route:r,params:n}}return{}}setDefaultHandler(e,t="GET"){this._defaultHandlerMap.set(t,R(e))}setCatchHandler(e){this._catchHandler=R(e)}registerRoute(e){this._routes.has(e.method)||this._routes.set(e.method,[]),this._routes.get(e.method).push(e)}unregisterRoute(t){if(!this._routes.has(t.method))throw new e("unregister-route-but-not-found-with-method",{method:t.method});const s=this._routes.get(t.method).indexOf(t);if(!(s>-1))throw new e("unregister-route-route-not-registered");this._routes.get(t.method).splice(s,1)}}let q;class U extends v{constructor(e,t){super((({request:s})=>{const a=e.getURLsToCacheKeys();for(const n of function*(e,{ignoreURLParametersMatching:t=[/^utm_/,/^fbclid$/],directoryIndex:s="index.html",cleanURLs:a=!0,urlManipulation:n}={}){const r=new URL(e,location.href);r.hash="",yield r.href;const i=function(e,t=[]){for(const s of[...e.searchParams.keys()])t.some((e=>e.test(s)))&&e.searchParams.delete(s);return e}(r,t);if(yield i.href,s&&i.pathname.endsWith("/")){const e=new URL(i.href);e.pathname+=s,yield e.href}if(a){const e=new URL(i.href);e.pathname+=".html",yield e.href}if(n){const e=n({url:r});for(const t of e)yield t.href}}(s.url,t)){const t=a.get(n);if(t)return{cacheKey:t,integrity:e.getIntegrityForCacheKey(t)}}}),e.strategy)}}var L;L=[{'revision':'a72143fd73fb204d6dc9b07ac5fadf6c','url':'assets/License.txt'},{'revision':'a2f5fe1e28626b12567c95a2ff28d52f','url':'assets/assetPrinter.py'},{'revision':'8d7e3ccea57a81806f9fb6e565ea715b','url':'assets/candy-crush/effects/Bolt.png'},{'revision':'60fb869712040e581bdb2fe6425e7fc0','url':'assets/candy-crush/effects/Bubble.png'},{'revision':'96192f91eb9c25a0d5b422cde60873a2','url':'assets/candy-crush/effects/bomb-selection-01.png'},{'revision':'600ba5337d0201e80d98f78e47e80a45','url':'assets/candy-crush/effects/bomb-selection-02.png'},{'revision':'ee383d323e8657512b1fd6b2115a8e96','url':'assets/candy-crush/effects/boom-05.png'},{'revision':'3e39090078fedd7b014a5c794f290551','url':'assets/candy-crush/effects/boom-06.png'},{'revision':'4b390e58ed5879a5773029e3df692ee5','url':'assets/candy-crush/effects/boom-07.png'},{'revision':'a8acf9e9828f8d7b458813cdfa7644d1','url':'assets/candy-crush/effects/boom-08.png'},{'revision':'96a19952429e702b5be38657f9858009','url':'assets/candy-crush/effects/boom-09.png'},{'revision':'0ec75daa4ad491f76c44c19e2989f274','url':'assets/candy-crush/effects/boom-10.png'},{'revision':'aa42a718cd6db14736fc2ecfafb771a6','url':'assets/candy-crush/effects/boom-11.png'},{'revision':'461b60674cb07ed79cf194398016ed8d','url':'assets/candy-crush/effects/boom-12.png'},{'revision':'47ee3954679cb2664fdef61700abea5f','url':'assets/candy-crush/effects/boom-13.png'},{'revision':'c99f4913801f68c5f52fa5c456abe26e','url':'assets/candy-crush/effects/boom-14.png'},{'revision':'2f8a679429898697a451c159e732cc13','url':'assets/candy-crush/effects/boom-15.png'},{'revision':'08a305260c7a0238f7fbc91c56098b4e','url':'assets/candy-crush/effects/boom-16.png'},{'revision':'332059e183a23b436084a443fbe852d1','url':'assets/candy-crush/effects/boom-17.png'},{'revision':'6a0bfb096109786de61901cefaad94e4','url':'assets/candy-crush/effects/bubble-crush.png'},{'revision':'94a48fa4960835d88f5f101d57545145','url':'assets/candy-crush/effects/circle-exp-1.png'},{'revision':'1fa492255a5f2dd0356d942cb571ab98','url':'assets/candy-crush/effects/circle-exp-2.png'},{'revision':'4680af0c466fc56b3b77ac5b2bf90cb2','url':'assets/candy-crush/effects/circle-exp-3.png'},{'revision':'b6bc4ee55df56809c1138efaaf208bf0','url':'assets/candy-crush/effects/circle-exp-4.png'},{'revision':'a9193003c466f65464b9fac9d99168d3','url':'assets/candy-crush/effects/emty-sprite.png'},{'revision':'d992c1fd7c234abe3b138fe0b3a6f0d2','url':'assets/candy-crush/effects/indicator-0.png'},{'revision':'56e55f6f606789fb9478f09786de9665','url':'assets/candy-crush/effects/indicator-1.png'},{'revision':'ea1934e3506528d2c6d06b0181085634','url':'assets/candy-crush/effects/indicator-2.png'},{'revision':'8d66b356df9206649fd59763a6603c6f','url':'assets/candy-crush/effects/indicator-3.png'},{'revision':'d0b4a50e3d6e1e54ffdfc9825f10c79f','url':'assets/candy-crush/effects/package-anim-1.png'},{'revision':'7a9a90e3b2b09867c8a161c37aecaf34','url':'assets/candy-crush/effects/package-anim-2.png'},{'revision':'1adea34986090d36bf6e2b6116ba7415','url':'assets/candy-crush/effects/package-anim-3.png'},{'revision':'74a92be2253b8eb609bdf3f2166d6e63','url':'assets/candy-crush/effects/package-anim-4.png'},{'revision':'930e900fb1279651bf49162543efdb2c','url':'assets/candy-crush/effects/package-animation-1.png'},{'revision':'3550df3a0100ce5cd27d8d6b15e4878f','url':'assets/candy-crush/effects/package-animation-2.png'},{'revision':'9076917f93dcbc836dd52f1fa0839263','url':'assets/candy-crush/effects/package-animation-3.png'},{'revision':'b22cfdb1b4fdd6996ec75da7c00249fe','url':'assets/candy-crush/effects/package-animation-4.png'},{'revision':'7ffd15ef033d7658fee6f542c7ee36e0','url':'assets/candy-crush/effects/snow.png'},{'revision':'4c2fc9accfa5ad060649aaf644e2fd8d','url':'assets/candy-crush/effects/stripes_destroy.png'},{'revision':'c2ac6e51f25bd12f1173f78c43fe5845','url':'assets/candy-crush/effects/teleport-anim-effect-01.png'},{'revision':'ebc45daaf657940d140552b9aadc44fc','url':'assets/candy-crush/effects/teleport-anim-effect-02.png'},{'revision':'b0a2ff0e3039a1cfc8f394bab6b0a911','url':'assets/candy-crush/effects/teleport-anim-effect-03.png'},{'revision':'ae05862bbef9bf350cc29518f567baf9','url':'assets/candy-crush/effects/teleport-anim-effect-04.png'},{'revision':'925b6d07e7ed56987ed376cbd263ea1f','url':'assets/candy-crush/effects/teleport-anim-effect-05.png'},{'revision':'331fbcba10ee439fce0ac139d8643a1a','url':'assets/candy-crush/effects/teleport-anim-effect-06.png'},{'revision':'efaa2d38c2a7309d644c9830c097b5ce','url':'assets/candy-crush/images/background-01.png'},{'revision':'3c25b1bb6906d15bf4b138c82dd7256a','url':'assets/candy-crush/images/background-02.png'},{'revision':'763e071417c8ecee74a2d528edece1bf','url':'assets/candy-crush/images/background-03.png'},{'revision':'a4d413002fad6a99594fd4e7e3fd3050','url':'assets/candy-crush/images/background-04.png'},{'revision':'e1378b05955c85ed1e1d8cb1aedc8106','url':'assets/candy-crush/images/background-05.png'},{'revision':'3e179040e62d3c1fac5e94daa57b61c5','url':'assets/candy-crush/images/bomb-items-01.png'},{'revision':'54870ad5a2c79c6aecde2a25389c6358','url':'assets/candy-crush/images/bomb-items-02.png'},{'revision':'1879a096af2819a4510eff3c265ad98f','url':'assets/candy-crush/images/bomb-items-03.png'},{'revision':'90089844bef5fd5b45c2e97e98611bb7','url':'assets/candy-crush/images/bomb-items-04.png'},{'revision':'2b6a36e8ffc0a1a8ccf2d1e048f6742f','url':'assets/candy-crush/images/bomb-items-05.png'},{'revision':'b4bfff4aced441fa50967246febdbc36','url':'assets/candy-crush/images/bomb-items-06.png'},{'revision':'a43da1d998d6c449a02dd53713c210ea','url':'assets/candy-crush/images/game-item-h.png'},{'revision':'1c009ef9401efd8a05e3b8be38a316ec','url':'assets/candy-crush/images/item-01-stripes-horiz.png'},{'revision':'74646a093ec1cc169041615e7e3b0a29','url':'assets/candy-crush/images/item-01-stripes-vert.png'},{'revision':'fda89bc81afa2c483d3f7c22e576d730','url':'assets/candy-crush/images/item-01.png'},{'revision':'1012e5722cbd8693a796b6025ee860cb','url':'assets/candy-crush/images/item-02-stripes-horiz.png'},{'revision':'aa6f8b4faa5636a182dced87ed517007','url':'assets/candy-crush/images/item-02-stripes-vert.png'},{'revision':'9f2005faed79fc34023cb72d33fe95c6','url':'assets/candy-crush/images/item-02.png'},{'revision':'dc6327abd059ee614e499f7b694ea7b0','url':'assets/candy-crush/images/item-03-stripes-horiz.png'},{'revision':'7d515bed81b225123a6d71daafb86198','url':'assets/candy-crush/images/item-03-stripes-vert.png'},{'revision':'0b2fcf47cb76f4e23823d01aeb63dac0','url':'assets/candy-crush/images/item-03.png'},{'revision':'46ff36bcfe618b6d4162dcb01c9fcde9','url':'assets/candy-crush/images/item-04-stripes-horiz.png'},{'revision':'b6b05c893cc90301971befc99074de50','url':'assets/candy-crush/images/item-04-stripes-vert.png'},{'revision':'3563ff970742462dfe2d92d97d1735bf','url':'assets/candy-crush/images/item-04.png'},{'revision':'a2dfa3e48db95dd6bc71d0f702031ba8','url':'assets/candy-crush/images/item-05-stripes-horiz.png'},{'revision':'43a588d0be66ba41443cb5e0e7a7e2cf','url':'assets/candy-crush/images/item-05-stripes-vert.png'},{'revision':'7d1ea21fa0544c0ae6abdc844d03991c','url':'assets/candy-crush/images/item-05.png'},{'revision':'0c25718a47431661eda886a3348a544a','url':'assets/candy-crush/images/item-06-stripes-horiz.png'},{'revision':'0b2161517863324f79e6da58b6efe883','url':'assets/candy-crush/images/item-06-stripes-vert.png'},{'revision':'cc8f358b05641fc83b7ec4f03416811c','url':'assets/candy-crush/images/item-06.png'},{'revision':'2d90cc76d9c4cabfdb4069b3666c6e42','url':'assets/candy-crush/images/item-mar-01.png'},{'revision':'e007af45271488c8dae583d13153ca74','url':'assets/candy-crush/images/item-mar-02.png'},{'revision':'62003219f46d3ba61c5197e20db03f79','url':'assets/candy-crush/images/item-mar-03.png'},{'revision':'c0a05970c43b690238f36105e4e40e2c','url':'assets/candy-crush/images/item-mar-04.png'},{'revision':'ac2e74afcf1013bcdd5af53a3908268c','url':'assets/candy-crush/images/item-mar-05.png'},{'revision':'8df73ca3b288293acb58e6bf5efbb10d','url':'assets/candy-crush/images/item-mar-06.png'},{'revision':'6a4ba4b9c94288cbaf68af4842a558c0','url':'assets/candy-crush/images/item-spot-01.png'},{'revision':'01598b2226eef93c78f795b13da9f68e','url':'assets/candy-crush/images/item-spot-02.png'},{'revision':'2d13db03711fec84aa6ffa0d3d47e80c','url':'assets/images/cookie1.png'},{'revision':'3d7217e240c1c41d32864a065ab938d6','url':'assets/images/cookie2.png'},{'revision':'d627dbea88c468bf0a11f6a471d3b185','url':'assets/images/croissant.png'},{'revision':'f23fad1c608a78b716183df69c0634fe','url':'assets/images/cupcake.png'},{'revision':'502ef2e67222d276a764d264dee396ef','url':'assets/images/donut.png'},{'revision':'ee14a72523b0f5525c5edcb7e15cf0b7','url':'assets/images/eclair.png'},{'revision':'1cbdf6b3fce2b6b03b5e63b79dde4f28','url':'assets/images/macaroon.png'},{'revision':'b887c333d5ec8274b78d0851e7b3337b','url':'assets/images/phaser-logo.png'},{'revision':'0b1500a0647929ea85a73e53af670689','url':'assets/images/pie.png'},{'revision':'aad7687d17ae8a4e5234a39da0a5a989','url':'assets/images/poptart1.png'},{'revision':'3bfbf2737d24008597aa36e12aa32aec','url':'assets/images/poptart2.png'},{'revision':'1cf71f717a67c59729166f1924c5f7d4','url':'assets/images/starcookie1.png'},{'revision':'996f19fd6990669bb02b2bb7e7588d1b','url':'assets/images/starcookie2.png'},{'revision':'254e18acbb5756144e754a14a6cf270a','url':'assets/pack.json'},{'revision':'57040e5677322118f6d56a1d9e43c5c6','url':'favicon.ico'},{'revision':'2ffbc23293ee8a797bc61e9c02534206','url':'icons/icons-192.png'},{'revision':'8bdcc486cda9b423f50e886f2ddb6604','url':'icons/icons-512.png'},{'revision':'bdc211e9ac6c7ef1bacfbd8eb282f6a5','url':'index.html'},{'revision':null,'url':'main.b680d81493a9f880ef14.bundle.js'},{'revision':'4b7794a9c6ccfc90c36c434a89288a64','url':'manifest.json'},{'revision':null,'url':'vendors.d52ccc982dede3cd8989.bundle.js'},{'revision':'bd5b234274f46d53c26c6a2587d17163','url':'vendors.d52ccc982dede3cd8989.bundle.js.LICENSE.txt'}],_().precache(L),function(t){const s=_();!function(t,s,a){let n;if("string"==typeof t){const e=new URL(t,location.href);n=new v((({url:t})=>t.href===e.href),s,a)}else if(t instanceof RegExp)n=new C(t,s,a);else if("function"==typeof t)n=new v(t,s,a);else{if(!(t instanceof v))throw new e("unsupported-route-type",{moduleName:"workbox-routing",funcName:"registerRoute",paramName:"capture"});n=t}(q||(q=new b,q.addFetchListener(),q.addCacheListener()),q).registerRoute(n)}(new U(s,t))}(undefined)})()})();