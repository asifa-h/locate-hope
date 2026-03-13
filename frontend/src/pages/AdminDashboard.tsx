import type { FormEvent } from 'react';
import { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import {
  createOrganization,
  createReward,
  getAdminOrganizations,
  getAdminReports,
  getAdminStats,
  sendReward,
  verifyReport,
} from '../lib/api';
import MapView from '../components/MapView';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  LineChart,
  Line,
} from 'recharts';
import { 
  Users, 
  Building2, 
  FileText, 
  AlertTriangle, 
  TrendingUp, 
  PieChart as PieChartIcon 
} from 'lucide-react';

type Tab = 'cases' | 'organizations' | 'rewards' | 'analysis';

const COLORS = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6'];

function AdminDashboard() {
  const { token } = useAuth();
  const [tab, setTab] = useState<Tab>('cases');
  const [reports, setReports] = useState<any[]>([]);
  const [orgs, setOrgs] = useState<any[]>([]);
  const [stats, setStats] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [newOrg, setNewOrg] = useState({
    name: '',
    category: 'NGO',
    phone: '',
    capacityTotal: '',
    capacityAvailable: '',
    latitude: '',
    longitude: '',
  });

  const [newReward, setNewReward] = useState({
    title: '',
    description: '',
    sponsor: '',
    couponCode: '',
    totalAvailable: '',
  });

  const [rewardUserId, setRewardUserId] = useState('');
  const [selectedRewardId, setSelectedRewardId] = useState<number | null>(null);

  useEffect(() => {
    if (!token) return;
    const authToken = token;
    let cancelled = false;

    async function load() {
      try {
        setLoading(true);
        const [reportRes, orgRes, statsRes] = await Promise.all([
          getAdminReports(authToken),
          getAdminOrganizations(authToken),
          getAdminStats(authToken),
        ]);
        if (cancelled) return;
        setReports(reportRes.reports);
        setOrgs(orgRes.organizations);
        setStats(statsRes);
      } catch (err: any) {
        if (!cancelled) setError(err.message || 'Failed to load admin data');
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    load();
    return () => {
      cancelled = true;
    };
  }, [token]);

  const handleVerify = async (
    id: number,
    verified: boolean,
    assignedNgoId?: number,
  ) => {
    if (!token) return;
    const authToken = token;
    try {
      await verifyReport(authToken, id, { verified, assignedNgoId });
      const updated = await getAdminReports(authToken);
      setReports(updated.reports);
    } catch (err: any) {
      setError(err.message || 'Failed to update report');
    }
  };

  const handleCreateOrg = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!token) return;
    const authToken = token;
    try {
      const payload = {
        ...newOrg,
        capacityTotal: newOrg.capacityTotal
          ? Number(newOrg.capacityTotal)
          : undefined,
        capacityAvailable: newOrg.capacityAvailable
          ? Number(newOrg.capacityAvailable)
          : undefined,
        latitude: Number(newOrg.latitude),
        longitude: Number(newOrg.longitude),
      };
      await createOrganization(authToken, payload);
      const res = await getAdminOrganizations(authToken);
      setOrgs(res.organizations);
      setNewOrg({
        name: '',
        category: 'NGO',
        phone: '',
        capacityTotal: '',
        capacityAvailable: '',
        latitude: '',
        longitude: '',
      });
    } catch (err: any) {
      setError(err.message || 'Failed to create organization');
    }
  };

  const handleCreateReward = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!token) return;
    const authToken = token;
    try {
      const payload = {
        title: newReward.title,
        description: newReward.description || undefined,
        sponsor: newReward.sponsor || undefined,
        couponCode: newReward.couponCode || undefined,
        totalAvailable: newReward.totalAvailable
          ? Number(newReward.totalAvailable)
          : undefined,
      };
      const res = await createReward(authToken, payload);
      setSelectedRewardId(res.reward.id);
      setNewReward({
        title: '',
        description: '',
        sponsor: '',
        couponCode: '',
        totalAvailable: '',
      });
    } catch (err: any) {
      setError(err.message || 'Failed to create reward');
    }
  };

  const handleSendReward = async () => {
    if (!token || !selectedRewardId || !rewardUserId) return;
    const authToken = token;
    try {
      await sendReward(authToken, selectedRewardId, {
        userId: Number(rewardUserId),
      });
      setRewardUserId('');
    } catch (err: any) {
      setError(err.message || 'Failed to send reward');
    }
  };

  return (
    <div className="mx-auto max-w-6xl px-4 py-8">
      <div className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-xl font-semibold text-slate-900">
            Admin control center
          </h1>
          <p className="mt-1 text-xs text-slate-600">
            Verify reports, manage NGOs & shelters, and orchestrate rewards.
          </p>
        </div>
      </div>

      {error && (
        <p className="mt-4 rounded-xl bg-red-50 px-3 py-2 text-xs text-red-700">
          {error}
        </p>
      )}

      <div className="mt-6 flex gap-2 text-xs">
        <button
          type="button"
          onClick={() => setTab('cases')}
          className={`rounded-full px-3 py-1.5 font-semibold ${
            tab === 'cases'
              ? 'bg-blue-600 text-white'
              : 'bg-slate-100 text-slate-700'
          }`}
        >
          Case management
        </button>
        <button
          type="button"
          onClick={() => setTab('organizations')}
          className={`rounded-full px-3 py-1.5 font-semibold ${
            tab === 'organizations'
              ? 'bg-blue-600 text-white'
              : 'bg-slate-100 text-slate-700'
          }`}
        >
          NGOs & shelters
        </button>
        <button
          type="button"
          onClick={() => setTab('rewards')}
          className={`rounded-full px-3 py-1.5 font-semibold ${
            tab === 'rewards'
              ? 'bg-blue-600 text-white'
              : 'bg-slate-100 text-slate-700'
          }`}
        >
          Rewards
        </button>
        <button
          type="button"
          onClick={() => setTab('analysis')}
          className={`rounded-full px-3 py-1.5 font-semibold ${
            tab === 'analysis'
              ? 'bg-blue-600 text-white'
              : 'bg-slate-100 text-slate-700'
          }`}
        >
          Data Analysis
        </button>
      </div>

      {tab === 'cases' && (
        <section className="mt-6 rounded-3xl bg-white p-4 shadow-sm">
          <h2 className="text-sm font-semibold text-slate-900">
            Incoming reports
          </h2>
          <p className="mt-1 text-[11px] text-slate-500">
            Review evidence, verify authenticity, assign to NGOs, and update
            user trust scores.
          </p>
          <div className="mt-3 space-y-2 text-xs text-slate-700">
            {loading && <p>Loading reports…</p>}
            {reports.map((r) => (
              <div
                key={r.id}
                className="rounded-2xl border border-slate-100 bg-slate-50 p-3"
              >
                <div className="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
                  <div>
                    <p className="text-xs font-semibold text-slate-900">
                      {r.description}
                    </p>
                    <p className="mt-1 text-[11px] text-slate-500">
                      By:
                      {' '}
                      <span className="font-semibold">
                        {r.user_name}
                      </span>
                      {' '}
                      •
                      {' '}
                      {r.user_email}
                      {' '}
                      •
                      {' '}
                      {new Date(r.created_at).toLocaleString()}
                    </p>
                    <p className="mt-1 text-[11px] text-slate-500">
                      Urgency:
                      {' '}
                      <span className="font-semibold uppercase">
                        {r.urgency}
                      </span>
                      {r.notes && ` • Notes: ${r.notes}`}
                    </p>
                    {r.media_path && (
                      <p className="mt-1 text-[11px]">
                        Evidence:
                        {' '}
                        <a
                          href={r.media_path}
                          target="_blank"
                          rel="noreferrer"
                          className="font-semibold text-blue-600 hover:text-blue-700"
                        >
                          View media
                        </a>
                      </p>
                    )}
                  </div>
                  <div className="flex flex-col items-start gap-2 sm:items-end">
                    <span className="rounded-full bg-slate-900 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-white">
                      {r.status}
                    </span>
                    <div className="flex flex-wrap gap-2 text-[11px]">
                      <button
                        type="button"
                        onClick={() => handleVerify(r.id, true)}
                        className="rounded-full bg-emerald-500 px-3 py-1 font-semibold text-white hover:bg-emerald-600"
                      >
                        Approve
                      </button>
                      <button
                        type="button"
                        onClick={() =>
                          handleVerify(
                            r.id,
                            true,
                            orgs.length ? orgs[0].id : undefined,
                          )}
                        className="rounded-full bg-blue-500 px-3 py-1 font-semibold text-white hover:bg-blue-600"
                      >
                        Approve & assign
                      </button>
                      <button
                        type="button"
                        onClick={() => handleVerify(r.id, false)}
                        className="rounded-full bg-red-500 px-3 py-1 font-semibold text-white hover:bg-red-600"
                      >
                        Reject
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
            {!loading && reports.length === 0 && (
              <p className="text-xs text-slate-500">
                No reports yet. New citizen reports will appear here for
                verification.
              </p>
            )}
          </div>
        </section>
      )}

      {tab === 'organizations' && (
        <section className="mt-6 grid gap-6 lg:grid-cols-[2fr,3fr]">
          <form
            onSubmit={handleCreateOrg}
            className="rounded-3xl bg-white p-4 shadow-sm text-xs"
          >
            <h2 className="text-sm font-semibold text-slate-900">
              Add NGO or shelter
            </h2>
            <p className="mt-1 text-[11px] text-slate-500">
              Onboard organizations to appear on the citizen map and receive
              alerts.
            </p>
            <div className="mt-3 space-y-3">
              <div>
                <label className="mb-1 block text-[11px] font-medium text-slate-700">
                  Name
                </label>
                <input
                  required
                  value={newOrg.name}
                  onChange={(e) =>
                    setNewOrg({ ...newOrg, name: e.target.value })}
                  className="w-full rounded-xl border border-slate-200 px-3 py-2 text-xs"
                />
              </div>
              <div>
                <label className="mb-1 block text-[11px] font-medium text-slate-700">
                  Category
                </label>
                <select
                  value={newOrg.category}
                  onChange={(e) =>
                    setNewOrg({ ...newOrg, category: e.target.value })}
                  className="w-full rounded-xl border border-slate-200 px-3 py-2 text-xs"
                >
                  <option value="NGO">NGO</option>
                  <option value="Shelter">Shelter</option>
                  <option value="OldAgeHome">Old age home</option>
                  <option value="RehabCenter">Rehab center</option>
                  <option value="FoodBank">Food bank</option>
                  <option value="CommunityCenter">Community center</option>
                </select>
              </div>
              <div>
                <label className="mb-1 block text-[11px] font-medium text-slate-700">
                  Phone
                </label>
                <input
                  value={newOrg.phone}
                  onChange={(e) =>
                    setNewOrg({ ...newOrg, phone: e.target.value })}
                  className="w-full rounded-xl border border-slate-200 px-3 py-2 text-xs"
                />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="mb-1 block text-[11px] font-medium text-slate-700">
                    Total capacity
                  </label>
                  <input
                    type="number"
                    value={newOrg.capacityTotal}
                    onChange={(e) =>
                      setNewOrg({
                        ...newOrg,
                        capacityTotal: e.target.value,
                      })}
                    className="w-full rounded-xl border border-slate-200 px-3 py-2 text-xs"
                  />
                </div>
                <div>
                  <label className="mb-1 block text-[11px] font-medium text-slate-700">
                    Available
                  </label>
                  <input
                    type="number"
                    value={newOrg.capacityAvailable}
                    onChange={(e) =>
                      setNewOrg({
                        ...newOrg,
                        capacityAvailable: e.target.value,
                      })}
                    className="w-full rounded-xl border border-slate-200 px-3 py-2 text-xs"
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="mb-1 block text-[11px] font-medium text-slate-700">
                    Latitude
                  </label>
                  <input
                    required
                    value={newOrg.latitude}
                    onChange={(e) =>
                      setNewOrg({
                        ...newOrg,
                        latitude: e.target.value,
                      })}
                    className="w-full rounded-xl border border-slate-200 px-3 py-2 text-xs"
                  />
                </div>
                <div>
                  <label className="mb-1 block text-[11px] font-medium text-slate-700">
                    Longitude
                  </label>
                  <input
                    required
                    value={newOrg.longitude}
                    onChange={(e) =>
                      setNewOrg({
                        ...newOrg,
                        longitude: e.target.value,
                      })}
                    className="w-full rounded-xl border border-slate-200 px-3 py-2 text-xs"
                  />
                </div>
              </div>
              {newOrg.latitude && newOrg.longitude && (
                <div className="mt-2">
                  <p className="mb-1 text-[11px] font-medium text-slate-700">Location Preview</p>
                  <MapView 
                    center={[Number(newOrg.latitude), Number(newOrg.longitude)]} 
                    organizations={[]} 
                    height="150px" 
                  />
                </div>
              )}
              <button
                type="submit"
                className="mt-1 w-full rounded-full bg-blue-600 px-4 py-2 text-xs font-semibold text-white hover:bg-blue-700"
              >
                Save organization
              </button>
            </div>
          </form>

          <div className="rounded-3xl bg-white p-4 shadow-sm text-xs">
            <h2 className="text-sm font-semibold text-slate-900">
              Registered organizations
            </h2>
            <div className="mt-3 max-h-[420px] space-y-2 overflow-y-auto">
              {orgs.map((o) => (
                <div
                  key={o.id}
                  className="rounded-2xl border border-slate-100 bg-slate-50 p-3"
                >
                  <p className="text-xs font-semibold text-slate-900">
                    {o.name}
                    {' '}
                    <span className="ml-2 rounded-full bg-slate-900 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-white">
                      {o.category}
                    </span>
                  </p>
                  <p className="mt-1 text-[11px] text-slate-600">
                    Phone:
                    {' '}
                    {o.phone || 'N/A'}
                  </p>
                  <p className="mt-1 text-[11px] text-slate-600">
                    Capacity:
                    {' '}
                    {o.capacity_available}
                    /
                    {o.capacity_total}
                  </p>
                  <p className="mt-1 text-[11px] text-slate-600">
                    Location:
                    {' '}
                    {o.latitude.toFixed(4)}
                    ,
                    {' '}
                    {o.longitude.toFixed(4)}
                  </p>
                </div>
              ))}
              {orgs.length === 0 && (
                <p className="text-xs text-slate-500">
                  No organizations yet. Add NGOs, shelters, and food banks to
                  power the map.
                </p>
              )}
            </div>
          </div>
        </section>
      )}

      {tab === 'analysis' && stats && (
        <section className="mt-6 space-y-6">
          {/* Top Summary Cards */}
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <div className="flex items-center gap-4 rounded-3xl bg-white p-6 shadow-sm">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-blue-100 text-blue-600">
                <Users size={24} />
              </div>
              <div>
                <p className="text-xs font-medium text-slate-500">Total Users</p>
                <p className="text-2xl font-bold text-slate-900">{stats.totalUsers}</p>
              </div>
            </div>
            <div className="flex items-center gap-4 rounded-3xl bg-white p-6 shadow-sm">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-emerald-100 text-emerald-600">
                <Building2 size={24} />
              </div>
              <div>
                <p className="text-xs font-medium text-slate-500">Active NGOs</p>
                <p className="text-2xl font-bold text-slate-900">{stats.totalNgos}</p>
              </div>
            </div>
            <div className="flex items-center gap-4 rounded-3xl bg-white p-6 shadow-sm">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-amber-100 text-amber-600">
                <FileText size={24} />
              </div>
              <div>
                <p className="text-xs font-medium text-slate-500">Total Reports</p>
                <p className="text-2xl font-bold text-slate-900">
                  {stats.reportsByStatus.reduce((acc: number, curr: any) => acc + curr.count, 0)}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-4 rounded-3xl bg-white p-6 shadow-sm">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-red-100 text-red-600">
                <AlertTriangle size={24} />
              </div>
              <div>
                <p className="text-xs font-medium text-slate-500">Emergency</p>
                <p className="text-2xl font-bold text-slate-900">
                  {stats.reportsByUrgency.find((u: any) => u.urgency === 'emergency')?.count || 0}
                </p>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
            {/* Reports by Status - Bar Chart */}
            <div className="rounded-3xl bg-white p-6 shadow-sm">
              <div className="mb-6 flex items-center gap-2">
                <TrendingUp size={18} className="text-slate-400" />
                <h3 className="text-sm font-semibold text-slate-900">Reports by Status</h3>
              </div>
              <div className="h-64 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={stats.reportsByStatus}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                    <XAxis 
                      dataKey="status" 
                      axisLine={false} 
                      tickLine={false} 
                      tick={{ fontSize: 10, fill: '#64748b' }}
                      textAnchor="middle"
                    />
                    <YAxis 
                      axisLine={false} 
                      tickLine={false} 
                      tick={{ fontSize: 10, fill: '#64748b' }}
                    />
                    <Tooltip 
                      contentStyle={{ 
                        borderRadius: '12px', 
                        border: 'none', 
                        boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)',
                        fontSize: '11px'
                      }} 
                    />
                    <Bar dataKey="count" radius={[6, 6, 0, 0]} fill="#3b82f6" barSize={40} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Reports by Urgency - Pie Chart */}
            <div className="rounded-3xl bg-white p-6 shadow-sm">
              <div className="mb-6 flex items-center gap-2">
                <PieChartIcon size={18} className="text-slate-400" />
                <h3 className="text-sm font-semibold text-slate-900">Urgency Distribution</h3>
              </div>
              <div className="h-64 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={stats.reportsByUrgency}
                      cx="50%"
                      cy="50%"
                      innerRadius={60}
                      outerRadius={80}
                      paddingAngle={5}
                      dataKey="count"
                      nameKey="urgency"
                    >
                      {stats.reportsByUrgency.map((_entry: any, index: number) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip 
                      contentStyle={{ 
                        borderRadius: '12px', 
                        border: 'none', 
                        boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)',
                        fontSize: '11px'
                      }} 
                    />
                  </PieChart>
                </ResponsiveContainer>
              </div>
              <div className="mt-4 flex flex-wrap justify-center gap-4">
                {stats.reportsByUrgency.map((entry: any, index: number) => (
                  <div key={entry.urgency} className="flex items-center gap-2">
                    <div className="h-2 w-2 rounded-full" style={{ backgroundColor: COLORS[index % COLORS.length] }} />
                    <span className="text-[10px] font-medium text-slate-600 uppercase">{entry.urgency}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Daily Reports Trend - Line Chart */}
            <div className="lg:col-span-2 rounded-3xl bg-white p-6 shadow-sm">
              <div className="mb-6 flex items-center gap-2">
                <TrendingUp size={18} className="text-slate-400" />
                <h3 className="text-sm font-semibold text-slate-900">7-Day Reporting Trend</h3>
              </div>
              <div className="h-64 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={[...stats.dailyReports].reverse()}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                    <XAxis 
                      dataKey="date" 
                      axisLine={false} 
                      tickLine={false} 
                      tick={{ fontSize: 10, fill: '#64748b' }}
                    />
                    <YAxis 
                      axisLine={false} 
                      tickLine={false} 
                      tick={{ fontSize: 10, fill: '#64748b' }}
                    />
                    <Tooltip 
                      contentStyle={{ 
                        borderRadius: '12px', 
                        border: 'none', 
                        boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)',
                        fontSize: '11px'
                      }} 
                    />
                    <Line 
                      type="monotone" 
                      dataKey="count" 
                      stroke="#3b82f6" 
                      strokeWidth={3} 
                      dot={{ r: 4, fill: '#3b82f6', strokeWidth: 2, stroke: '#fff' }}
                      activeDot={{ r: 6, strokeWidth: 0 }}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>
        </section>
      )}

      {tab === 'rewards' && (
        <section className="mt-6 grid gap-6 lg:grid-cols-[2fr,3fr]">
          <form
            onSubmit={handleCreateReward}
            className="rounded-3xl bg-white p-4 shadow-sm text-xs"
          >
            <h2 className="text-sm font-semibold text-slate-900">
              Create reward or coupon
            </h2>
            <p className="mt-1 text-[11px] text-slate-500">
              Add sponsor rewards that can be sent to trusted community
              reporters.
            </p>
            <div className="mt-3 space-y-3">
              <div>
                <label className="mb-1 block text-[11px] font-medium text-slate-700">
                  Title
                </label>
                <input
                  required
                  value={newReward.title}
                  onChange={(e) =>
                    setNewReward({ ...newReward, title: e.target.value })}
                  className="w-full rounded-xl border border-slate-200 px-3 py-2 text-xs"
                />
              </div>
              <div>
                <label className="mb-1 block text-[11px] font-medium text-slate-700">
                  Description
                </label>
                <textarea
                  rows={3}
                  value={newReward.description}
                  onChange={(e) =>
                    setNewReward({
                      ...newReward,
                      description: e.target.value,
                    })}
                  className="w-full rounded-xl border border-slate-200 px-3 py-2 text-xs"
                />
              </div>
              <div>
                <label className="mb-1 block text-[11px] font-medium text-slate-700">
                  Sponsor
                </label>
                <input
                  value={newReward.sponsor}
                  onChange={(e) =>
                    setNewReward({ ...newReward, sponsor: e.target.value })}
                  className="w-full rounded-xl border border-slate-200 px-3 py-2 text-xs"
                />
              </div>
              <div>
                <label className="mb-1 block text-[11px] font-medium text-slate-700">
                  Coupon code (optional)
                </label>
                <input
                  value={newReward.couponCode}
                  onChange={(e) =>
                    setNewReward({
                      ...newReward,
                      couponCode: e.target.value,
                    })}
                  className="w-full rounded-xl border border-slate-200 px-3 py-2 text-xs"
                />
              </div>
              <div>
                <label className="mb-1 block text-[11px] font-medium text-slate-700">
                  Total available (optional)
                </label>
                <input
                  type="number"
                  value={newReward.totalAvailable}
                  onChange={(e) =>
                    setNewReward({
                      ...newReward,
                      totalAvailable: e.target.value,
                    })}
                  className="w-full rounded-xl border border-slate-200 px-3 py-2 text-xs"
                />
              </div>
              <button
                type="submit"
                className="mt-1 w-full rounded-full bg-emerald-600 px-4 py-2 text-xs font-semibold text-white hover:bg-emerald-700"
              >
                Save reward
              </button>
            </div>
          </form>

          <div className="rounded-3xl bg-white p-4 shadow-sm text-xs">
            <h2 className="text-sm font-semibold text-slate-900">
              Send reward to user
            </h2>
            <p className="mt-1 text-[11px] text-slate-500">
              Pick a reward you just created and grant it to a verified user by
              their user ID.
            </p>
            <div className="mt-3 space-y-3">
              <div>
                <label className="mb-1 block text-[11px] font-medium text-slate-700">
                  Reward ID
                </label>
                <input
                  type="number"
                  value={selectedRewardId ?? ''}
                  onChange={(e) =>
                    setSelectedRewardId(
                      e.target.value ? Number(e.target.value) : null,
                    )}
                  className="w-full rounded-xl border border-slate-200 px-3 py-2 text-xs"
                />
              </div>
              <div>
                <label className="mb-1 block text-[11px] font-medium text-slate-700">
                  User ID
                </label>
                <input
                  type="number"
                  value={rewardUserId}
                  onChange={(e) => setRewardUserId(e.target.value)}
                  className="w-full rounded-xl border border-slate-200 px-3 py-2 text-xs"
                />
              </div>
              <button
                type="button"
                onClick={handleSendReward}
                className="mt-1 w-full rounded-full bg-blue-600 px-4 py-2 text-xs font-semibold text-white hover:bg-blue-700"
              >
                Send reward
              </button>
              <p className="mt-1 text-[11px] text-slate-500">
                The user will receive a thank‑you note along with any coupon
                details in their dashboard.
              </p>
            </div>
          </div>
        </section>
      )}
    </div>
  );
}

export default AdminDashboard;

