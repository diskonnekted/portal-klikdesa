const fs = require('fs');
const turf = require('@turf/turf');

console.log("Reading peta_desa.geojson...");
const desaGeoJson = JSON.parse(fs.readFileSync('./public/peta_desa.geojson', 'utf8'));

console.log(`Total desa features: ${desaGeoJson.features.length}`);

// Group features by Kecamatan
const kecamatanMap = {};

for (const feature of desaGeoJson.features) {
    const kecName = feature.properties.Kecamatan || "Unknown";
    
    if (!kecamatanMap[kecName]) {
        kecamatanMap[kecName] = [];
    }
    
    // Ensure the geometry is valid before adding
    if (feature.geometry && (feature.geometry.type === 'Polygon' || feature.geometry.type === 'MultiPolygon')) {
        kecamatanMap[kecName].push(feature);
    }
}

console.log(`Found ${Object.keys(kecamatanMap).length} Kecamatan.`);

const kecamatanFeatures = [];

for (const kecName in kecamatanMap) {
    console.log(`Processing ${kecName} with ${kecamatanMap[kecName].length} desa...`);
    
    try {
        // Create a FeatureCollection for this Kecamatan's villages
        const collection = turf.featureCollection(kecamatanMap[kecName]);
        
        // Dissolve/Union all polygons in the collection
        // Turf.js dissolve merges features that share the same property, 
        // if property is omitted, it merges all features into one.
        const dissolved = turf.dissolve(collection);
        
        if (dissolved && dissolved.features && dissolved.features.length > 0) {
            // Take the first merged feature
            const mergedFeature = dissolved.features[0];
            
            // Re-assign properties
            mergedFeature.properties = {
                Kecamatan: kecName,
                Kabupaten: "Banjarnegara",
                Name: kecName
            };
            
            kecamatanFeatures.push(mergedFeature);
        } else {
            console.error(`Failed to dissolve ${kecName}, result was empty.`);
        }
    } catch (e) {
        console.error(`Error processing ${kecName}:`, e);
    }
}

const finalCollection = turf.featureCollection(kecamatanFeatures);

console.log(`Writing peta_kecamatan.geojson with ${finalCollection.features.length} features...`);
fs.writeFileSync('./public/peta_kecamatan.geojson', JSON.stringify(finalCollection));
console.log("Done!");
