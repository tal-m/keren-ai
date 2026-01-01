(function(){
    // Minimal, stable chat widget script (no resize handles)
    function ensureWidgetCss() {
        if (document.getElementById('keren-chat-widget-css')) return;
        const css = `
            .chat-widget, .chat-widget * { box-sizing: border-box; }
            .chat-widget { position: fixed; bottom: 20px; right: 20px; width: 360px; height: 480px; z-index: 99999; background: #fff; border-radius: 10px; box-shadow: 0 12px 40px rgba(0,0,0,0.25); overflow: hidden; display: flex; flex-direction: column; border: 1px solid #e6e6e6; }
            .chat-widget.hidden { display: none; }
            .chat-widget.minimized { height: 44px; width: 260px; }
            .chat-widget .cw-header { position: relative; height: 44px; background: linear-gradient(90deg,#003f7f,#002e66); color: white; display: flex; align-items: center; gap: 8px; padding: 8px; cursor: move; justify-content: space-between; }
            .chat-widget .cw-logo { width: 40px; height: 40px; object-fit: contain; margin-right: 8px; }
            .chat-widget .cw-title { font-weight: 700; font-size: 0.95rem; margin-left: 6px; }
            .chat-widget .cw-controls { margin-left: auto; display: flex; gap: 6px; align-items: center; }
            .chat-widget .cw-controls button { background: rgba(255,255,255,0.16); border: none; color: white; padding: 6px 8px; border-radius: 6px; cursor: pointer; }
            .chat-widget iframe { border: 0; width: 100%; height: calc(100% - 44px); display: block; }
            .chat-open-btn { position: fixed; bottom: 20px; right: 20px; width: 56px; height: 56px; z-index: 99999; border-radius: 50%; background: #003f7f; color: white; display: flex; align-items: center; justify-content: center; box-shadow: 0 8px 24px rgba(0,0,0,0.22); border: none; cursor: pointer; font-size: 20px; }
            .chat-open-btn.hidden { display: none; }
        `;
        const style = document.createElement('style');
        style.id = 'keren-chat-widget-css';
        style.appendChild(document.createTextNode(css));
        (document.head || document.documentElement).appendChild(style);
    }

    function createWidget() {
        ensureWidgetCss();
        const widget = document.createElement('div');
        widget.className = 'chat-widget';
        widget.id = 'keren-chat-widget';

        const header = document.createElement('div');
        header.className = 'cw-header';
        header.innerHTML = '<div style="display:flex;align-items:center;"><img class="cw-logo" src="/reichman_university_logo.png" alt="Keren-AI" /><div class="cw-title">Keren-AI</div></div>';

        const controls = document.createElement('div');
        controls.className = 'cw-controls';
        const minBtn = document.createElement('button'); minBtn.title = 'מזער'; minBtn.innerText = '-';
        controls.appendChild(minBtn);
        header.appendChild(controls);

        const iframe = document.createElement('iframe');
        iframe.src = '/chat.html';
        iframe.id = 'keren-chat-iframe';
        iframe.title = 'Keren AI Chat';

        widget.appendChild(header);
        widget.appendChild(iframe);

        const open = document.createElement('button');
        open.className = 'chat-open-btn';
        open.id = 'keren-chat-open';
        open.innerText = '💬';
        open.title = "פתח את הצ'אט";

        document.body.appendChild(widget);
        document.body.appendChild(open);

        // ensure visible
        open.classList.remove('hidden'); open.style.display = 'flex';
        widget.style.display = 'flex'; widget.style.zIndex = '99999';

        // events
        minBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            widget.classList.add('minimized');
            widget.style.display = 'none';
            open.classList.remove('hidden');
            open.style.display = 'flex';
        });

        open.addEventListener('click', () => {
            widget.classList.remove('hidden');
            widget.classList.remove('minimized');
            widget.style.display = 'flex';
            open.classList.add('hidden');
            open.style.display = 'none';
        });

        return { widget, header, iframe, openBtn: open };
    }

    function enableDrag(element, handle) {
        let isDown = false, startX = 0, startY = 0, origX = 0, origY = 0;
        handle.addEventListener('mousedown', (e) => { isDown = true; startX = e.clientX; startY = e.clientY; const rect = element.getBoundingClientRect(); origX = rect.left; origY = rect.top; document.body.style.userSelect = 'none'; });
        window.addEventListener('mousemove', (e) => { if (!isDown) return; const dx = e.clientX - startX, dy = e.clientY - startY; element.style.left = (origX + dx) + 'px'; element.style.top = (origY + dy) + 'px'; element.style.right = 'auto'; element.style.bottom = 'auto'; element.style.position = 'fixed'; });
        window.addEventListener('mouseup', () => { isDown = false; document.body.style.userSelect = ''; });
    }

    function init() {
        if (document.getElementById('keren-chat-widget')) return;
        const { widget, header, iframe, openBtn } = createWidget();
        widget.style.right = '20px'; widget.style.bottom = '20px';
        widget.style.display = 'flex'; widget.style.zIndex = '99999';
        enableDrag(widget, header);
        window.KerenChatWidget = { widget, iframe, openBtn };
        try { openBtn.classList.add('hidden'); openBtn.style.display = 'none'; } catch(e){}
    }

    if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init); else init();

})();
