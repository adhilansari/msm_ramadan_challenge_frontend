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

export async function fetchSurahMulk(): Promise<Ayat[]> {
    try {
        // Fetch Admin Configuration
        let start_ayat = 1;
        let end_ayat = 30;
        try {
            const configRes = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001'}/game/config`, { next: { revalidate: 0 } });
            if (configRes.ok) {
                const config = await configRes.json();
                start_ayat = config.start_ayat;
                end_ayat = config.end_ayat;
            }
        } catch (e) {
            console.error('Failed to fetch challenge config, defaulting to 1-30', e);
        }

        const limit = end_ayat - start_ayat + 1;
        const page = Math.floor((start_ayat - 1) / limit) + 1; // Basic approximation to get the verses. Since we query per_page=30 usually, we will fetch everything and slice.

        // To make it robust: fetch all 30 verses of Surah Mulk first, then slice it to the configured range.
        const res = await fetch(
            'https://api.quran.com/api/v4/verses/by_chapter/67?words=true&word_fields=text_uthmani_tajweed,text_uthmani&translations=37&per_page=30',
            { cache: 'no-store' }
        )
        if (!res.ok) throw new Error('Failed to fetch Surah Mulk')

        const data = await res.json()
        const allVerses: Ayat[] = data.verses;

        // Filter based on admin configuration
        return allVerses.filter(v => v.verse_number >= start_ayat && v.verse_number <= end_ayat);
    } catch (err) {
        console.error('Error fetching Quran data:', err)
        return []
    }
}
