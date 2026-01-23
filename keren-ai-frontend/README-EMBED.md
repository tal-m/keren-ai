# Keren-AI Widget Embed (MVP)

This project can be embedded into any website via an iframe.

## Files

- `embed.html` – widget-only page (renders only the chat widget)
- `src/embed.tsx` – widget-only entrypoint
- `public/keren-widget-loader.js` – client paste/hostable loader
- `public/embed-demo-host.html` – a local demo “client website” page

## Local quick test

1. Start the frontend normally (Vite dev server).
2. Open: `/embed-demo-host.html` in the browser.

If your Vite server is on port 5173, the URL is:

- `http://localhost:5173/embed-demo-host.html`

## Client snippet (what the client pastes)

```html
<script>
  window.KEREN_WIDGET_URL = "https://YOUR-WIDGET-HOST";
</script>
<script src="https://YOUR-WIDGET-HOST/keren-widget-loader.js" async></script>
```

That will inject an iframe pointing at:

- `https://YOUR-WIDGET-HOST/embed.html`

## Notes

- For MVP, this assumes your API gateway CORS already allows `YOUR-WIDGET-HOST`.
- When moving from dev/ngrok to prod, you only change `YOUR-WIDGET-HOST`.

