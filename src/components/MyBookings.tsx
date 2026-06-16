import { useEffect, useState } from 'react';
import { API } from '../api';

type Booking = {
  id: number;
  providerEmail: string;
  customerEmail: string;
  start: string;
  end: string;
  status: string;
};

function fmt(iso: string) {
  return new Date(iso).toLocaleString([], {
    weekday: 'short', month: 'short', day: 'numeric',
    hour: '2-digit', minute: '2-digit',
  });
}

export function MyBookings({ refreshKey }: { refreshKey: number }) {
  const [bookings, setBookings] = useState<Booking[]>([]);

  const load = async () => setBookings((await API.get('/bookings/me')).data);
  useEffect(() => { load(); }, [refreshKey]);

  const cancel = async (id: number) => {
    await API.post(`/bookings/${id}/cancel`);
    await load();
  };

  return (
    <div className="card">
      <h2>My bookings</h2>
      {bookings.length === 0 && <p className="muted">No bookings yet.</p>}
      <div className="list">
        {bookings.map((b) => (
          <div key={b.id} className="row">
            <div>
              <strong>{fmt(b.start)}</strong>
              <div className="muted small">with {b.providerEmail}</div>
            </div>
            <button className="link danger" onClick={() => cancel(b.id)}>cancel</button>
          </div>
        ))}
      </div>
    </div>
  );
}
