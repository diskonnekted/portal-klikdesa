fetch('https://opendata.banjarnegarakab.go.id/api/3/action/package_search?q=stunting&rows=100')
    .then(res => res.json())
    .then(data => {
        data.result.results.forEach(p => {
            let t = p.title.toUpperCase();
            t = t.replace('DATA JUMLAH BALITA STUNTING PER DESA/KELURAHAN KECAMATAN ', '')
                 .replace('DATA JUMLAH BALITA STUNTING KECAMATAN ', '');
            const resource = p.resources.find(r => r.format.toLowerCase() === 'csv' || r.format.toLowerCase() === 'json' || r.name.toLowerCase().includes('data'));
            if (resource) {
                console.log(`"${t.trim()}": "${resource.id}",`);
            }
        });
    })
    .catch(err => console.error(err));
