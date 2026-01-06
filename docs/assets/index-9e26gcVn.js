(function(){const t=document.createElement("link").relList;if(t&&t.supports&&t.supports("modulepreload"))return;for(const i of document.querySelectorAll('link[rel="modulepreload"]'))o(i);new MutationObserver(i=>{for(const a of i)if(a.type==="childList")for(const l of a.addedNodes)l.tagName==="LINK"&&l.rel==="modulepreload"&&o(l)}).observe(document,{childList:!0,subtree:!0});function s(i){const a={};return i.integrity&&(a.integrity=i.integrity),i.referrerPolicy&&(a.referrerPolicy=i.referrerPolicy),i.crossOrigin==="use-credentials"?a.credentials="include":i.crossOrigin==="anonymous"?a.credentials="omit":a.credentials="same-origin",a}function o(i){if(i.ep)return;i.ep=!0;const a=s(i);fetch(i.href,a)}})();const r={GUTENDEX_BASE_URL:"https://gutendex.com",PREFETCH_THRESHOLD:25,INITIAL_BATCH_SIZE:50,LOAD_BATCH_SIZE:30,LOAD_MORE_COUNT:7,MAX_ROUNDS:5,ID_MULTIPLIER:2,MAX_ID_ATTEMPTS_MULTIPLIER:10,MIN_CATALOG_ID:1,MAX_CATALOG_ID:75e3,MAX_CATALOG_PERCENTAGE:.9,MAX_ID_BUFFER:500,LOADING_POLL_INTERVAL_MS:100,LOADING_TIMEOUT_MS:3e4,COPY_FEEDBACK_DURATION_MS:2e3,INTERSECTION_ROOT_MARGIN:"200px",INTERSECTION_THRESHOLD:0},d={TITLE_MAX_LINES:2,TITLE_FONT_SIZE_SMALL:"clamp(1.2rem, 4.5vw, 1.7rem)",TITLE_MAX_LENGTH:70,SUMMARY_MAX_LENGTH:200,SUBJECT_MAX_LENGTH:12,COVER_PLACEHOLDER_MAX_LENGTH:40,FAVORITE_TITLE_MAX_LENGTH:50,FAVORITE_PLACEHOLDER_MAX_LENGTH:20,MAX_SUBJECTS_DISPLAYED:2,MAX_TOTAL_TAGS:3,PRELOAD_IMAGE_COUNT:3,TITLE_OBSERVER_ROOT_MARGIN:"50px"},_={MAX_SEEN_IDS:1e4,CLEANUP_KEEP_COUNT:5e3,FAVORITES_STORAGE_KEY:"bookworm_favorites",LOCALSTORAGE_SAVE_DEBOUNCE_MS:300};function $(e){let t=Number(e);return isFinite(t)||(t=Date.now()),t=t|0,function(){let s=t+=1831565813;return s=Math.imul(s^s>>>15,s|1),s^=s+Math.imul(s^s>>>7,s|61),((s^s>>>14)>>>0)/4294967296}}function x(e,t){const s=[...e];for(let o=s.length-1;o>0;o--){const i=Math.floor(t()*(o+1));[s[o],s[i]]=[s[i],s[o]]}return s}const H="https://gutendex.com";async function z(){try{const t=await(await fetch(`${H}/books?sort=descending`)).json();return t.results&&t.results.length>0?Math.max(...t.results.map(s=>s.id)):null}catch(e){return console.error("Failed to fetch max catalog ID:",e),null}}async function V(e,t){if(e.length===0)return[];const s=new URL(`${H}/books`);s.searchParams.append("ids",e.join(",")),t&&s.searchParams.append("languages",t);try{const o=await fetch(s.toString());if(!o.ok)throw new Error(`HTTP ${o.status}`);return(await o.json()).results||[]}catch(o){return console.error("Batch fetch error:",o),[]}}class q{constructor(t={}){this.buffer=[],this.seenIds=new Set,this.failedIds=new Set,this.isInitialized=!1,this.isLoading=!1,this.hasMore=!0,this.totalAttempted=0,this.totalFound=0,this.seed=t.seed||Date.now(),this.random=$(this.seed),this.languages=t.languages||null,this.prefetchThreshold=t.prefetchThreshold||r.PREFETCH_THRESHOLD,this.minId=r.MIN_CATALOG_ID,this.maxId=r.MAX_CATALOG_ID}async initialize(){if(this.isInitialized)return{maxId:this.maxId,seed:this.seed};const t=await z();return t!==null&&(this.maxId=t+r.MAX_ID_BUFFER),await this.loadRandomBatch(r.INITIAL_BATCH_SIZE),this.isInitialized=!0,{maxId:this.maxId,seed:this.seed}}cleanupOldIds(){if(this.seenIds.size>_.MAX_SEEN_IDS){const t=Array.from(this.seenIds).slice(-5e3);this.seenIds=new Set(t),console.log(`Memory cleanup: Reduced seenIds from ${_.MAX_SEEN_IDS} to ${this.seenIds.size}`)}if(this.failedIds.size>_.MAX_SEEN_IDS){const t=Array.from(this.failedIds).slice(-5e3);this.failedIds=new Set(t),console.log(`Memory cleanup: Reduced failedIds from ${_.MAX_SEEN_IDS} to ${this.failedIds.size}`)}}generateRandomIds(t){const s=new Set;let o=0;const i=t*r.MAX_ID_ATTEMPTS_MULTIPLIER;for(;s.size<t&&o<i;){const a=Math.floor(this.random()*this.maxId)+this.minId;!this.seenIds.has(a)&&!this.failedIds.has(a)&&s.add(a),o++}return Array.from(s)}async loadRandomBatch(t=10){if(!this.isLoading){this.isLoading=!0;try{let s=[],o=0;const i=r.MAX_ROUNDS;for(;s.length<t&&o<i;){const l=Math.ceil((t-s.length)*r.ID_MULTIPLIER),n=this.generateRandomIds(l);this.totalAttempted+=n.length,n.forEach(v=>this.seenIds.add(v));const E=await V(n,this.languages),h=new Set(E.map(v=>v.id));n.forEach(v=>{h.has(v)||this.failedIds.add(v)}),this.totalFound+=E.length,s.push(...E),o++}const a=x(s,this.random);this.buffer.push(...a),this.cleanupOldIds(),this.seenIds.size+this.failedIds.size>this.maxId*r.MAX_CATALOG_PERCENTAGE&&(this.hasMore=!1)}finally{this.isLoading=!1}}}async getNext(t=1){this.isInitialized||await this.initialize(),this.buffer.length<this.prefetchThreshold&&this.hasMore&&!this.isLoading&&this.loadRandomBatch(r.LOAD_BATCH_SIZE).catch(console.error),this.buffer.length===0&&this.isLoading&&await new Promise((o,i)=>{const a=setTimeout(()=>{clearInterval(l),i(new Error("Loading timeout - books failed to load"))},r.LOADING_TIMEOUT_MS),l=setInterval(()=>{(!this.isLoading||this.buffer.length>0)&&(clearInterval(l),clearTimeout(a),o())},r.LOADING_POLL_INTERVAL_MS)});const s=this.buffer.splice(0,t);return this.buffer.length<this.prefetchThreshold&&this.hasMore&&!this.isLoading&&this.loadRandomBatch(r.LOAD_BATCH_SIZE).catch(console.error),{books:s,hasMore:this.hasMore||this.buffer.length>0}}getStats(){return{attempted:this.totalAttempted,found:this.totalFound,hitRate:this.totalAttempted>0?(this.totalFound/this.totalAttempted*100).toFixed(1)+"%":"N/A",bufferSize:this.buffer.length,seenCount:this.seenIds.size}}}let I=null,M=null;function y(){M={favoritesCount:Array.from(document.querySelectorAll(".favorites-count"))}}function j(){return M||y(),M}function T(){if(I!==null)return I;try{const e=localStorage.getItem(_.FAVORITES_STORAGE_KEY),t=e?JSON.parse(e):[];return I=t,t}catch(e){return console.error("Failed to load favorites:",e),I=[],[]}}function Y(e){try{localStorage.setItem(_.FAVORITES_STORAGE_KEY,JSON.stringify(e)),I=e}catch(t){throw console.error("Failed to save favorites:",t),t instanceof Error&&t.name==="QuotaExceededError"?alert("Storage quota exceeded! Your favorites list is full. Please remove some items to add new ones."):alert("Failed to save favorites. Please try again."),t}}function K(e){return T().some(s=>s.id===e)}function k(e){const t=T(),s=t.findIndex(o=>o.id===e.id);s>=0?t.splice(s,1):t.push(e);try{return Y(t),F(),s<0}catch{return s>=0?t.push(e):t.pop(),s>=0}}function F(){const e=T().length;j().favoritesCount.forEach(s=>{s.textContent=e.toString(),s.style.display="none"})}function Z(){M=null,y()}function N(e){return e.formats["image/jpeg"]||null}function J(e){return`https://www.gutenberg.org/ebooks/${e.id}`}function R(e){return e.formats["text/html"]||J(e)}function g(e,t){return!e||e.length<=t?e||"":e.substring(0,t).trim()+"..."}function B(e){e&&(e.addEventListener("click",()=>location.reload()),e.style.cursor="pointer")}function W(e,t){var b,w,D;const s=N(e),o=((b=e.authors[0])==null?void 0:b.name)||"Unknown Author",i=((w=e.summaries)==null?void 0:w[0])||"No summary available for this classic work.",a=((D=e.subjects)==null?void 0:D.slice(0,d.MAX_TOTAL_TAGS))||[],l=e.languages||["en"],n=document.createElement("article");n.className="book-card",n.innerHTML=`
    <div class="card-bg">
      ${s?`<img class="card-bg-image" src="${s}" alt="" loading="lazy">`:""}
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
          ${s?`<img src="${s}" alt="${e.title}" loading="eager" class="cover-image" decoding="async">`:`<div class="cover-placeholder">${g(e.title,d.COVER_PLACEHOLDER_MAX_LENGTH)}</div>`}
        </div>
      </div>

      <div class="book-info">
        <h1 class="book-title">${g(e.title,d.TITLE_MAX_LENGTH)}</h1>
        <p class="book-author">
          <span class="author-line"></span>
          ${o}
        </p>
        <p class="book-summary">${g(i,d.SUMMARY_MAX_LENGTH)}</p>

        <div class="book-tags">
          ${l.map(c=>`<span class="tag language">${c.toUpperCase()}</span>`).join("")}
          ${a.slice(0,d.MAX_SUBJECTS_DISPLAYED).map(c=>`<span class="tag">${g(c.split(" -- ")[0],d.SUBJECT_MAX_LENGTH)}</span>`).join("")}
        </div>
      </div>

      <div class="book-actions">
        <a href="${R(e)}" target="_blank" rel="noopener" class="btn btn-primary">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"/>
            <path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"/>
          </svg>
          Read
        </a>
        <div class="icon-wrapper favorite-wrapper">
          <svg class="action-favorite-icon ${K(e.id)?"favorited":""}" data-book-id="${e.id}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" role="button" aria-label="Add to favorites">
            <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/>
          </svg>
        </div>
        <div class="icon-wrapper link-wrapper">
          <svg class="copy-link-icon" data-book-url="${R(e)}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" role="button" aria-label="Copy link">
            <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"/>
            <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"/>
          </svg>
        </div>
      </div>
    </div>
  `,B(n.querySelector(".app-name"));const E=n.querySelector(".action-favorite-icon");E&&E.addEventListener("click",c=>{c.stopPropagation();const u=k(e);E.classList.toggle("favorited",u),E.setAttribute("aria-label",u?"Remove from favorites":"Add to favorites")});const h=n.querySelector(".copy-link-icon");h&&h.addEventListener("click",async c=>{c.stopPropagation();const u=h.dataset.bookUrl||"";try{await navigator.clipboard.writeText(u);const m=h.innerHTML;h.innerHTML='<path d="M20 6L9 17l-5-5"/>',h.classList.add("copied"),setTimeout(()=>{h.innerHTML=m,h.classList.remove("copied")},r.COPY_FEEDBACK_DURATION_MS)}catch(m){console.error("Failed to copy link:",m)}});const v=n.querySelector(".mobile-header-favorites");v&&v.addEventListener("click",t);const p=n.querySelector(".cover-image");p&&(p.addEventListener("load",()=>{p.classList.add("loaded")}),p.addEventListener("error",()=>{var u;const c=document.createElement("div");c.className="cover-placeholder",c.textContent=g(e.title,d.COVER_PLACEHOLDER_MAX_LENGTH),(u=p.parentElement)==null||u.replaceChild(c,p)}));const L=n.querySelector(".book-title");if(L){const c=()=>{const m=parseFloat(getComputedStyle(L).lineHeight),O=L.clientHeight;Math.round(O/m)>d.TITLE_MAX_LINES&&(L.style.fontSize=d.TITLE_FONT_SIZE_SMALL)},u=new IntersectionObserver(m=>{m.forEach(O=>{O.isIntersecting&&(c(),u.disconnect())})},{rootMargin:d.TITLE_OBSERVER_ROOT_MARGIN});u.observe(n)}return n}function G(){const e=document.createElement("div");return e.className="loading-card",e.id="loading-sentinel",e.innerHTML=`
    <div class="loader"></div>
    <p class="loading-text">Discovering more books...</p>
  `,e}function Q(e,t=d.PRELOAD_IMAGE_COUNT){e.slice(0,Math.min(t,e.length)).forEach(s=>{const o=N(s);if(o){const i=new Image;i.src=o}})}function ee(e,t){const s=new IntersectionObserver(i=>{var a;(a=i[0])!=null&&a.isIntersecting&&!t.value&&e()},{rootMargin:r.INTERSECTION_ROOT_MARGIN,threshold:r.INTERSECTION_THRESHOLD}),o=document.getElementById("loading-sentinel");return o&&s.observe(o),s}function U(){const e=document.getElementById("favoritesContent");if(!e)return;const t=T();if(t.length===0){e.innerHTML=`
      <div class="favorites-empty">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
          <path d="M4 19.5v-15A2.5 2.5 0 0 1 6.5 2H20v20H6.5a2.5 2.5 0 0 1 0-5H20"/>
          <path d="M8 7h6M8 11h8"/>
        </svg>
        <p>No favorites yet</p>
        <small>Tap the book icon to save books here</small>
      </div>
    `;return}e.innerHTML=t.map(s=>{var a;const o=N(s),i=((a=s.authors[0])==null?void 0:a.name)||"Unknown Author";return`
      <div class="favorite-item" data-book-id="${s.id}">
        <div class="favorite-cover">
          ${o?`<img src="${o}" alt="${s.title}" loading="lazy">`:`<div class="cover-placeholder-small">${g(s.title,d.FAVORITE_PLACEHOLDER_MAX_LENGTH)}</div>`}
        </div>
        <div class="favorite-info">
          <h3>${g(s.title,d.FAVORITE_TITLE_MAX_LENGTH)}</h3>
          <p>${i}</p>
        </div>
        <div class="favorite-actions">
          <a href="${R(s)}" target="_blank" rel="noopener" class="favorite-read-btn" aria-label="Read book">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"/>
              <path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"/>
            </svg>
          </a>
          <button class="favorite-remove-btn" data-book-id="${s.id}" aria-label="Remove from favorites">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M3 6h18M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/>
            </svg>
          </button>
        </div>
      </div>
    `}).join(""),e.querySelectorAll(".favorite-remove-btn").forEach(s=>{s.addEventListener("click",()=>{const o=parseInt(s.getAttribute("data-book-id")??"0",10),a=T().find(l=>l.id===o);a&&(k(a),U(),document.querySelectorAll(`.action-favorite-icon[data-book-id="${o}"]`).forEach(l=>{l.classList.remove("favorited")}))})})}function C(){const e=document.getElementById("favoritesPanel");if(!e)return;e.classList.contains("open")?e.classList.remove("open"):(U(),e.classList.add("open"))}const P=new q({languages:"en",prefetchThreshold:r.PREFETCH_THRESHOLD}),A={value:!1};let S=null;const f={feed:document.getElementById("feed"),favoritesToggle:document.getElementById("favoritesToggle"),favoritesClose:document.getElementById("favoritesClose"),desktopHeader:document.getElementById("desktopHeader")};async function X(e=r.LOAD_MORE_COUNT){if(!(A.value||!f.feed)){A.value=!0;try{const{books:t,hasMore:s}=await P.getNext(e),o=document.getElementById("loading-sentinel");o&&o.remove(),t.forEach(i=>{const a=W(i,C);f.feed.appendChild(a)}),Q(t),s&&(f.feed.appendChild(G()),te())}catch(t){console.error("Failed to load books:",t)}finally{A.value=!1}}}function te(){S&&S.disconnect(),S=ee(()=>X(r.LOAD_MORE_COUNT),A)}async function se(){if(f.feed){f.feed.appendChild(G());try{await P.initialize(),f.feed.innerHTML="",await X(r.LOAD_MORE_COUNT)}catch(e){console.error("Failed to initialize:",e),f.feed.innerHTML=`
      <div class="error-state">
        <h2>Something went wrong</h2>
        <p>We couldn't load the books. Please try again.</p>
        <button class="btn btn-primary" onclick="location.reload()">
          Refresh
        </button>
      </div>
    `}}}function oe(){f.desktopHeader&&B(f.desktopHeader.querySelector(".app-name")),f.favoritesToggle&&f.favoritesToggle.addEventListener("click",C),f.favoritesClose&&f.favoritesClose.addEventListener("click",C),document.addEventListener("mousedown",e=>{e.button===1&&e.preventDefault()})}y();oe();F();Z();se();
//# sourceMappingURL=index-9e26gcVn.js.map
