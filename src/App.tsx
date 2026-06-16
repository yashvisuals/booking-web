import { useState } from 'react';
import { Auth } from './components/Auth';
import { ProviderDashboard } from './components/ProviderDashboard';
import { CustomerDashboard } from './components/CustomerDashboard';
import { MyBookings } from './components/MyBookings';
import { clearToken, decodeToken, getToken } from './auth';

export default function App() {
  const [token, setTokenState] = useState(getToken());
  const [refreshKey, setRefreshKey] = useState(0);
  const user = decodeToken(token);

  const logout = () => {
    clearToken();
    setTokenState(null);
  };

  return (
    <div className="app">
      <header className="brand">
        <div className="brand-mark">📅</div>
        <h1>Booking</h1>
        <p className="tagline">Availability, slots, and conflict-free bookings.</p>
      </header>

      {!user ? (
        <Auth onAuthed={() => setTokenState(getToken())} />
      ) : (
        <>
          <div className="topbar">
            <span>
              <span className={`badge ${user.role.toLowerCase()}`}>{user.role}</span>
              &nbsp;{user.email}
            </span>
            <button className="link" onClick={logout}>Log out</button>
          </div>

          {user.role === 'PROVIDER'
            ? <ProviderDashboard />
            : <CustomerDashboard onBooked={() => setRefreshKey((k) => k + 1)} />}

          <MyBookings refreshKey={refreshKey} />
        </>
      )}
    </div>
  );
}
