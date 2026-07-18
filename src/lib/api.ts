import { API_URL } from '@/lib/constants'

export interface QuranWord {
    id: number
    position: number
    text: string
    text_uthmani: string
    text_uthmani_tajweed?: string
    translation: { text: string }
    char_type_name: string // "word" or "end"
}

export interface Ayat {
    id: number
    verse_number: number
    verse_key: string
    words: QuranWord[]
    translations: { id: number, text: string }[]
}

export const SURAH_NAMES = [
  "Al-Fatihah", "Al-Baqarah", "Ali 'Imran", "An-Nisa", "Al-Ma'idah", "Al-An'am", "Al-A'raf", "Al-Anfal", "At-Tawbah", "Yunus",
  "Hud", "Yusuf", "Ar-Ra'd", "Ibrahim", "Al-Hijr", "An-Nahl", "Al-Isra", "Al-Kahf", "Maryam", "Ta-Ha",
  "Al-Anbiya", "Al-Hajj", "Al-Mu'minun", "An-Nur", "Al-Furqan", "Ash-Shu'ara", "An-Naml", "Al-Qasas", "Al-Ankabut", "Ar-Rum",
  "Luqman", "As-Sajdah", "Al-Ahzab", "Saba", "Fatir", "Ya-Sin", "As-Saffat", "Sad", "Az-Zumar", "Ghafir",
  "Fussilat", "Ash-Shura", "Az-Zukhruf", "Ad-Dukhan", "Al-Jathiyah", "Al-Ahqaf", "Muhammad", "Al-Fath", "Al-Hujurat", "Qaf",
  "Adh-Dhariyat", "At-Tur", "An-Najm", "Al-Qamar", "Ar-Rahman", "Al-Waqi'ah", "Al-Hadid", "Al-Mujadilah", "Al-Hashr", "Al-Mumtahanah",
  "As-Saff", "Al-Jumu'ah", "Al-Munafiqun", "At-Taghabun", "At-Talaq", "At-Tahrim", "Al-Mulk", "Al-Qalam", "Al-Haqqah", "Al-Ma'arij",
  "Nuh", "Al-Jinn", "Al-Muzzammil", "Al-Muddaththir", "Al-Qiyamah", "Al-Insan", "Al-Mursalat", "An-Naba", "An-Naziat", "Abasa",
  "At-Takwir", "Al-Infitar", "Al-Mutaffifin", "Al-Inshiqaq", "Al-Buruj", "At-Tariq", "Al-A'la", "Al-Ghashiyah", "Al-Fajr", "Al-Balad",
  "Ash-Shams", "Al-Layl", "Ad-Duha", "Ash-Sharh", "At-Tin", "Al-Alaq", "Al-Qadr", "Al-Bayyinah", "Az-Zalzalah", "Al-Adiyat",
  "Al-Qari'ah", "At-Takathur", "Al-Asr", "Al-Humazah", "Al-Fil", "Quraysh", "Al-Ma'un", "Al-Kauthar", "Al-Kafirun", "An-Nasr",
  "Al-Masad", "Al-Ikhlas", "Al-Falaq", "An-Nas"
];

export async function fetchClassChallenge(className: string): Promise<{ ayats: Ayat[], surahName: string, surahNumber: number, startAyat: number, endAyat: number } | null> {
    try {
        let surahNumber = 67;
        let startAyat = 1;
        let endAyat = 30;
        try {
            const configRes = await fetch(`${API_URL}/game/config?class=${encodeURIComponent(className)}`, { next: { revalidate: 0 } });
            if (configRes.ok) {
                const config = await configRes.json();
                surahNumber = config.surah_number || 67;
                startAyat = config.start_ayat || 1;
                endAyat = config.end_ayat || 30;
            }
        } catch (e) {
            console.error('Failed to fetch challenge config, defaulting to Mulk 1-30', e);
        }

        const res = await fetch(
            `https://api.quran.com/api/v4/verses/by_chapter/${surahNumber}?words=true&word_fields=text_uthmani_tajweed,text_uthmani&translations=37&per_page=300`,
            { cache: 'no-store' }
        )
        if (!res.ok) throw new Error('Failed to fetch Surah verses')

        const data = await res.json()
        const allVerses: Ayat[] = data.verses;

        const ayats = allVerses.filter(v => v.verse_number >= startAyat && v.verse_number <= endAyat);
        const surahName = SURAH_NAMES[surahNumber - 1] || `Surah ${surahNumber}`;

        return {
            ayats,
            surahName,
            surahNumber,
            startAyat,
            endAyat
        }
    } catch (err) {
        console.error('Error fetching Quran data:', err)
        return null;
    }
}

export async function fetchSurahMulk(): Promise<Ayat[]> {
    try {
        const result = await fetchClassChallenge('');
        return result ? result.ayats : [];
    } catch (err) {
        console.error('Error fetching Surah Mulk:', err)
        return []
    }
}

