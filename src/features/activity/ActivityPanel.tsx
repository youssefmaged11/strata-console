import { useState } from 'react';
import { MessageSquare, RefreshCw, Send } from 'lucide-react';
import { useActivity } from './useActivity';

export function ActivityPanel({ changeId }: { changeId: string }) {
  const { events, loading, addComment, refresh } = useActivity(changeId);
  const [comment, setComment] = useState('');
  return (
    <section className="activity-panel">
      <header><div><MessageSquare /><h3>Activity</h3></div><button className="icon-button" aria-label="Refresh activity" onClick={() => void refresh()}><RefreshCw /></button></header>
      <form className="comment-box" onSubmit={(event) => { event.preventDefault(); const message = comment.trim(); if (!message) return; setComment(''); void addComment(message); }}>
        <textarea aria-label="Add an internal comment" placeholder="Add an internal comment…" value={comment} onChange={(event) => setComment(event.target.value)} />
        <button className="button primary" disabled={!comment.trim()}><Send /> Comment</button>
      </form>
      {loading && events.length === 0 ? <div className="activity-loading">Loading activity…</div> : (
        <ol>{events.map((event) => <li key={event.id}><i className={event.kind} /><div><strong>{event.actor}</strong><p>{event.message}</p><time>{new Date(event.createdAt).toLocaleString()}</time></div></li>)}</ol>
      )}
    </section>
  );
}
