import React, { useState, useEffect } from 'react';
import { 
  Leaf, Camera, MapPin, AlertTriangle, CheckCircle2, 
  History, Home, Search, Loader2, UploadCloud, ChevronRight, 
  Award, Navigation 
} from 'lucide-react';

// --- MOCK DATABASE & AI LOGIC ---
const mockDatabase = {
  "baterai": {
    item_name: "Baterai Bekas",
    category: "B3 (Bahan Berbahaya)",
    confidence_score: 98.5,
    handling_step: "Jangan dibuang ke tempat sampah biasa. Bungkus dengan plastik bening yang kering, pisahkan dari sampah lain untuk mencegah korsleting atau kebocoran bahan kimia.",
    safety_warning: "Tinggi - Mengandung logam berat (Lithium/Alkaline).",
    recyclability: "Khusus",
    locations: [
      { name: "E-Waste Dropbox Balaikota", distance: 1.2, status_open: true },
      { name: "Bank Sampah Elektronik Jaya", distance: 3.5, status_open: true }
    ]
  },
  "lampu": {
    item_name: "Lampu Neon/Bohlam",
    category: "B3 (Bahan Berbahaya)",
    confidence_score: 95.2,
    handling_step: "Gunakan sarung tangan. Jika pecah, hindari menghirup uapnya (mengandung merkuri). Masukkan ke dalam wadah tertutup rapat atau kardus aslinya.",
    safety_warning: "Tinggi - Mengandung merkuri dan pecahan kaca.",
    recyclability: "Khusus",
    locations: [
      { name: "Kantor Dinas Lingkungan Hidup", distance: 2.0, status_open: true },
      { name: "E-Waste Dropbox Balaikota", distance: 4.1, status_open: true }
    ]
  },
  "botol": {
    item_name: "Botol Plastik PET",
    category: "Anorganik",
    confidence_score: 99.1,
    handling_step: "Kosongkan isi botol, cuci bersih, lepaskan label jika memungkinkan, lalu remukkan botol untuk menghemat ruang sebelum dibuang ke tong sampah biru.",
    safety_warning: "Rendah - Aman ditangani langsung.",
    recyclability: "Tinggi (Dapat didaur ulang penuh)",
    locations: [
      { name: "Bank Sampah Hijau Berseri", distance: 0.8, status_open: true },
      { name: "Pengepul Daur Ulang Mandiri", distance: 1.5, status_open: true }
    ]
  },
  "apel": {
    item_name: "Sisa Makanan (Apel)",
    category: "Organik",
    confidence_score: 96.8,
    handling_step: "Masukkan ke dalam komposter atau lubang biopori. Jika dibuang ke tempat sampah umum, pastikan wadah tertutup agar tidak mengundang hama.",
    safety_warning: "Rendah - Mudah membusuk.",
    recyclability: "Kompos",
    locations: [
      { name: "Fasilitas Kompos RT 04", distance: 0.3, status_open: true },
      { name: "TPA Sementara Desa", distance: 2.1, status_open: true }
    ]
  }
};

export default function App() {
  const [activeTab, setActiveTab] = useState('identify');
  const [inputText, setInputText] = useState('');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [result, setResult] = useState(null);
  const [history, setHistory] = useState([]);

  const handleAnalyze = (e) => {
    e.preventDefault();
    if (!inputText) return;

    setIsAnalyzing(true);
    setResult(null);

    // Simulate Network/AI Latency
    setTimeout(() => {
      const keyword = inputText.toLowerCase();
      let foundData = null;

      // Simple keyword matching for simulation
      for (const key in mockDatabase) {
        if (keyword.includes(key)) {
          foundData = mockDatabase[key];
          break;
        }
      }

      if (!foundData) {
        foundData = {
          item_name: "Material Tidak Dikenal",
          category: "Unknown",
          confidence_score: 45.0,
          handling_step: "Kami tidak dapat mengidentifikasi sampah ini. Harap pisahkan dan hubungi petugas kebersihan setempat.",
          safety_warning: "Tidak diketahui - Tangani dengan hati-hati.",
          recyclability: "Tidak diketahui",
          locations: []
        };
      }

      setResult(foundData);
      setIsAnalyzing(false);
      
      if (foundData.category !== "Unknown") {
        setHistory([{...foundData, date: new Date().toLocaleDateString()}, ...history]);
      }

    }, 1500);
  };

  const simulateImageUpload = () => {
    const items = ["Baterai", "Botol", "Lampu", "Apel"];
    const randomItem = items[Math.floor(Math.random() * items.length)];
    setInputText(randomItem);
    handleAnalyze({ preventDefault: () => {} });
  };

  const getCategoryColor = (category) => {
    if (category.includes('B3')) return 'text-red-400 border-red-500/50 bg-red-500/10';
    if (category.includes('Anorganik')) return 'text-blue-400 border-blue-500/50 bg-blue-500/10';
    if (category.includes('Organik')) return 'text-green-400 border-green-500/50 bg-green-500/10';
    return 'text-gray-400 border-gray-500/50 bg-gray-500/10';
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-200 font-sans selection:bg-emerald-500/30">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-slate-900/80 backdrop-blur-md border-b border-slate-800 px-6 py-4 flex items-center justify-between shadow-lg">
        <div className="flex items-center gap-2">
          <div className="bg-emerald-500/20 p-2 rounded-lg border border-emerald-500/30">
            <Leaf className="w-6 h-6 text-emerald-400" />
          </div>
          <h1 className="text-xl font-bold bg-gradient-to-r from-emerald-400 to-cyan-400 bg-clip-text text-transparent">
            Eco-Logic
          </h1>
        </div>
        <div className="flex items-center gap-4 text-sm font-medium">
          <div className="hidden sm:flex items-center gap-2 px-3 py-1 bg-slate-800 rounded-full border border-slate-700">
            <Award className="w-4 h-4 text-yellow-500" />
            <span>240 Poin</span>
          </div>
          <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-emerald-500 to-blue-500 border-2 border-slate-800"></div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-4xl mx-auto p-4 sm:p-6 lg:p-8 pb-24">
        
        {/* Tab Navigation */}
        <div className="flex bg-slate-900 p-1 rounded-xl mb-8 border border-slate-800 shadow-sm">
          <button 
            onClick={() => setActiveTab('dashboard')}
            className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-lg text-sm font-medium transition-all ${activeTab === 'dashboard' ? 'bg-slate-800 text-emerald-400 shadow' : 'text-slate-400 hover:text-slate-300'}`}
          >
            <Home className="w-4 h-4" /> Dashboard
          </button>
          <button 
            onClick={() => setActiveTab('identify')}
            className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-lg text-sm font-medium transition-all ${activeTab === 'identify' ? 'bg-slate-800 text-emerald-400 shadow' : 'text-slate-400 hover:text-slate-300'}`}
          >
            <Search className="w-4 h-4" /> Identifikasi AI
          </button>
          <button 
            onClick={() => setActiveTab('history')}
            className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-lg text-sm font-medium transition-all ${activeTab === 'history' ? 'bg-slate-800 text-emerald-400 shadow' : 'text-slate-400 hover:text-slate-300'}`}
          >
            <History className="w-4 h-4" /> Riwayat
          </button>
        </div>

        {/* Tab Content: Identify */}
        {activeTab === 'identify' && (
          <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
            
            {/* Input Card */}
            <div className="bg-slate-900 rounded-2xl border border-slate-800 p-6 shadow-xl relative overflow-hidden">
              <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-500/5 rounded-full blur-3xl -mr-20 -mt-20 pointer-events-none"></div>
              
              <h2 className="text-xl font-semibold mb-4 text-slate-100 flex items-center gap-2">
                Identifikasi Material
              </h2>
              <p className="text-slate-400 text-sm mb-6">
                Ketik nama barang atau unggah foto untuk mengetahui kategori sampah dan instruksi penanganannya secara cerdas.
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
              <div className="bg-slate-900 rounded-2xl border border-slate-800 p-8 text-center animate-pulse">
                <Loader2 className="w-8 h-8 text-emerald-500 animate-spin mx-auto mb-4" />
                <h3 className="text-slate-300 font-medium">Memproses dengan AI...</h3>
                <p className="text-slate-500 text-sm mt-2">Menghubungkan ke layanan klasifikasi & GIS</p>
              </div>
            )}

            {/* Results Display */}
            {result && !isAnalyzing && (
              <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
                
                {/* Identification Card */}
                <div className="bg-slate-900 rounded-2xl border border-slate-800 p-6 shadow-xl relative overflow-hidden">
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

                  <div className="grid sm:grid-cols-2 gap-4 mt-2">
                    <div className="bg-slate-950 p-4 rounded-xl border border-slate-800">
                      <h4 className="text-slate-400 text-xs font-semibold mb-2 uppercase flex items-center gap-2">
                         Standard Operating Procedure (SOP)
                      </h4>
                      <p className="text-slate-200 text-sm leading-relaxed">
                        {result.handling_step}
                      </p>
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

                {/* GIS Drop-point Card */}
                {result.locations.length > 0 && (
                  <div className="bg-slate-900 rounded-2xl border border-slate-800 p-6 shadow-xl">
                    <div className="flex justify-between items-center mb-6">
                      <h2 className="text-lg font-semibold text-slate-100 flex items-center gap-2">
                        <MapPin className="w-5 h-5 text-emerald-500" />
                        Lokasi Pembuangan Terdekat
                      </h2>
                      <span className="text-xs text-slate-500 bg-slate-950 px-2 py-1 rounded border border-slate-800">
                        Radius 5KM (GIS)
                      </span>
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
        )}

        {/* Tab Content: Dashboard */}
        {activeTab === 'dashboard' && (
          <div className="space-y-6 animate-in fade-in duration-500">
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
              <div className="bg-slate-900 p-5 rounded-2xl border border-slate-800">
                <Leaf className="w-6 h-6 text-emerald-500 mb-3" />
                <h3 className="text-3xl font-bold text-slate-100">12</h3>
                <p className="text-sm text-slate-400 mt-1">Aksi Peduli</p>
              </div>
              <div className="bg-slate-900 p-5 rounded-2xl border border-slate-800">
                <AlertTriangle className="w-6 h-6 text-red-500 mb-3" />
                <h3 className="text-3xl font-bold text-slate-100">3</h3>
                <p className="text-sm text-slate-400 mt-1">Limbah B3 Diselamatkan</p>
              </div>
              <div className="bg-slate-900 p-5 rounded-2xl border border-slate-800 col-span-2 sm:col-span-1">
                <Award className="w-6 h-6 text-yellow-500 mb-3" />
                <h3 className="text-3xl font-bold text-slate-100">240</h3>
                <p className="text-sm text-slate-400 mt-1">Poin Terkumpul</p>
              </div>
            </div>

            <div className="bg-slate-900 rounded-2xl border border-slate-800 p-6">
              <h2 className="text-lg font-semibold text-slate-100 mb-4">Misi Anda Hari Ini</h2>
              <div className="space-y-3">
                <div className="flex items-center justify-between p-4 bg-slate-950 rounded-xl border border-slate-800">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-blue-500/20 flex items-center justify-center border border-blue-500/30">
                      <UploadCloud className="w-5 h-5 text-blue-400" />
                    </div>
                    <div>
                      <h4 className="font-medium text-slate-200">Identifikasi 1 Botol Plastik</h4>
                      <p className="text-xs text-slate-500">+10 Poin</p>
                    </div>
                  </div>
                  <button className="text-sm bg-slate-800 px-3 py-1.5 rounded-lg text-emerald-400 font-medium">Mulai</button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Tab Content: History */}
        {activeTab === 'history' && (
          <div className="bg-slate-900 rounded-2xl border border-slate-800 p-6 animate-in fade-in duration-500">
            <h2 className="text-lg font-semibold text-slate-100 mb-6 flex items-center gap-2">
              <History className="w-5 h-5" />
              Log Pembuangan (Reporting System)
            </h2>
            
            {history.length === 0 ? (
              <div className="text-center py-12 text-slate-500">
                <UploadCloud className="w-12 h-12 mx-auto mb-3 opacity-20" />
                <p>Belum ada aktivitas pembuangan.</p>
                <button onClick={() => setActiveTab('identify')} className="text-emerald-400 mt-2 text-sm">Mulai Identifikasi</button>
              </div>
            ) : (
              <div className="space-y-4">
                {history.map((log, idx) => (
                  <div key={idx} className="flex items-center justify-between p-4 bg-slate-950 rounded-xl border border-slate-800">
                    <div>
                      <h4 className="font-medium text-slate-200">{log.item_name}</h4>
                      <div className="flex gap-2 items-center mt-1">
                        <span className="text-xs text-slate-500">{log.date}</span>
                        <span className="text-slate-700">•</span>
                        <span className={`text-[10px] uppercase font-bold px-1.5 py-0.5 rounded border ${getCategoryColor(log.category)}`}>
                          {log.category.split(' ')[0]}
                        </span>
                      </div>
                    </div>
                    <div className="text-right">
                      <span className="text-sm font-medium text-emerald-400">+15 Poin</span>
                      <p className="text-xs text-slate-500 mt-1">Berhasil dicatat</p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </main>
    </div>
  );
}
