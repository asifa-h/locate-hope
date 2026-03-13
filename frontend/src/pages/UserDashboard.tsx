import { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import {
  getNearbyOrganizations,
  getUserDashboard,
  getUserReports,
} from '../lib/api';
import MapView from '../components/MapView';

type CategoryFilter =
  | 'all'
  | 'NGO'
  | 'Shelter'
  | 'OldAgeHome'
  | 'RehabCenter'
  | 'FoodBank'
  | 'CommunityCenter';

function UserDashboard() {
  const { token, user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [stats, setStats] = useState<{
    total_reports: number;
    verified_reports: number;
    trust_score: number;
  } | null>(null);
  const [rewards, setRewards] = useState<any[]>([]);
  const [reports, setReports] = useState<any[]>([]);
  const [location, setLocation] = useState<[number, number] | null>(null);
  const [altitude, setAltitude] = useState<number | null>(null);
  const [address, setAddress] = useState<string | null>(null);
  const [orgs, setOrgs] = useState<any[]>([]);
  const [isRefreshingLocation, setIsRefreshingLocation] = useState(false);

  const refreshLocation = () => {
    if (!navigator.geolocation) return;
    setIsRefreshingLocation(true);
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const coords: [number, number] = [pos.coords.latitude, pos.coords.longitude];
        setLocation(coords);
        setAltitude(pos.coords.altitude);
        setIsRefreshingLocation(false);
      },
      (err) => {
        console.error('Manual location refresh error', err);
        setIsRefreshingLocation(false);
      },
      { enableHighAccuracy: true, timeout: 10000 }
    );
  };
  const [category, setCategory] = useState<CategoryFilter>('all');

  useEffect(() => {
    if (!token) return;
    const authToken = token;
    let cancelled = false;

    async function load() {
      try {
        setLoading(true);
        const [dashboard, reportList] = await Promise.all([
          getUserDashboard(authToken),
          getUserReports(authToken),
        ]);

        if (cancelled) return;

        setStats({
          total_reports: dashboard.user.total_reports,
          verified_reports: dashboard.user.verified_reports,
          trust_score: dashboard.user.trust_score,
        });
        setRewards(dashboard.rewards);
        setReports(reportList.reports);
      } catch (err: any) {
        if (!cancelled) setError(err.message || 'Failed to load dashboard');
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    load();

    return () => {
      cancelled = true;
    };
  }, [token]);

  useEffect(() => {
    if (!token) return;

    const fetchAddress = async (lat: number, lon: number) => {
      try {
        const response = await fetch(
          `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lon}&zoom=18&addressdetails=1`
        );
        const data = await response.json();
        setAddress(data.display_name);
      } catch (err) {
        console.error('Error reverse geocoding', err);
      }
    };

    if (!navigator.geolocation) {
      const fallback: [number, number] = [13.0827, 80.2707]; // Chennai, Tamil Nadu
      setLocation(fallback);
      fetchAddress(fallback[0], fallback[1]);
      return;
    }

    // Wake up GPS
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const coords: [number, number] = [pos.coords.latitude, pos.coords.longitude];
        setLocation(coords);
        setAltitude(pos.coords.altitude);
        fetchAddress(coords[0], coords[1]);
        getNearbyOrganizations(token, coords[0], coords[1]).then(res => setOrgs(res.organizations));
      },
      () => {},
      { enableHighAccuracy: true, timeout: 5000 }
    );

    const watchId = navigator.geolocation.watchPosition(
      (pos) => {
        const coords: [number, number] = [pos.coords.latitude, pos.coords.longitude];
        setLocation(coords);
        setAltitude(pos.coords.altitude);
        fetchAddress(coords[0], coords[1]);

        getNearbyOrganizations(token, coords[0], coords[1]).then(
          (res) => {
            setOrgs(res.organizations);
          },
        );
      },
      (err) => {
        console.error('Geolocation error', err);
        if (!location) {
          const fallback: [number, number] = [13.0827, 80.2707]; // Chennai, Tamil Nadu
          setLocation(fallback);
          fetchAddress(fallback[0], fallback[1]);
          getNearbyOrganizations(token, fallback[0], fallback[1]).then(
            (res) => {
              setOrgs(res.organizations);
            },
          );
        }
      },
      { enableHighAccuracy: true, maximumAge: 0, timeout: 10000 },
    );

    return () => navigator.geolocation.clearWatch(watchId);
  }, [token, location]);

  const filteredOrgs =
    category === 'all'
      ? orgs
      : orgs.filter((o) => o.category === category);

  return (
    <div className="mx-auto max-w-6xl px-4 py-8">
      <div className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-xl font-semibold text-slate-900">
            Hi
            {' '}
            {user?.name || 'citizen'}
            ,
          </h1>
          <p className="mt-1 text-xs text-slate-600">
            Track your reports, trust score, and rewards — and see help centers
            around you.
          </p>
          {address && (
            <div className="mt-3 flex flex-col gap-1 rounded-2xl bg-blue-50 p-4 shadow-sm shadow-blue-500/5 md:mt-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="h-2 w-2 animate-pulse rounded-full bg-blue-500"></div>
                  <p className="text-[10px] font-bold uppercase tracking-wider text-blue-600">Current Location Detected</p>
                </div>
                <button
                  type="button"
                  onClick={refreshLocation}
                  disabled={isRefreshingLocation}
                  className="text-[10px] font-bold text-blue-600 hover:text-blue-700 disabled:opacity-50"
                >
                  {isRefreshingLocation ? 'Refreshing…' : 'Refresh'}
                </button>
              </div>
              <p className="text-xs font-semibold text-slate-900 leading-relaxed">
                {address}
              </p>
              {altitude !== null && (
                <p className="text-[10px] font-medium text-slate-500">
                  Altitude: <span className="text-slate-700">{altitude.toFixed(2)} meters</span> above sea level
                </p>
              )}
            </div>
          )}
        </div>
      </div>

      {error && (
        <p className="mt-4 rounded-xl bg-red-50 px-3 py-2 text-xs text-red-700">
          {error}
        </p>
      )}

      <section className="mt-6 grid gap-4 md:grid-cols-3">
        <div className="rounded-2xl bg-white p-4 shadow-sm">
          <p className="text-xs font-medium text-slate-600">Total reports</p>
          <p className="mt-2 text-3xl font-semibold text-slate-900">
            {stats?.total_reports ?? (loading ? '…' : 0)}
          </p>
          <p className="mt-1 text-[11px] text-slate-500">
            Every verified report brings help closer to someone in need.
          </p>
        </div>
        <div className="rounded-2xl bg-white p-4 shadow-sm">
          <p className="text-xs font-medium text-slate-600">
            Verified reports
          </p>
          <p className="mt-2 text-3xl font-semibold text-emerald-600">
            {stats?.verified_reports ?? (loading ? '…' : 0)}
          </p>
          <p className="mt-1 text-[11px] text-slate-500">
            Verified by admins to prevent misuse and build trust.
          </p>
        </div>
        <div className="rounded-2xl bg-gradient-to-br from-blue-600 to-emerald-500 p-4 text-white shadow-sm">
          <p className="text-xs font-medium">Trust score</p>
          <p className="mt-2 text-3xl font-semibold">
            {stats?.trust_score ?? (loading ? '…' : 0)}
          </p>
          <p className="mt-1 text-[11px] text-blue-50">
            Higher trust unlocks badges and sponsor rewards.
          </p>
        </div>
      </section>

      <section className="mt-8 grid gap-6 lg:grid-cols-[3fr,2fr]">
        <div>
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-semibold text-slate-900">
              Nearby help centers
            </h2>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value as CategoryFilter)}
              className="rounded-full border border-slate-200 bg-white px-3 py-1 text-[11px] text-slate-700"
            >
              <option value="all">All categories</option>
              <option value="NGO">NGOs</option>
              <option value="Shelter">Shelters</option>
              <option value="OldAgeHome">Old age homes</option>
              <option value="RehabCenter">Rehab centers</option>
              <option value="FoodBank">Food banks</option>
              <option value="CommunityCenter">Community centers</option>
            </select>
          </div>
          <div className="mt-3">
            <MapView center={location} organizations={filteredOrgs} />
          </div>
        </div>
        <div className="space-y-4">
          <div className="rounded-2xl bg-white p-4 shadow-sm">
            <h2 className="text-sm font-semibold text-slate-900">
              Your latest reports
            </h2>
            <div className="mt-3 space-y-2 text-xs text-slate-700">
              {reports.slice(0, 5).map((r) => (
                <div
                  key={r.id}
                  className="rounded-xl border border-slate-100 bg-slate-50 px-3 py-2"
                >
                  <div className="flex items-center justify-between">
                    <p className="line-clamp-1 font-medium">
                      {r.description}
                    </p>
                    <span className="ml-2 rounded-full bg-slate-900 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-white">
                      {r.status}
                    </span>
                  </div>
                  <p className="mt-1 text-[11px] text-slate-500">
                    Urgency:
                    {' '}
                    <span className="font-semibold uppercase">
                      {r.urgency}
                    </span>
                    {' '}
                    •
                    {' '}
                    {new Date(r.created_at).toLocaleString()}
                  </p>
                </div>
              ))}
              {reports.length === 0 && !loading && (
                <p className="text-xs text-slate-500">
                  No reports yet. When you see someone in distress, use{' '}
                  <span className="font-semibold text-blue-600">
                    “Report a case”
                  </span>
                  {' '}
                  to alert nearby help centers.
                </p>
              )}
            </div>
          </div>
          <div className="rounded-2xl bg-white p-4 shadow-sm">
            <h2 className="text-sm font-semibold text-slate-900">
              Rewards & badges
            </h2>
            <div className="mt-3 space-y-2 text-xs text-slate-700">
              {rewards.slice(0, 4).map((r) => (
                <div
                  key={r.id}
                  className="rounded-xl border border-emerald-100 bg-emerald-50 px-3 py-2"
                >
                  <p className="text-xs font-semibold text-emerald-900">
                    {r.title}
                  </p>
                  {r.sponsor && (
                    <p className="text-[11px] text-emerald-800">
                      Sponsor:
                      {' '}
                      {r.sponsor}
                    </p>
                  )}
                  {r.coupon_code && (
                    <p className="mt-1 text-[11px] font-mono text-emerald-900">
                      Code:
                      {' '}
                      {r.coupon_code}
                    </p>
                  )}
                  <p className="mt-1 text-[11px] text-emerald-800">
                    {r.note}
                  </p>
                </div>
              ))}
              {rewards.length === 0 && (
                <p className="text-xs text-slate-500">
                  When admins verify your reports, you&apos;ll start receiving
                  thank‑you notes, badges, and partner discounts here.
                </p>
              )}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

export default UserDashboard;

