/*
  Keren-AI widget loader (MVP)

  Usage (client site):
    <script>
      window.KEREN_WIDGET_URL = "https://your-widget-host"; // no trailing slash
    </script>
    <script src="https://your-widget-host/keren-widget-loader.js" async></script>

  Notes:
  - This loader injects an iframe pointing to `${KEREN_WIDGET_URL}/embed.html`.
  - Keep it simple for MVP; no tokens/options yet.
*/
(function () {
  var base = (window.KEREN_WIDGET_URL || '').toString().replace(/\/+$/, '');
  if (!base) {
    // eslint-disable-next-line no-console
    console.error('[KerenWidget] Missing window.KEREN_WIDGET_URL (e.g. "https://widget.example.com").');
    return;
  }

  var src = base + '/embed.html';

  // Avoid double-inject.
  if (document.getElementById('keren-widget-iframe')) return;

  var iframe = document.createElement('iframe');
  iframe.id = 'keren-widget-iframe';
  iframe.src = src;
  iframe.title = 'Keren-AI Chatbot';
  iframe.setAttribute('aria-label', 'Keren-AI Chatbot');

  // The widget itself is fixed-position inside the iframe.
  // The iframe needs to cover the area where the widget may appear.
  iframe.style.position = 'fixed';
  iframe.style.right = '0';
  iframe.style.bottom = '0';
  iframe.style.width = '420px';
  iframe.style.height = '560px';
  iframe.style.border = '0';
  iframe.style.background = 'transparent';
  iframe.style.zIndex = '99999';

  document.body.appendChild(iframe);
})();

