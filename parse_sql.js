const fs = require('fs');

const sql = fs.readFileSync('public/data-desa.sql', 'utf8');
const lines = sql.split('\n');

const desaMap = {};

let inInsert = false;
for (let line of lines) {
    line = line.trim();
    if (line.startsWith("INSERT INTO `desa`")) {
        inInsert = true;
        continue;
    }
    
    if (inInsert) {
        const match = line.match(/^\((.*)\)[,;]/);
        if (match) {
            const rowStr = "[" + match[1] + "]";
            try {
                const cleanRow = rowStr.replace(/NULL/g, "null");
                // eslint-disable-next-line no-new-func
                const row = new Function('return ' + cleanRow)();
                
                const nama_kecamatan = row[1];
                const nama_desa = row[2];
                const alamat_website = row[3];
                const jumlah_penduduk = row[4];
                const db_penduduk = row[8];
                const developer = row[11];
                
                if (nama_desa && nama_kecamatan) {
                    const cleanKec = nama_kecamatan.replace(/kecamatan/i, '').replace(/kec\./i, '').trim().toUpperCase();
                    const cleanDesa = nama_desa.toUpperCase();
                    const key = cleanDesa + "_" + cleanKec;
                    
                    desaMap[key] = {
                        kecamatan: nama_kecamatan,
                        isDigital: db_penduduk === 'Sudah Ada',
                        pop: new Intl.NumberFormat('id-ID').format(jumlah_penduduk || 0),
                        website: alamat_website && alamat_website.length > 5 ? alamat_website : null,
                        provider: developer || "Belum Ada"
                    };
                }
            } catch (e) {
                console.error("Error parsing row:", line);
            }
        }
        
        if (line.endsWith(";")) {
            inInsert = false;
        }
    }
}

fs.writeFileSync('public/desa_data.json', JSON.stringify(desaMap, null, 2));
console.log("Successfully parsed " + Object.keys(desaMap).length + " villages into public/desa_data.json");
