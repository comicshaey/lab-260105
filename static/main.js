/* edulabhaey 공통 JS
   - 공통 네비/검색/목차/상단이동/푸터/라이트박스
*/

const PAGES = [
  { url:"index.html",   title:"홈", desc:"개요" },
  { url:"about.html",   title:"About", desc:"사이트 목적/운영 원칙/주의사항" },
  { url:"guide.html",   title:"신규 생존가이드", desc:"살려줘" },
  { url:"map.html",     title:"업무 전체 지도", desc:"학교행정 큰 그림(회계/계약/복무/기록)" },
  { url:"wave.html",    title:"문서등록대장 파도타기", desc:"학교 운영 로그 읽는 법(시그니처)" },
  { url:"expend.html",  title:"지출 업무", desc:"세출·계약 흐름 + 결의서 필드 해석" },
  { url:"payroll.html", title:"인건비 지급", desc:"급여 큰틀 + 1모듈(정액급식비) 깊게" },
  { url:"skills.html",  title:"실무 팁", desc:"전임자 파일 찾기/기안문 읽기/확인 루틴" },
  { url:"glossary.html",title:"질문 잡화점", desc:"신규가 막히는 용어/상황 정리" },
];

const NAV_ITEMS = [
  { url:"index.html",   label:"홈" },
  { url:"guide.html",   label:"생존가이드" },
  { url:"map.html",     label:"업무 맵" },
  { url:"wave.html",    label:"파도타기" },
  { url:"expend.html",  label:"지출업무" },
  { url:"payroll.html", label:"인건비" },
  { url:"skills.html",  label:"실무 팁" },
  { url:"glossary.html",label:"질문 잡화점" },
];

function $(sel, el=document){ return el.querySelector(sel); }
function $all(sel, el=document){ return [...el.querySelectorAll(sel)]; }

function currentPath(){
  return location.pathname.split("/").pop() || "index.html";
}

/* ===== 상단 메뉴 전 페이지 공통화 =====
   - 페이지마다 nav 구성이 달라서 "메뉴가 사라지는 것처럼" 보이는 문제 해결
   - header 안에 <nav class="nav">만 있으면 내용은 JS가 통일해줌
*/
function applyGlobalNav(){
  const nav = $("header .nav");
  if(!nav) return;

  nav.innerHTML = NAV_ITEMS.map(it =>
    `<a data-nav href="${it.url}">${it.label}</a>`
  ).join("");

  setActiveNav();
}

function setActiveNav(){
  const path = currentPath();
  $all("[data-nav]").forEach(a=>{
    a.classList.toggle("active", a.getAttribute("href") === path);
  });
}

function setupSearch(){
  const input = $("#siteSearch");
  const box = $("#searchResults");
  if(!input || !box) return;

  const render = (items)=>{
    if(!items.length){ box.style.display="none"; box.innerHTML=""; return; }
    box.innerHTML = items.slice(0,8).map(p=>`
      <a class="item" href="${p.url}">
        <div class="t">${p.title}</div>
        <div class="d">${p.desc}</div>
      </a>
    `).join("");
    box.style.display="block";
  };

  input.addEventListener("input", ()=>{
    const q = input.value.trim().toLowerCase();
    if(q.length < 1){ render([]); return; }
    const items = PAGES.filter(p =>
      p.title.toLowerCase().includes(q) ||
      p.desc.toLowerCase().includes(q) ||
      p.url.toLowerCase().includes(q)
    );
    render(items);
  });

  document.addEventListener("click", (e)=>{
    if(!box.contains(e.target) && e.target !== input){
      box.style.display="none";
    }
  });

  input.addEventListener("keydown", (e)=>{
    if(e.key === "Escape"){
      input.value = "";
      box.style.display="none";
    }
  });
}

function setupTOC(){
  const toc = $("#toc");
  if(!toc) return;

  const headers = $all("main h2[id], main h3[id]");
  if(!headers.length) return;

  toc.innerHTML = `
    <div class="tt">이 페이지 목차</div>
    ${headers.map(h=>{
      const level = h.tagName.toLowerCase();
      const pad = (level === "h3") ? " style='margin-left:10px; opacity:.95;'" : "";
      return `<a href="#${h.id}" data-toc="${h.id}"${pad}>${h.textContent}</a>`;
    }).join("")}
    <div class="hr"></div>
    <div class="small">TIP: <span class="kbd">Ctrl</span>+<span class="kbd">F</span>는 페이지 내 검색</div>
  `;

  const onScroll = ()=>{
    let current = headers[0].id;
    for(const h of headers){
      const r = h.getBoundingClientRect();
      if(r.top <= 120) current = h.id;
    }
    $all("[data-toc]").forEach(a=>{
      a.classList.toggle("active", a.getAttribute("data-toc") === current);
    });
  };
  document.addEventListener("scroll", onScroll, {passive:true});
  onScroll();
}

function setupTopButton(){
  const btn = $("#topBtn");
  if(!btn) return;
  const onScroll = ()=>{
    btn.style.display = (window.scrollY > 600) ? "inline-flex" : "none";
  };
  document.addEventListener("scroll", onScroll, {passive:true});
  btn.addEventListener("click", ()=> window.scrollTo({top:0, behavior:"smooth"}));
  onScroll();
}

function setLastUpdated(){
  const el = $("#lastUpdated");
  if(!el) return;
  const d = new Date();
  const s = `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,"0")}-${String(d.getDate()).padStart(2,"0")}`;
  el.textContent = s;
}

/* 우클릭 방지(기본 수준) */
function disableRightClick(){
  document.addEventListener("contextmenu", (e)=> e.preventDefault());

  document.addEventListener("dragstart", (e)=>{
    if(e.target && e.target.tagName === "IMG") e.preventDefault();
  });
}

/* 전 페이지 꼬릿말(footer) 통일 적용 */
function applyGlobalFooter(){
  const html = `
    <div class="wrap row">
      <div>
        제작자: 커여운 고주무관 · Contact:
        <a href="mailto:edusproutcomics@naver.com">edusproutcomics@naver.com</a>
        · 개인적으로 만든 비공식 사이트입니다.
      </div>
      <div class="small">
        <a href="about.html">사이트안내</a> · <a href="guide.html">사용가이드</a> · <a href="glossary.html">질문 잡화점</a>
      </div>
    </div>
  `;

  let footer = document.querySelector("footer.footer");
  if(!footer){
    footer = document.createElement("footer");
    footer.className = "footer";
    document.body.appendChild(footer);
  }
  footer.innerHTML = html;
}


function setupImageLightbox(){
  // 라이트박스 DOM
  const lb = document.createElement("div");
  lb.className = "lightbox";
  lb.innerHTML = `
    <div class="lb-inner" role="dialog" aria-modal="true">
      <button class="lb-btn lb-close" type="button" aria-label="닫기">✕</button>
      <button class="lb-btn lb-prev" type="button" aria-label="이전">←</button>
      <button class="lb-btn lb-next" type="button" aria-label="다음">→</button>

      <div class="lb-stage">
        <div class="lb-imgwrap">
          <img class="lb-img" src="" alt="확대 이미지">
          <div class="lb-overlay"></div>
        </div>
      </div>

      <div class="lb-caption">
        <div class="lb-title"></div>
        <div class="lb-desc"></div>
        <div class="lb-hint">ESC 닫기 · ←/→ 이동 · 클릭 닫기</div>
      </div>
    </div>
  `;
  document.body.appendChild(lb);

  const imgEl = $(".lb-img", lb);
  const ovEl  = $(".lb-overlay", lb);
  const tEl   = $(".lb-title", lb);
  const dEl   = $(".lb-desc", lb);

  let items = [];
  let idx = 0;

  const collectItems = (group)=>{
    const sel = group ? `.img-zoomable[data-lb-group="${group}"]` : `.img-zoomable`;
    return $all(sel).map(img=>{
      const figure = img.closest("figure");
      const capT = figure ? $(".imgcap .t", figure)?.textContent?.trim() : "";
      const capD = figure ? $(".imgcap .d", figure)?.textContent?.trim() : "";
      const overlay = figure ? $(".imgwrap .overlay", figure) : null;
      return { img, capT, capD, overlay };
    });
  };

  const openAt = (newItems, newIdx)=>{
    items = newItems;
    idx = newIdx;

    const it = items[idx];
    imgEl.src = it.img.src;

    // 캡션 고정
    tEl.textContent = it.capT || "";
    dEl.textContent = it.capD || "";

    // 오버레이 복제(마커)
    ovEl.innerHTML = "";
    if(it.overlay){
      ovEl.innerHTML = it.overlay.innerHTML;
    }

    lb.style.display = "flex";
    document.body.style.overflow = "hidden";
  };

  const close = ()=>{
    lb.style.display = "none";
    imgEl.src = "";
    ovEl.innerHTML = "";
    document.body.style.overflow = "";
  };

  const move = (dir)=>{
    if(!items.length) return;
    idx = (idx + dir + items.length) % items.length;
    const it = items[idx];

    imgEl.src = it.img.src;
    tEl.textContent = it.capT || "";
    dEl.textContent = it.capD || "";
    ovEl.innerHTML = it.overlay ? it.overlay.innerHTML : "";
  };

  // 썸네일 클릭 -> 열기
  document.addEventListener("click", (e)=>{
    const img = e.target.closest(".img-zoomable");
    if(!img) return;

    const group = img.getAttribute("data-lb-group") || "";
    const list = collectItems(group);
    const start = list.findIndex(x => x.img === img);
    openAt(list, Math.max(0, start));
  });

  // 닫기(배경 클릭/버튼)
  lb.addEventListener("click", (e)=>{
    if(e.target === lb) close();
  });
  $(".lb-close", lb).addEventListener("click", close);

  // 이전/다음 버튼
  $(".lb-prev", lb).addEventListener("click", ()=> move(-1));
  $(".lb-next", lb).addEventListener("click", ()=> move(+1));

  // 키보드
  document.addEventListener("keydown", (e)=>{
    if(lb.style.display !== "flex") return;

    if(e.key === "Escape") close();
    if(e.key === "ArrowLeft") move(-1);
    if(e.key === "ArrowRight") move(+1);
  });

  // 스테이지 클릭하면 닫기(이미지 자체 클릭 제외)
  $(".lb-stage", lb).addEventListener("click", (e)=>{
    // 이미지 클릭은 확대 유지(실수로 닫히는 것 방지)
    if(e.target && (e.target.classList.contains("lb-img") || e.target.closest(".lb-imgwrap"))) return;
    close();
  });
}

document.addEventListener("DOMContentLoaded", ()=>{
  applyGlobalNav();  
  setupSearch();
  setupTOC();
  setupTopButton();
  setLastUpdated();

  disableRightClick();
  applyGlobalFooter();

  setupImageLightbox(); 
});

document.addEventListener("DOMContentLoaded", () => {
  const lightbox = document.createElement("div");
  lightbox.className = "lightbox";
  document.body.appendChild(lightbox);

  document.querySelectorAll(".img-zoomable").forEach(img => {
    img.addEventListener("click", () => {
      lightbox.innerHTML = "";
      const big = document.createElement("img");
      big.src = img.src;
      lightbox.appendChild(big);
      lightbox.style.display = "flex";
    });
  });

  lightbox.addEventListener("click", () => {
    lightbox.style.display = "none";
  });

  document.addEventListener("keydown", e => {
    if(e.key === "Escape") lightbox.style.display = "none";
  });
});
