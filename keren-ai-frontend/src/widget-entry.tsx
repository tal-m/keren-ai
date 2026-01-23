import React from 'react';
import ReactDOM from 'react-dom/client';
import ChatWidget from './components/ChatWidget';
import './index.css';

export type KerenWidgetMountTarget = HTMLElement | ShadowRoot;

function ensureContainerEl(target: KerenWidgetMountTarget): HTMLElement {
  // If caller passed an element, mount into it.
  if (target instanceof HTMLElement) return target;

  // If caller passed a ShadowRoot, create an inner mount element.
  const existing = target.getElementById('keren-widget-inner-root');
  if (existing) return existing as HTMLElement;

  const el = document.createElement('div');
  el.id = 'keren-widget-inner-root';
  target.appendChild(el);
  return el;
}

/**
 * Mounts the Keren widget into the given target.
 * The target is usually created by `public/keren-widget-loader.js`.
 */
export function mountKerenWidget(target: KerenWidgetMountTarget) {
  const el = ensureContainerEl(target);
  ReactDOM.createRoot(el).render(
    <React.StrictMode>
      <ChatWidget />
    </React.StrictMode>
  );
}

// Support simple loader that just appends a container and loads this script.
// The loader can set window.__KEREN_WIDGET_TARGET__ to an Element or ShadowRoot.
declare global {
  interface Window {
    __KEREN_WIDGET_TARGET__?: KerenWidgetMountTarget;
    mountKerenWidget?: (target: KerenWidgetMountTarget) => void;
  }
}

window.mountKerenWidget = mountKerenWidget;

if (window.__KEREN_WIDGET_TARGET__) {
  mountKerenWidget(window.__KEREN_WIDGET_TARGET__);
}

