(()=>{

window.qxLiveObserver?.disconnect();
clearInterval(window.qxLiveFix);
document.getElementById('qx-live-style')?.remove();

const s=document.createElement('style');
s.id='qx-live-style';

s.textContent=`
.v2KPX {
  display: inline-flex !important;
  align-items: center !important;
  justify-content: flex-start !important;
  gap: 0 !important;
  padding-left: 0 !important;
  margin-left: 0 !important;
  color: #0faf59 !important;
}

/* আইকনের ডানপাশে মার্জিন বাড়িয়ে ফাঁকা জায়গা করা হয়েছে */
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
  margin-right: 8px !important; /* ডানের ফাঁকা জায়গা বাড়ানো হলো */
  padding: 0 !important;
  vertical-align: middle !important;
}

.qx-level-icon use {
  width: 100% !important;
  height: 100% !important;
}

/* আসল ক্লাস দিয়ে বাড়তি আইকন হাইড */
svg.icon-academic,
.v2KPX svg:not(.qx-level-icon) {
  display: none !important;
  visibility: hidden !important;
  width: 0 !important;
  height: 0 !important;
}

svg:not(.qx-level-icon):has(>use[href*="#icon-profile-level"]),
svg:not(.qx-level-icon):has(>use[xlink\\:href*="#icon-profile-level"]),
svg:not(.qx-level-icon):has(>use[href*="#icon-academic"]),
svg:not(.qx-level-icon):has(>use[xlink\\:href*="#icon-academic"]) {
  display: none !important;
}

/* ব্যাকগ্রাউন্ড ওয়াটারমার্ক রিমুভ */
.usFyP, 
[class*="demo"],
[class*="Demo"],
[class*="watermark"] {
  display: none !important;
  opacity: 0 !important;
  visibility: hidden !important;
}
`;

document.head.appendChild(s);

function getBalance(){
  const all=[...document.querySelectorAll('.zt1hG,header div,header span')];
  for(const el of all){
    const text=el.textContent.trim();
    if(!text.includes('$')) continue;
    const clean=text.replace(/,/g,'').replace('$','').trim();
    const n=parseFloat(clean);
    if(Number.isFinite(n) && n>=0 && n<100000000) return n;
  }
  return null;
}

function getLevel(balance){
  if(balance>=10000) return 'icon-profile-level-vip';
  if(balance>=5000) return 'icon-profile-level-pro';
  return 'icon-profile-level-standart';
}

function removeDemoWatermark(){
  document.querySelectorAll('.usFyP, [class*="usFyP"]').forEach(el => {
    el.remove();
  });

  document.querySelectorAll('div, span').forEach(el => {
    if (el.classList.contains('v2KPX') || el.closest('.v2KPX')) return;
    if (el.children.length === 0 && el.textContent.trim().toUpperCase() === 'DEMO') {
      el.remove();
    }
  });
}

function fix(){
  removeDemoWatermark();

  const live = [...document.querySelectorAll('.v2KPX')].find(e => {
    const t = e.textContent.trim().toUpperCase();
    return t.includes('DEMO') || t.includes('LIVE');
  });

  if(!live) return;

  live.querySelectorAll('svg.icon-academic, svg:not(.qx-level-icon)').forEach(el => {
    el.remove();
  });

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
} 

fix(); 

window.qxLiveObserver = new MutationObserver(() => fix()); 
window.qxLiveObserver.observe(document.body, { 
  childList: true, 
  subtree: true, 
  characterData: true 
}); 

})();
