(function(){const o=document.createElement("link").relList;if(o&&o.supports&&o.supports("modulepreload"))return;for(const a of document.querySelectorAll('link[rel="modulepreload"]'))s(a);new MutationObserver(a=>{for(const i of a)if(i.type==="childList")for(const r of i.addedNodes)r.tagName==="LINK"&&r.rel==="modulepreload"&&s(r)}).observe(document,{childList:!0,subtree:!0});function t(a){const i={};return a.integrity&&(i.integrity=a.integrity),a.referrerPolicy&&(i.referrerPolicy=a.referrerPolicy),a.crossOrigin==="use-credentials"?i.credentials="include":a.crossOrigin==="anonymous"?i.credentials="omit":i.credentials="same-origin",i}function s(a){if(a.ep)return;a.ep=!0;const i=t(a);fetch(a.href,i)}})();const n={GUTENDEX_BASE_URL:"https://gutendex.com",PREFETCH_THRESHOLD:20,INITIAL_BATCH_SIZE:40,LOAD_BATCH_SIZE:25,LOAD_MORE_COUNT:5,MAX_ROUNDS:5,ID_MULTIPLIER:2,MAX_ID_ATTEMPTS_MULTIPLIER:10,MIN_CATALOG_ID:1,MAX_CATALOG_ID:75e3,MAX_CATALOG_PERCENTAGE:.9,MAX_ID_BUFFER:500,LOADING_POLL_INTERVAL_MS:100,LOADING_TIMEOUT_MS:3e4,COPY_FEEDBACK_DURATION_MS:2e3,INTERSECTION_ROOT_MARGIN:"200px",INTERSECTION_THRESHOLD:0},b=n.GUTENDEX_BASE_URL;function $(e){let o=Number(e);return isFinite(o)||(o=Date.now()),o=o|0,function(){let t=o+=1831565813;return t=Math.imul(t^t>>>15,t|1),t^=t+Math.imul(t^t>>>7,t|61),((t^t>>>14)>>>0)/4294967296}}function P(e,o){const t=[...e];for(let s=t.length-1;s>0;s--){const a=Math.floor(o()*(s+1));[t[s],t[a]]=[t[a],t[s]]}return t}class x{constructor(o={}){this.buffer=[],this.seenIds=new Set,this.failedIds=new Set,this.isInitialized=!1,this.isLoading=!1,this.hasMore=!0,this.totalAttempted=0,this.totalFound=0,this.seed=o.seed||Date.now(),this.random=$(this.seed),this.languages=o.languages||null,this.prefetchThreshold=o.prefetchThreshold||n.PREFETCH_THRESHOLD,this.minId=n.MIN_CATALOG_ID,this.maxId=n.MAX_CATALOG_ID}async initialize(){if(this.isInitialized)return{maxId:this.maxId,seed:this.seed};try{const t=await(await fetch(`${b}/books?sort=descending`)).json();t.results&&t.results.length>0&&(this.maxId=Math.max(...t.results.map(s=>s.id))+n.MAX_ID_BUFFER)}catch{console.warn("Could not determine max ID, using default")}return await this.loadRandomBatch(n.INITIAL_BATCH_SIZE),this.isInitialized=!0,{maxId:this.maxId,seed:this.seed}}generateRandomIds(o){const t=new Set;let s=0;const a=o*n.MAX_ID_ATTEMPTS_MULTIPLIER;for(;t.size<o&&s<a;){const i=Math.floor(this.random()*this.maxId)+this.minId;!this.seenIds.has(i)&&!this.failedIds.has(i)&&t.add(i),s++}return Array.from(t)}async fetchByIds(o){if(o.length===0)return[];const t=new URL(`${b}/books`);t.searchParams.append("ids",o.join(",")),this.languages&&t.searchParams.append("languages",this.languages);try{const s=await fetch(t.toString());if(!s.ok)throw new Error(`HTTP ${s.status}`);return(await s.json()).results||[]}catch(s){return console.error("Batch fetch error:",s),[]}}async loadRandomBatch(o=10){if(!this.isLoading){this.isLoading=!0;try{let t=[],s=0;const a=n.MAX_ROUNDS;for(;t.length<o&&s<a;){const r=Math.ceil((o-t.length)*n.ID_MULTIPLIER),h=this.generateRandomIds(r);this.totalAttempted+=h.length,h.forEach(l=>this.seenIds.add(l));const c=await this.fetchByIds(h),p=new Set(c.map(l=>l.id));h.forEach(l=>{p.has(l)||this.failedIds.add(l)}),this.totalFound+=c.length,t.push(...c),s++}const i=P(t,this.random);this.buffer.push(...i),this.seenIds.size+this.failedIds.size>this.maxId*n.MAX_CATALOG_PERCENTAGE&&(this.hasMore=!1)}finally{this.isLoading=!1}}}async getNext(o=1){this.isInitialized||await this.initialize(),this.buffer.length<this.prefetchThreshold&&this.hasMore&&!this.isLoading&&this.loadRandomBatch(n.LOAD_BATCH_SIZE).catch(console.error),this.buffer.length===0&&this.isLoading&&await new Promise((s,a)=>{const i=setTimeout(()=>{clearInterval(r),a(new Error("Loading timeout - books failed to load"))},n.LOADING_TIMEOUT_MS),r=setInterval(()=>{(!this.isLoading||this.buffer.length>0)&&(clearInterval(r),clearTimeout(i),s())},n.LOADING_POLL_INTERVAL_MS)});const t=this.buffer.splice(0,o);return this.buffer.length<this.prefetchThreshold&&this.hasMore&&!this.isLoading&&this.loadRandomBatch(n.LOAD_BATCH_SIZE).catch(console.error),{books:t,hasMore:this.hasMore||this.buffer.length>0}}getStats(){return{attempted:this.totalAttempted,found:this.totalFound,hitRate:this.totalAttempted>0?(this.totalFound/this.totalAttempted*100).toFixed(1)+"%":"N/A",bufferSize:this.buffer.length,seenCount:this.seenIds.size}}}const S="bookworm_favorites";let m=null;function g(){if(m!==null)return m;try{const e=localStorage.getItem(S),o=e?JSON.parse(e):[];return m=o,o}catch(e){return console.error("Failed to load favorites:",e),m=[],[]}}function z(e){try{localStorage.setItem(S,JSON.stringify(e)),m=e}catch(o){throw console.error("Failed to save favorites:",o),o instanceof Error&&o.name==="QuotaExceededError"?alert("Storage quota exceeded! Your favorites list is full. Please remove some items to add new ones."):alert("Failed to save favorites. Please try again."),o}}function G(e){return g().some(t=>t.id===e)}function C(e){const o=g(),t=o.findIndex(s=>s.id===e.id);t>=0?o.splice(t,1):o.push(e);try{return z(o),N(),t<0}catch{return t>=0?o.push(e):o.pop(),t>=0}}function N(){const e=g().length;document.querySelectorAll(".favorites-count").forEach(t=>{t.textContent=e.toString(),t.style.display="none"})}function k(){const e=document.getElementById("favoritesContent");if(!e)return;const o=g();if(o.length===0){e.innerHTML=`
      <div class="favorites-empty">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
          <path d="M4 19.5v-15A2.5 2.5 0 0 1 6.5 2H20v20H6.5a2.5 2.5 0 0 1 0-5H20"/>
          <path d="M8 7h6M8 11h8"/>
        </svg>
        <p>No favorites yet</p>
        <small>Tap the book icon to save books here</small>
      </div>
    `;return}e.innerHTML=o.map(t=>{var i;const s=H(t),a=((i=t.authors[0])==null?void 0:i.name)||"Unknown Author";return`
      <div class="favorite-item" data-book-id="${t.id}">
        <div class="favorite-cover">
          ${s?`<img src="${s}" alt="${t.title}" loading="lazy">`:`<div class="cover-placeholder-small">${u(t.title,20)}</div>`}
        </div>
        <div class="favorite-info">
          <h3>${u(t.title,50)}</h3>
          <p>${a}</p>
        </div>
        <div class="favorite-actions">
          <a href="${T(t)}" target="_blank" rel="noopener" class="favorite-read-btn" aria-label="Read book">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"/>
              <path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"/>
            </svg>
          </a>
          <button class="favorite-remove-btn" data-book-id="${t.id}" aria-label="Remove from favorites">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M3 6h18M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/>
            </svg>
          </button>
        </div>
      </div>
    `}).join(""),e.querySelectorAll(".favorite-remove-btn").forEach(t=>{t.addEventListener("click",()=>{const s=parseInt(t.dataset.bookId||"0"),i=g().find(r=>r.id===s);i&&(C(i),k(),document.querySelectorAll(`.action-favorite-icon[data-book-id="${s}"]`).forEach(r=>{r.classList.remove("favorited")}))})})}function _(){const e=document.getElementById("favoritesPanel");if(!e)return;e.classList.contains("open")?e.classList.remove("open"):(k(),e.classList.add("open"))}function D(e){e&&(e.addEventListener("click",()=>location.reload()),e.style.cursor="pointer")}const v=document.getElementById("feed"),B=new x({languages:"en",prefetchThreshold:n.PREFETCH_THRESHOLD});let X=0,E=!1,I=null;function H(e){return e.formats["image/jpeg"]||null}function j(e){return`https://www.gutenberg.org/ebooks/${e.id}`}function T(e){return e.formats["text/html"]||j(e)}function u(e,o){return!e||e.length<=o?e||"":e.substring(0,o).trim()+"..."}function q(e){var A,M,y;const o=H(e),t=((A=e.authors[0])==null?void 0:A.name)||"Unknown Author",s=((M=e.summaries)==null?void 0:M[0])||"No summary available for this classic work.",a=((y=e.subjects)==null?void 0:y.slice(0,3))||[],i=e.languages||["en"],r=document.createElement("article");r.className="book-card",r.innerHTML=`
    <div class="card-bg">
      ${o?`<img class="card-bg-image" src="${o}" alt="" loading="lazy">`:""}
      <div class="card-bg-overlay"></div>
      <div class="card-bg-pattern"></div>
    </div>

    <div class="card-content">
      <header class="card-header">
        <span class="app-name">BookWorm</span>
        <button class="favorites-toggle-btn mobile-header-favorites" aria-label="View favorites">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z"/>
          </svg>
          <span class="favorites-count">0</span>
        </button>
      </header>

      <div class="cover-container">
        <div class="book-cover">
          ${o?`<img src="${o}" alt="${e.title}" loading="lazy" class="cover-image">`:`<div class="cover-placeholder">${u(e.title,40)}</div>`}
        </div>
      </div>

      <div class="book-info">
        <h1 class="book-title">${u(e.title,70)}</h1>
        <p class="book-author">
          <span class="author-line"></span>
          ${t}
        </p>
        <p class="book-summary">${u(s,200)}</p>

        <div class="book-tags">
          ${i.map(d=>`<span class="tag language">${d.toUpperCase()}</span>`).join("")}
          ${a.slice(0,2).map(d=>`<span class="tag">${u(d.split(" -- ")[0],18)}</span>`).join("")}
        </div>

        <div class="book-actions">
          <a href="${T(e)}" target="_blank" rel="noopener" class="btn btn-primary">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"/>
              <path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"/>
            </svg>
            Read
          </a>
          <div class="icon-wrapper favorite-wrapper">
            <svg class="action-favorite-icon ${G(e.id)?"favorited":""}" data-book-id="${e.id}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" role="button" aria-label="Add to favorites">
              <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/>
            </svg>
          </div>
          <div class="icon-wrapper link-wrapper">
            <svg class="copy-link-icon" data-book-url="${T(e)}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" role="button" aria-label="Copy link">
              <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"/>
              <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"/>
            </svg>
          </div>
        </div>
      </div>
    </div>
  `,D(r.querySelector(".app-name"));const h=r.querySelector(".action-favorite-icon");h&&h.addEventListener("click",d=>{d.stopPropagation();const f=C(e);h.classList.toggle("favorited",f),h.setAttribute("aria-label",f?"Remove from favorites":"Add to favorites")});const c=r.querySelector(".copy-link-icon");c&&c.addEventListener("click",async d=>{d.stopPropagation();const f=c.dataset.bookUrl||"";try{await navigator.clipboard.writeText(f);const L=c.innerHTML;c.innerHTML='<path d="M20 6L9 17l-5-5"/>',c.classList.add("copied"),setTimeout(()=>{c.innerHTML=L,c.classList.remove("copied")},n.COPY_FEEDBACK_DURATION_MS)}catch(L){console.error("Failed to copy link:",L)}});const p=r.querySelector(".mobile-header-favorites");p&&p.addEventListener("click",_);const l=r.querySelector(".cover-image");return l&&(l.addEventListener("load",()=>{l.classList.add("loaded")}),l.addEventListener("error",()=>{var f;const d=document.createElement("div");d.className="cover-placeholder",d.textContent=u(e.title,40),(f=l.parentElement)==null||f.replaceChild(d,l)})),r}function F(){const e=document.createElement("div");return e.className="loading-card",e.id="loading-sentinel",e.innerHTML=`
    <div class="loader"></div>
    <p class="loading-text">Discovering more books...</p>
  `,e}async function U(e=n.LOAD_MORE_COUNT){if(!(E||!v)){E=!0;try{const{books:o,hasMore:t}=await B.getNext(e),s=document.getElementById("loading-sentinel");s&&s.remove(),o.forEach(a=>{const i=q(a);v.appendChild(i),X++}),t&&(v.appendChild(F()),V())}catch(o){console.error("Failed to load books:",o)}finally{E=!1}}}function V(){I&&I.disconnect(),I=new IntersectionObserver(o=>{var t;(t=o[0])!=null&&t.isIntersecting&&!E&&U(n.LOAD_MORE_COUNT)},{rootMargin:n.INTERSECTION_ROOT_MARGIN,threshold:n.INTERSECTION_THRESHOLD});const e=document.getElementById("loading-sentinel");e&&I.observe(e)}async function Z(){if(v){v.appendChild(F());try{await B.initialize(),v.innerHTML="",await U(n.LOAD_MORE_COUNT)}catch(e){console.error("Failed to initialize:",e),v.innerHTML=`
      <div class="error-state">
        <h2>Something went wrong</h2>
        <p>We couldn't load the books. Please try again.</p>
        <button class="btn btn-primary" onclick="location.reload()">
          Refresh
        </button>
      </div>
    `}}}Z();const w=document.getElementById("desktopHeader");w&&D(w.querySelector(".app-name"));const O=document.getElementById("favoritesToggle"),R=document.getElementById("favoritesClose");O&&O.addEventListener("click",_);R&&R.addEventListener("click",_);N();document.addEventListener("mousedown",e=>{e.button===1&&e.preventDefault()});
//# sourceMappingURL=index-DC_XfOMt.js.map
