export const opendataConfig = {
    // Mapping Kecamatan name (uppercase, normalized) to their respective Stunting dataset resource ID in OpenData Banjarnegara
    stuntingDesaResourceIds: {
        "KARANGKOBAR": "0afa8c6f-1b9b-479f-a224-38e3b4ac3dec",
        "PANDANARUM": "420e76ca-11b0-442f-bdb6-483c35f56cf3", // Updated from latest API result
        "BATUR": "43328c40-2130-496c-84a5-14f572de0f73",
        "PUNGGELAN": "ef079430-4358-4e55-8c28-c50c8ca557e2",
        "WANAYASA": "3e146372-8765-450a-8122-9def72c4f581",
        "SIGALUH": "4b6e17d4-43a9-4d37-a485-a4382379fb95",
        "PEJAWARAN": "537920fd-d421-4757-895f-9412d6ce1ec7",
        "BANJARNEGARA": "01d6fafd-465f-4b2f-8241-62e9e7ec7678",
        "BAWANG": "02ba5afa-ed6e-4149-a84c-8db802a418ee",
        "RAKIT": "b334119b-8a22-4f50-8155-7e8ac9c49fb4",
        "MANDIRAJA": "cb547f80-4306-426c-a489-9bf8de58f6ca",
        "SUSUKAN": "d0f902df-0aa2-4c01-8d97-de0bbaa36781",
        "PAGENTENTAN": "25d03f50-c534-4a0a-93c0-bb50a4485a39", // Wait, API said "Kecamatan Pagentan"
        "PAGENTAN": "25d03f50-c534-4a0a-93c0-bb50a4485a39",
        "WANADADI": "e3ae8f8d-b927-4384-82f1-b99147381c45",
    } as Record<string, string>,

    // Helper to get resource ID by Kecamatan Name safely
    getStuntingResourceIdByKecamatan: (kecamatanName: string): string | null => {
        if (!kecamatanName) return null;
        
        // Normalize: remove "Kec.", "Kecamatan", trim, uppercase
        const normalized = kecamatanName
            .replace(/kecamatan/i, '')
            .replace(/kec\./i, '')
            .trim()
            .toUpperCase();
            
        return opendataConfig.stuntingDesaResourceIds[normalized] || null;
    }
};
