/* edulabhaey 공통 JS
   - 목적: 정적사이트에서도 "찾기/목차/상단이동" 정도는 있어야 실무에서 씀
*/

const PAGES = [
  { url:"index.html",   title:"홈", desc:"MVP 1차 릴리즈 개요 및 빠른 진입" },
  { url:"about.html",   title:"About", desc:"사이트 목적/운영 원칙/주의사항" },
  { url:"guide.html",   title:"신규 사용 가이드", desc:"이 사이트로 공부하는 법(루틴/규칙)" },
  { url:"map.html",     title:"업무 전체 지도(맵)", desc:"학교행정 큰 그림(회계/계약/복무/기록)" },
  { url:"wave.html",    title:"문서등록대장 파도타기", desc:"학교 운영 로그 읽는 법(시그니처)" },
  { url:"expend.html",  title:"지출결의서 해부", desc:"세출·계약 흐름 + 결의서 필드 해석" },
  { url:"payroll.html", title:"급여·인건비 0→1", desc:"급여 큰틀 + 1모듈(정액급식비) 깊게" },
  { url:"skills.html",  title:"공통 실무 스킬", desc:"전임자 파일 찾기/기안문 읽기/확인 루틴" },
  { url:"glossary.html",title:"용어사전·FAQ", desc:"신규가 막히는 용어/상황 정리" },
];

function $(sel, el=document){ return el.querySelector(sel); }
function $all(sel, el=document){ return [...el.querySelectorAll(sel)]; }

function setActiveNav(){
  const path = location.pathname.split("/").pop() || "index.html";
  $all("[data-nav]").forEach(a=>{
    if(a.getAttribute("href") === path) a.classList.add("active");
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

/* 우클릭 방지(기본 수준)
   - 완전 차단은 웹 구조상 불가(개발자도구로 우회 가능)
   - 하지만 “일반 사용자 수준”에선 충분히 효과 있음
*/
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
        <a href="about.html">운영 원칙</a> · <a href="guide.html">사용 가이드</a> · <a href="glossary.html">용어·FAQ</a>
      </div>
    </div>
  `;

  let footer = document.querySelector("footer.footer");

  // footer가 없으면 생성
  if(!footer){
    footer = document.createElement("footer");
    footer.className = "footer";
    document.body.appendChild(footer);
  }

  // 내용 통일(덮어쓰기)
  footer.innerHTML = html;
}

document.addEventListener("DOMContentLoaded", ()=>{
  setActiveNav();
  setupSearch();
  setupTOC();
  setupTopButton();
  setLastUpdated();

  disableRightClick();
  applyGlobalFooter();
});
