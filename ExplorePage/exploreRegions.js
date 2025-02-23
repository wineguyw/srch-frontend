// MapBox access token (replace with your actual token if needed)
mapboxgl.accessToken = "pk.eyJ1Ijoid2VzbGV5ZWxsaW90dCIsImEiOiJjbTdncXJvMzMxMDB1Mmxwdmlyb2s0c2JlIn0.nOaxv1GoC7lp-ko57CKNSQ";

document.addEventListener("DOMContentLoaded", () => {
  const globeContainer = document.getElementById("globeViz");
  const countryFilter = document.getElementById("countryFilter");
  const regionFilter = document.getElementById("regionFilter");
  const subregionFilter = document.getElementById("subregionFilter");
  const subregionGroup = document.getElementById("subregionGroup");

  if (!globeContainer) {
    console.error("❌ ERROR: Globe container #globeViz NOT found in the DOM! Please ensure <div id='globeViz'></div> exists in your HTML.");
    return;
  }

  console.log("✅ Initializing MapBox Globe...");

  // Wine region data (adjusted subregion zoom for more context)
  const wineRegions = {
    USA: { lat: 39.8283, lng: -98.5795, zoom: 2, regions: {
      "Napa Valley": { lat: 38.2975, lng: -122.2869, zoom: 10, subregions: [
        { name: "St. Helena AVA", lat: 38.505, lng: -122.470 },
        { name: "Oakville AVA", lat: 38.428, lng: -122.408 },
        { name: "Yountville AVA", lat: 38.401, lng: -122.361 }
      ]},
      "Sonoma County": { lat: 38.433, lng: -122.515, zoom: 10, subregions: [
        { name: "Russian River Valley", lat: 38.495, lng: -122.950 },
        { name: "Alexander Valley", lat: 38.648, lng: -122.867 }
      ]}
    }},
    France: { lat: 46.6034, lng: 1.8883, zoom: 3, regions: {
      "Bordeaux": { lat: 44.8378, lng: -0.5792, zoom: 10, subregions: [
        { name: "Médoc", lat: 45.100, lng: -0.850 },
        { name: "Saint-Émilion", lat: 44.895, lng: -0.155 }
      ]}
    }},
    Italy: { lat: 41.8719, lng: 12.5674, zoom: 3, regions: {
      "Tuscany": { lat: 43.7711, lng: 11.2486, zoom: 10, subregions: [
        { name: "Chianti", lat: 43.469, lng: 11.046 },
        { name: "Montalcino", lat: 43.056, lng: 11.489 }
      ]}
    }},
    Spain: { lat: 40.4637, lng: -3.7492, zoom: 3, regions: {
      "Rioja": { lat: 42.303, lng: -2.427, zoom: 10, subregions: [
        { name: "Alta", lat: 42.418, lng: -2.723 },
        { name: "Alavesa", lat: 42.608, lng: -2.579 }
      ]}
    }},
    Portugal: { lat: 39.3999, lng: -8.2245, zoom: 3, regions: {
      "Douro Valley": { lat: 41.160, lng: -7.720, zoom: 10, subregions: [
        { name: "Cima Corgo", lat: 41.117, lng: -7.722 },
        { name: "Baixo Corgo", lat: 41.197, lng: -7.728 }
      ]}
    }},
    Australia: { lat: -25.2744, lng: 133.7751, zoom: 3, regions: {
      "Barossa Valley": { lat: -34.554, lng: 138.958, zoom: 10, subregions: [
        { name: "Eden Valley", lat: -34.554, lng: 139.054 }
      ]}
    }},
    "New Zealand": { lat: -40.9006, lng: 174.8860, zoom: 3, regions: {
      "Marlborough": { lat: -41.5134, lng: 173.9612, zoom: 10, subregions: [
        { name: "Wairau Valley", lat: -41.517, lng: 173.916 }
      ]}
    }},
    "South Africa": { lat: -30.5595, lng: 22.9375, zoom: 3, regions: {
      "Stellenbosch": { lat: -33.934, lng: 18.860, zoom: 10, subregions: [
        { name: "Simonsberg", lat: -33.890, lng: 18.860 }
      ]}
    }},
    Argentina: { lat: -38.4161, lng: -63.6167, zoom: 3, regions: {
      "Mendoza": { lat: -32.889, lng: -68.845, zoom: 10, subregions: [
        { name: "Luján de Cuyo", lat: -32.97, lng: -68.88 },
        { name: "Uco Valley", lat: -33.61, lng: -69.21 }
      ]}
    }},
    Chile: { lat: -35.6751, lng: -71.5430, zoom: 3, regions: {
      "Maipo Valley": { lat: -33.772, lng: -70.675, zoom: 10, subregions: [
        { name: "Alto Maipo", lat: -33.650, lng: -70.700 }
      ]}
    }},
    Germany: { lat: 51.1657, lng: 10.4515, zoom: 3, regions: {
      "Mosel": { lat: 49.744, lng: 6.627, zoom: 10, subregions: [
        { name: "Bernkastel", lat: 49.915, lng: 6.920 }
      ]}
    }}
  };

  const allLabels = [
    { name: "Napa Valley", country: "USA", lat: 38.2975, lng: -122.2869 },
    { name: "Sonoma County", country: "USA", lat: 38.433, lng: -122.515 },
    { name: "Bordeaux", country: "France", lat: 44.8378, lng: -0.5792 },
    { name: "Tuscany", country: "Italy", lat: 43.7711, lng: 11.2486 },
    { name: "Rioja", country: "Spain", lat: 42.303, lng: -2.427 },
    { name: "Douro Valley", country: "Portugal", lat: 41.160, lng: -7.720 },
    { name: "Barossa Valley", country: "Australia", lat: -34.554, lng: 138.958 },
    { name: "Marlborough", country: "New Zealand", lat: -41.5134, lng: 173.9612 },
    { name: "Stellenbosch", country: "South Africa", lat: -33.934, lng: 18.860 },
    { name: "Mendoza", country: "Argentina", lat: -32.889, lng: -68.845 },
    { name: "Maipo Valley", country: "Chile", lat: -33.772, lng: -70.675 },
    { name: "Mosel", country: "Germany", lat: 49.744, lng: 6.627 }
  ];

  // Initialize MapBox GL JS globe
  const map = new mapboxgl.Map({
    container: "globeViz",
    style: "mapbox://styles/mapbox/satellite-streets-v12", // High-resolution, clear style
    center: [0, 20], // Global view
    zoom: 1, // Start at global zoom
    projection: "globe", // 3D globe projection
    maxZoom: 22, // Allow high zoom for subregions
    minZoom: 0 // Allow global view
  });

  // Add navigation controls
  map.addControl(new mapboxgl.NavigationControl(), "top-right");

  // Disable scroll zoom initially, enable on interaction
  map.scrollZoom.disable();
  globeContainer.addEventListener("mousedown", () => map.scrollZoom.enable());
  globeContainer.addEventListener("touchstart", () => map.scrollZoom.enable());

  // Adjust atmosphere for minimal glow and reduced stars
  map.on("style.load", () => {
    map.setFog({
      color: "rgba(0, 0, 0, 0.1)", // Minimal glow
      "high-color": "#1a1a1a", // Darker, less prominent
      "horizon-blend": 0.01, // Reduced blend
      "star-intensity": 0.1 // Minimal stars
    });
  });

  // Generate rings for wine regions, scaled for clarity
  const generateRings = (location) => {
    const rings = [];
    const numRings = 3; // Reduced for clarity
    const baseSize = 0.05; // Smaller base size
    const spacing = 0.02; // Tighter spacing

    for (let i = 0; i < numRings; i++) {
      rings.push({
        type: "circle",
        geometry: {
          type: "Point",
          coordinates: [location.lng, location.lat]
        },
        properties: {
          radius: baseSize + i * spacing, // Controlled radius
          speed: 0.02 + i * 0.005, // Slower propagation
          period: 3000 + i * 400, // Faster cycle
          color: `rgba(255, 69, 0, ${0.6 - i * 0.1})` // Adjusted opacity
        }
      });
    }
    return rings;
  };

  const ringsData = allLabels.flatMap(generateRings);

  // Add rings as a GeoJSON source and layer
  map.on("load", () => {
    map.addSource("rings", {
      type: "geojson",
      data: {
        type: "FeatureCollection",
        features: ringsData
      }
    });

    map.addLayer({
      id: "rings-layer",
      type: "circle",
      source: "rings",
      paint: {
        "circle-radius": [
          "interpolate",
          ["linear"],
          ["zoom"],
          0, ["get", "radius"], // Small at low zooms
          22, ["*", ["get", "radius"], 5] // Scale up slightly at high zooms, but cap
        ],
        "circle-color": ["get", "color"],
        "circle-opacity": 0.6 // Reduced opacity
      }
    });

    // Animate rings with controlled expansion
    function animateRings(timestamp) {
      ringsData.forEach((ring, index) => {
        const properties = ring.properties;
        const progress = (timestamp % properties.period) / properties.period;
        const radius = properties.radius * (1 + Math.sin(progress * Math.PI * 2) * properties.speed);
        ring.properties.radius = Math.min(radius, 0.5); // Cap radius to prevent screen-filling
      });
      map.getSource("rings").setData({
        type: "FeatureCollection",
        features: ringsData
      });
      requestAnimationFrame(animateRings);
    }
    requestAnimationFrame(animateRings);
  });

  // Auto-rotation
  let autoRotate = true;
  const rotationSpeed = 0.02; // Degrees per frame

  function rotateGlobe() {
    if (autoRotate) {
      const currentBearing = map.getBearing();
      map.easeTo({ bearing: currentBearing + rotationSpeed, duration: 0 });
      requestAnimationFrame(rotateGlobe);
    }
  }

  rotateGlobe();

  // Stop auto-rotation on interaction
  function stopAutoRotate() {
    autoRotate = false;
  }

  globeContainer.addEventListener("mousedown", stopAutoRotate);
  globeContainer.addEventListener("touchstart", stopAutoRotate);

  // Track and manage zoom level
  let currentZoomLevel = 1.0;

  function stopAndZoom(lat, lng, zoom) {
    console.log(`📌 Zooming to Lat: ${lat}, Lng: ${lng}, Zoom: ${zoom}`);
    stopAutoRotate();
    currentZoomLevel = zoom;
    map.easeTo({
      center: [lng, lat],
      zoom: zoom,
      duration: 3000, // Increased from 1500 to slow down the animation
      pitch: 0 // Flat view for consistency
    });
  }

  // Country Selection
  countryFilter.addEventListener("change", () => {
    const country = countryFilter.value;
    console.log("🔍 Selected Country:", country);

    regionFilter.innerHTML = '<option value="">Select a Region</option>';
    regionFilter.disabled = !country;
    subregionFilter.innerHTML = '<option value="">Select a Subregion</option>';
    subregionFilter.disabled = true;
    subregionGroup.style.display = "none";

    if (country) {
      Object.keys(wineRegions[country].regions).forEach(region => {
        const option = document.createElement("option");
        option.value = region;
        option.textContent = region;
        regionFilter.appendChild(option);
      });
      stopAndZoom(wineRegions[country].lat, wineRegions[country].lng, wineRegions[country].zoom);
    }
  });

  // Region Selection
  regionFilter.addEventListener("change", () => {
    const country = countryFilter.value;
    const region = regionFilter.value;
    console.log("🔍 Selected Region:", region);

    subregionFilter.innerHTML = '<option value="">Select a Subregion</option>';
    subregionFilter.disabled = true;
    subregionGroup.style.display = "none";

    if (region) {
      const regionData = wineRegions[country].regions[region];
      stopAndZoom(regionData.lat, regionData.lng, regionData.zoom);

      if (regionData.subregions?.length) {
        console.log(`🟢 Found ${regionData.subregions.length} subregions for ${region}`);
        subregionFilter.disabled = false;
        subregionGroup.style.display = "block";
        regionData.subregions.forEach(subregion => {
          const option = document.createElement("option");
          option.value = subregion.name;
          option.textContent = subregion.name;
          subregionFilter.appendChild(option);
        });
      }
    }
  });

  // Subregion Selection (adjusted zoom for more context)
  subregionFilter.addEventListener("change", () => {
    const country = countryFilter.value;
    const region = regionFilter.value;
    const subregion = subregionFilter.value;
    console.log("🔍 Selected Subregion:", subregion);

    if (subregion) {
      const subregionData = wineRegions[country].regions[region].subregions.find(s => s.name === subregion);
      stopAndZoom(subregionData.lat, subregionData.lng, 11); // Reduced from 14 to 11 for more context
    }
  });

  // Add labels for wine regions
  map.on("load", () => {
    map.addSource("labels", {
      type: "geojson",
      data: {
        type: "FeatureCollection",
        features: allLabels.map(label => ({
          type: "Feature",
          geometry: { type: "Point", coordinates: [label.lng, label.lat] },
          properties: { name: label.name, country: label.country }
        }))
      }
    });

    map.addLayer({
      id: "labels-layer",
      type: "symbol",
      source: "labels",
      layout: {
        "text-field": ["get", "name"],
        "text-size": 12,
        "text-offset": [0, 1.5],
        "text-anchor": "top",
        "visibility": "visible"
      },
      paint: {
        "text-color": "#ffffff",
        "text-halo-color": "#000000",
        "text-halo-width": 1
      },
      minzoom: 2, // Show at country level
      maxzoom: 12 // Hide at subregional zooms for clarity
    });
  });

  console.log("✅ MapBox Globe Initialized with Adjusted Zoom and Slower Animation!");
});