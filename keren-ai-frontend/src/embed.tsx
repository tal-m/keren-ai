import React from 'react';
import ReactDOM from 'react-dom/client';
import ChatWidget from './components/ChatWidget';

// Widget-only entrypoint: renders ONLY the floating widget.
// No admin/auth pages, so it can be embedded cleanly.
ReactDOM.createRoot(document.getElementById('keren-widget-root')!).render(
  <React.StrictMode>
    <ChatWidget />
  </React.StrictMode>
);

