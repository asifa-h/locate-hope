import type { FormEvent } from 'react';
import {
  useEffect,
  useRef,
  useState,
} from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { submitReport } from '../lib/api';

type Urgency = 'low' | 'medium' | 'emergency';

function ReportPage() {
  const { token } = useAuth();
  const navigate = useNavigate();
  const [description, setDescription] = useState('');
  const [urgency, setUrgency] = useState<Urgency>('medium');
  const [notes, setNotes] = useState('');
  const [location, setLocation] = useState<[number, number] | null>(null);
  const [altitude, setAltitude] = useState<number | null>(null);
  const [address, setAddress] = useState<string | null>(null);
  const [locError, setLocError] = useState<string | null>(null);

  const videoRef = useRef<HTMLVideoElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [stream, setStream] = useState<MediaStream | null>(null);
  const [capturedBlob, setCapturedBlob] = useState<Blob | null>(null);
  const [capturedPreview, setCapturedPreview] = useState<string | null>(null);
  const [cameraError, setCameraError] = useState<string | null>(null);
  const [startingCamera, setStartingCamera] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
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
        setLocError(null);
      },
      (err) => {
        console.error('Manual location refresh error', err);
        setLocError('Could not refresh precise location. Please check your GPS settings.');
        setIsRefreshingLocation(false);
      },
      { enableHighAccuracy: true, timeout: 10000 }
    );
  };

  useEffect(() => {
    if (!navigator.geolocation) {
      setLocError('Geolocation is not available in this browser.');
      return;
    }

    const fetchAddress = async (lat: number, lon: number) => {
      try {
        const response = await fetch(
          `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lon}&zoom=18`
        );
        const data = await response.json();
        setAddress(data.display_name);
      } catch (err) {
        console.error('Error fetching address', err);
      }
    };

    // Use a higher precision request first to wake up the GPS
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const coords: [number, number] = [pos.coords.latitude, pos.coords.longitude];
        setLocation(coords);
        setAltitude(pos.coords.altitude);
        fetchAddress(coords[0], coords[1]);
      },
      () => {}, // Ignore initial error, watchPosition will handle it
      { enableHighAccuracy: true, timeout: 5000 }
    );

    const watchId = navigator.geolocation.watchPosition(
      (pos) => {
        const coords: [number, number] = [pos.coords.latitude, pos.coords.longitude];
        setLocation(coords);
        setAltitude(pos.coords.altitude);
        fetchAddress(coords[0], coords[1]);
        setLocError(null); // Clear error if we get a position
      },
      (err) => {
        console.error('Location error', err);
        if (!location) { // Only fallback if we don't have ANY location yet
          const fallback: [number, number] = [13.0827, 80.2707]; // Chennai, Tamil Nadu
          setLocation(fallback);
          fetchAddress(fallback[0], fallback[1]);
          setLocError('Could not access precise GPS. Using Tamil Nadu fallback.');
        }
      },
      { 
        enableHighAccuracy: true, 
        maximumAge: 0, // Force fresh location
        timeout: 10000 
      },
    );

    return () => navigator.geolocation.clearWatch(watchId);
  }, [location]);

  const startCamera = async () => {
    setCameraError(null);
    setCapturedBlob(null);
    setCapturedPreview(null);
    setStartingCamera(true);
    try {
      const mediaStream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: 'environment' },
        audio: false,
      });
      setStream(mediaStream);
      if (videoRef.current) {
        videoRef.current.srcObject = mediaStream;
      }
    } catch (err) {
      console.error('Camera error', err);
      setCameraError(
        'Could not access camera. Please allow camera permissions in your browser.',
      );
    } finally {
      setStartingCamera(false);
    }
  };

  const stopCamera = () => {
    stream?.getTracks().forEach((t) => t.stop());
    setStream(null);
    if (videoRef.current) {
      videoRef.current.srcObject = null;
    }
  };

  const captureFrame = () => {
    if (!videoRef.current || !canvasRef.current) return;
    const video = videoRef.current;
    const canvas = canvasRef.current;
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
    canvas.toBlob(
      (blob) => {
        if (blob) {
          setCapturedBlob(blob);
          setCapturedPreview(URL.createObjectURL(blob));
          stopCamera();
        }
      },
      'image/jpeg',
      0.85,
    );
  };

  useEffect(() => {
    return () => {
      stopCamera();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!token) return;
    if (!location) {
      setSubmitError('Location is required. Please allow GPS access.');
      return;
    }
    if (!capturedBlob) {
      setSubmitError('Please capture photo evidence using the camera.');
      return;
    }
    setSubmitError(null);
    setSubmitting(true);
    try {
      // Validate location before sending
      if (location[0] === 0 && location[1] === 0) {
        throw new Error('Invalid location data. Please ensure GPS is active.');
      }

      const formData = new FormData();
      formData.append('description', description);
      formData.append('urgency', urgency);
      if (notes) formData.append('notes', notes);
      formData.append('latitude', String(location[0]));
      formData.append('longitude', String(location[1]));
      
      // Ensure media is a valid Blob/File
      if (!(capturedBlob instanceof Blob)) {
        throw new Error('Evidence photo is missing or invalid.');
      }
      formData.append('media', capturedBlob, 'evidence.jpg');

      await submitReport(token, formData);
      navigate('/dashboard', { replace: true });
    } catch (err: any) {
      console.error('Submission error:', err);
      setSubmitError(err.message || 'Failed to submit report. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="mx-auto max-w-5xl px-4 py-8">
      <div className="max-w-2xl">
        <h1 className="text-xl font-semibold text-slate-900">
          Report a vulnerable person
        </h1>
        <p className="mt-1 text-xs text-slate-600">
          Capture live evidence with your camera, share what you&apos;re seeing,
          and we&apos;ll route the case to nearby NGOs, shelters, and help
          centers.
        </p>
      </div>

      <form
        onSubmit={handleSubmit}
        className="mt-6 grid gap-6 rounded-3xl bg-white p-6 shadow-sm lg:grid-cols-[3fr,2fr]"
      >
        <div className="space-y-4 text-sm">
          <div>
            <label className="mb-1 block text-xs font-medium text-slate-700">
              Describe the situation
            </label>
            <textarea
              required
              rows={4}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Who do you see? What do they need? Are they in immediate danger?"
              className="w-full resize-none rounded-xl border border-slate-200 px-3 py-2 text-sm outline-none ring-0 focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
            />
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label className="mb-1 block text-xs font-medium text-slate-700">
                Urgency level
              </label>
              <div className="flex gap-2">
                {(['low', 'medium', 'emergency'] as Urgency[]).map((lvl) => (
                  <button
                    key={lvl}
                    type="button"
                    onClick={() => setUrgency(lvl)}
                    className={`flex-1 rounded-full border px-3 py-1.5 text-xs font-semibold ${
                      urgency === lvl
                        ? lvl === 'emergency'
                          ? 'border-red-500 bg-red-50 text-red-700'
                          : 'border-blue-500 bg-blue-50 text-blue-700'
                        : 'border-slate-200 bg-slate-50 text-slate-700'
                    }`}
                  >
                    {lvl === 'low'
                      ? 'Low'
                      : lvl === 'medium'
                        ? 'Medium'
                        : 'Emergency'}
                  </button>
                ))}
              </div>
            </div>
            <div>
              <label className="mb-1 block text-xs font-medium text-slate-700">
                Optional notes for NGOs
              </label>
              <textarea
                rows={3}
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="Share any extra context: visible injuries, children, weather, etc."
                className="w-full resize-none rounded-xl border border-slate-200 px-3 py-2 text-sm outline-none ring-0 focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
              />
            </div>
          </div>

          <div className="rounded-2xl bg-slate-50 px-3 py-2 text-[11px] text-slate-600">
            <p className="font-semibold text-slate-800">
              Safety & privacy notice
            </p>
            <p className="mt-1">
              Only admins and verified NGOs can view your evidence media. Please
              avoid sharing names, license plates, or faces of bystanders unless
              necessary for safety.
            </p>
          </div>
        </div>

        <div className="space-y-4 text-sm">
          <div>
            <label className="mb-1 block text-xs font-medium text-slate-700">
              Live camera evidence
            </label>
            <p className="mb-2 text-[11px] text-slate-500">
              Evidence can only be captured using your camera. Uploads from your
              gallery are not allowed to reduce misuse.
            </p>
            <div className="overflow-hidden rounded-2xl border border-slate-200 bg-slate-950/95 text-xs text-slate-100">
              <div className="flex items-center justify-between border-b border-slate-800 px-3 py-2">
                <span className="text-[11px] font-medium text-slate-100">
                  Camera preview
                </span>
                <div className="flex gap-2">
                  {capturedPreview ? (
                    <button
                      type="button"
                      onClick={() => {
                        setCapturedBlob(null);
                        setCapturedPreview(null);
                        startCamera();
                      }}
                      className="rounded-full bg-slate-700 px-3 py-1 text-[11px] font-semibold text-white hover:bg-slate-800"
                    >
                      Retake photo
                    </button>
                  ) : (
                    <>
                      <button
                        type="button"
                        onClick={startCamera}
                        disabled={startingCamera || !!stream}
                        className="rounded-full bg-emerald-500 px-3 py-1 text-[11px] font-semibold text-white hover:bg-emerald-600 disabled:opacity-50"
                      >
                        {startingCamera ? 'Opening…' : stream ? 'Camera active' : 'Open camera'}
                      </button>
                      {stream && (
                        <button
                          type="button"
                          onClick={captureFrame}
                          className="rounded-full bg-blue-500 px-3 py-1 text-[11px] font-semibold text-white hover:bg-blue-600"
                        >
                          Capture photo
                        </button>
                      )}
                    </>
                  )}
                </div>
              </div>
              <div className="flex h-56 items-center justify-center bg-slate-900">
                {capturedPreview ? (
                  <img
                    src={capturedPreview}
                    alt="Captured evidence"
                    className="h-full w-full object-contain"
                  />
                ) : (
                  <video
                    ref={videoRef}
                    autoPlay
                    playsInline
                    muted
                    className="h-full w-full object-contain"
                  />
                )}
              </div>
              <canvas
                ref={canvasRef}
                className="hidden"
              />
            </div>
            {cameraError && (
              <p className="mt-2 text-[11px] text-red-500">
                {cameraError}
              </p>
            )}
          </div>

          <div>
            <div className="mb-1 flex items-center justify-between">
              <label className="block text-xs font-medium text-slate-700">
                GPS location & address
              </label>
              <button
                type="button"
                onClick={refreshLocation}
                disabled={isRefreshingLocation}
                className="text-[10px] font-bold text-blue-600 hover:text-blue-700 disabled:opacity-50"
              >
                {isRefreshingLocation ? 'Refreshing…' : 'Refresh location'}
              </button>
            </div>
            <div className="rounded-2xl border border-slate-200 bg-slate-50 px-3 py-2 text-[11px] text-slate-600">
              {location ? (
                <>
                  <div className="mb-2 space-y-1">
                    <p className="flex items-center gap-1 font-semibold text-slate-800">
                      <span className="h-1.5 w-1.5 rounded-full bg-blue-500"></span>
                      Location captured
                    </p>
                    {address && (
                      <p className="text-[10px] font-medium leading-relaxed text-slate-600">
                        {address}
                      </p>
                    )}
                    <p className="font-mono text-[9px] text-slate-400">
                      Lat: {location[0].toFixed(6)}, Lon: {location[1].toFixed(6)}
                      {altitude !== null && ` • Alt: ${altitude.toFixed(2)}m`}
                    </p>
                  </div>
                  <MapView center={location} organizations={[]} height="180px" />
                </>
              ) : locError ? (
                <p className="text-red-600">{locError}</p>
              ) : (
                <p>Requesting your GPS location… please allow location access.</p>
              )}
            </div>
          </div>

          {submitError && (
            <p className="rounded-2xl bg-red-50 px-3 py-2 text-[11px] text-red-700">
              {submitError}
            </p>
          )}

          <button
            type="submit"
            disabled={submitting}
            className="w-full rounded-full bg-blue-600 px-4 py-2 text-sm font-semibold text-white shadow-md shadow-blue-500/30 hover:bg-blue-700 disabled:cursor-not-allowed disabled:bg-blue-300"
          >
            {submitting ? 'Submitting report…' : 'Submit report'}
          </button>
        </div>
      </form>
    </div>
  );
}

export default ReportPage;

