document.addEventListener("DOMContentLoaded", () => {
  const globeContainer = document.getElementById("globeViz");
  const countryFilter = document.getElementById("countryFilter");
  const regionFilter = document.getElementById("regionFilter");
  const subregionFilter = document.getElementById("subregionFilter");
  const subregionGroup = document.getElementById("subregionGroup");

  if (!globeContainer) {
    console.error("❌ ERROR: Globe container #globeViz NOT found in the DOM!");
    return;
  }

  console.log("✅ Initializing Globe...");

  // [Your existing wineRegions and allLabels objects remain exactly the same]

  // Generate multiple expanding rings per location
  const generateRings = (location) => {
    const rings = [];
    const numRings = 8;
    const baseSize = 1.0;
    const spacing = 0.15;

    for (let i = 0; i < numRings; i++) {
      rings.push({
        lat: location.lat,
        lng: location.lng,
        maxRadius: baseSize + i * spacing,
        propagationSpeed: 0.2 + i * 0.05,
        repeatPeriod: 4000 + i * 500,
        color: `rgba(255, 69, 0, ${0.9 - i * 0.1})`
      });
    }
    return rings;
  };

  const ringsData = allLabels.flatMap(generateRings);

  // 🌍 Initialize the Globe with Mapbox Tiles
  const MAPBOX_ACCESS_TOKEN = "pk.eyJ1Ijoid2VzbGV5ZWxsaW90dCIsImEiOiJjbTdncXJvMzMxMDB1Mmxwdmlyb2s0c2JlIn0.nOaxv1GoC7lp-ko57CKNSQ";

  // 🔹 Updated Tile Coordinate Function
  function latLngToTileCoords(lat, lng, zoom) {
    const n = Math.pow(2, zoom);
    // Ensure latitude is within Mapbox bounds (-85.0511 to 85.0511)
    const clampedLat = Math.max(-85.0511, Math.min(85.0511, lat));
    const latRad = clampedLat * Math.PI / 180;
    // Ensure longitude wraps correctly
    const wrappedLng = ((lng + 180) % 360 + 360) % 360 - 180;
    const xtile = Math.floor(((wrappedLng + 180) / 360) * n);
    const ytile = Math.floor((1 - Math.asinh(Math.tan(latRad)) / Math.PI) / 2 * n);
    return { x: xtile, y: ytile };
  }

  // 🔹 Updated Tile URL Function
  function getTileUrl(lat, lng, zoom) {
    try {
      const validZoom = Math.min(22, Math.max(0, Math.floor(zoom)));
      const { x, y } = latLngToTileCoords(lat, lng, validZoom);
      const wrappedX = ((x % Math.pow(2, validZoom)) + Math.pow(2, validZoom)) % Math.pow(2, validZoom);
      
      // Use Mapbox v4 endpoint for more reliable satellite imagery
      const tileUrl = `https://api.mapbox.com/v4/mapbox.satellite/${validZoom}/${wrappedX}/${y}@2x.jpg90?access_token=${MAPBOX_ACCESS_TOKEN}`;
      console.log(`🗺️ Generated Tile URL: ${tileUrl}`);
      return tileUrl;
    } catch (error) {
      console.error('Error generating tile URL:', error);
      return `https://api.mapbox.com/v4/mapbox.satellite/0/0/0@2x.jpg90?access_token=${MAPBOX_ACCESS_TOKEN}`;
    }
  }

  // 🔹 Updated Globe Initialization
  const myGlobe = Globe()
    .globeImageUrl((coords) => {
      try {
        const defaultCoords = { lat: 39.8283, lng: -98.5795, zoom: 2 };
        const { lat, lng, zoom } = coords || defaultCoords;
        return getTileUrl(lat, lng, zoom);
      } catch (error) {
        console.error("Error loading globe tiles:", error);
        return 'https://upload.wikimedia.org/wikipedia/commons/thumb/4/4e/Earth_from_Space_%28cropped%29.jpg/800px-Earth_from_Space_%28cropped%29.jpg';
      }
    })
    .bumpImageUrl('//unpkg.com/three-globe/example/img/earth-topology.png')
    .backgroundColor('#121212')
    .ringsData(ringsData)
    .ringColor(d => d.color)
    .ringMaxRadius(d => d.maxRadius)
    .ringPropagationSpeed(d => d.propagationSpeed)
    .ringRepeatPeriod(d => d.repeatPeriod)
    .showAtmosphere(true)
    .atmosphereColor('rgba(158, 141, 141, 0.3)')
    .atmosphereAltitude(0.25)
    .onZoom((altitude) => {
      if (altitude > 0 && !autoRotate) {
        const pov = myGlobe.pointOfView();
        debouncedUpdateTileLayer(altitude, pov.lat, pov.lng);
      }
    })
    .onGlobeClick((point) => {
      if (point.lat && point.lng) {
        const zoomFactor = 0.5;
        debouncedUpdateTileLayer(zoomFactor, point.lat, point.lng);
        stopAndZoom(point.lat, point.lng, zoomFactor);
      }
    });

  myGlobe(globeContainer);

  // 🔹 Improved Tile Update Function
  function updateTileLayer(zoomFactor, lat, lng) {
    const zoomLevel = (() => {
      if (zoomFactor > 2.0) return 2;      // Very far - global view
      if (zoomFactor > 1.0) return 4;      // Far - continental view
      if (zoomFactor > 0.5) return 6;      // Medium - country view
      if (zoomFactor > 0.2) return 8;      // Close - regional view
      return 10;                           // Very close - local view
    })();

    try {
      const tileUrl = getTileUrl(lat, lng, zoomLevel);
      myGlobe.globeImageUrl(() => tileUrl);
    } catch (error) {
      console.error('Error updating tile layer:', error);
      // Keep current view on error
    }
  }

  // 🔹 Improved Debounce Function
  function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
      const later = () => {
        clearTimeout(timeout);
        func(...args);
      };
      clearTimeout(timeout);
      timeout = setTimeout(later, wait);
    };
  }

  // Reduced debounce time for better responsiveness
  const debouncedUpdateTileLayer = debounce((zoomFactor, lat, lng) => {
    try {
      updateTileLayer(zoomFactor, lat, lng);
    } catch (error) {
      console.error('Error in debounced update:', error);
    }
  }, 1000);

  // [Rest of your code remains exactly the same, including:]
  // - Auto-rotation logic
  // - Stop rotation functions
  // - Zoom tracking
  // - Country/Region/Subregion selection handlers
  let autoRotate = true;
  const rotationSpeed = 0.02;

  function rotateGlobe() {
    if (autoRotate) {
      const currentView = myGlobe.pointOfView();
      myGlobe.pointOfView({
        lat: currentView.lat,
        lng: currentView.lng + rotationSpeed,
        altitude: currentView.altitude
      });
      requestAnimationFrame(rotateGlobe);
    }
  }

  rotateGlobe();

  function stopAutoRotate() {
    autoRotate = false;
  }

  globeContainer.addEventListener("mousedown", stopAutoRotate);
  globeContainer.addEventListener("touchstart", stopAutoRotate);

  let currentZoomLevel = 2.0;

  function stopAndZoom(lat, lng, zoomFactor) {
    console.log(`📌 Applying Zoom - Lat: ${lat}, Lng: ${lng}, Zoom: ${zoomFactor}`);
    stopAutoRotate();
    currentZoomLevel = zoomFactor;
    debouncedUpdateTileLayer(zoomFactor, lat, lng);
    myGlobe.pointOfView({ lat, lng, altitude: zoomFactor }, 1500);
  }

  // [Your existing event listeners remain exactly the same]
  countryFilter.addEventListener("change", () => {
    const selectedCountry = countryFilter.value;
    console.log("🔍 Zooming to Country:", selectedCountry);

    regionFilter.innerHTML = '<option value="">Select a Region</option>';
    regionFilter.disabled = !selectedCountry;

    if (selectedCountry) {
      Object.keys(wineRegions[selectedCountry].regions).forEach(region => {
        const option = document.createElement("option");
        option.value = region;
        option.textContent = region;
        regionFilter.appendChild(option);
      });    

      stopAndZoom(
        wineRegions[selectedCountry].lat, 
        wineRegions[selectedCountry].lng, 
        Math.max(0.7, currentZoomLevel * 0.6)
      );
    }
  });

  regionFilter.addEventListener("change", () => {
    const selectedCountry = countryFilter.value;
    const selectedRegion = regionFilter.value;
    console.log(`🔍 Zooming to Region: ${selectedRegion}`);

    subregionFilter.innerHTML = '<option value="">Select a Subregion</option>';
    subregionFilter.disabled = true;
    subregionGroup.style.display = "none";

    const regionData = wineRegions[selectedCountry]?.regions[selectedRegion];

    if (regionData) {
      stopAndZoom(regionData.lat, regionData.lng, Math.max(0.2, currentZoomLevel * 0.35));

      if (regionData.subregions && regionData.subregions.length > 0) {
        console.log(`🟢 Found ${regionData.subregions.length} subregions for ${selectedRegion}`);
        subregionFilter.disabled = false;
        subregionGroup.style.display = "block";

        regionData.subregions.forEach(subregion => {
          const option = document.createElement("option");
          option.value = subregion.name;
          option.textContent = subregion.name;
          subregionFilter.appendChild(option);
        });
      }
    } else {
      console.warn(`⚠️ Region Data Not Found: ${selectedRegion}`);
    }
  });

  subregionFilter.addEventListener("change", () => {
    const selectedCountry = countryFilter.value;
    const selectedRegion = regionFilter.value;
    const selectedSubregion = subregionFilter.value;

    console.log(`🔍 Zooming to Subregion: ${selectedSubregion}`);

    const subregionData = wineRegions[selectedCountry]?.regions[selectedRegion]?.subregions
      .find(subregion => subregion.name === selectedSubregion);

    if (subregionData) {
      stopAndZoom(subregionData.lat, subregionData.lng, Math.max(0.05, currentZoomLevel * 0.2));
    } else {
      console.warn(`⚠️ Subregion Data Not Found: ${selectedSubregion}`);
    }
  });

  console.log("✅ Globe Initialized with Auto-Rotation!");
});