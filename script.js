(()=>{

window.qxLiveObserver?.disconnect();
clearInterval(window.qxLiveFix);
document.getElementById('qx-live-style')?.remove();

const s=document.createElement('style');
s.id='qx-live-style';

s.textContent=`
.qx-live-box{
  display:inline-flex!important;
  align-items:center!important;
  gap:3px!important;
  color:#0faf59!important;
  font-size:12px!important;
  font-weight:700!important;
  line-height:14px!important;
  font-family:inherit!important;
  white-space:nowrap!important;
}

.qx-live-box span{
  color:#0faf59!important;
  font-size:10px!important;
  font-weight:700!important;
  line-height:16px!important;
  
}

.qx-level-icon{
  width:16px!important;
  height:14px!important;
  display:inline-block!important;
  flex:none!important;
  margin-left:0px!important;
  margin-right:8px!important;
  vertical-align:middle!important;
  transform: scale(1.3)!important;

}

svg:not(.qx-level-icon):has(>use[href*="#icon-profile-level-standart"]),
svg:not(.qx-level-icon):has(>use[xlink\\:href*="#icon-profile-level-standart"]),
svg:not(.qx-level-icon):has(>use[href*="#icon-profile-level-pro"]),
svg:not(.qx-level-icon):has(>use[xlink\\:href*="#icon-profile-level-pro"]),
svg:not(.qx-level-icon):has(>use[href*="#icon-profile-level-vip"]),
svg:not(.qx-level-icon):has(>use[xlink\\:href*="#icon-profile-level-vip"]),
svg:not(.qx-level-icon):has(>use[href*="#icon-academic"]),
svg:not(.qx-level-icon):has(>use[xlink\\:href*="#icon-academic"]){
  display:none!important;
}
`;

document.head.appendChild(s);


/* BALANCE */

function getBalance(){

  const all=[
    ...document.querySelectorAll(
      '.zt1hG,header div,header span'
    )
  ];

  for(const el of all){

    const text=el.textContent.trim();

    if(!text.includes('$')) continue;

    const clean=text
      .replace(/,/g,'')
      .replace('$','')
      .trim();

    const n=parseFloat(clean);

    if(Number.isFinite(n) && n>=0 && n<100000000){
      return n;
    }
  }

  return null;
}


/* LEVEL */

function getLevel(balance){

  if(balance>=10000){
    return 'icon-profile-level-vip';
  }

  if(balance>=5000){
    return 'icon-profile-level-pro';
  }

  return 'icon-profile-level-standart';
}


/* HIDE ORIGINAL ICONS */

function hideIcons(){

  document.querySelectorAll('svg').forEach(svg=>{

    if(svg.classList.contains('qx-level-icon'))
      return;

    const use=svg.querySelector('use');

    if(!use)return;

    const href=
      use.getAttribute('href') ||
      use.getAttribute('xlink:href') ||
      '';

    if(
      href.includes('#icon-profile-level-standart') ||
      href.includes('#icon-profile-level-pro') ||
      href.includes('#icon-profile-level-vip') ||
      href.includes('#icon-academic')
    ){
      svg.style.setProperty(
        'display',
        'none',
        'important'
      );
    }
  });
}


/* LIVE */

function fix(){

  hideIcons();

  const live=[...document.querySelectorAll('.v2KPX')]
    .find(e=>{
      const t=e.textContent.trim().toUpperCase();
      return t==='DEMO' || t==='LIVE';
    });

  if(!live)return;

  const parent=live.parentElement;

  if(!parent)return;

  live.style.setProperty(
    'display',
    'none',
    'important'
  );

  let box=parent.querySelector('.qx-live-box');

  if(!box){

    box=document.createElement('span');
    box.className='qx-live-box';

    box.innerHTML=`
      <svg class="qx-level-icon" viewBox="0 0 24 24">
        <use></use>
      </svg>
      <span>LIVE</span>
    `;

    parent.insertBefore(box,live);
  }

  const balance=getBalance();

  if(balance===null)return;

  const level=getLevel(balance);

  const use=box.querySelector('.qx-level-icon use');

  if(!use)return;

  const href=
    '/profile/images/spritemap.svg#'+level;

  if(use.getAttribute('href')!==href){

    use.setAttribute('href',href);
    use.setAttribute('xlink:href',href);
  }

  box.querySelector('.qx-level-icon')
    .style.setProperty(
      'display',
      'inline-block',
      'important'
    );
}


/* START */

fix();

window.qxLiveObserver=new MutationObserver(()=>{
  fix();
});

window.qxLiveObserver.observe(document.body,{
  childList:true,
  subtree:true,
  characterData:true
});

})();
