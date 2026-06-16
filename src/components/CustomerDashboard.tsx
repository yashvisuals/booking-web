import { useEffect, useState } from 'react';
import { API } from '../api';

type Provider = { id: number; email: string };
type Slot = { start: string; end: string };

const localZone = Intl.DateTimeFormat().resolvedOptions().timeZone;

function fmtTime(iso: string) {
  return new Date(iso).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
}

export function CustomerDashboard({ onBooked }: { onBooked: () => void }) {
  const [providers, setProviders] = useState<Provider[]>([]);
  const [providerId, setProviderId] = useState<number | null>(null);
  const [date, setDate] = useState('');
  const [slots, setSlots] = useState<Slot[]>([]);
  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState('');

  useEffect(() => {
    API.get('/providers').then((r) => setProviders(r.data));
  }, []);

  const loadSlots = async () => {
    if (!providerId || !date) return;
    setLoading(true);
    setMsg('');
    try {
      const res = await API.get(`/providers/${providerId}/slots`, { params: { date } });
      setSlots(res.data);
      if (res.data.length === 0) setMsg('No free slots on this date.');
    } finally {
      setLoading(false);
    }
  };

  const book = async (slot: Slot) => {
    setMsg('');
    try {
      await API.post('/bookings', { providerId, start: slot.start });
      setMsg('Booked! 🎉');
      await loadSlots();
      onBooked();
    } catch (err: any) {
      setMsg(err.response?.status === 409 ? 'That slot was just taken — try another.' :
        (err.response?.data?.message ?? 'Could not book'));
    }
  };

  return (
    <div className="card">
      <h2>Book an appointment</h2>
      <p className="muted">Times shown in your timezone ({localZone}).</p>

      <div className="grid-form">
        <label className="wide">Provider
          <select value={providerId ?? ''} onChange={(e) => setProviderId(Number(e.target.value))}>
            <option value="" disabled>Select a provider…</option>
            {providers.map((p) => <option key={p.id} value={p.id}>{p.email}</option>)}
          </select>
        </label>
        <label>Date
          <input type="date" value={date} onChange={(e) => setDate(e.target.value)} />
        </label>
        <button className="wide" onClick={loadSlots} disabled={!providerId || !date || loading}>
          {loading ? 'Loading…' : 'Find slots'}
        </button>
      </div>

      {msg && <p className={msg.startsWith('Booked') ? 'success' : 'muted'}>{msg}</p>}

      <div className="slots">
        {slots.map((s) => (
          <button key={s.start} className="slot" onClick={() => book(s)}>
            {fmtTime(s.start)}
          </button>
        ))}
      </div>
    </div>
  );
}
