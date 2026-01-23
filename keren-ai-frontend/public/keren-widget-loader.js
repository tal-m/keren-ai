/*
  Keren-AI widget loader (MVP) - Updated for Client Origin Tracking

  Usage (client site):
    <script>
      window.KEREN_WIDGET_URL = "https://your-widget-host"; // no trailing slash
    </script>
    <script src="https://your-widget-host/keren-widget-loader.js" async></script>
*/
(function () {
  var base = (window.KEREN_WIDGET_URL || '').toString().replace(/\/+$/, '');
  if (!base) {
    // eslint-disable-next-line no-console
    console.error('[KerenWidget] Missing window.KEREN_WIDGET_URL (e.g. "https://widget.example.com").');
    return;
  }

  // 1. Capture the origin of the Client Site (e.g., "http://localhost:5500")
  var clientOrigin = window.location.origin;

  // 2. Append it to the src as a query parameter
  var src = base + '/embed.html?parentOrigin=' + encodeURIComponent(clientOrigin);

  // Avoid double-inject.
  if (document.getElementById('keren-widget-iframe')) return;

  var iframe = document.createElement('iframe');
  iframe.id = 'keren-widget-iframe';
  iframe.src = src;
  iframe.title = 'Keren-AI Chatbot';
  iframe.setAttribute('aria-label', 'Keren-AI Chatbot');

  // The widget itself is fixed-position inside the iframe.
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