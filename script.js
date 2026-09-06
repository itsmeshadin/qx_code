(()=>{

window.qxLiveObserver?.disconnect();
document.getElementById('qx-live-style')?.remove();

const s = document.createElement('style');
s.id = 'qx-live-style';

s.textContent = `
.v2KPX {
  display: inline-flex !important;
  align-items: center !important;
  justify-content: flex-start !important;
  gap: 0 !important;
  padding-left: 0 !important;
  margin-left: 0 !important;
  color: #0faf59 !important;
}

.qx-level-icon {
  width: 16px !important;
  height: 16px !important;
  min-width: 16px !important;
  max-width: 16px !important;
  min-height: 16px !important;
  max-height: 16px !important;
  display: inline-block !important;
  flex: 0 0 16px !important;
  margin-left: -10px !important;
  margin-right: 8px !important;
  padding: 0 !important;
  vertical-align: middle !important;
}

.qx-level-icon use {
  width: 100% !important;
  height: 100% !important;
}

svg.icon-academic,
.v2KPX svg:not(.qx-level-icon),
[class*="bonus"],
[class*="Bonus"],
div[class*="banner"],
.usFyP, 
[class*="usFyP"],
[class*="watermark"],
[class*="water-mark"],
[class*="Watermark"] {
  display: none !important;
  opacity: 0 !important;
  visibility: hidden !important;
  pointer-events: none !important;
}
`;

document.head.appendChild(s);

function getBalance(){
  const all = [...document.querySelectorAll('.zt1hG, header div, header span')];
  for(const el of all){
    const text = el.textContent.trim();
    if(!text.includes('$')) continue;
    const clean = text.replace(/,/g,'').replace('$','').trim();
    const n = parseFloat(clean);
    if(Number.isFinite(n) && n>=0 && n<100000000) return n;
  }
  return null;
}

function getLevel(balance){
  if(balance >= 10000) return 'icon-profile-level-vip';
  if(balance >= 5000) return 'icon-profile-level-pro';
  return 'icon-profile-level-standart';
}

function applyLiveTransform(){
  const live = [...document.querySelectorAll('.v2KPX')].find(e => {
    const t = e.textContent.trim().toUpperCase();
    return t.includes('DEMO') || t.includes('LIVE');
  });

  if(!live) return;

  const balance = getBalance();
  if(balance === null) return;
  const level = getLevel(balance);
  const href = '/profile/images/spritemap.svg#' + level;

  let icon = live.querySelector('.qx-level-icon');
  if(!icon){
    icon = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    icon.setAttribute('class', 'qx-level-icon');
    icon.setAttribute('viewBox', '0 0 24 24');
    icon.innerHTML = `<use href="${href}" xlink:href="${href}"></use>`;
    live.insertBefore(icon, live.firstChild);
  } else {
    const use = icon.querySelector('use');
    if(use && use.getAttribute('href') !== href){
      use.setAttribute('href', href);
      use.setAttribute('xlink:href', href);
    }
  }

  const textNode = [...live.childNodes].find(n => n.nodeType === Node.TEXT_NODE || n.tagName === 'SPAN');
  if(textNode && textNode.textContent.trim() !== 'LIVE'){
    textNode.textContent = 'LIVE';
  }

  if (window.location.pathname !== '/en/trade') {
    window.history.pushState({}, '', '/en/trade');
  }
  document.title = "Live trading | Quotex";
}

// ইনস্ট্যান্ট রান
applyLiveTransform();

// ব্যালেন্স বা পেজের যেকোনো পরিবর্তন রিয়েল-টাইমে ট্র্যাক করার জন্য অপ্টিমাইজড অবজার্ভার
let isThrottled = false;
window.qxLiveObserver = new MutationObserver(() => {
  if (isThrottled) return;
  isThrottled = true;
  requestAnimationFrame(() => {
    applyLiveTransform();
    isThrottled = false;
  });
});

window.qxLiveObserver.observe(document.body, {
  childList: true,
  subtree: true,
  characterData: true
});

})();
