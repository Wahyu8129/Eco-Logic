import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Leaf, Camera, MapPin, AlertTriangle, CheckCircle2,
  Search, Loader2, ChevronRight, Navigation
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { simulateAIAnalysis, RANDOM_ITEMS } from '../utils/mockDatabase';

const getCategoryColor = (category) => {
  if (category.includes('B3')) return 'text-red-400 border-red-500/50 bg-red-500/10';
  if (category.includes('Anorganik')) return 'text-blue-400 border-blue-500/50 bg-blue-500/10';
  if (category.includes('Organik')) return 'text-green-400 border-green-500/50 bg-green-500/10';
  return 'text-gray-400 border-gray-500/50 bg-gray-500/10';
};

export default function IdentifyPage() {
  const { addHistory } = useApp();
  const navigate = useNavigate();
  const [inputText, setInputText] = useState('');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [result, setResult] = useState(null);

  const runAnalysis = (keyword) => {
    setIsAnalyzing(true);
    setResult(null);
    setTimeout(() => {
      const foundData = simulateAIAnalysis(keyword);
      setResult(foundData);
      setIsAnalyzing(false);
      addHistory(foundData);
    }, 1500);
  };

  const handleAnalyze = (e) => {
    e.preventDefault();
    if (!inputText) return;
    runAnalysis(inputText);
  };

  const simulateImageUpload = () => {
    const randomItem = RANDOM_ITEMS[Math.floor(Math.random() * RANDOM_ITEMS.length)];
    setInputText(randomItem);
    runAnalysis(randomItem);
  };

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">

      {/* Input Card */}
      <div className="bg-slate-900 rounded-2xl border border-slate-800 p-6 shadow-xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-500/5 rounded-full blur-3xl -mr-20 -mt-20 pointer-events-none"></div>
        <h2 className="text-xl font-semibold mb-2 text-slate-100">Identifikasi Material</h2>
        <p className="text-slate-400 text-sm mb-6">
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
                className="w-full bg-slate-950 border border-slate-700 rounded-xl py-3 pl-10 pr-4 text-slate-200 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/50 focus:border-emerald-500 transition-all"
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
            <div className="flex-grow border-t border-slate-800"></div>
            <span className="flex-shrink-0 mx-4 text-slate-500 text-xs uppercase tracking-wider font-semibold">ATAU</span>
            <div className="flex-grow border-t border-slate-800"></div>
          </div>

          <button
            type="button"
            onClick={simulateImageUpload}
            className="w-full border-2 border-dashed border-slate-700 hover:border-emerald-500/50 bg-slate-950/50 hover:bg-slate-900 rounded-xl py-8 flex flex-col items-center justify-center gap-3 transition-all group"
          >
            <div className="p-3 bg-slate-800 group-hover:bg-emerald-500/20 rounded-full text-slate-400 group-hover:text-emerald-400 transition-colors">
              <Camera className="w-6 h-6" />
            </div>
            <div className="text-center">
              <span className="font-medium text-slate-300">Ambil Foto / Unggah Gambar</span>
              <p className="text-xs text-slate-500 mt-1">Simulasi otomatis (Mock AI CV)</p>
            </div>
          </button>
        </form>
      </div>

      {/* Loading State */}
      {isAnalyzing && (
        <div className="bg-slate-900 rounded-2xl border border-slate-800 p-8 text-center">
          <Loader2 className="w-8 h-8 text-emerald-500 animate-spin mx-auto mb-4" />
          <h3 className="text-slate-300 font-medium">Memproses dengan AI...</h3>
          <p className="text-slate-500 text-sm mt-2">Menghubungkan ke layanan klasifikasi &amp; GIS</p>
        </div>
      )}

      {/* Results */}
      {result && !isAnalyzing && (
        <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
          {/* Identification Card */}
          <div className="bg-slate-900 rounded-2xl border border-slate-800 p-6 shadow-xl">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
              <div>
                <h3 className="text-slate-400 text-xs font-semibold tracking-wider uppercase mb-1">Hasil Identifikasi</h3>
                <h2 className="text-2xl font-bold text-slate-100">{result.item_name}</h2>
              </div>
              <div className="flex items-center gap-2 bg-slate-950 px-3 py-1.5 rounded-lg border border-slate-800">
                <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                <span className="text-sm font-medium text-slate-300">Akurasi: {result.confidence_score}%</span>
              </div>
            </div>

            <div className={`inline-flex items-center gap-2 px-4 py-2 rounded-full border text-sm font-semibold mb-6 ${getCategoryColor(result.category)}`}>
              {result.category.includes('B3') ? <AlertTriangle className="w-4 h-4" /> : <Leaf className="w-4 h-4" />}
              Kategori: {result.category}
            </div>

            <div className="grid sm:grid-cols-2 gap-4">
              <div className="bg-slate-950 p-4 rounded-xl border border-slate-800">
                <h4 className="text-slate-400 text-xs font-semibold mb-2 uppercase">SOP Penanganan</h4>
                <p className="text-slate-200 text-sm leading-relaxed">{result.handling_step}</p>
              </div>
              <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 space-y-4">
                <div>
                  <h4 className="text-slate-400 text-xs font-semibold mb-1 uppercase">Peringatan Keamanan</h4>
                  <p className={`text-sm font-medium ${result.category.includes('B3') ? 'text-red-400' : 'text-slate-200'}`}>
                    {result.safety_warning}
                  </p>
                </div>
                <div>
                  <h4 className="text-slate-400 text-xs font-semibold mb-1 uppercase">Tingkat Daur Ulang</h4>
                  <p className="text-sm text-slate-200">{result.recyclability}</p>
                </div>
              </div>
            </div>
          </div>

          {/* GIS Locations */}
          {result.locations.length > 0 && (
            <div className="bg-slate-900 rounded-2xl border border-slate-800 p-6 shadow-xl">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-lg font-semibold text-slate-100 flex items-center gap-2">
                  <MapPin className="w-5 h-5 text-emerald-500" />
                  Lokasi Pembuangan Terdekat
                </h2>
                <span className="text-xs text-slate-500 bg-slate-950 px-2 py-1 rounded border border-slate-800">Radius 5KM (GIS)</span>
              </div>
              <div className="space-y-3">
                {result.locations.map((loc, idx) => (
                  <div key={idx} className="flex flex-col sm:flex-row justify-between items-start sm:items-center bg-slate-950 p-4 rounded-xl border border-slate-800 hover:border-emerald-500/50 transition-colors group">
                    <div className="mb-3 sm:mb-0">
                      <h4 className="font-medium text-slate-200 group-hover:text-emerald-400 transition-colors">{loc.name}</h4>
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
                    <button className="w-full sm:w-auto bg-slate-800 hover:bg-slate-700 text-slate-200 text-sm px-4 py-2 rounded-lg font-medium transition-colors flex items-center justify-center gap-2">
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
