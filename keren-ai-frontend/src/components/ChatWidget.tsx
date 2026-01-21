import React, { useState } from 'react';
import ChatPanel from './ChatPanel';

const CHAT_Z = 99999;

const ChatWidget: React.FC = () => {
  const [open, setOpen] = useState(true);
  const [logoOk, setLogoOk] = useState(true);

  // Vite serves files from `public/` at the site root.
  const logoUrl = '/reichman_university_logo.png';

  const widgetStyle: React.CSSProperties = {
    position: 'fixed',
    right: 20,
    bottom: 20,
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
  };

  const openBtnStyle: React.CSSProperties = {
    position: 'fixed',
    right: 20,
    bottom: 20,
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
      <div style={widgetStyle}>
        <div
          style={{
            height: 44,
            background: 'linear-gradient(90deg,#003f7f,#002e66)',
            color: 'white',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: 8,
            padding: 8,
            cursor: 'default',
            direction: 'ltr',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center' }}>
            {logoOk ? (
              <img
                src={logoUrl}
                alt="Reichman University"
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

