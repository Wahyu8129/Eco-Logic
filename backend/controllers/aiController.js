const { GoogleGenerativeAI } = require("@google/generative-ai");

// Inisialisasi API Gemini
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

// System prompt untuk membatasi ruang lingkup bot
const SYSTEM_PROMPT = `
Anda adalah EcoBot, asisten AI resmi untuk aplikasi Eco-Logic.
Tugas utama Anda adalah mengedukasi pengguna tentang pengelolaan sampah, mengidentifikasi jenis sampah dari gambar, dan menjelaskan fitur-fitur aplikasi Eco-Logic.

ATURAN KETAT YANG HARUS ANDA PATUHI:
1. BATASAN TOPIK: Anda HANYA boleh merespons percakapan yang berhubungan dengan:
   - Sampah, limbah, daur ulang, dan pengelolaan lingkungan.
   - Pertanyaan seputar fitur aplikasi Eco-Logic (sistem poin, riwayat, lokasi pembuangan).
   - Dampak lingkungan dan gaya hidup ramah lingkungan (go-green).

2. MENOLAK TOPIK LAIN: Jika pengguna menanyakan topik di luar batasan di atas (contoh: politik, hiburan, game, coding, atau hal umum lainnya), Anda HARUS menolak dengan sopan.
   Gunakan kalimat seperti: "Maaf, saya adalah asisten khusus lingkungan Eco-Logic. Saya hanya dapat membantu Anda berdiskusi seputar pengelolaan sampah dan fitur aplikasi ini. Ada yang bisa saya bantu terkait sampah hari ini?"

3. ATURAN GAMBAR (Jika ada): Jika pengguna mengunggah gambar, analisis apakah itu adalah sampah, tempat sampah, atau barang yang berpotensi didaur ulang. 
   Jika gambar tersebut TIDAK relevan (misalnya: foto manusia/selfie, hewan peliharaan, makanan di piring, dsb), tolak dengan halus.
   Gunakan kalimat seperti: "Maaf, dari gambar yang saya lihat, sepertinya ini bukan barang yang terkait dengan sampah atau daur ulang. Mohon unggah foto objek sampah yang ingin Anda identifikasi."

4. GAYA BAHASA: Gunakan bahasa Indonesia yang ramah, suportif, dan edukatif. Posisikan diri Anda sebagai teman yang peduli lingkungan.
`;

const chatWithAI = async (req, res) => {
    try {
        const { message, missionContext } = req.body;

        if (!message) {
            return res.status(400).json({ success: false, message: "Pesan tidak boleh kosong." });
        }

        let dynamicPrompt = SYSTEM_PROMPT;
        if (missionContext) {
            dynamicPrompt += `\n\n[INFO TAMBAHAN]\nBerikut adalah status misi harian dan mingguan pengguna saat ini:\n${missionContext}\nBerikan informasi misi ini HANYA jika pengguna menanyakannya. Bersikaplah ramah dan menyemangati.`;
        }

        // Gunakan model gemini-2.5-flash
        const model = genAI.getGenerativeModel({ 
            model: "gemini-2.5-flash",
            systemInstruction: dynamicPrompt 
        });

        const result = await model.generateContent(message);
        const response = await result.response;
        const text = response.text();

        res.json({
            success: true,
            reply: text
        });
    } catch (error) {
        console.error("AI Error:", error);
        res.status(500).json({ success: false, message: "Terjadi kesalahan saat menghubungi AI." });
    }
};

const identifyWaste = async (req, res) => {
    try {
        const { text, imageBase64 } = req.body;
        
        if (!text && !imageBase64) {
            return res.status(400).json({ success: false, message: "Teks atau gambar tidak boleh kosong." });
        }

        const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });
        
        const prompt = `Anda adalah sistem identifikasi sampah Eco-Logic. 
Tugas Anda adalah mengidentifikasi benda yang diberikan (melalui teks atau gambar) dan merespons HANYA dengan format JSON yang valid, tanpa teks markdown lainnya.
Format JSON:
{
  "item_name": "Nama Benda (Singkat)",
  "category": "Pilih salah satu: Organik / Anorganik / Limbah B3",
  "confidence_score": "Angka 1-100 menunjukkan seberapa yakin Anda",
  "handling_step": "SOP atau langkah penanganan pembuangan",
  "safety_warning": "Peringatan keamanan jika ada (atau 'Tidak ada bahaya khusus')",
  "recyclability": "Tingkat/Potensi daur ulang (Misal: 'Tinggi - Mudah didaur ulang')"
}`;
        
        let contentToGenerate = [prompt];
        
        if (text) {
            contentToGenerate.push(`Benda yang perlu diidentifikasi: ${text}`);
        }
        
        if (imageBase64) {
            // imageBase64 format: data:image/jpeg;base64,.....
            const base64Data = imageBase64.replace(/^data:image\/\w+;base64,/, "");
            const mimeType = imageBase64.match(/^data:(image\/\w+);base64,/)?.[1] || "image/jpeg";
            
            contentToGenerate.push({
                inlineData: {
                    data: base64Data,
                    mimeType: mimeType
                }
            });
        }

        const result = await model.generateContent(contentToGenerate);
        const response = await result.response;
        let responseText = response.text();
        
        // Clean markdown JSON ticks if present
        responseText = responseText.replace(/```json/g, "").replace(/```/g, "").trim();
        
        const jsonResult = JSON.parse(responseText);
        
        // --- Fase 3: Pencocokan Data (Database Matching) ---
        try {
            const db = require('../config/db');
            const [categories] = await db.execute('SELECT * FROM waste_categories');
            
            for (const cat of categories) {
                const dbName = cat.name.toLowerCase();
                const dbDesc = cat.description.toLowerCase();
                const itemName = jsonResult.item_name.toLowerCase();
                const aiCat = jsonResult.category.toLowerCase();
                
                // Cek apakah item dari AI cocok dengan keyword di database
                if (itemName.includes(dbName) || dbDesc.includes(itemName) || aiCat.includes(dbName)) {
                    jsonResult.handling_step = `[SOP Resmi Database] ${cat.handling_sop}`;
                    if (cat.danger_level === 'Tinggi') {
                        jsonResult.safety_warning = `[BAHAYA TINGGI] ${jsonResult.safety_warning}`;
                    }
                    break;
                }
            }
        } catch (dbError) {
            console.error("DB Match error:", dbError);
            // Tetap lanjut menggunakan fallback hasil asli dari AI
        }
        
        // Add dummy location data for UI until Phase 4 (GIS) is done
        jsonResult.locations = [
            { name: "Bank Sampah Terdekat (Simulasi)", distance: (Math.random() * 5).toFixed(1), status_open: true },
            { name: "TPA Kota (Simulasi)", distance: (Math.random() * 10 + 5).toFixed(1), status_open: true }
        ];

        res.json({
            success: true,
            data: jsonResult
        });
    } catch (error) {
        console.error("AI Identify Error:", error);
        res.status(500).json({ success: false, message: "Terjadi kesalahan saat mengidentifikasi sampah." });
    }
};

module.exports = {
    chatWithAI,
    identifyWaste
};
