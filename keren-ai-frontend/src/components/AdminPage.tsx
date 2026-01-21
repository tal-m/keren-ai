import React, { useEffect, useMemo, useRef, useState } from 'react';
import { useAuth } from '../auth';
import { apiAuthGet, apiAuthJson, ApiError } from '../api';

type Tab = 'history' | 'info';

type ChunkDoc = any;

type MetricSummary = {
  avgUserTokens?: number;
  avgAiTokens?: number;
  avgTotalTokens?: number;
  totalInteractions?: number;
};

type ChatMetric = any;

function getDocId(doc: any): string | null {
  return doc?.id ?? doc?.documentId ?? doc?.metadata?.id ?? null;
}

function getDocText(doc: any): string {
  return (doc?.text ?? doc?.content ?? doc?.payload ?? '').toString();
}

function getDocTag(doc: any): string {
  const m = doc?.metadata;
  if (!m) return '';
  if (typeof m === 'object') return (m.tag ?? m['tag'] ?? '').toString();
  if (typeof m === 'string') {
    try {
      const parsed = JSON.parse(m);
      return (parsed?.tag ?? '').toString();
    } catch {
      return '';
    }
  }
  return '';
}

const AdminPage: React.FC = () => {
  const { accessToken, logout } = useAuth();
  const [tab, setTab] = useState<Tab>('history');
  const initialLoadRef = useRef(true);
  const [authError, setAuthError] = useState<string | null>(null);

  // Info tab state
  const [chunks, setChunks] = useState<ChunkDoc[]>([]);
  const [chunksLoading, setChunksLoading] = useState(false);
  const [chunksError, setChunksError] = useState<string | null>(null);
  const [showAdd, setShowAdd] = useState(false);
  const [newContent, setNewContent] = useState('');
  const [newTag, setNewTag] = useState('');
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editingContent, setEditingContent] = useState('');
  const [editingTag, setEditingTag] = useState('');

  // History tab state
  const [summary, setSummary] = useState<MetricSummary | null>(null);
  const [metrics, setMetrics] = useState<ChatMetric[]>([]);
  const [metricsLoading, setMetricsLoading] = useState(false);
  const [metricsError, setMetricsError] = useState<string | null>(null);

  const authToken = useMemo(() => accessToken ?? '', [accessToken]);

  const handleAuthError = (err: unknown) => {
    if (err instanceof ApiError && (err.status === 401 || err.status === 403)) {
      setAuthError('אימות נכשל. נסה לרענן / להיכנס שוב.');
      if (!initialLoadRef.current) {
        logout();
      }
      return;
    }
  };

  const loadChunks = async () => {
    if (!authToken) return;
    setChunksLoading(true);
    setChunksError(null);
    try {
      const docs = await apiAuthGet('/api/v1/admin/chunks', authToken);
      setAuthError(null);
      setChunks(Array.isArray(docs) ? docs : []);
    } catch (e: any) {
      handleAuthError(e);
      setChunksError(e?.message ?? 'שגיאה בטעינת הקטעים');
    } finally {
      setChunksLoading(false);
    }
  };

  const addChunk = async () => {
    const content = newContent.trim();
    const tag = newTag.trim();
    if (!content) {
      alert('יש להזין תוכן לקטע');
      return;
    }
    try {
      await apiAuthJson('/api/v1/admin/chunks', { method: 'POST', token: authToken, body: { content, tag } });
      setNewContent('');
      setNewTag('');
      setShowAdd(false);
      await loadChunks();
    } catch (e: any) {
      handleAuthError(e);
      alert('שגיאה ביצירת הקטע');
    }
  };

  const beginEdit = (doc: any) => {
    const id = getDocId(doc);
    if (!id) return;
    setEditingId(id);
    setEditingContent((doc?.text ?? doc?.content ?? '').toString());
    setEditingTag(getDocTag(doc));
  };

  const cancelEdit = () => {
    setEditingId(null);
    setEditingContent('');
    setEditingTag('');
  };

  const saveEdit = async () => {
    const id = editingId;
    if (!id) return;
    const content = editingContent.trim();
    const tag = editingTag.trim();
    if (!content) {
      alert('יש להזין תוכן לקטע');
      return;
    }
    try {
      await apiAuthJson(`/api/v1/admin/chunks/${encodeURIComponent(id)}`, {
        method: 'PUT',
        token: authToken,
        body: { content, tag },
      });
      cancelEdit();
      await loadChunks();
    } catch (e: any) {
      handleAuthError(e);
      alert('שגיאה בעדכון הקטע');
    }
  };

  const deleteChunk = async (doc: any) => {
    const id = getDocId(doc);
    if (!id) return;
    if (!confirm('למחוק קטע זה?')) return;
    try {
      await apiAuthJson(`/api/v1/admin/chunks/${encodeURIComponent(id)}`, { method: 'DELETE', token: authToken });
      await loadChunks();
    } catch (e: any) {
      handleAuthError(e);
      alert('שגיאה בביצוע המחיקה');
    }
  };

  const loadMetrics = async () => {
    if (!authToken) return;
    setMetricsLoading(true);
    setMetricsError(null);
    try {
      const s = await apiAuthGet('/api/v1/admin/metrics/summary', authToken);
      setAuthError(null);
      setSummary(s ?? null);
      const m = await apiAuthGet('/api/v1/admin/metrics', authToken);
      setMetrics(Array.isArray(m) ? m : []);
    } catch (e: any) {
      handleAuthError(e);
      setMetricsError(e?.message ?? 'שגיאה בטעינת ההיסטוריה');
    } finally {
      setMetricsLoading(false);
    }
  };

  useEffect(() => {
    if (!authToken) return;
    if (tab === 'info') loadChunks();
    if (tab === 'history') loadMetrics();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [tab, authToken]);

  useEffect(() => {
    // Mark first load as complete shortly after mount.
    const t = window.setTimeout(() => {
      initialLoadRef.current = false;
    }, 800);
    return () => window.clearTimeout(t);
  }, []);

  return (
    <div dir="rtl" lang="he" style={{ minHeight: '100vh', background: '#f4f4f9', display: 'flex', flexDirection: 'column' }}>
      <div style={{ display: 'flex', background: '#fff', borderBottom: '1px solid #ddd' }}>
        <button
          className="tab"
          style={{ padding: '12px 18px', border: 'none', background: 'transparent', cursor: 'pointer', fontWeight: 700, color: tab === 'history' ? '#28a745' : '#333', borderBottom: tab === 'history' ? '3px solid #28a745' : '3px solid transparent' }}
          onClick={() => setTab('history')}
        >
          היסטוריית שאלות
        </button>
        <button
          className="tab"
          style={{ padding: '12px 18px', border: 'none', background: 'transparent', cursor: 'pointer', fontWeight: 700, color: tab === 'info' ? '#28a745' : '#333', borderBottom: tab === 'info' ? '3px solid #28a745' : '3px solid transparent' }}
          onClick={() => setTab('info')}
        >
          מידע
        </button>
        <div style={{ marginLeft: 'auto', padding: 12, display: 'flex', alignItems: 'center', gap: 8 }}>
          <button
            onClick={logout}
            style={{ padding: '8px 12px', background: '#dc3545', border: 'none', color: 'white', borderRadius: 6, cursor: 'pointer' }}
          >
            התנתק
          </button>
        </div>
      </div>

      {authError && (
        <div style={{ padding: 12, background: '#fff3cd', borderBottom: '1px solid #ffeeba', color: '#856404' }}>
          {authError}
        </div>
      )}

      <div style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
        {tab === 'info' && (
          <div style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
            <div style={{ display: 'flex', gap: 8, padding: 12, alignItems: 'center', borderBottom: '1px solid #eee', background: 'white' }}>
              <button onClick={loadChunks}>רענן</button>
              <button onClick={() => setShowAdd(true)} style={{ background: '#007bff', color: 'white', border: 'none', borderRadius: 6, padding: '6px 10px', cursor: 'pointer' }}>
                הוסף קטע +
              </button>
              <div style={{ flex: 1 }} />
              <div style={{ color: '#666', fontSize: '0.9rem' }}>רשימת קטעים במאגר</div>
            </div>

            {showAdd && (
              <div style={{ padding: 12, background: 'white', borderTop: '1px solid #eee' }}>
                <label>תוכן:</label>
                <textarea style={{ width: '100%', minHeight: 80, marginTop: 6 }} value={newContent} onChange={(e) => setNewContent(e.target.value)} />
                <div style={{ marginTop: 8 }}>
                  <label>תג:</label>
                  <input style={{ width: '100%', marginTop: 6 }} type="text" value={newTag} onChange={(e) => setNewTag(e.target.value)} placeholder="תג (לדוגמה: מטרה, דרישות)" />
                </div>
                <div style={{ marginTop: 10, display: 'flex', gap: 8 }}>
                  <button onClick={addChunk} style={{ background: '#007bff', color: 'white', border: 'none', borderRadius: 6, padding: '6px 10px', cursor: 'pointer' }}>
                    שמור
                  </button>
                  <button onClick={() => setShowAdd(false)} style={{ padding: '6px 10px' }}>
                    ביטול
                  </button>
                </div>
              </div>
            )}

            <div style={{ padding: 16, overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: 12 }}>
              {chunksLoading && <div style={{ color: '#666' }}>טוען...</div>}
              {chunksError && <div style={{ color: '#c00' }}>{chunksError}</div>}
              {!chunksLoading && !chunksError && chunks.length === 0 && <div style={{ color: '#666' }}>אין קטעים במאגר</div>}

              {chunks.map((doc) => {
                const id = getDocId(doc);
                const text = getDocText(doc);
                const tag = getDocTag(doc);
                const isEditing = editingId && id && editingId === id;

                return (
                  <div key={id ?? text} style={{ background: 'white', padding: 12, borderRadius: 8, border: '1px solid #e6e6e6', display: 'flex', justifyContent: 'space-between', gap: 12 }}>
                    <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 6 }}>
                      {!isEditing ? (
                        <>
                          <div style={{ whiteSpace: 'pre-wrap' }}>{text}</div>
                          <div style={{ color: '#666', fontSize: '0.9rem' }}>{tag ? `תג: ${tag}` : id ? `id: ${id}` : ''}</div>
                        </>
                      ) : (
                        <>
                          <textarea style={{ width: '100%', minHeight: 80 }} value={editingContent} onChange={(e) => setEditingContent(e.target.value)} />
                          <input style={{ width: '100%' }} value={editingTag} onChange={(e) => setEditingTag(e.target.value)} placeholder="תג (אופציונלי)" />
                        </>
                      )}
                    </div>

                    <div style={{ display: 'flex', gap: 8, alignItems: 'flex-start' }}>
                      {!isEditing ? (
                        <>
                          <button
                            onClick={() => beginEdit(doc)}
                            disabled={!id}
                            style={{ padding: '6px 10px', background: '#ffc107', border: 'none', color: '#222', borderRadius: 6, cursor: 'pointer' }}
                          >
                            ערוך
                          </button>
                          <button
                            onClick={() => deleteChunk(doc)}
                            disabled={!id}
                            style={{ padding: '6px 10px', background: '#dc3545', border: 'none', color: 'white', borderRadius: 6, cursor: 'pointer' }}
                          >
                            מחק
                          </button>
                        </>
                      ) : (
                        <>
                          <button
                            onClick={saveEdit}
                            style={{ padding: '6px 10px', background: '#007bff', border: 'none', color: 'white', borderRadius: 6, cursor: 'pointer' }}
                          >
                            שמור
                          </button>
                          <button onClick={cancelEdit} style={{ padding: '6px 10px' }}>
                            ביטול
                          </button>
                        </>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {tab === 'history' && (
          <div style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
            <div style={{ padding: 12, display: 'flex', alignItems: 'center', gap: 8, background: 'white', borderBottom: '1px solid #eee' }}>
              <button onClick={loadMetrics}>רענן</button>
              <div style={{ flex: 1 }} />
              <div style={{ color: '#666', fontSize: '0.9rem' }}>היסטוריית שאלות וסטטיסטיקות</div>
            </div>

            <div style={{ padding: 12, background: 'white', borderBottom: '1px solid #eee', display: 'flex', gap: 16, flexWrap: 'wrap' }}>
              {summary ? (
                <>
                  <SummaryItem title="ממוצע טוקנים שאלה" value={summary.avgUserTokens} />
                  <SummaryItem title="ממוצע טוקנים תשובה" value={summary.avgAiTokens} />
                  <SummaryItem title={'ממוצע טוקנים סה"כ'} value={summary.avgTotalTokens} />
                  <SummaryItem title="סך כל אינטראקציות" value={summary.totalInteractions} />
                </>
              ) : (
                <div style={{ color: '#666' }}>{metricsLoading ? 'טוען...' : ''}</div>
              )}
            </div>

            <div style={{ padding: 16, overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: 12 }}>
              {metricsLoading && <div style={{ color: '#666' }}>טוען...</div>}
              {metricsError && <div style={{ color: '#c00' }}>{metricsError}</div>}
              {!metricsLoading && !metricsError && metrics.length === 0 && <div style={{ color: '#666' }}>אין נתונים</div>}

              {metrics.map((m: any, idx: number) => (
                <div key={m?.id ?? idx} style={{ background: 'white', padding: 12, borderRadius: 8, border: '1px solid #e6e6e6' }}>
                  <FieldRow label="שאלה" value={m?.userInput} />
                  <FieldRow label="תשובת בוט" value={m?.aiResponse} />
                  <FieldRow label="נוצר ב" value={m?.createdAt} />
                  <FieldRow label="טוקנים שאלה" value={m?.userTokens} />
                  <FieldRow label="טוקנים תשובה" value={m?.aiTokens} />
                  <FieldRow label={'טוקנים סה"כ'} value={m?.totalTokens} />
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

const SummaryItem: React.FC<{ title: string; value: any }> = ({ title, value }) => {
  return (
    <div style={{ minWidth: 160, padding: 8, borderRadius: 6, background: 'white', border: '1px solid #eee' }}>
      <div style={{ fontSize: '0.9rem', color: '#666' }}>{title}</div>
      <div style={{ fontWeight: 'bold', marginTop: 6 }}>{value ?? '-'}</div>
    </div>
  );
};

const FieldRow: React.FC<{ label: string; value: any }> = ({ label, value }) => {
  const text = value !== null && value !== undefined && String(value).trim() !== '' ? String(value) : '-';
  return (
    <div style={{ display: 'grid', gridTemplateColumns: '160px 1fr', gap: 12, padding: '10px 0', alignItems: 'start', borderBottom: '1px solid #f0f0f0' }}>
      <div style={{ fontWeight: 600, minWidth: 140, color: '#333' }}>{label}:</div>
      <div style={{ color: '#222', whiteSpace: 'pre-wrap' }}>{text}</div>
    </div>
  );
};

export default AdminPage;

