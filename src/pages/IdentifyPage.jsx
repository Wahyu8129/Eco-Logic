import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Leaf, Camera, MapPin, AlertTriangle, CheckCircle2,
  Search, Loader2, ChevronRight, Navigation
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { simulateAIAnalysis, RANDOM_ITEMS } from '../utils/mockDatabase';

const getCategoryColor = (category) => {
  if (!category) return 'text-gray-400 border-gray-500/50 bg-gray-500/10';
  if (category.toLowerCase().includes('b3')) return 'text-red-400 border-red-500/50 bg-red-500/10';
  if (category.toLowerCase().includes('anorganik')) return 'text-blue-400 border-blue-500/50 bg-blue-500/10';
  if (category.toLowerCase().includes('organik')) return 'text-green-400 border-green-500/50 bg-green-500/10';
  return 'text-gray-400 border-gray-500/50 bg-gray-500/10';
};

export default function IdentifyPage() {
  const { addHistory } = useApp();
  const navigate = useNavigate();
  const [inputText, setInputText] = useState('');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [result, setResult] = useState(null);
  const [userLoc, setUserLoc] = useState(null);
  const [useRadius, setUseRadius] = useState(true);

  const fileInputRef = React.useRef(null);

  React.useEffect(() => {
    if ('geolocation' in navigator) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setUserLoc({
            lat: position.coords.latitude,
            lng: position.coords.longitude
          });
        },
        () => {
          setUserLoc({ lat: -6.200000, lng: 106.816666 }); // fallback
        }
      );
    }
  }, []);

  const runAnalysis = async (keyword, imageBase64 = null) => {
    setIsAnalyzing(true);
    setResult(null);
    try {
      const response = await fetch('http://localhost:5000/api/ai/identify', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text: keyword, imageBase64 })
      });
      const resData = await response.json();
      if (resData.success) {
        let finalResult = { ...resData.data };
        
        // Fetch real locations from Phase 4 API if we have user location
        if (userLoc) {
          try {
            const locRes = await fetch(`http://localhost:5000/api/locations?lat=${userLoc.lat}&lng=${userLoc.lng}`);
            if (locRes.ok) {
              const realLocations = await locRes.json();
              const allUniqueLocations = [];
              const seenNames = new Set();
              for (const loc of realLocations) {
                if (!seenNames.has(loc.name)) {
                  allUniqueLocations.push(loc);
                  seenNames.add(loc.name);
                }
              }
              finalResult.all_locations = allUniqueLocations.map(loc => ({
                name: loc.name,
                distance: loc.distance !== undefined ? loc.distance.toFixed(1) : "?",
                rawDistance: loc.distance,
                status_open: true,
                latitude: loc.latitude,
                longitude: loc.longitude
              }));
              finalResult.locations = finalResult.all_locations.filter(loc => loc.rawDistance <= 3).slice(0, 3);
            }
          } catch (e) {
            console.error("Failed fetching real locations", e);
          }
        }
        
        setResult(finalResult);
        addHistory(finalResult);
      } else {
        alert("Gagal mengidentifikasi: " + resData.message);
      }
    } catch (error) {
      alert("Terjadi kesalahan koneksi ke server.");
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleAnalyze = (e) => {
    e.preventDefault();
    if (!inputText) return;
    runAnalysis(inputText);
  };

  const handleImageUploadClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        runAnalysis('', reader.result); // send base64 string
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">

      {/* Input Card */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-6 shadow-xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-500/5 rounded-full blur-3xl -mr-20 -mt-20 pointer-events-none"></div>
        <h2 className="text-xl font-semibold mb-2 text-slate-900 dark:text-slate-100">Identifikasi Material</h2>
        <p className="text-slate-600 dark:text-slate-400 text-sm mb-6">
          Ketik nama barang atau unggah foto untuk mengetahui kategori sampah dan instruksi penanganannya.
        </p>
        <form onSubmit={handleAnalyze} className="space-y-4 relative z-10">
          <div className="flex gap-2">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500" />
              <input
                type="text"
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                placeholder="Contoh: Baterai, Botol plastik, Lampu bohlam..."
                className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-700 rounded-xl py-3 pl-10 pr-4 text-slate-800 dark:text-slate-200 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/50 focus:border-emerald-500 transition-all"
              />
            </div>
            <button
              type="submit"
              disabled={isAnalyzing || !inputText}
              className="bg-emerald-600 hover:bg-emerald-500 disabled:opacity-50 text-white px-6 py-3 rounded-xl font-medium transition-colors flex items-center gap-2"
            >
              {isAnalyzing ? <Loader2 className="w-5 h-5 animate-spin" /> : 'Analisis'}
            </button>
          </div>

          <div className="relative flex items-center py-2">
            <div className="flex-grow border-t border-slate-200 dark:border-slate-800"></div>
            <span className="flex-shrink-0 mx-4 text-slate-500 text-xs uppercase tracking-wider font-semibold">ATAU</span>
            <div className="flex-grow border-t border-slate-200 dark:border-slate-800"></div>
          </div>

          <input 
            type="file" 
            accept="image/*" 
            capture="environment" 
            className="hidden" 
            ref={fileInputRef}
            onChange={handleFileChange}
          />
          <button
            type="button"
            onClick={handleImageUploadClick}
            disabled={isAnalyzing}
            className="w-full border-2 border-dashed border-slate-300 dark:border-slate-700 hover:border-emerald-500/50 bg-slate-50 dark:bg-slate-950/50 hover:bg-white dark:bg-slate-900 rounded-xl py-8 flex flex-col items-center justify-center gap-3 transition-all group disabled:opacity-50"
          >
            <div className="p-3 bg-slate-100 dark:bg-slate-800 group-hover:bg-emerald-500/20 rounded-full text-slate-600 dark:text-slate-400 group-hover:text-emerald-400 transition-colors">
              <Camera className="w-6 h-6" />
            </div>
            <div className="text-center">
              <span className="font-medium text-slate-700 dark:text-slate-300">Ambil Foto / Unggah Gambar</span>
              <p className="text-xs text-slate-500 mt-1">Menggunakan AI Computer Vision</p>
            </div>
          </button>
        </form>
      </div>

      {/* Loading State */}
      {isAnalyzing && (
        <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-12 text-center shadow-xl">
          <div className="relative w-20 h-20 mx-auto mb-6">
            {/* Background ring */}
            <div className="absolute inset-0 border-4 border-slate-200 dark:border-slate-800 rounded-full"></div>
            {/* Spinning ring */}
            <div className="absolute inset-0 border-4 border-emerald-500 rounded-full border-t-transparent animate-[spin_1s_linear_infinite]"></div>
            {/* Inner pulsing glow */}
            <div className="absolute inset-2 bg-emerald-500/20 rounded-full blur-md animate-pulse-soft"></div>
            {/* Center icon */}
            <div className="absolute inset-0 flex items-center justify-center">
              <Leaf className="w-8 h-8 text-emerald-500 animate-pulse-soft" />
            </div>
          </div>
          <h3 className="text-xl text-slate-800 dark:text-slate-200 font-bold mb-2 animate-pulse">Memproses dengan AI...</h3>
          <p className="text-slate-500 text-sm">Sedang mengidentifikasi jenis material dan rekomendasi...</p>
        </div>
      )}

      {/* Results */}
      {result && !isAnalyzing && (
        <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
          {/* Identification Card */}
          <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-6 shadow-xl">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
              <div>
                <h3 className="text-slate-600 dark:text-slate-400 text-xs font-semibold tracking-wider uppercase mb-1">Hasil Identifikasi</h3>
                <h2 className="text-2xl font-bold text-slate-900 dark:text-slate-100">{result.item_name}</h2>
              </div>
              <div className="flex items-center gap-2 bg-slate-50 dark:bg-slate-950 px-3 py-1.5 rounded-lg border border-slate-200 dark:border-slate-800">
                <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                <span className="text-sm font-medium text-slate-700 dark:text-slate-300">Akurasi: {result.confidence_score}%</span>
              </div>
            </div>

            <div className={`inline-flex items-center gap-2 px-4 py-2 rounded-full border text-sm font-semibold mb-6 ${getCategoryColor(result.category)}`}>
              {result.category && result.category.toLowerCase().includes('b3') ? <AlertTriangle className="w-4 h-4" /> : <Leaf className="w-4 h-4" />}
              Kategori: {result.category}
            </div>

            <div className="grid sm:grid-cols-2 gap-4">
              <div className="bg-slate-50 dark:bg-slate-950 p-4 rounded-xl border border-slate-200 dark:border-slate-800">
                <h4 className="text-slate-600 dark:text-slate-400 text-xs font-semibold mb-2 uppercase">SOP Penanganan</h4>
                <p className="text-slate-800 dark:text-slate-200 text-sm leading-relaxed">{result.handling_step}</p>
              </div>
              <div className="bg-slate-50 dark:bg-slate-950 p-4 rounded-xl border border-slate-200 dark:border-slate-800 space-y-4">
                <div>
                  <h4 className="text-slate-600 dark:text-slate-400 text-xs font-semibold mb-1 uppercase">Peringatan Keamanan</h4>
                  <p className={`text-sm font-medium ${result.category && result.category.toLowerCase().includes('b3') ? 'text-red-400' : 'text-slate-800 dark:text-slate-200'}`}>
                    {result.safety_warning}
                  </p>
                </div>
                <div>
                  <h4 className="text-slate-600 dark:text-slate-400 text-xs font-semibold mb-1 uppercase">Tingkat Daur Ulang</h4>
                  <p className="text-sm text-slate-800 dark:text-slate-200">{result.recyclability}</p>
                </div>
              </div>
            </div>
          </div>

          {/* GIS Locations */}
          {((result.all_locations && result.all_locations.length > 0) || (result.locations && result.locations.length > 0)) && (
            <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-6 shadow-xl">
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-3">
                <h2 className="text-lg font-semibold text-slate-900 dark:text-slate-100 flex items-center gap-2">
                  <MapPin className="w-5 h-5 text-emerald-500" />
                  Lokasi Pembuangan Terdekat
                </h2>
                <button 
                  onClick={() => setUseRadius(!useRadius)}
                  className={`text-xs px-3 py-1.5 rounded-lg border transition-colors flex items-center gap-2 ${useRadius ? 'bg-emerald-50 dark:bg-emerald-900/20 text-emerald-600 dark:text-emerald-400 border-emerald-200 dark:border-emerald-800' : 'bg-slate-50 dark:bg-slate-950 text-slate-500 border-slate-200 dark:border-slate-800'}`}
                  title="Matikan untuk melihat semua lokasi tanpa batasan 3KM"
                >
                  <div className={`w-2 h-2 rounded-full ${useRadius ? 'bg-emerald-500' : 'bg-slate-400'}`}></div>
                  Radius 3KM: {useRadius ? 'ON' : 'OFF'}
                </button>
              </div>
              <div className="space-y-3">
                {(result.all_locations 
                  ? result.all_locations.filter(loc => !useRadius || (loc.rawDistance !== undefined && loc.rawDistance <= 3)).slice(0, 5) 
                  : result.locations
                ).map((loc, idx) => (
                  <div key={idx} className="flex flex-col sm:flex-row justify-between items-start sm:items-center bg-slate-50 dark:bg-slate-950 p-4 rounded-xl border border-slate-200 dark:border-slate-800 hover:border-emerald-500/50 transition-colors group">
                    <div className="mb-3 sm:mb-0">
                      <h4 className="font-medium text-slate-800 dark:text-slate-200 group-hover:text-emerald-400 transition-colors">{loc.name}</h4>
                      <div className="flex items-center gap-3 mt-1">
                        <span className="text-xs text-slate-500 flex items-center gap-1">
                          <Navigation className="w-3 h-3" /> {loc.distance} km jarak
                        </span>
                        {loc.status_open && (
                          <span className="text-xs text-emerald-400 bg-emerald-400/10 px-2 py-0.5 rounded-full border border-emerald-400/20">
                            Buka
                          </span>
                        )}
                      </div>
                    </div>
                    <button 
                      onClick={() => {
                        if(userLoc && loc.latitude && loc.longitude) {
                          navigate('/map', { state: { targetLocation: loc } });
                        } else {
                          navigate('/map');
                        }
                      }}
                      className="w-full sm:w-auto bg-slate-100 dark:bg-slate-800 hover:bg-slate-700 text-slate-800 dark:text-slate-200 text-sm px-4 py-2 rounded-lg font-medium transition-colors flex items-center justify-center gap-2"
                    >
                      Arahkan Rute <ChevronRight className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
