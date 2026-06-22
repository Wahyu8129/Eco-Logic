import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { MapContainer, TileLayer, Marker, Popup, useMap, Polyline } from 'react-leaflet';
import { MapPin, Navigation, Info } from 'lucide-react';
import L from 'leaflet';

// Fix for default marker icon in react-leaflet
import markerIcon2x from 'leaflet/dist/images/marker-icon-2x.png';
import markerIcon from 'leaflet/dist/images/marker-icon.png';
import markerShadow from 'leaflet/dist/images/marker-shadow.png';

delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconUrl: markerIcon,
  iconRetinaUrl: markerIcon2x,
  shadowUrl: markerShadow,
});

// Custom icon for user location
const userIcon = new L.Icon({
  iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-red.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41]
});

// Dummy disposal locations removed, we will fetch from backend

// Helper to center map on user location
function RecenterAutomatically({lat, lng}) {
  const map = useMap();
  useEffect(() => {
    if (lat && lng) {
       map.setView([lat, lng]);
    }
  }, [lat, lng, map]);
  return null;
}

// Helper to fit bounds when route changes
function FitBounds({ polyline }) {
  const map = useMap();
  useEffect(() => {
    if (polyline && polyline.length > 0) {
      map.fitBounds(polyline, { padding: [50, 50] });
    }
  }, [polyline, map]);
  return null;
}

export default function MapPage() {
  const routerLocation = useLocation();
  const [userLoc, setUserLoc] = useState(null);
  const [loadingLoc, setLoadingLoc] = useState(true);
  const [errorMsg, setErrorMsg] = useState(null);
  const [disposalLocations, setDisposalLocations] = useState([]);
  const [routePolyline, setRoutePolyline] = useState(null);
  const [isRouting, setIsRouting] = useState(false);
  const [useRadius, setUseRadius] = useState(true); // Default ON sesuai permintaan

  useEffect(() => {
    if ('geolocation' in navigator) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setUserLoc({
            lat: position.coords.latitude,
            lng: position.coords.longitude
          });
          setLoadingLoc(false);
        },
        (error) => {
          console.error("Error getting location:", error);
          setErrorMsg("Gagal mendapatkan lokasi. Pastikan izin lokasi diberikan.");
          setLoadingLoc(false);
          // Default location (e.g. Jakarta)
          setUserLoc({ lat: -6.200000, lng: 106.816666 });
        }
      );
    } else {
      setErrorMsg("Geolokasi tidak didukung oleh browser Anda.");
      setLoadingLoc(false);
      setUserLoc({ lat: -6.200000, lng: 106.816666 });
    }
  }, []);

  useEffect(() => {
    if (userLoc) {
      // Fetch disposal locations and distances
      const fetchLocations = async () => {
        try {
          const response = await fetch(`http://localhost:5000/api/locations?lat=${userLoc.lat}&lng=${userLoc.lng}`);
          if (response.ok) {
            const data = await response.json();
            // Filter duplikat berdasarkan nama (karena ada kemungkinan data dobel di database)
            const uniqueLocations = [];
            const seenNames = new Set();
            for (const loc of data) {
              if (!seenNames.has(loc.name)) {
                uniqueLocations.push(loc);
                seenNames.add(loc.name);
              }
            }
            setDisposalLocations(uniqueLocations);
          }
        } catch (error) {
          console.error("Failed to fetch locations:", error);
        }
      };
      
      fetchLocations();
    }
  }, [userLoc]);

  const handleRouteClick = async (locLat, locLng) => {
    if (userLoc) {
      setIsRouting(true);
      try {
        const res = await fetch(`https://router.project-osrm.org/route/v1/driving/${userLoc.lng},${userLoc.lat};${locLng},${locLat}?overview=full&geometries=geojson`);
        const data = await res.json();
        if (data.routes && data.routes.length > 0) {
          // OSRM GeoJSON mengembalikan [longitude, latitude], Leaflet butuh [latitude, longitude]
          const coords = data.routes[0].geometry.coordinates.map(c => [c[1], c[0]]);
          setRoutePolyline(coords);
        } else {
          setErrorMsg("Gagal menemukan rute darat ke lokasi tersebut.");
        }
      } catch (err) {
        console.error("Failed to fetch route", err);
        setErrorMsg("Gagal mengambil rute dari server OSRM.");
      } finally {
        setIsRouting(false);
      }
    }
  };

  // Auto-route jika diarahkan dari IdentifyPage
  useEffect(() => {
    if (userLoc && routerLocation.state?.targetLocation) {
      const target = routerLocation.state.targetLocation;
      if (target.latitude && target.longitude) {
        handleRouteClick(target.latitude, target.longitude);
      }
    }
  }, [userLoc, routerLocation.state]);

  return (
    <div className="flex flex-col h-full space-y-4">
      <div className="bg-white dark:bg-slate-900 rounded-2xl p-6 shadow-sm border border-slate-200 dark:border-slate-800 relative overflow-hidden group">
        <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
          <MapPin className="w-24 h-24 text-emerald-500" />
        </div>
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center relative z-10 gap-4">
          <div>
            <h1 className="text-2xl font-bold text-slate-800 dark:text-white mb-2 flex items-center gap-2">
              Peta Lokasi Pembuangan
            </h1>
            <p className="text-slate-600 dark:text-slate-400 max-w-lg">
              Temukan bank sampah atau titik daur ulang terdekat dari lokasi Anda saat ini.
            </p>
          </div>
          <button 
            onClick={() => setUseRadius(!useRadius)}
            className={`text-sm px-4 py-2 rounded-xl border transition-colors flex items-center gap-2 shadow-sm ${useRadius ? 'bg-emerald-50 dark:bg-emerald-900/20 text-emerald-600 dark:text-emerald-400 border-emerald-200 dark:border-emerald-800' : 'bg-slate-50 dark:bg-slate-950 text-slate-500 border-slate-200 dark:border-slate-800'}`}
            title="Matikan untuk melihat semua lokasi tanpa batasan jarak"
          >
            <div className={`w-2.5 h-2.5 rounded-full ${useRadius ? 'bg-emerald-500' : 'bg-slate-400'}`}></div>
            Batas Radius 3KM: {useRadius ? 'ON' : 'OFF'}
          </button>
        </div>
      </div>

      <div className="flex-1 bg-white dark:bg-slate-900 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 overflow-hidden min-h-[400px] relative">
        {loadingLoc && (
          <div className="absolute inset-0 flex items-center justify-center bg-slate-100/50 dark:bg-slate-800/50 z-20">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-emerald-500"></div>
          </div>
        )}
        
        {errorMsg && (
           <div className="absolute top-4 left-4 right-4 bg-amber-100 border border-amber-400 text-amber-700 px-4 py-3 rounded z-[1000] flex items-start gap-2 text-sm shadow-md">
             <Info className="w-5 h-5 flex-shrink-0 mt-0.5" />
             <p>{errorMsg}</p>
           </div>
        )}

        {userLoc && (
          <MapContainer 
            center={[userLoc.lat, userLoc.lng]} 
            zoom={13} 
            className="w-full h-full absolute inset-0 z-10"
          >
            <TileLayer
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />
            
            <RecenterAutomatically lat={userLoc.lat} lng={userLoc.lng} />

            {/* User Location Marker */}
            <Marker position={[userLoc.lat, userLoc.lng]} icon={userIcon}>
              <Popup>
                <div className="text-center font-semibold">Lokasi Anda</div>
              </Popup>
            </Marker>

            {/* Disposal Locations Markers */}
            {disposalLocations
              .filter(loc => !useRadius || (loc.distance !== undefined && loc.distance <= 3))
              .map(loc => (
              <Marker key={loc.id} position={[loc.latitude, loc.longitude]}>
                <Popup>
                  <div className="p-1 min-w-[150px]">
                    <h3 className="font-bold text-slate-800 mb-1">{loc.name}</h3>
                    {loc.distance !== undefined && (
                      <p className="text-xs text-emerald-600 font-medium mb-1">
                        Jarak: {loc.distance.toFixed(2)} km
                      </p>
                    )}
                    <p className="text-xs text-slate-600 mb-2">Menerima: {Array.isArray(loc.accepted_waste_types) ? loc.accepted_waste_types.join(', ') : loc.accepted_waste_types}</p>
                    <button 
                      onClick={() => handleRouteClick(loc.latitude, loc.longitude)}
                      disabled={isRouting}
                      className="flex items-center justify-center gap-1 w-full bg-emerald-500 text-white text-xs py-1.5 rounded hover:bg-emerald-600 disabled:opacity-50 transition-colors"
                    >
                      <Navigation className="w-3 h-3" />
                      {isRouting ? "Mencari..." : "Tampilkan Rute"}
                    </button>
                  </div>
                </Popup>
              </Marker>
            ))}

            {/* Polyline Rute */}
            {routePolyline && (
              <>
                <Polyline 
                  positions={routePolyline} 
                  pathOptions={{ color: '#10b981', weight: 5, opacity: 0.8 }} 
                />
                <FitBounds polyline={routePolyline} />
              </>
            )}
          </MapContainer>
        )}
      </div>
    </div>
  );
}
