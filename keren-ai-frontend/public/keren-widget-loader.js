/*
  Keren-AI widget loader (MVP) - Native injection (no iframe)

  Client usage:
    <script>
      window.KEREN_WIDGET_URL = "https://your-widget-host"; // no trailing slash
    </script>
    <script src="https://your-widget-host/keren-widget-loader.js" async></script>

  This loader:
    - creates a container in the client DOM
    - (optionally) attaches a ShadowRoot for CSS isolation
    - injects widget CSS
    - loads widget JS bundle and mounts it
*/
(function () {
  function stripTrailingSlashes(url) {
    return (url || '').toString().replace(/\/+$/, '');
  }

  function detectBaseFromCurrentScript() {
    var script = document.currentScript;
    if (!script) {
      var scripts = document.getElementsByTagName('script');
      script = scripts[scripts.length - 1];
    }
    if (!script || !script.src) return '';
    try {
      var u = new URL(script.src);
      return u.origin;
    } catch (e) {
      return '';
    }
  }

  function ensureOnce(id) {
    return !document.getElementById(id);
  }

  function inject() {
    // Avoid double-inject.
    if (!ensureOnce('keren-widget-host')) return;

    var base = stripTrailingSlashes(window.KEREN_WIDGET_URL) || stripTrailingSlashes(detectBaseFromCurrentScript());
    if (!base) {
      // eslint-disable-next-line no-console
      console.error('[KerenWidget] Missing window.KEREN_WIDGET_URL (e.g. "https://widget.example.com").');
      return;
    }

    // Host element in the client DOM.
    var host = document.createElement('div');
    host.id = 'keren-widget-host';
    document.body.appendChild(host);

    // Shadow DOM for isolation (recommended).
    var target = host;
    if (host.attachShadow) {
      target = host.attachShadow({ mode: 'open' });
    }

    // Expose the mount target for the widget bundle.
    window.__KEREN_WIDGET_TARGET__ = target;

    // Inject CSS into <head> (works even with shadow DOM; styles are global).
    // For MVP, global CSS is OK. If you want fully isolated styles later, we can inline CSS into shadow root.
    if (ensureOnce('keren-widget-css')) {
      var link = document.createElement('link');
      link.id = 'keren-widget-css';
      link.rel = 'stylesheet';
      link.href = base + '/assets/widget.css';
      document.head.appendChild(link);
    }

    // Load the widget bundle.
    if (ensureOnce('keren-widget-bundle')) {
      var script = document.createElement('script');
      script.id = 'keren-widget-bundle';
      script.type = 'module';
      script.src = base + '/assets/widget-entry.js';
      script.onload = function () {
        // If the bundle didn't auto-mount (should), try calling the global.
        if (typeof window.mountKerenWidget === 'function' && window.__KEREN_WIDGET_TARGET__) {
          try {
            window.mountKerenWidget(window.__KEREN_WIDGET_TARGET__);
          } catch (e) {
            // eslint-disable-next-line no-console
            console.error('[KerenWidget] mountKerenWidget failed:', e);
          }
        }
      };
      script.onerror = function (e) {
        // eslint-disable-next-line no-console
        console.error('[KerenWidget] Failed loading widget bundle:', e);
      };
      document.head.appendChild(script);
    }
  }

  // async-safe: wait for body.
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', inject);
  } else {
    inject();
  }
})();