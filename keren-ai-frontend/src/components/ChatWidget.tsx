import React, { useEffect, useRef, useState } from 'react';
import ChatPanel from './ChatPanel';

const CHAT_Z = 99999;

type Point = { x: number; y: number };

type DragState = {
  isDown: boolean;
  start: Point;
  orig: Point;
};

const ChatWidget: React.FC = () => {
  const [open, setOpen] = useState(true);
  const [logoOk, setLogoOk] = useState(true);
  const [logoUrl] = useState(() => `/reichman_university_logo.png?v=${Date.now()}`);
  const [pos, setPos] = useState<{ right: number; bottom: number; left: number | null; top: number | null }>({
    right: 20,
    bottom: 20,
    left: null,
    top: null,
  });

  const dragRef = useRef<DragState>({ isDown: false, start: { x: 0, y: 0 }, orig: { x: 0, y: 0 } });
  const widgetRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const onMove = (e: MouseEvent) => {
      const d = dragRef.current;
      if (!d.isDown) return;
      const dx = e.clientX - d.start.x;
      const dy = e.clientY - d.start.y;
      setPos({ right: 20, bottom: 20, left: d.orig.x + dx, top: d.orig.y + dy });
    };
    const onUp = () => {
      dragRef.current.isDown = false;
      document.body.style.userSelect = '';
    };

    window.addEventListener('mousemove', onMove);
    window.addEventListener('mouseup', onUp);
    return () => {
      window.removeEventListener('mousemove', onMove);
      window.removeEventListener('mouseup', onUp);
    };
  }, []);

  const startDrag = (e: React.MouseEvent) => {
    const el = widgetRef.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    dragRef.current = {
      isDown: true,
      start: { x: e.clientX, y: e.clientY },
      orig: { x: rect.left, y: rect.top },
    };
    document.body.style.userSelect = 'none';
  };

  const widgetStyle: React.CSSProperties = {
    position: 'fixed',
    zIndex: CHAT_Z,
    width: 360,
    height: 480,
    background: '#fff',
    borderRadius: 10,
    boxShadow: '0 12px 40px rgba(0,0,0,0.25)',
    overflow: 'hidden',
    display: open ? 'flex' : 'none',
    flexDirection: 'column',
    border: '1px solid #e6e6e6',
    right: pos.left === null ? pos.right : 'auto',
    bottom: pos.top === null ? pos.bottom : 'auto',
    left: pos.left !== null ? pos.left : 'auto',
    top: pos.top !== null ? pos.top : 'auto',
  };

  const openBtnStyle: React.CSSProperties = {
    position: 'fixed',
    right: pos.left === null ? 20 : 'auto',
    bottom: pos.top === null ? 20 : 'auto',
    left: pos.left !== null ? pos.left : 'auto',
    top: pos.top !== null ? pos.top : 'auto',
    width: 56,
    height: 56,
    zIndex: CHAT_Z,
    borderRadius: '50%',
    background: '#003f7f',
    color: 'white',
    display: open ? 'none' : 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    boxShadow: '0 8px 24px rgba(0,0,0,0.22)',
    border: 'none',
    cursor: 'pointer',
    fontSize: 20,
  };

  return (
    <>
      <div ref={widgetRef} style={widgetStyle}>
        <div
          onMouseDown={startDrag}
          style={{
            height: 44,
            background: 'linear-gradient(90deg,#003f7f,#002e66)',
            color: 'white',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: 8,
            padding: 8,
            cursor: 'move',
            direction: 'ltr',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center' }}>
            {logoOk ? (
              <img
                src={logoUrl}
                alt="Keren-AI"
                style={{ width: 40, height: 40, objectFit: 'contain', marginRight: 8 }}
                onError={() => setLogoOk(false)}
              />
            ) : (
              <div
                aria-hidden
                style={{ width: 40, height: 40, marginRight: 8, borderRadius: 6, background: 'rgba(255,255,255,0.16)' }}
              />
            )}
            <div style={{ fontWeight: 700, fontSize: '0.95rem' }}>Keren-AI</div>
          </div>

          <div style={{ display: 'flex', gap: 6, alignItems: 'center' }}>
            <button
              title="מזער"
              onClick={(e) => {
                e.stopPropagation();
                setOpen(false);
              }}
              style={{
                background: 'rgba(255,255,255,0.16)',
                border: 'none',
                color: 'white',
                padding: '6px 8px',
                borderRadius: 6,
                cursor: 'pointer',
              }}
            >
              -
            </button>
          </div>
        </div>

        <div style={{ flex: 1, height: 'calc(100% - 44px)' }}>
          <ChatPanel />
        </div>
      </div>

      <button
        style={openBtnStyle}
        onClick={() => setOpen(true)}
        title="פתח את הצ'אט"
        aria-label="פתח את הצ'אט"
      >
        💬
      </button>
    </>
  );
};

export default ChatWidget;

