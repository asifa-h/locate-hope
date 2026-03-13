import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { useMemo, useState, useEffect } from 'react';

// Fix for default marker icons in Leaflet with React
import icon from 'leaflet/dist/images/marker-icon.png';
import iconShadow from 'leaflet/dist/images/marker-shadow.png';

let DefaultIcon = L.icon({
  iconUrl: icon,
  shadowUrl: iconShadow,
  iconSize: [25, 41],
  iconAnchor: [12, 41],
});

L.Marker.prototype.options.icon = DefaultIcon;

const hospitalIcon = new L.Icon({
  iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-red.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41]
});

const pharmacyIcon = new L.Icon({
  iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-green.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41]
});

const ngoIcon = new L.Icon({
  iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-blue.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41]
});

const shelterIcon = new L.Icon({
  iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-orange.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41]
});

const rehabIcon = new L.Icon({
  iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-violet.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41]
});

type OrgMarker = {
  id: number;
  name: string;
  category: string;
  phone?: string | null;
  latitude: number;
  longitude: number;
  distance_m?: number;
};

type Amenity = {
  id: number;
  lat: number;
  lon: number;
  name?: string;
  type: 'hospital' | 'pharmacy' | 'clinic' | 'shelter' | 'rehab';
};

type Props = {
  center: [number, number] | null;
  organizations?: OrgMarker[];
  height?: string;
};

// Component to handle map center changes
function RecenterMap({ center }: { center: [number, number] }) {
  const map = useMap();
  useEffect(() => {
    map.setView(center, map.getZoom());
  }, [center, map]);
  return null;
}

function MapView({ center, organizations = [], height = '400px' }: Props) {
  const [amenities, setAmenities] = useState<Amenity[]>([]);
  const [loadingAmenities, setLoadingAmenities] = useState(false);

  const mapCenter = useMemo(() => {
    return center || [40.7128, -74.0060]; // NYC fallback
  }, [center]);

  useEffect(() => {
    if (!center) return;

    const fetchAmenities = async () => {
      setLoadingAmenities(true);
      try {
        const [lat, lon] = center;
        // Check for valid lat/lon before querying
        if (isNaN(lat) || isNaN(lon) || (lat === 0 && lon === 0)) {
          setLoadingAmenities(false);
          return;
        }

        const radius = 2000; // 2km radius
        
        // Overpass API query for hospitals, pharmacies, clinics, shelters, rehab centers
        const query = `
          [out:json][timeout:30];
          (
            node["amenity"~"hospital|pharmacy|clinic"](around:${radius},${lat},${lon});
            node["amenity"="social_facility"]["social_facility:for"~"homeless|refugee"](around:${radius},${lat},${lon});
            node["amenity"="social_facility"]["social_facility"~"rehab"](around:${radius},${lat},${lon});
            way["amenity"~"hospital|pharmacy|clinic"](around:${radius},${lat},${lon});
            way["amenity"="social_facility"]["social_facility:for"~"homeless|refugee"](around:${radius},${lat},${lon});
            way["amenity"="social_facility"]["social_facility"~"rehab"](around:${radius},${lat},${lon});
          );
          out center;
        `;
        
        const response = await fetch('https://overpass-api.de/api/interpreter', {
          method: 'POST',
          body: query,
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded'
          }
        });

        if (!response.ok) throw new Error('Overpass API error');
        
        const data = await response.json();
        const results = data.elements.map((el: any) => {
          const tags = el.tags || {};
          const amenity = tags.amenity;
          const social = tags.social_facility;
          let type: Amenity['type'] = 'hospital';
          
          if (amenity === 'pharmacy') type = 'pharmacy';
          else if (amenity === 'clinic') type = 'clinic';
          else if (amenity === 'social_facility') {
            if (social?.includes('rehab')) type = 'rehab';
            else type = 'shelter';
          }
          
          return {
            id: el.id,
            lat: el.lat || el.center?.lat,
            lon: el.lon || el.center?.lon,
            name: tags.name || tags.amenity || 'Unnamed facility',
            type
          };
        });
        
        setAmenities(results);
      } catch (err) {
        console.error('Error fetching Overpass data', err);
      } finally {
        setLoadingAmenities(false);
      }
    };

    const timeoutId = setTimeout(fetchAmenities, 500); // Debounce API calls
    return () => clearTimeout(timeoutId);
  }, [center]);

  return (
    <div className="relative overflow-hidden rounded-2xl border border-slate-200 shadow-sm" style={{ height }}>
      <MapContainer 
        center={mapCenter} 
        zoom={14} 
        style={{ height: '100%', width: '100%' }}
        scrollWheelZoom={true}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        
        {center && <RecenterMap center={center} />}

        {/* User Location */}
        {center && (
          <Marker position={center}>
            <Popup>
              <div className="text-xs font-semibold">You are here</div>
            </Popup>
          </Marker>
        )}

        {/* NGOs/Shelters from DB */}
        {organizations.map((org) => (
          <Marker 
            key={`org-${org.id}`} 
            position={[org.latitude, org.longitude]}
            icon={ngoIcon}
          >
            <Popup>
              <div className="p-1 text-xs">
                <p className="font-bold text-slate-900">{org.name}</p>
                <p className="text-slate-600">{org.category}</p>
                {typeof org.distance_m === 'number' && (
                  <p className="text-blue-600">
                    {(org.distance_m / 1000).toFixed(2)} km away
                  </p>
                )}
                {org.phone && <p>Phone: {org.phone}</p>}
              </div>
            </Popup>
          </Marker>
        ))}

        {/* Amenities from Overpass */}
        {amenities.map((amenity) => (
          <Marker 
            key={`amenity-${amenity.id}`} 
            position={[amenity.lat, amenity.lon]}
            icon={
              amenity.type === 'pharmacy' ? pharmacyIcon : 
              amenity.type === 'shelter' ? shelterIcon :
              amenity.type === 'rehab' ? rehabIcon :
              hospitalIcon
            }
          >
            <Popup>
              <div className="p-1 text-xs">
                <p className="font-bold text-slate-900">{amenity.name}</p>
                <p className="capitalize text-slate-600">{amenity.type.replace('_', ' ')}</p>
                <p className="text-[10px] text-slate-400">Public Facility</p>
              </div>
            </Popup>
          </Marker>
        ))}
      </MapContainer>

      {loadingAmenities && (
        <div className="absolute bottom-4 left-4 z-[1000] rounded-full bg-white/90 px-3 py-1 text-[10px] font-medium text-slate-600 shadow-sm backdrop-blur">
          Searching nearby Tamil Nadu facilities...
        </div>
      )}

      <div className="absolute bottom-4 right-4 z-[1000] flex flex-col gap-1">
        <div className="flex items-center gap-2 rounded-lg bg-white/90 p-2 text-[10px] shadow-sm backdrop-blur">
          <span className="h-2 w-2 rounded-full bg-blue-500"></span>
          <span>NGO / Shelter (Registered)</span>
        </div>
        <div className="flex items-center gap-2 rounded-lg bg-white/90 p-2 text-[10px] shadow-sm backdrop-blur">
          <span className="h-2 w-2 rounded-full bg-red-500"></span>
          <span>Hospital / Clinic</span>
        </div>
        <div className="flex items-center gap-2 rounded-lg bg-white/90 p-2 text-[10px] shadow-sm backdrop-blur">
          <span className="h-2 w-2 rounded-full bg-green-500"></span>
          <span>Pharmacy</span>
        </div>
        <div className="flex items-center gap-2 rounded-lg bg-white/90 p-2 text-[10px] shadow-sm backdrop-blur">
          <span className="h-2 w-2 rounded-full bg-orange-500"></span>
          <span>Public Shelter</span>
        </div>
        <div className="flex items-center gap-2 rounded-lg bg-white/90 p-2 text-[10px] shadow-sm backdrop-blur">
          <span className="h-2 w-2 rounded-full bg-purple-500"></span>
          <span>Rehab Center</span>
        </div>
      </div>
    </div>
  );
}

export default MapView;
