export const opendataConfig = {
    // Mapping Kecamatan name (uppercase, normalized) to their respective Stunting dataset resource ID in OpenData Banjarnegara
    stuntingDesaResourceIds: {
        "KARANGKOBAR": "0afa8c6f-1b9b-479f-a224-38e3b4ac3dec",
        "PANDANARUM": "f5ebb442-dca4-4a42-8fa2-c24c8b8e9f49",
        "BATUR": "43328c40-2130-496c-84a5-14f572de0f73",
        "PUNGGELAN": "ef079430-4358-4e55-8c28-c50c8ca557e2",
        "WANAYASA": "3e146372-8765-450a-8122-9def72c4f581",
        // Add more kecamatans here as their Resource IDs become known
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
