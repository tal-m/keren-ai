import React, { useEffect, useRef, useState } from 'react';
import { apiPost } from '../api';

type Msg = { type: 'user' | 'bot'; text: string };

type ChatRequest = { message: string };

const ChatPanel: React.FC = () => {
  const [messages, setMessages] = useState<Msg[]>([]);
  const [input, setInput] = useState('');
  const [sending, setSending] = useState(false);
  const chatBoxRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const el = chatBoxRef.current;
    if (!el) return;
    el.scrollTop = el.scrollHeight;
  }, [messages.length]);

  async function send() {
    const text = input.trim();
    if (!text || sending) return;

    setMessages((prev) => [...prev, { type: 'user', text }]);
    setInput('');
    setSending(true);

    try {
      const payload: ChatRequest = { message: text };
      const reply = await apiPost('/api/v1/admin/chat', payload);
      setMessages((prev) => [...prev, { type: 'bot', text: String(reply) }]);
    } catch {
      setMessages((prev) => [...prev, { type: 'bot', text: 'שגיאה בחיבור לשרת' }]);
    } finally {
      setSending(false);
    }
  }

  return (
    <div style={{ height: '100%', display: 'flex', flexDirection: 'column', fontFamily: 'sans-serif' }} dir="rtl" lang="he">
      <div
        ref={chatBoxRef}
        style={{
          flex: 1,
          overflowY: 'auto',
          padding: 14,
          display: 'flex',
          flexDirection: 'column',
          gap: 10,
          background: '#f4f4f9',
        }}
      >
        {messages.map((m, idx) => (
          <div
            key={idx}
            style={{
              alignSelf: m.type === 'user' ? 'flex-start' : 'flex-end',
              background: m.type === 'user' ? '#007bff' : '#e9e9eb',
              color: m.type === 'user' ? 'white' : '#333',
              padding: '10px 14px',
              borderRadius: 15,
              maxWidth: '80%',
              wordBreak: 'break-word',
              whiteSpace: 'pre-wrap',
            }}
          >
            {m.text}
          </div>
        ))}
      </div>

      <div style={{ display: 'flex', padding: 10, background: 'white', borderTop: '1px solid #ddd', gap: 8 }}>
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="שאל אותי משהו על קרן אור..."
          onKeyDown={(e) => {
            if (e.key === 'Enter') send();
          }}
          style={{ flex: 1, padding: 10, border: '1px solid #ccc', borderRadius: 4, outline: 'none' }}
          disabled={sending}
        />
        <button
          onClick={send}
          aria-label="שלח"
          disabled={sending}
          style={{ padding: '10px 12px', background: '#003f7f', color: 'white', border: 'none', borderRadius: 4, cursor: 'pointer' }}
        >
          ➤
        </button>
      </div>
    </div>
  );
};

export default ChatPanel;

