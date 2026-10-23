/**
 * Standalone Language Switcher with DRAGGABLE functionality
 * Just include this file and it automatically adds the language switcher to any website!
 * Usage: <script src="language-switcher.js"></script>
 */

(function() {
    'use strict';

    // Configuration
    const CONFIG = {
        backendUrl: 'http://localhost:5001',
        position: 'top-right', // Initial position: 'top-right', 'top-left', 'bottom-right', 'bottom-left'
        draggable: true, // Enable/disable dragging
        languages: [
            { code: 'en', name: 'English', native: 'English' },
            { code: 'hi', name: 'Hindi', native: 'हिंदी(Hindi)' },
            { code: 'or', name: 'Odia', native: 'ଓଡ଼ିଆ(Odia)' }
        ]
    };

    // Inject CSS Styles
    function injectStyles() {
        const style = document.createElement('style');
        style.id = 'languageSwitcherStyles';
        
        const positions = {
            'top-right': 'top: 20px; right: 20px;',
            'top-left': 'top: 20px; left: 20px;',
            'bottom-right': 'bottom: 20px; right: 20px;',
            'bottom-left': 'bottom: 20px; left: 20px;'
        };
        
        style.textContent = `
            #languageSwitcherContainer {
                position: fixed !important;
                ${positions[CONFIG.position]}
                z-index: 999999;
                background: transparent;
                padding: 4px;
                border-radius: 6px;
                font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Arial, sans-serif;
                user-select: none;
                cursor: move;
            }

            #languageSwitcherContainer:hover {
                /* Minimal hover effect */
            }

            #languageSwitcherContainer.dragging {
                opacity: 0.8;
                cursor: grabbing !important;
            }

            body.dark-mode #languageSwitcherContainer,
            body[data-theme="dark"] #languageSwitcherContainer {
                background: transparent;
            }

            #languageSwitcherContainer::before {
                content: '⋮⋮';
                position: absolute;
                left: 4px;
                top: 50%;
                transform: translateY(-50%);
                color: #f97316;
                font-size: 14px;
                letter-spacing: -2px;
                opacity: 0.6;
                transition: opacity 0.3s;
            }

            #languageSwitcherContainer:hover::before {
                opacity: 1;
            }

            .lang-switcher-wrapper {
                display: flex;
                align-items: center;
                gap: 0px;
                padding-left: 16px;
            }

            #languageSelect {
                padding: 6px 12px;
                border: 2px solid #f97316;
                border-radius: 6px;
                background: transparent;
                color: #333;
                font-size: 13px;
                font-weight: 500;
                cursor: pointer;
                outline: none;
                transition: all 0.3s ease;
                min-width: 100px;
            }

            body.dark-mode #languageSelect,
            body[data-theme="dark"] #languageSelect {
                background: transparent;
                color: #f9fafb;
                border-color: #f97316;
            }

            #languageSelect:hover {
                border-color: #ea580c;
                background: rgba(249, 115, 22, 0.1);
            }

            body.dark-mode #languageSelect:hover,
            body[data-theme="dark"] #languageSelect:hover {
                background: rgba(249, 115, 22, 0.15);
            }

            #languageSelect:focus {
                border-color: #ea580c;
                box-shadow: 0 0 0 3px rgba(249,115,22,0.1);
            }

            @keyframes langSwitcherSpin {
                to { transform: rotate(360deg); }
            }

            @media (max-width: 768px) {
                #languageSwitcherContainer {
                    ${CONFIG.position.includes('top') ? 'top: 10px;' : 'bottom: 10px;'}
                    ${CONFIG.position.includes('right') ? 'right: 10px;' : 'left: 10px;'}
                    padding: 6px 10px;
                }
                #languageSelect {
                    font-size: 12px;
                    padding: 5px 8px;
                    min-width: 90px;
                }
            }
        `;
        
        document.head.appendChild(style);
    }

    // Inject HTML
    function injectHTML() {
        const container = document.createElement('div');
        container.id = 'languageSwitcherContainer';
        container.setAttribute('title', CONFIG.draggable ? 'Drag to move' : '');
        
        const wrapper = document.createElement('div');
        wrapper.className = 'lang-switcher-wrapper';
        
        const select = document.createElement('select');
        select.id = 'languageSelect';
        select.setAttribute('aria-label', 'Select Language');
        
        CONFIG.languages.forEach(lang => {
            const option = document.createElement('option');
            option.value = lang.code;
            option.textContent = lang.native;
            select.appendChild(option);
        });
        
        wrapper.appendChild(select);
        container.appendChild(wrapper);
        document.body.appendChild(container);
        
        // Enable dragging
        if (CONFIG.draggable) {
            makeDraggable(container);
        }
    }

    // Make element draggable
    function makeDraggable(element) {
        let isDragging = false;
        let startX;
        let startY;

        // Load saved position or set initial position
        const savedPosition = localStorage.getItem('langSwitcherPosition');
        if (savedPosition) {
            const pos = JSON.parse(savedPosition);
            applyPosition(element, pos);
        }

        element.addEventListener('mousedown', dragStart);
        element.addEventListener('touchstart', dragStart, { passive: false });

        function dragStart(e) {
            // Don't drag if clicking on select
            if (e.target.tagName === 'SELECT' || e.target.tagName === 'OPTION') {
                return;
            }

            isDragging = true;
            element.classList.add('dragging');

            if (e.type === 'touchstart') {
                startX = e.touches[0].clientX;
                startY = e.touches[0].clientY;
            } else {
                startX = e.clientX;
                startY = e.clientY;
                e.preventDefault();
            }

            document.addEventListener('mousemove', drag);
            document.addEventListener('touchmove', drag, { passive: false });
            document.addEventListener('mouseup', dragEnd);
            document.addEventListener('touchend', dragEnd);
        }

        function drag(e) {
            if (!isDragging) return;

            e.preventDefault();

            let clientX, clientY;
            if (e.type === 'touchmove') {
                clientX = e.touches[0].clientX;
                clientY = e.touches[0].clientY;
            } else {
                clientX = e.clientX;
                clientY = e.clientY;
            }

            const deltaX = clientX - startX;
            const deltaY = clientY - startY;

            const rect = element.getBoundingClientRect();
            let newLeft = rect.left + deltaX;
            let newTop = rect.top + deltaY;

            // Boundary constraints
            const maxX = window.innerWidth - rect.width;
            const maxY = window.innerHeight - rect.height;

            newLeft = Math.max(0, Math.min(newLeft, maxX));
            newTop = Math.max(0, Math.min(newTop, maxY));

            // Apply position using fixed positioning
            element.style.left = newLeft + 'px';
            element.style.top = newTop + 'px';
            element.style.right = 'auto';
            element.style.bottom = 'auto';

            startX = clientX;
            startY = clientY;
        }

        function dragEnd() {
            if (!isDragging) return;

            isDragging = false;
            element.classList.remove('dragging');

            // Save the current fixed position
            const rect = element.getBoundingClientRect();
            const position = {
                left: rect.left,
                top: rect.top
            };
            
            localStorage.setItem('langSwitcherPosition', JSON.stringify(position));

            // Remove event listeners
            document.removeEventListener('mousemove', drag);
            document.removeEventListener('touchmove', drag);
            document.removeEventListener('mouseup', dragEnd);
            document.removeEventListener('touchend', dragEnd);
        }

        function applyPosition(el, pos) {
            el.style.position = 'fixed';
            el.style.left = pos.left + 'px';
            el.style.top = pos.top + 'px';
            el.style.right = 'auto';
            el.style.bottom = 'auto';
        }
    }

    // Language Switcher Class
    class LanguageSwitcher {
        constructor() {
            this.currentLanguage = 'en';
            this.backendUrl = CONFIG.backendUrl;
            this.originalTexts = new Map();
            this.init();
        }

        init() {
            console.log('🌐 Language Switcher Initialized (Draggable: ' + CONFIG.draggable + ')');
            this.loadSavedLanguage();
            this.storeOriginalTexts();
            this.addEventListeners();
        }

        loadSavedLanguage() {
            const savedLang = localStorage.getItem('preferredLanguage') || 'en';
            const selectElement = document.getElementById('languageSelect');
            if (selectElement) {
                selectElement.value = savedLang;
                if (savedLang !== 'en') {
                    setTimeout(() => this.switchLanguage(savedLang), 100);
                }
            }
            this.currentLanguage = savedLang;
        }

        storeOriginalTexts() {
            const elements = this.getTranslatableElements();
            elements.forEach((el, index) => {
                this.originalTexts.set(index, el.textContent.trim());
            });
            console.log(`📝 Stored ${this.originalTexts.size} original texts`);
        }

        addEventListeners() {
            const selectElement = document.getElementById('languageSelect');
            if (selectElement) {
                selectElement.addEventListener('change', (e) => {
                    this.switchLanguage(e.target.value);
                });
            }
        }

        async switchLanguage(targetLanguage) {
            if (targetLanguage === this.currentLanguage) return;

            console.log(`🔄 Switching from ${this.currentLanguage} to ${targetLanguage}`);
            
            try {
                this.showLoading(true);
                const textElements = this.getTranslatableElements();
                const texts = Array.from(this.originalTexts.values());
                
                // If switching to English, restore original
                if (targetLanguage === 'en') {
                    this.restoreOriginalTexts(textElements);
                    this.currentLanguage = targetLanguage;
                    localStorage.setItem('preferredLanguage', targetLanguage);
                    this.showLoading(false);
                    console.log('✅ Restored to English');
                    return;
                }
                
                // Translate to target language
                const response = await fetch(`${this.backendUrl}/api/translate/bulk`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        texts: texts,
                        targetLanguage: this.getLanguageName(targetLanguage)
                    })
                });
                
                if (!response.ok) {
                    throw new Error(`Backend error: ${response.status}`);
                }
                
                const data = await response.json();
                
                if (data.translations && data.translations.length > 0) {
                    this.updatePageContent(textElements, data.translations);
                    this.currentLanguage = targetLanguage;
                    localStorage.setItem('preferredLanguage', targetLanguage);
                    console.log('✅ Translation successful');
                } else {
                    throw new Error('No translations received');
                }
                
            } catch (error) {
                console.error('❌ Translation error:', error);
                alert(`Translation failed: ${error.message}\n\nPlease ensure Python backend is running on port ${this.backendUrl.split(':').pop()}`);
                // Revert selection
                document.getElementById('languageSelect').value = this.currentLanguage;
            } finally {
                this.showLoading(false);
            }
        }

        getTranslatableElements() {
            // Exclude language switcher and common non-translatable elements
            const selectors = [
                'h1:not(#languageSwitcherContainer *):not(script):not(style)',
                'h2:not(#languageSwitcherContainer *):not(script):not(style)',
                'h3:not(#languageSwitcherContainer *):not(script):not(style)',
                'h4:not(#languageSwitcherContainer *):not(script):not(style)',
                'h5:not(#languageSwitcherContainer *):not(script):not(style)',
                'h6:not(#languageSwitcherContainer *):not(script):not(style)',
                'p:not(#languageSwitcherContainer *):not(script):not(style)',
                'button:not(#languageSwitcherContainer *):not(script):not(style)',
                'label:not(#languageSwitcherContainer *):not(script):not(style)',
                'li:not(#languageSwitcherContainer *):not(script):not(style)',
                'a:not(#languageSwitcherContainer *):not(script):not(style)',
                'span.translatable',
                'div.translatable'
            ];
            
            const elements = Array.from(document.querySelectorAll(selectors.join(',')))
                .filter(el => {
                    const text = el.textContent.trim();
                    return text.length > 0 && 
                           text.length < 500 && // Skip very long text blocks
                           el.offsetParent !== null &&
                           !this.hasTranslatableParent(el) &&
                           !el.closest('script, style, code, pre');
                });
            
            return elements;
        }

        hasTranslatableParent(element) {
            let parent = element.parentElement;
            while (parent && parent !== document.body) {
                if (parent.matches('h1, h2, h3, h4, h5, h6, p, button, label, li, a') &&
                    !parent.closest('#languageSwitcherContainer')) {
                    return true;
                }
                parent = parent.parentElement;
            }
            return false;
        }

        restoreOriginalTexts(elements) {
            elements.forEach((element, index) => {
                const originalText = this.originalTexts.get(index);
                if (originalText) {
                    element.textContent = originalText;
                }
            });
        }

        updatePageContent(elements, translations) {
            let updatedCount = 0;
            elements.forEach((element, index) => {
                if (translations[index] && translations[index].trim() !== '') {
                    element.textContent = translations[index];
                    updatedCount++;
                }
            });
            console.log(`📊 Updated ${updatedCount} elements`);
        }

        getLanguageName(code) {
            const languageMap = {
                'en': 'english',
                'or': 'odia', 
                'hi': 'hindi'
            };
            return languageMap[code] || code;
        }

        showLoading(show) {
            const existingLoader = document.getElementById('translationLoader');
            if (existingLoader) existingLoader.remove();

            if (show) {
                const loader = document.createElement('div');
                loader.id = 'translationLoader';
                loader.innerHTML = `
                    <div style="position: fixed; top: 50%; left: 50%; transform: translate(-50%, -50%); 
                               background: rgba(0,0,0,0.9); color: white; padding: 20px 30px; border-radius: 12px; 
                               z-index: 1000000; font-size: 16px; box-shadow: 0 4px 20px rgba(0,0,0,0.3);">
                        <div style="display: flex; align-items: center; gap: 10px;">
                            <div style="width: 20px; height: 20px; border: 3px solid #fff; border-top-color: transparent; 
                                       border-radius: 50%; animation: langSwitcherSpin 1s linear infinite;"></div>
                            <span>Translating...</span>
                        </div>
                    </div>
                `;
                document.body.appendChild(loader);
            }
        }
    }

    // Initialize when DOM is ready
    function initialize() {
        injectStyles();
        injectHTML();
        
        // Wait a bit for DOM to be fully ready
        setTimeout(() => {
            window.languageSwitcher = new LanguageSwitcher();
        }, 100);
    }

    // Auto-initialize
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initialize);
    } else {
        initialize();
    }

})();