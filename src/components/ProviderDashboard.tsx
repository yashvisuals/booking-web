import { useEffect, useState } from 'react';
import { API } from '../api';

type Rule = {
  id: number;
  dayOfWeek: string;
  startTime: string;
  endTime: string;
  zoneId: string;
  slotMinutes: number;
};

const DAYS = ['MONDAY', 'TUESDAY', 'WEDNESDAY', 'THURSDAY', 'FRIDAY', 'SATURDAY', 'SUNDAY'];
const localZone = Intl.DateTimeFormat().resolvedOptions().timeZone;

export function ProviderDashboard() {
  const [rules, setRules] = useState<Rule[]>([]);
  const [dayOfWeek, setDayOfWeek] = useState('MONDAY');
  const [startTime, setStartTime] = useState('09:00');
  const [endTime, setEndTime] = useState('17:00');
  const [zoneId, setZoneId] = useState(localZone);
  const [slotMinutes, setSlotMinutes] = useState(30);
  const [error, setError] = useState('');

  const load = async () => setRules((await API.get('/availability')).data);
  useEffect(() => { load(); }, []);

  const add = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    try {
      await API.post('/availability', { dayOfWeek, startTime, endTime, zoneId, slotMinutes });
      await load();
    } catch (err: any) {
      setError(err.response?.data?.message ?? 'Could not add rule');
    }
  };

  const remove = async (id: number) => {
    await API.delete(`/availability/${id}`);
    await load();
  };

  return (
    <div className="card">
      <h2>Your availability</h2>
      <p className="muted">Define when you're open. Times are in the zone you choose.</p>

      <form className="grid-form" onSubmit={add}>
        <label>Day
          <select value={dayOfWeek} onChange={(e) => setDayOfWeek(e.target.value)}>
            {DAYS.map((d) => <option key={d} value={d}>{d[0] + d.slice(1).toLowerCase()}</option>)}
          </select>
        </label>
        <label>From
          <input type="time" value={startTime} onChange={(e) => setStartTime(e.target.value)} />
        </label>
        <label>To
          <input type="time" value={endTime} onChange={(e) => setEndTime(e.target.value)} />
        </label>
        <label>Slot (min)
          <input type="number" min={5} step={5} value={slotMinutes}
                 onChange={(e) => setSlotMinutes(Number(e.target.value))} />
        </label>
        <label className="wide">Timezone
          <input value={zoneId} onChange={(e) => setZoneId(e.target.value)} />
        </label>
        <button type="submit" className="wide">Add availability</button>
      </form>
      {error && <p className="error">{error}</p>}

      <div className="list">
        {rules.length === 0 && <p className="muted">No availability yet.</p>}
        {rules.map((r) => (
          <div key={r.id} className="row">
            <div>
              <strong>{r.dayOfWeek[0] + r.dayOfWeek.slice(1).toLowerCase()}</strong>
              <div className="muted small">{r.startTime}–{r.endTime} · {r.slotMinutes}m · {r.zoneId}</div>
            </div>
            <button className="link danger" onClick={() => remove(r.id)}>remove</button>
          </div>
        ))}
      </div>
    </div>
  );
}
