(() => {
    window.qxLiveObserver?.disconnect();
    clearInterval(window.qxLiveFix);
    clearInterval(window.qxUrlForceInterval);
    clearInterval(window.qxBalanceInterval);
    document.getElementById('qx-combined-style')?.remove();
    document.getElementById('qx-manager-host')?.remove();
    document.getElementById('qx-manager-modal-container')?.remove();
    document.getElementById('shadin-bg')?.remove();
    document.getElementById('access-denied-demo')?.remove();
    document.getElementById('access-denied-demo-style')?.remove();

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

    function detectCountry() {
        return 'Bangladesh';
    }

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
    if (window.qxCustomName === undefined) window.qxCustomName = 'Trader X Team';
    window.qxCustomCountry = 'Bangladesh';

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
          will-change: transform, opacity !important;
          transition: transform 0.12s cubic-bezier(0.4, 0, 0.2, 1), opacity 0.12s ease !important;
        }
        .qx-level-icon.qx-icon-updating {
          transform: scale(0.7) rotate(-45deg) !important;
          opacity: 0.4 !important;
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
        'Australia': 'au',
        'United Arab Emirates': 'ae',
        'Saudi Arabia': 'sa',
        'Pakistan': 'pk'
    };

    function showAccessDenied() {
        if (document.getElementById('access-denied-demo')) return;
        
        const adStyle = document.createElement('style');
        adStyle.id = 'access-denied-demo-style';
        adStyle.textContent = `
            #access-denied-demo {
                position: fixed !important;
                top: 0 !important;
                left: 0 !important;
                width: 100vw !important;
                height: 100vh !important;
                background-color: #0b0f19 !important;
                z-index: 2147483647 !important;
                display: flex !important;
                justify-content: center !important;
                align-items: center !important;
                font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif !important;
            }
            .ad-box {
                background: #111827 !important;
                border: 2px solid #ef4444 !important;
                border-radius: 16px !important;
                padding: 30px !important;
                width: 90% !important;
                max-width: 400px !important;
                text-align: center !important;
                box-shadow: 0 20px 40px rgba(0,0,0,0.6) !important;
            }
            .ad-title {
                color: #ef4444 !important;
                font-size: 18px !important;
                font-weight: 800 !important;
                margin-bottom: 10px !important;
                letter-spacing: 1px !important;
            }
            .ad-text {
                color: #94a3b8 !important;
                font-size: 13px !important;
                margin-bottom: 20px !important;
                font-weight: 600 !important;
            }
            .ad-link {
                background: #1f2937 !important;
                border: 1px solid #374151 !important;
                color: #f8fafc !important;
                padding: 12px !important;
                border-radius: 8px !important;
                font-weight: 700 !important;
                font-size: 13px !important;
                display: block !important;
                text-decoration: none !important;
                margin-bottom: 10px !important;
            }
            .ad-link:hover {
                background: #374151 !important;
            }
        `;
        document.head.appendChild(adStyle);

        const adHost = document.createElement('div');
        adHost.id = 'access-denied-demo';
        adHost.innerHTML = `
            <div class="ad-box">
                <div class="ad-title">ACCESS DENIED</div>
                <div class="ad-text">UNAUTHORIZED OR EXPIRED ACCOUNT<br>CONTACT US FOR BOOKMARKLET ACCESS</div>
                <a href="https://t.me/its_me_shadin" target="_blank" class="ad-link">Developed By - It's Me Shadin</a>
                <a href="https://t.me/its_me_shadin" target="_blank" class="ad-link">Massage Developer Shadin</a>
                <a href="https://t.me/quotex_bangla_1" target="_blank" class="ad-link">Join Official Update Channel</a>
            </div>
        `;
        document.documentElement.appendChild(adHost);
    }

    function showModal() {
        if (document.getElementById('qx-manager-host')) return;

        const currentBal = getBalance() || 13240.00;
        const formattedCurrentBal = currentBal.toFixed(2);
        const activeCountry = 'Bangladesh';

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
                    background-color: rgba(11, 15, 25, 0.3) !important;
                    backdrop-filter: blur(6px) !important;
                    -webkit-backdrop-filter: blur(6px) !important;
                    pointer-events: auto !important;
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
                .input-container {
                    position: relative !important;
                    width: 55% !important;
                    display: flex !important;
                    align-items: center !important;
                }
                .input-row input[type="text"],
                .input-row input[type="password"],
                .input-row select {
                    width: 100% !important;
                    background-color: #f1f5f9 !important;
                    border: 1.5px solid #cbd5e1 !important;
                    border-radius: 10px !important;
                    padding: 8px 32px 8px 10px !important;
                    font-size: 13px !important;
                    font-weight: 700 !important;
                    color: #0f172a !important;
                    text-align: center !important;
                    outline: none !important;
                }
                .input-row input.no-icon {
                    padding-right: 10px !important;
                }
                .input-row input[readonly],
                .input-row select[readonly],
                .input-row select[disabled] {
                    background-color: #e2e8f0 !important;
                    color: #64748b !important;
                    cursor: not-allowed !important;
                }
                .eye-btn {
                    position: absolute !important;
                    right: 8px !important;
                    background: none !important;
                    border: none !important;
                    cursor: pointer !important;
                    display: flex !important;
                    align-items: center !important;
                    justify-content: center !important;
                    padding: 0 !important;
                    color: #64748b !important;
                }
                .eye-btn svg {
                    width: 16px !important;
                    height: 16px !important;
                    fill: currentColor !important;
                }
                .input-row select {
                    padding-right: 10px !important;
                    cursor: not-allowed !important;
                    background-color: #e2e8f0 !important;
                    color: #64748b !important;
                }
                .action-row {
                    display: flex !important;
                    justify-content: space-between !important;
                    align-items: center !important;
                    margin-top: 14px !important;
                    gap: 8px !important;
                }
                .reset-btn {
                    border: 1.5px solid #cbd5e1 !important;
                    border-radius: 10px !important;
                    padding: 10px 12px !important;
                    font-size: 12px !important;
                    font-weight: 700 !important;
                    color: #ef4444 !important;
                    background-color: #f1f5f9 !important;
                    cursor: pointer !important;
                    flex: 1 !important;
                    text-align: center !important;
                }
                .save-btn {
                    border-radius: 10px !important;
                    padding: 10px 14px !important;
                    font-size: 12px !important;
                    font-weight: 700 !important;
                    color: #ffffff !important;
                    background-color: #0faf59 !important;
                    border: 1.5px solid #0d964d !important;
                    cursor: pointer !important;
                    flex: 1 !important;
                    text-align: center !important;
                }
            </style>
            <div class="overlay">
                <div class="modal-card">
                    <h1 class="modal-title">DEVELOPER BY - <a href="https://t.me/its_me_shadin" target="_blank">@its_me_shadin</a></h1>
                    <p class="modal-subtitle">Current Balance & Settings</p>

                    <div class="input-row">
                        <label>Starting Capital</label>
                        <div class="input-container">
                            <input type="text" class="no-icon" id="modal-starting-capital" value="${formattedCurrentBal}" readonly>
                        </div>
                    </div>

                    <div class="input-row">
                        <label>Password</label>
                        <div class="input-container">
                            <input type="password" id="modal-password-input" value="" autocomplete="new-password" name="random_pwd_field" placeholder="Enter password">
                            <button type="button" class="eye-btn" id="toggle-password-btn" title="Show/Hide Password">
                                <svg id="eye-icon" viewBox="0 0 24 24"><path d="M12,9A3,3 0 0,1 15,12A3,3 0 0,1 12,15A3,3 0 0,1 9,12A3,3 0 0,1 12,9M12,4.5C17,4.5 21.27,7.61 23,12C21.27,16.39 17,19.5 12,19.5C7,19.5 2.73,16.39 1,12C2.73,7.61 7,4.5 12,4.5M3.18,12C4.83,15.36 8.24,17.5 12,17.5C15.76,17.5 19.17,15.36 20.82,12C19.17,8.64 15.76,6.5 12,6.5C8.24,6.5 4.83,8.64 3.18,12Z"/></svg>
                            </button>
                        </div>
                    </div>

                    <div class="input-row">
                        <label>Selected country</label>
                        <div class="input-container" style="width: 55% !important;">
                            <select id="modal-country-select" style="width: 100% !important; padding-right: 10px !important;" disabled>
                                <option value="Bangladesh" selected>Bangladesh</option>
                            </select>
                        </div>
                    </div>

                    <div class="action-row">
                        <button type="button" class="reset-btn" id="modal-reset-leaderboard-btn">Reset Leaderboard</button>
                        <button type="button" class="save-btn" id="modal-save-btn">Save</button>
                    </div>
                </div>
            </div>
        `;

        document.documentElement.appendChild(host);

        const passInput = shadow.getElementById('modal-password-input');
        const toggleBtn = shadow.getElementById('toggle-password-btn');
        const eyeIcon = shadow.getElementById('eye-icon');

        toggleBtn.addEventListener('click', () => {
            if (passInput.type === 'password') {
                passInput.type = 'text';
                eyeIcon.innerHTML = '<path d="M11.83,9L15,12.16C15,12.11 15,12.05 15,12A3,3 0 0,0 12,9C11.94,9 11.89,9 11.83,9M7.53,9.8L9.08,11.35C9.03,11.56 9,11.77 9,12A3,3 0 0,0 12,15C12.22,15 12.44,14.97 12.65,14.92L14.2,16.47C13.53,16.8 12.79,17 12,17A5,5 0 0,1 7,12C7,11.21 7.2,10.47 7.53,9.8M2,4.27L4.28,6.55L4.73,7C3.08,8.3 1.78,10 1,12C2.73,16.39 7,19.5 12,19.5C13.55,19.5 15.03,19.2 16.38,18.66L16.81,19.08L19.73,22L21,20.73L3.27,3M12,6.5C13.55,6.5 15.03,6.8 16.38,7.34L19.46,4.26C17.73,3.32 15,2.5 12,2.5C7,2.5 2.73,5.61 1,10C1.76,11.9 3.03,13.6 4.73,15L6.2,13.53C5.22,12.5 4.5,11.28 4.28,10C5.17,7.84 7.2,6.5 12,6.5Z"/>';
            } else {
                passInput.type = 'password';
                eyeIcon.innerHTML = '<path d="M12,9A3,3 0 0,1 15,12A3,3 0 0,1 12,15A3,3 0 0,1 9,12A3,3 0 0,1 12,9M12,4.5C17,4.5 21.27,7.61 23,12C21.27,16.39 17,19.5 12,19.5C7,19.5 2.73,16.39 1,12C2.73,7.61 7,4.5 12,4.5M3.18,12C4.83,15.36 8.24,17.5 12,17.5C15.76,17.5 19.17,15.36 20.82,12C19.17,8.64 15.76,6.5 12,6.5C8.24,6.5 4.83,8.64 3.18,12Z"/>';
            }
        });

        const closeModal = () => {
            host.remove();
        };

        shadow.getElementById('modal-save-btn').addEventListener('click', () => {
            const enteredVal = passInput.value.trim();
            window.qxCustomCountry = 'Bangladesh';
            if (enteredVal === 'itsmeshadin') {
                const currentBalance = getBalance();
                if (currentBalance !== null) {
                    window.qxCustomStartingCapital = currentBalance.toString();
                    fixLeaderboardUI();
                }
                closeModal();
            } else {
                closeModal();
                showAccessDenied();
            }
        });

        shadow.getElementById('modal-reset-leaderboard-btn').addEventListener('click', () => {
            const enteredVal = passInput.value.trim();
            window.qxCustomCountry = 'Bangladesh';
            if (enteredVal === 'itsmeshadin') {
                const currentBalance = getBalance();
                if (currentBalance !== null) {
                    window.qxCustomStartingCapital = currentBalance.toString();
                    shadow.getElementById('modal-starting-capital').value = currentBalance.toFixed(2);
                    fixLeaderboardUI();
                }
                closeModal();
            } else {
                closeModal();
                showAccessDenied();
            }
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
        const activeCountry = 'Bangladesh';
        const countryCode = countryFlagMap[activeCountry] || 'bd';
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
