import { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { getNgoReports, updateNgoReportStatus } from '../lib/api';
import MapView from '../components/MapView';

type NgoStatusFilter = 'pending' | 'in_progress' | 'resolved';

function NgoDashboard() {
  const { token } = useAuth();
  const [status, setStatus] = useState<NgoStatusFilter>('pending');
  const [reports, setReports] = useState<any[]>([]);
  const [selectedReportId, setSelectedReportId] = useState<number | null>(null);
  const [reportAddress, setReportAddress] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const selectedReport = reports.find((r) => r.id === selectedReportId) || null;

  useEffect(() => {
    if (!token) return;
    const authToken = token;
    let cancelled = false;

    async function load() {
      try {
        setLoading(true);
        const res = await getNgoReports(authToken, status);
        if (!cancelled) {
          setReports(res.reports);
          if (res.reports.length && !selectedReportId) {
            setSelectedReportId(res.reports[0].id);
          }
        }
      } catch (err: any) {
        if (!cancelled) setError(err.message || 'Failed to load NGO cases');
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    load();
    return () => {
      cancelled = true;
    };
  }, [token, status, selectedReportId]);

  useEffect(() => {
    if (selectedReport) {
      setReportAddress(null); // Reset address while loading new one
      const fetchAddress = async () => {
        try {
          const res = await fetch(
            `https://nominatim.openstreetmap.org/reverse?format=json&lat=${selectedReport.latitude}&lon=${selectedReport.longitude}&zoom=18`
          );
          const data = await res.json();
          setReportAddress(data.display_name);
        } catch (err) {
          console.error('Error fetching report address', err);
        }
      };
      fetchAddress();
    }
  }, [selectedReport]);

  const handleStatusChange = async (id: number, newStatus: NgoStatusFilter) => {
    if (!token) return;
    const authToken = token;
    try {
      await updateNgoReportStatus(authToken, id, newStatus);
      const res = await getNgoReports(authToken, status);
      setReports(res.reports);
    } catch (err: any) {
      setError(err.message || 'Failed to update status');
    }
  };

  return (
    <div className="mx-auto max-w-6xl px-4 py-8">
      <div className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-xl font-semibold text-slate-900">
            NGO response dashboard
          </h1>
          <p className="mt-1 text-xs text-slate-600">
            See incoming cases around your organization, review evidence, and
            track resolution.
          </p>
        </div>
      </div>

      {error && (
        <p className="mt-4 rounded-xl bg-red-50 px-3 py-2 text-xs text-red-700">
          {error}
        </p>
      )}

      <div className="mt-6 flex gap-2 text-xs">
        {(['pending', 'in_progress', 'resolved'] as NgoStatusFilter[]).map(
          (s) => (
            <button
              key={s}
              type="button"
              onClick={() => setStatus(s)}
              className={`rounded-full px-3 py-1.5 font-semibold ${
                status === s
                  ? 'bg-amber-600 text-white'
                  : 'bg-slate-100 text-slate-700'
              }`}
            >
              {s === 'pending'
                ? 'Pending'
                : s === 'in_progress'
                  ? 'In progress'
                  : 'Resolved'}
            </button>
          ),
        )}
      </div>

      <section className="mt-6 grid gap-6 lg:grid-cols-[2fr,3fr]">
        <div className="rounded-3xl bg-white p-4 shadow-sm text-xs">
          <h2 className="text-sm font-semibold text-slate-900">
            Nearby cases
          </h2>
          <div className="mt-3 max-h-[460px] space-y-2 overflow-y-auto">
            {loading && <p>Loading cases…</p>}
            {reports.map((r) => (
              <button
                key={r.id}
                type="button"
                onClick={() => setSelectedReportId(r.id)}
                className={`w-full rounded-2xl border px-3 py-2 text-left ${
                  r.id === selectedReportId
                    ? 'border-amber-500 bg-amber-50'
                    : 'border-slate-100 bg-slate-50'
                }`}
              >
                <p className="text-xs font-semibold text-slate-900">
                  {r.description}
                </p>
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
              </button>
            ))}
            {!loading && reports.length === 0 && (
              <p className="text-xs text-slate-500">
                No cases in this status yet.
              </p>
            )}
          </div>
        </div>

        <div className="rounded-3xl bg-white p-4 shadow-sm text-xs">
          <h2 className="text-sm font-semibold text-slate-900">
            Case details & map
          </h2>
          {selectedReport ? (
            <div className="mt-3 space-y-3">
              <p className="text-xs font-semibold text-slate-900">
                {selectedReport.description}
              </p>
              <p className="text-[11px] text-slate-500">
                Reporter:
                {' '}
                {selectedReport.user_name}
                {' '}
                •
                {' '}
                {selectedReport.user_phone}
              </p>
              {reportAddress && (
                <p className="rounded-xl bg-amber-50 p-3 text-[11px] font-medium text-amber-900 leading-relaxed shadow-sm shadow-amber-500/5">
                  <span className="block text-[9px] font-bold uppercase tracking-wider text-amber-600 mb-1">Detected Address</span>
                  {reportAddress}
                </p>
              )}
              {selectedReport.notes && (
                <p className="text-[11px] text-slate-600">
                  Notes:
                  {' '}
                  {selectedReport.notes}
                </p>
              )}
              {selectedReport.media_path && (
                <div>
                  <p className="mb-1 text-[11px] font-medium text-slate-700">
                    Evidence media
                  </p>
                  <a
                    href={selectedReport.media_path}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex rounded-full bg-slate-900 px-3 py-1 text-[11px] font-semibold text-white hover:bg-slate-800"
                  >
                    Open in new tab
                  </a>
                </div>
              )}
              <div>
                <p className="mb-1 text-[11px] font-medium text-slate-700">
                  Location on map
                </p>
                <MapView
                  center={[
                    selectedReport.latitude,
                    selectedReport.longitude,
                  ]}
                  organizations={[]}
                  height="260px"
                />
              </div>
              <div className="mt-3 flex gap-2 text-[11px]">
                <button
                  type="button"
                  onClick={() =>
                    handleStatusChange(selectedReport.id, 'in_progress')}
                  className="rounded-full bg-amber-600 px-3 py-1 font-semibold text-white hover:bg-amber-700"
                >
                  Mark in progress
                </button>
                <button
                  type="button"
                  onClick={() =>
                    handleStatusChange(selectedReport.id, 'resolved')}
                  className="rounded-full bg-emerald-600 px-3 py-1 font-semibold text-white hover:bg-emerald-700"
                >
                  Mark resolved
                </button>
              </div>
            </div>
          ) : (
            <p className="mt-3 text-xs text-slate-500">
              Select a case from the left to see details.
            </p>
          )}
        </div>
      </section>
    </div>
  );
}

export default NgoDashboard;

