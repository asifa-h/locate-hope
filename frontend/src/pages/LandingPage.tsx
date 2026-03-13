import { Link } from 'react-router-dom';

function LandingPage() {
  return (
    <div className="mx-auto max-w-6xl px-4 py-10">
      <section className="grid gap-10 md:grid-cols-[3fr,2fr] md:items-center">
        <div>
          <p className="inline-flex rounded-full bg-blue-50 px-3 py-1 text-xs font-semibold text-blue-700 ring-1 ring-blue-100">
            Community‑powered rescue
          </p>
          <h1 className="mt-4 text-4xl font-bold tracking-tight text-slate-900 sm:text-5xl">
            See someone in distress.
            <span className="block text-blue-600">Locate hope in seconds.</span>
          </h1>
          <p className="mt-4 max-w-xl text-sm text-slate-600">
            LocateHope turns bystanders into first‑responders. Capture live
            evidence, pin the exact location, and instantly notify nearby NGOs,
            shelters, and community centers.
          </p>
          <div className="mt-6 flex flex-wrap gap-3">
            <Link
              to="/report"
              className="rounded-full bg-blue-600 px-5 py-2 text-sm font-semibold text-white shadow-md shadow-blue-500/30 hover:bg-blue-700"
            >
              Report a case now
            </Link>
            <Link
              to="/register"
              className="rounded-full border border-slate-300 px-4 py-2 text-sm font-semibold text-slate-800 hover:border-blue-400 hover:text-blue-700"
            >
              Join as a citizen
            </Link>
          </div>
          <div className="mt-6 flex flex-wrap gap-4 text-xs text-slate-500">
            <div className="flex items-center gap-2 rounded-full bg-slate-100 px-3 py-1 text-slate-700">
              <span className="flex h-2 w-2 rounded-full bg-emerald-500"></span>
              <span className="font-semibold">Live</span> reports active
            </div>
            <div className="flex items-center gap-2 rounded-full bg-slate-100 px-3 py-1 text-slate-700">
              <span className="flex h-2 w-2 rounded-full bg-blue-500"></span>
              <span className="font-semibold">GPS</span> pinpointing enabled
            </div>
          </div>
        </div>
        <div className="rounded-3xl bg-gradient-to-br from-blue-600 via-emerald-500 to-sky-400 p-[1px] shadow-xl">
          <div className="h-full rounded-[1.4rem] bg-slate-950/95 p-5">
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-emerald-300">
              Live rescue radar
            </p>
            <p className="mt-2 text-sm text-slate-200">
              Nearby shelters, food banks, old age homes, and NGOs around you.
            </p>
            <div className="mt-4 h-64 rounded-2xl bg-slate-900/70 p-3 text-[11px] text-slate-200">
              <div className="flex items-center justify-between">
                <span className="font-semibold text-slate-100">
                  Map preview
                </span>
                <span className="rounded-full bg-emerald-500/20 px-2 py-0.5 text-[10px] font-semibold text-emerald-300">
                  GPS ready
                </span>
              </div>
              <div className="mt-3 grid h-[180px] grid-cols-3 gap-2">
                <div className="col-span-2 rounded-xl bg-gradient-to-br from-sky-500/40 via-blue-500/20 to-emerald-400/10 p-2">
                  <div className="flex items-center justify-between text-[10px] text-slate-100">
                    <span>Your location</span>
                    <span className="rounded-full bg-slate-900/60 px-2 py-0.5 text-[9px]">
                      250m radius
                    </span>
                  </div>
                  <div className="mt-3 grid h-[120px] grid-cols-4 gap-1 text-[8px] text-slate-100">
                    <div className="col-span-2 rounded-lg bg-emerald-500/40 p-1">
                      <p className="font-semibold">Shelter A</p>
                      <p>3 beds free</p>
                    </div>
                    <div className="rounded-lg bg-sky-500/40 p-1">
                      <p className="font-semibold">NGO Hope</p>
                      <p>0.9km</p>
                    </div>
                    <div className="rounded-lg bg-blue-500/40 p-1">
                      <p className="font-semibold">Food Bank</p>
                      <p>Open</p>
                    </div>
                    <div className="rounded-lg bg-emerald-400/40 p-1">
                      <p className="font-semibold">Old Age Home</p>
                      <p>2 spots</p>
                    </div>
                    <div className="col-span-2 rounded-lg bg-slate-900/60 p-1">
                      <p className="font-semibold">Heatmap zone</p>
                      <p>5 reports this week</p>
                    </div>
                  </div>
                </div>
                <div className="flex flex-col justify-between rounded-xl bg-slate-900/60 p-2">
                  <div>
                    <p className="text-[10px] font-semibold text-slate-100">
                      Live stats
                    </p>
                    <p className="mt-2 text-2xl font-bold text-emerald-300">
                      124
                    </p>
                    <p className="text-[10px] text-slate-400">
                      people reached this month
                    </p>
                  </div>
                  <div className="space-y-1 text-[9px] text-slate-300">
                    <p>✔ Verified citizen reports</p>
                    <p>✔ NGO response tracking</p>
                    <p>✔ Secured evidence vault</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section
        id="how-it-works"
        className="mt-14 grid gap-8 rounded-3xl bg-white p-6 shadow-sm md:grid-cols-3"
      >
        <div>
          <h2 className="text-lg font-semibold text-slate-900">
            How LocateHope works
          </h2>
          <p className="mt-2 text-xs text-slate-600">
            A simple 3‑step flow that turns awareness into action.
          </p>
        </div>
        <div className="space-y-4 text-xs text-slate-700">
          <h3 className="font-semibold text-slate-900">
            1. Capture & describe
          </h3>
          <p>
            Use your browser camera to capture live photo or video – no gallery
            uploads – and describe what you see.
          </p>
        </div>
        <div className="space-y-4 text-xs text-slate-700">
          <h3 className="font-semibold text-slate-900">
            2. Locate & notify
          </h3>
          <p>
            LocateHope pins your GPS location and surfaces the closest shelters,
            NGOs, old age homes, and community centers that can respond.
          </p>
        </div>
        <div className="space-y-4 text-xs text-slate-700 md:col-span-3 md:flex md:items-start md:gap-8">
          <div className="mt-4 flex-1 border-t border-dashed border-slate-200 pt-4">
            <h3 className="text-xs font-semibold text-emerald-700">
              3. Resolve & reward
            </h3>
            <p className="mt-1 text-xs text-slate-600">
              Admins verify each case, assign it to NGOs, and track its
              resolution. Verified reports increase your trust score and unlock
              community rewards and sponsor discounts.
            </p>
          </div>
        </div>
      </section>

      <section id="about" className="mt-10 grid gap-8 md:grid-cols-2">
        <div className="rounded-3xl bg-white p-6 shadow-sm">
          <h2 className="text-lg font-semibold text-slate-900">
            Built for cities that care
          </h2>
          <p className="mt-2 text-xs text-slate-600">
            LocateHope bridges the gap between compassionate citizens and
            overwhelmed organizations. Every verified report feeds into a living
            map of vulnerability hotspots, helping NGOs and city agencies plan
            better outreach.
          </p>
          <ul className="mt-4 space-y-2 text-xs text-slate-700">
            <li>• Live map of shelters, NGOs, food banks, and care centers.</li>
            <li>• Case triage for admins with verification workflows.</li>
            <li>• Dashboards for NGOs with capacity tracking and analytics.</li>
            <li>• Gamified rewards for trustworthy citizen reporters.</li>
          </ul>
        </div>
        <div className="rounded-3xl border border-dashed border-emerald-400/60 bg-emerald-50/50 p-6 text-xs text-emerald-900">
          <h3 className="text-sm font-semibold text-emerald-800">
            For NGOs & shelters
          </h3>
          <p className="mt-2">
            Onboard your organization to receive location‑based alerts for
            nearby vulnerable individuals, track your beds and capacity, and
            understand where help is needed most.
          </p>
          <p className="mt-3 text-[11px] text-emerald-800">
            The NGO dashboard gives you incoming cases, evidence media, a
            shelter capacity tracker, and response analytics — all in one place.
          </p>
        </div>
      </section>
    </div>
  );
}

export default LandingPage;

