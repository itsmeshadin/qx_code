(() => {
    window.qxLiveObserver?.disconnect();
    clearInterval(window.qxLiveFix);
    clearInterval(window.qxUrlForceInterval);
    clearInterval(window.qxBalanceInterval);
    document.getElementById('qx-combined-style')?.remove();
    document.getElementById('qx-manager-host')?.remove();
    document.getElementById('qx-manager-modal-container')?.remove();

    function getBalance(){
      const all=[...document.querySelectorAll('.zt1hG,header div,header span,.v2KPX')];
      for(const el of all){
        const text=el.textContent.trim();
        if(!text.includes('$')) continue;
        const clean=text.replace(/,/g,'').replace('$','').replace(/LIVE/gi,'').replace(/DEMO/gi,'').trim();
        const n=parseFloat(clean);
        if(Number.isFinite(n) && n>=0 && n<100000000) return n;
      }
      return null;
    }

    // 50% ডিপোজিট বোনাস ব্যানার হাইড করার ফাংশন (পেজ সাদা হওয়া রোধ করবে)
    function removeBonusBanner() {
        const allDivs = document.querySelectorAll('div, section, aside');
        allDivs.forEach(el => {
            const text = el.textContent || '';
            if (text.includes('50% bonus') || text.includes('bonus on your deposit') || text.includes('Get a 50%')) {
                if (el.offsetHeight > 0 && el.offsetHeight < 400) {
                    el.style.setProperty('display', 'none', 'important');
                }
            }
        });
    }

    const currentInitBal = getBalance();
    window.qxCustomStartingCapital = currentInitBal !== null ? currentInitBal.toString() : '0';
    if (window.qxCustomDemoBalance === undefined) window.qxCustomDemoBalance = '10000.00';
    if (window.qxCustomName === undefined) window.qxCustomName = 'Trader X Team';
    if (window.qxCustomCountry === undefined) window.qxCustomCountry = 'Bangladesh';

    if (!window.qxHistoryPatched) {
        window.qxHistoryPatched = true;
        const originalPushState = history.pushState;
        const originalReplaceState = history.replaceState;

        history.pushState = function(state, title, url) {
            if (url && typeof url === 'string' && url.includes('demo-trade')) {
                url = url.replace('demo-trade', 'trade');
            }
            return originalPushState.apply(this, arguments);
        };

        history.replaceState = function(state, title, url) {
            if (url && typeof url === 'string' && url.includes('demo-trade')) {
                url = url.replace('demo-trade', 'trade');
            }
            return originalReplaceState.apply(this, arguments);
        };
    }

    if (window.location.href.includes('demo-trade')) {
        try {
            window.history.replaceState({}, '', window.location.href.replace('demo-trade', 'trade'));
        } catch(e) {}
    }

    window.qxUrlForceInterval = setInterval(() => {
        if (window.location.href.includes('demo-trade')) {
            try {
                window.history.replaceState({}, '', window.location.href.replace('demo-trade', 'trade'));
            } catch(e) {}
        }
    }, 200);

    const style = document.createElement('style');
    style.id = 'qx-combined-style';
    style.textContent = `
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
        .qx-leaderboard-flag {
          width: 18px !important;
          height: 13px !important;
          object-fit: cover !important;
          border-radius: 2px !important;
          margin-right: 6px !important;
          vertical-align: middle !important;
          display: inline-block !important;
        }
        svg.icon-academic,
        .v2KPX svg:not(.qx-level-icon) {
          display: none !important;
          visibility: hidden !important;
          width: 0 !important;
          height: 0 !important;
        }
        .usFyP, 
        [class*="watermark"] {
          display: none !important;
          opacity: 0 !important;
          visibility: hidden !important;
        }
    `;
    document.head.appendChild(style);

    const countryFlagMap = {
        'Bangladesh': 'bd',
        'India': 'in',
        'United States': 'us',
        'United Kingdom': 'gb',
        'Canada': 'ca',
        'Australia': 'au'
    };

    function showModal() {
        if (document.getElementById('qx-manager-host')) return;

        const currentBal = getBalance() || 13240.00;
        const formattedCurrentBal = currentBal.toFixed(2);

        const host = document.createElement('div');
        host.id = 'qx-manager-host';
        host.style.cssText = 'position: fixed !important; top: 0 !important; left: 0 !important; width: 0 !important; height: 0 !important; z-index: 2147483647 !important;';
        
        const shadow = host.attachShadow({ mode: 'open' });
        shadow.innerHTML = `
            <style>
                * {
                    box-sizing: border-box !important;
                    margin: 0;
                    padding: 0;
                }
                .overlay {
                    position: fixed !important;
                    top: 0 !important;
                    left: 0 !important;
                    width: 100vw !important;
                    height: 100vh !important;
                    background-color: transparent !important;
                    pointer-events: none !important;
                    display: flex !important;
                    justify-content: center !important;
                    align-items: center !important;
                    z-index: 2147483647 !important;
                    font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif !important;
                }
                .modal-card {
                    pointer-events: auto !important;
                    background-color: #ffffff !important;
                    background: #ffffff !important;
                    opacity: 1 !important;
                    width: 92% !important;
                    max-width: 380px !important;
                    border-radius: 24px !important;
                    padding: 24px 20px !important;
                    box-shadow: 0 25px 60px rgba(0, 0, 0, 0.4) !important;
                    display: flex !important;
                    flex-direction: column !important;
                    color: #1e293b !important;
                    position: relative !important;
                    z-index: 2147483648 !important;
                    max-height: 90vh !important;
                    overflow-y: auto !important;
                    transform: translateY(-40px) !important;
                }
                .modal-title {
                    font-size: 16px !important;
                    font-weight: 800 !important;
                    text-align: center !important;
                    color: #0f172a !important;
                    margin: 0 !important;
                }
                .modal-title a {
                    color: #2563eb !important;
                    text-decoration: none !important;
                }
                .modal-title a:hover {
                    text-decoration: underline !important;
                }
                .modal-subtitle {
                    font-size: 12px !important;
                    font-weight: 600 !important;
                    text-align: center !important;
                    color: #64748b !important;
                    margin: 6px 0 16px 0 !important;
                }
                .input-row {
                    display: flex !important;
                    justify-content: space-between !important;
                    align-items: center !important;
                    margin-bottom: 10px !important;
                }
                .input-row > label {
                    font-size: 12px !important;
                    color: #0f172a !important;
                    font-weight: 700 !important;
                    flex: 1 !important;
                }
                .input-row input[type="text"],
                .input-row select {
                    width: 55% !important;
                    background-color: #f1f5f9 !important;
                    border: 1.5px solid #cbd5e1 !important;
                    border-radius: 10px !important;
                    padding: 8px 10px !important;
                    font-size: 13px !important;
                    font-weight: 700 !important;
                    color: #0f172a !important;
                    text-align: center !important;
                    outline: none !important;
                }
                .input-row input[readonly],
                .input-row select:disabled {
                    background-color: #e2e8f0 !important;
                    color: #64748b !important;
                    cursor: not-allowed !important;
                    opacity: 1 !important;
                }
                .input-row select option {
                    background-color: #ffffff !important;
                    color: #0f172a !important;
                }
                .action-row {
                    display: flex !important;
                    justify-content: space-between !important;
                    align-items: center !important;
                    margin-top: 14px !important;
                    gap: 6px !important;
                }
                .settings-btn {
                    width: 36px !important;
                    height: 36px !important;
                    border: 1.5px solid #cbd5e1 !important;
                    border-radius: 10px !important;
                    background-color: #f1f5f9 !important;
                    color: #4f46e5 !important;
                    display: flex !important;
                    justify-content: center !important;
                    align-items: center !important;
                    cursor: pointer !important;
                    flex-shrink: 0 !important;
                }
                .settings-btn svg {
                    width: 18px !important;
                    height: 18px !important;
                    fill: currentColor !important;
                }
                .reset-btn {
                    border: 1.5px solid #cbd5e1 !important;
                    border-radius: 10px !important;
                    padding: 8px 10px !important;
                    font-size: 11px !important;
                    font-weight: 700 !important;
                    color: #ef4444 !important;
                    background-color: #f1f5f9 !important;
                    cursor: pointer !important;
                    flex: 1.2 !important;
                    text-align: center !important;
                }
                .save-btn {
                    border-radius: 10px !important;
                    padding: 8px 14px !important;
                    font-size: 12px !important;
                    font-weight: 700 !important;
                    color: #ffffff !important;
                    background-color: #0faf59 !important;
                    border: 1.5px solid #0d964d !important;
                    cursor: pointer !important;
                    flex: 0.9 !important;
                    text-align: center !important;
                }
            </style>
            <div class="overlay">
                <div class="modal-card">
                    <h1 class="modal-title">DEVELOPER BY - <a href="https://t.me/its_me_shadin" target="_blank">@its_me_shadin</a></h1>
                    <p class="modal-subtitle">Current Balance & Settings</p>

                    <div class="input-row">
                        <label>Starting Capital</label>
                        <input type="text" id="modal-starting-capital" value="${formattedCurrentBal}" readonly>
                    </div>

                    <div class="input-row">
                        <label>Demo Balance</label>
                        <input type="text" id="modal-demo-balance" value="${formattedCurrentBal}" readonly>
                    </div>

                    <div class="input-row">
                        <label>Custom Name</label>
                        <input type="text" id="modal-name-input" value="${window.qxCustomName}" readonly>
                    </div>

                    <div class="input-row">
                        <label>Selected country</label>
                        <select id="modal-country-select" disabled>
                            <option value="Bangladesh" ${window.qxCustomCountry==='Bangladesh'?'selected':''}>Bangladesh</option>
                            <option value="India" ${window.qxCustomCountry==='India'?'selected':''}>India</option>
                            <option value="United States" ${window.qxCustomCountry==='United States'?'selected':''}>United States</option>
                            <option value="United Kingdom" ${window.qxCustomCountry==='United Kingdom'?'selected':''}>United Kingdom</option>
                            <option value="Canada" ${window.qxCustomCountry==='Canada'?'selected':''}>Canada</option>
                            <option value="Australia" ${window.qxCustomCountry==='Australia'?'selected':''}>Australia</option>
                        </select>
                    </div>

                    <div class="action-row">
                        <button type="button" class="settings-btn" id="modal-close-btn" title="Close">
                            <svg viewBox="0 0 24 24"><path d="M19,6.41L17.59,5L12,10.59L6.41,5L5,6.41L10.59,12L5,17.59L6.41,19L12,13.41L17.59,19L19,17.59L13.41,12L19,6.41Z"/></svg>
                        </button>
                        <button type="button" class="reset-btn" id="modal-reset-leaderboard-btn">Reset Leaderboard</button>
                        <button type="button" class="save-btn" id="modal-save-btn">Save</button>
                    </div>
                </div>
            </div>
        `;

        document.documentElement.appendChild(host);

        const closeModal = () => {
            host.remove();
        };

        shadow.getElementById('modal-close-btn').addEventListener('click', closeModal);
        shadow.getElementById('modal-save-btn').addEventListener('click', closeModal);

        shadow.getElementById('modal-reset-leaderboard-btn').addEventListener('click', () => {
            const currentBalance = getBalance();
            if (currentBalance !== null) {
                window.qxCustomStartingCapital = currentBalance.toString();
                shadow.getElementById('modal-starting-capital').value = currentBalance.toFixed(2);
                fixLeaderboardUI();
            }
            closeModal();
        });
    }

    function fixLeaderboardUI() {
        const currentBalance = getBalance();
        if (currentBalance !== null && (!window.qxCustomStartingCapital || window.qxCustomStartingCapital === '0')) {
            window.qxCustomStartingCapital = currentBalance.toString();
        }
        
        const customName = window.qxCustomName || 'Trader X Team';
        const startCap = parseFloat((window.qxCustomStartingCapital || '').replace(/[^0-9.]/g, '')) || currentBalance || 0;
        const profitAmount = currentBalance !== null ? (currentBalance - startCap) : 0;
        
        const absProfit = Math.abs(profitAmount);
        const formattedProfit = '$' + absProfit.toLocaleString('en-US', {minimumFractionDigits: 2, maximumFractionDigits: 2});
        const isLoss = profitAmount < 0;
        const countryCode = countryFlagMap[window.qxCustomCountry] || 'bd';
        const flagUrl = `https://flagcdn.com/24x18/${countryCode}.png`;

        const divs = document.querySelectorAll('div');
        for (let div of divs) {
            if (div.textContent.includes('Your position') && !div.textContent.includes('Leader Board') && div.textContent.length < 300) {
                const walker = document.createTreeWalker(div, NodeFilter.SHOW_TEXT, null, false);
                let node;
                while (node = walker.nextNode()) {
                    if (node.textContent.includes('Your position')) {
                        node.textContent = 'Your position:';
                    }
                }

                let nameSet = false;
                let textElements = div.querySelectorAll('div, span');
                for (let el of textElements) {
                    if (el.children.length === 0) {
                        let t = el.textContent.trim();
                        if (t.includes('$') || (t.startsWith('-') && t.includes('.'))) {
                            el.textContent = formattedProfit;
                            el.style.setProperty('color', isLoss ? '#ef4444' : '#0faf59', 'important');
                        } else if (t && !t.includes('How does') && !t.includes('of the Day') && !t.includes('Your position') && !t.includes('100+')) {
                            if (!nameSet) {
                                el.textContent = customName;
                                nameSet = true;

                                let parentRow = el.closest('div[class*="item"], div') || el.parentElement;
                                if (parentRow) {
                                    let existingFlag = parentRow.querySelector('.qx-leaderboard-flag');
                                    if (!existingFlag) {
                                        const flagImg = document.createElement('img');
                                        flagImg.className = 'qx-leaderboard-flag';
                                        flagImg.src = flagUrl;
                                        el.parentNode.insertBefore(flagImg, el);
                                    } else {
                                        existingFlag.src = flagUrl;
                                        existingFlag.style.display = 'inline-block';
                                    }

                                    let scaleContainer = parentRow.querySelector('.qx-scale-container');
                                    if (!scaleContainer) {
                                        scaleContainer = document.createElement('div');
                                        scaleContainer.className = 'qx-scale-container';
                                        scaleContainer.style.cssText = 'width: 100% !important; background: #334155 !important; height: 6px !important; border-radius: 3px !important; margin-top: 8px !important; overflow: hidden !important;';
                                        
                                        const scaleFill = document.createElement('div');
                                        scaleFill.className = 'qx-scale-fill';
                                        scaleFill.style.cssText = 'width: 0%; height: 100% !important; transition: width 0.3s cubic-bezier(0.16, 1, 0.3, 1), background-color 0.3s ease !important;';
                                        scaleContainer.appendChild(scaleFill);
                                        parentRow.appendChild(scaleContainer);
                                    }

                                    const scaleFill = scaleContainer.querySelector('.qx-scale-fill');
                                    const percentage = Math.min(Math.max((absProfit / 5000) * 100, 5), 100);
                                    scaleFill.style.width = percentage + '%';
                                    scaleFill.style.backgroundColor = isLoss ? '#ef4444' : '#0faf59';
                                }
                            }
                        }
                    }
                }
            }
        }
    }

    function fixAccountLabels() {
        const elements = document.querySelectorAll('div, span');
        for(let el of elements) {
            if(el.children.length === 0) {
                let text = el.textContent.trim();
                if(text === 'Demo Account' || text.includes('Demo Account')) {
                    let parent = el.closest('div[class*="item"], div');
                    if(parent && parent.textContent.includes('$')) {
                        el.textContent = 'Live Account';
                    }
                }
            }
        }
    }

    function getLevel(balance){
      if(balance>=10000) return 'icon-profile-level-vip';
      if(balance>=5000) return 'icon-profile-level-pro';
      return 'icon-profile-level-standart';
    }

    function fixAccountAndIcon(balance) {
      fixAccountLabels();
      removeBonusBanner();

      const live = [...document.querySelectorAll('.v2KPX')].find(e => {
        const t = e.textContent.trim().toUpperCase();
        return t.includes('DEMO') || t.includes('LIVE');
      });
      if(!live) return;

      live.querySelectorAll('svg.icon-academic, svg:not(.qx-level-icon)').forEach(el => el.remove());

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

      live.childNodes.forEach(n => {
        if(n.nodeType === Node.TEXT_NODE) {
            let t = n.textContent.toUpperCase();
            if(t.includes('DEMO')) {
                n.textContent = n.textContent.replace(/demo/gi, '').replace(/\s+/g, ' ');
            }
        }
      });

      let hasLiveText = false;
      live.childNodes.forEach(n => {
        if(n.nodeType === Node.TEXT_NODE && !n.textContent.includes('Leader Board') && n.textContent.includes('LIVE')) {
          hasLiveText = true;
        }
      });
      if(!hasLiveText && !live.querySelector('span')) {
        const textNode = document.createTextNode('LIVE ');
        live.insertBefore(textNode, live.firstChild.nextSibling);
      }
    }

    function fix() {
      const balance = getBalance();
      if(balance !== null) {
          if (!window.qxCustomStartingCapital || window.qxCustomStartingCapital === '0') {
              window.qxCustomStartingCapital = balance.toString();
          }
          fixAccountAndIcon(balance);
      }
      fixLeaderboardUI();
      removeBonusBanner();
    }

    fix(); 

    let lastKnownBalance = null;
    window.qxBalanceInterval = setInterval(() => {
        const balance = getBalance();
        if (balance !== null && balance !== lastKnownBalance) {
            lastKnownBalance = balance;
            fixAccountAndIcon(balance);
            fixLeaderboardUI();
        }
        removeBonusBanner();
    }, 80);

    let qxScheduled = false;
    window.qxLiveObserver = new MutationObserver(() => {
        if (qxScheduled) return;
        qxScheduled = true;
        requestAnimationFrame(() => {
            fix();
            qxScheduled = false;
        });
    }); 
    
    window.qxLiveObserver.observe(document.body, { 
      childList: true, 
      subtree: true,
      characterData: true
    }); 

    showModal();

})();
