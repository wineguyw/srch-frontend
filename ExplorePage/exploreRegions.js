// MapBox access token (replace with your actual token if needed)
mapboxgl.accessToken = "pk.eyJ1Ijoid2VzbGV5ZWxsaW90dCIsImEiOiJjbTdncXJvMzMxMDB1Mmxwdmlyb2s0c2JlIn0.nOaxv1GoC7lp-ko57CKNSQ";

document.addEventListener("DOMContentLoaded", () => {
  const globeContainer = document.getElementById("globeViz");
  const countryFilter = document.getElementById("countryFilter");
  const regionFilter = document.getElementById("regionFilter");
  const subregionFilter = document.getElementById("subregionFilter");
  const subregionGroup = document.getElementById("subregionGroup");

  // Add a new dropdown for AVAs (only for USA)
  const avaFilter = document.createElement("select");
  avaFilter.id = "avaFilter";
  avaFilter.innerHTML = '<option value="">Select an AVA</option>';
  const avaGroup = document.createElement("div");
  avaGroup.id = "avaGroup";
  avaGroup.style.display = "none";
  const avaLabel = document.createElement("label");
  avaLabel.textContent = "AVA:";
  avaLabel.htmlFor = "avaFilter";
  avaGroup.appendChild(avaLabel);
  avaGroup.appendChild(avaFilter);
  subregionGroup.parentNode.insertBefore(avaGroup, subregionGroup.nextSibling);

  if (!globeContainer) {
    console.error("❌ ERROR: Globe container #globeViz NOT found in the DOM! Please ensure <div id='globeViz'></div> exists in your HTML.");
    return;
  }

  console.log("✅ Initializing MapBox Globe...");
// Wine region data (updated with United Kingdom, Switzerland, Hungary, Canada, Mexico)
const wineRegions = {
  USA: { 
    lat: 39.8283, lng: -98.5795, zoom: 4,
    regions: {
      "California": { lat: 36.7783, lng: -119.4179, zoom: 6, subregions: [
        { name: "Napa Valley", lat: 38.2975, lng: -122.2869, avas: [
          { name: "St. Helena AVA", lat: 38.505, lng: -122.470 },
          { name: "Oakville AVA", lat: 38.428, lng: -122.408 },
          { name: "Yountville AVA", lat: 38.401, lng: -122.361 },
          { name: "Rutherford AVA", lat: 38.458, lng: -122.421 },
          { name: "Calistoga AVA", lat: 38.578, lng: -122.579 }
        ]},
        { name: "Sonoma County", lat: 38.433, lng: -122.515, avas: [
          { name: "Russian River Valley", lat: 38.495, lng: -122.950 },
          { name: "Alexander Valley", lat: 38.648, lng: -122.867 },
          { name: "Dry Creek Valley", lat: 38.650, lng: -122.950 },
          { name: "Sonoma Coast AVA", lat: 38.400, lng: -123.100 },
          { name: "Knights Valley AVA", lat: 38.650, lng: -122.717 }
        ]},
        { name: "San Luis Obispo", lat: 35.2828, lng: -120.6596, avas: [
          { name: "Edna Valley AVA", lat: 35.217, lng: -120.617 },
          { name: "Arroyo Grande Valley AVA", lat: 35.133, lng: -120.583 },
          { name: "Paso Robles AVA", lat: 35.6225, lng: -120.6910 }
        ]},
        { name: "Paso Robles", lat: 35.6225, lng: -120.6910, avas: [
          { name: "Adelaida District AVA", lat: 35.650, lng: -120.800 },
          { name: "Templeton Gap District AVA", lat: 35.550, lng: -120.717 },
          { name: "Willow Creek District AVA", lat: 35.600, lng: -120.750 },
          { name: "El Pomar District AVA", lat: 35.583, lng: -120.633 }
        ]},
        { name: "Santa Barbara", lat: 34.4208, lng: -119.6982, avas: [
          { name: "Santa Ynez Valley AVA", lat: 34.600, lng: -120.083 },
          { name: "Santa Maria Valley AVA", lat: 34.933, lng: -120.433 },
          { name: "Sta. Rita Hills AVA", lat: 34.633, lng: -120.150 },
          { name: "Ballard Canyon AVA", lat: 34.633, lng: -120.117 }
        ]},
        { name: "Temecula", lat: 33.4936, lng: -117.1484, avas: [
          { name: "Temecula Valley AVA", lat: 33.4936, lng: -117.1484 }
        ]},
        { name: "Central Valley", lat: 36.3000, lng: -119.8000, avas: [
          { name: "Lodi AVA", lat: 38.130, lng: -121.272 },
          { name: "Madera AVA", lat: 36.961, lng: -120.060 },
          { name: "Clarksburg AVA", lat: 38.420, lng: -121.527 }
        ]},
        { name: "Sierra Foothills", lat: 38.6000, lng: -120.8000, avas: [
          { name: "Amador County AVA", lat: 38.450, lng: -120.800 },
          { name: "El Dorado AVA", lat: 38.733, lng: -120.800 }
        ]}
      ]},
      "Oregon": { lat: 44.0000, lng: -120.5000, zoom: 6, subregions: [
        { name: "Willamette Valley", lat: 45.211, lng: -123.062, avas: [
          { name: "Dundee Hills", lat: 45.300, lng: -123.050 },
          { name: "Eola-Amity Hills", lat: 45.050, lng: -123.200 },
          { name: "Chehalem Mountains", lat: 45.333, lng: -122.983 },
          { name: "Yamhill-Carlton", lat: 45.350, lng: -123.150 },
          { name: "McMinnville AVA", lat: 45.210, lng: -123.200 }
        ]},
        { name: "Umpqua Valley", lat: 43.2000, lng: -123.3500, avas: [
          { name: "Red Hill Douglas County AVA", lat: 43.200, lng: -123.350 },
          { name: "Elkton Oregon AVA", lat: 43.633, lng: -123.567 }
        ]},
        { name: "Rogue Valley", lat: 42.3000, lng: -122.9000, avas: [
          { name: "Applegate Valley AVA", lat: 42.250, lng: -123.150 },
          { name: "Illinois Valley AVA", lat: 42.150, lng: -123.650 }
        ]},
        { name: "Columbia Gorge", lat: 45.6000, lng: -121.2000, avas: [
          { name: "Columbia Gorge AVA", lat: 45.600, lng: -121.200 }
        ]}
      ]},
      "Washington": { lat: 47.5000, lng: -120.5000, zoom: 6, subregions: [
        { name: "Columbia Valley", lat: 46.200, lng: -119.500, avas: [
          { name: "Walla Walla Valley", lat: 46.067, lng: -118.283 },
          { name: "Yakima Valley", lat: 46.417, lng: -120.450 },
          { name: "Red Mountain AVA", lat: 46.267, lng: -119.433 },
          { name: "Rattlesnake Hills AVA", lat: 46.400, lng: -120.200 }
        ]},
        { name: "Horse Heaven Hills", lat: 46.0000, lng: -119.5000, avas: [
          { name: "Horse Heaven Hills AVA", lat: 46.000, lng: -119.500 }
        ]},
        { name: "Lake Chelan", lat: 47.833, lng: -120.016, avas: [
          { name: "Lake Chelan AVA", lat: 47.833, lng: -120.016 }
        ]},
        { name: "Snipes Mountain", lat: 46.283, lng: -120.333, avas: [
          { name: "Snipes Mountain AVA", lat: 46.283, lng: -120.333 }
        ]}
      ]},
      "New York": { lat: 42.8000, lng: -76.8000, zoom: 6, subregions: [
        { name: "Finger Lakes", lat: 42.6000, lng: -76.9000, avas: [
          { name: "Seneca Lake AVA", lat: 42.600, lng: -76.900 },
          { name: "Cayuga Lake AVA", lat: 42.700, lng: -76.700 },
          { name: "Keuka Lake AVA", lat: 42.500, lng: -77.100 }
        ]},
        { name: "Long Island", lat: 40.9000, lng: -72.8000, avas: [
          { name: "North Fork of Long Island AVA", lat: 40.950, lng: -72.600 },
          { name: "The Hamptons, Long Island AVA", lat: 40.900, lng: -72.400 }
        ]},
        { name: "Hudson River Region", lat: 41.8000, lng: -73.9000, avas: [
          { name: "Hudson River Region AVA", lat: 41.800, lng: -73.900 }
        ]}
      ]},
      "Texas": { lat: 31.0000, lng: -100.0000, zoom: 6, subregions: [
        { name: "Texas Hill Country", lat: 30.4000, lng: -98.9000, avas: [
          { name: "Texas Hill Country AVA", lat: 30.400, lng: -98.900 },
          { name: "Fredericksburg in the Texas Hill Country AVA", lat: 30.275, lng: -98.872 }
        ]},
        { name: "High Plains", lat: 34.0000, lng: -102.0000, avas: [
          { name: "Texas High Plains AVA", lat: 34.000, lng: -102.000 }
        ]},
        { name: "Davis Mountains", lat: 30.633, lng: -104.000, avas: [
          { name: "Davis Mountains AVA", lat: 30.633, lng: -104.000 }
        ]}
      ]},
      "Michigan": { lat: 44.5000, lng: -85.5000, zoom: 6, subregions: [
        { name: "Leelanau Peninsula", lat: 45.0000, lng: -85.8000, avas: [
          { name: "Leelanau Peninsula AVA", lat: 45.000, lng: -85.800 }
        ]},
        { name: "Old Mission Peninsula", lat: 44.9000, lng: -85.5000, avas: [
          { name: "Old Mission Peninsula AVA", lat: 44.900, lng: -85.500 }
        ]},
        { name: "Fennville", lat: 42.600, lng: -86.100, avas: [
          { name: "Fennville AVA", lat: 42.600, lng: -86.100 }
        ]}
      ]},
      "North Carolina": { lat: 35.5000, lng: -79.0000, zoom: 6, subregions: [
        { name: "Yadkin Valley", lat: 36.1000, lng: -80.6000, avas: [
          { name: "Yadkin Valley AVA", lat: 36.100, lng: -80.600 },
          { name: "Swan Creek AVA", lat: 36.200, lng: -80.867 }
        ]},
        { name: "Haw River Valley", lat: 36.000, lng: -79.400, avas: [
          { name: "Haw River Valley AVA", lat: 36.000, lng: -79.400 }
        ]}
      ]},
      "Virginia": { lat: 37.5000, lng: -78.5000, zoom: 6, subregions: [
        { name: "Monticello", lat: 38.0000, lng: -78.4000, avas: [
          { name: "Monticello AVA", lat: 38.000, lng: -78.400 }
        ]},
        { name: "Shenandoah Valley", lat: 38.8000, lng: -78.6000, avas: [
          { name: "Shenandoah Valley AVA", lat: 38.800, lng: -78.600 }
        ]},
        { name: "Middleburg", lat: 38.970, lng: -77.735, avas: [
          { name: "Middleburg Virginia AVA", lat: 38.970, lng: -77.735 }
        ]},
        { name: "Northern Neck", lat: 37.967, lng: -76.400, avas: [
          { name: "Northern Neck George Washington Birthplace AVA", lat: 37.967, lng: -76.400 }
        ]}
      ]}
    }
  },

  France: { 
    lat: 46.6034, lng: 1.8883, zoom: 5,
    regions: {
      "Bordeaux": { lat: 44.8378, lng: -0.5792, zoom: 10, subregions: [
        { name: "Médoc", lat: 45.100, lng: -0.850 },
        { name: "Saint-Émilion", lat: 44.895, lng: -0.155 },
        { name: "Pomerol", lat: 44.917, lng: -0.183 },
        { name: "Graves", lat: 44.700, lng: -0.550 },
        { name: "Sauternes", lat: 44.533, lng: -0.333 },
        { name: "Entre-Deux-Mers", lat: 44.750, lng: -0.300 }
      ]},
      "Burgundy": { lat: 47.0311, lng: 4.8254, zoom: 10, subregions: [
        { name: "Côte de Nuits", lat: 47.200, lng: 4.967 },
        { name: "Côte de Beaune", lat: 47.000, lng: 4.833 },
        { name: "Chablis", lat: 47.817, lng: 3.800 },
        { name: "Mâconnais", lat: 46.300, lng: 4.833 },
        { name: "Beaujolais", lat: 46.133, lng: 4.667 }
      ]},
      "Champagne": { lat: 49.256, lng: 4.033, zoom: 10, subregions: [
        { name: "Reims", lat: 49.250, lng: 4.033 },
        { name: "Épernay", lat: 49.050, lng: 3.950 },
        { name: "Montagne de Reims", lat: 49.200, lng: 4.050 },
        { name: "Vallée de la Marne", lat: 49.000, lng: 3.800 },
        { name: "Côte des Blancs", lat: 48.950, lng: 4.000 }
      ]},
      "Rhône Valley": { lat: 44.777, lng: 4.871, zoom: 10, subregions: [
        { name: "Northern Rhône", lat: 45.200, lng: 4.800 },
        { name: "Southern Rhône", lat: 44.100, lng: 4.800 },
        { name: "Châteauneuf-du-Pape", lat: 44.050, lng: 4.833 },
        { name: "Gigondas", lat: 44.167, lng: 5.000 },
        { name: "Tavel", lat: 44.000, lng: 4.700 }
      ]},
      "Loire Valley": { lat: 47.400, lng: 0.683, zoom: 10, subregions: [
        { name: "Sancerre", lat: 47.333, lng: 2.833 },
        { name: "Pouilly-Fumé", lat: 47.300, lng: 2.950 },
        { name: "Muscadet", lat: 47.150, lng: -1.500 },
        { name: "Vouvray", lat: 47.417, lng: 0.800 }
      ]},
      "Alsace": { lat: 48.250, lng: 7.450, zoom: 10, subregions: [
        { name: "Riquewihr", lat: 48.167, lng: 7.300 },
        { name: "Ribeauvillé", lat: 48.200, lng: 7.333 },
        { name: "Colmar", lat: 48.083, lng: 7.350 }
      ]},
      "Provence": { lat: 43.500, lng: 5.500, zoom: 10, subregions: [
        { name: "Bandol", lat: 43.150, lng: 5.750 },
        { name: "Côtes de Provence", lat: 43.400, lng: 6.200 },
        { name: "Aix-en-Provence", lat: 43.533, lng: 5.450 }
      ]}
    }
  },

  Italy: { 
    lat: 41.8719, lng: 12.5674, zoom: 5,
    regions: {
      "Tuscany": { lat: 43.7711, lng: 11.2486, zoom: 10, subregions: [
        { name: "Chianti", lat: 43.469, lng: 11.046 },
        { name: "Montalcino", lat: 43.056, lng: 11.489 },
        { name: "Montepulciano", lat: 43.100, lng: 11.783 },
        { name: "Bolgheri", lat: 43.233, lng: 10.617 },
        { name: "San Gimignano", lat: 43.467, lng: 11.033 }
      ]},
      "Piedmont": { lat: 44.693, lng: 7.678, zoom: 10, subregions: [
        { name: "Barolo", lat: 44.600, lng: 7.950 },
        { name: "Barbaresco", lat: 44.733, lng: 8.083 },
        { name: "Asti", lat: 44.900, lng: 8.200 },
        { name: "Langhe", lat: 44.600, lng: 8.000 },
        { name: "Roero", lat: 44.800, lng: 7.900 }
      ]},
      "Veneto": { lat: 45.500, lng: 11.550, zoom: 10, subregions: [
        { name: "Valpolicella", lat: 45.533, lng: 10.867 },
        { name: "Soave", lat: 45.417, lng: 11.233 },
        { name: "Prosecco", lat: 45.950, lng: 12.300 },
        { name: "Bardolino", lat: 45.550, lng: 10.717 }
      ]},
      "Sicily": { lat: 37.599, lng: 14.015, zoom: 10, subregions: [
        { name: "Etna", lat: 37.700, lng: 15.000 },
        { name: "Marsala", lat: 37.800, lng: 12.433 },
        { name: "Vittoria", lat: 36.950, lng: 14.533 },
        { name: "Noto", lat: 36.883, lng: 15.083 }
      ]},
      "Umbria": { lat: 43.100, lng: 12.400, zoom: 10, subregions: [
        { name: "Orvieto", lat: 42.717, lng: 12.117 },
        { name: "Montefalco", lat: 42.883, lng: 12.650 }
      ]},
      "Abruzzo": { lat: 42.350, lng: 14.167, zoom: 10, subregions: [
        { name: "Montepulciano d'Abruzzo", lat: 42.400, lng: 14.200 },
        { name: "Trebbiano d'Abruzzo", lat: 42.300, lng: 14.150 }
      ]}
    }
  },

  Spain: { 
    lat: 40.4637, lng: -3.7492, zoom: 5,
    regions: {
      "Rioja": { lat: 42.303, lng: -2.427, zoom: 10, subregions: [
        { name: "Alta", lat: 42.418, lng: -2.723 },
        { name: "Alavesa", lat: 42.608, lng: -2.579 },
        { name: "Baja", lat: 42.133, lng: -2.333 },
        { name: "Oriental", lat: 42.250, lng: -2.100 }
      ]},
      "Catalonia": { lat: 41.3851, lng: 2.1734, zoom: 10, subregions: [
        { name: "Priorat", lat: 41.200, lng: 0.766 },
        { name: "Penedès", lat: 41.347, lng: 1.698 },
        { name: "Montsant", lat: 41.150, lng: 0.833 },
        { name: "Empordà", lat: 42.267, lng: 3.000 }
      ]},
      "Galicia": { lat: 42.433, lng: -8.647, zoom: 10, subregions: [
        { name: "Rías Baixas", lat: 42.250, lng: -8.700 },
        { name: "Ribeira Sacra", lat: 42.400, lng: -7.500 },
        { name: "Monterrei", lat: 41.950, lng: -7.450 },
        { name: "Valdeorras", lat: 42.417, lng: -7.000 }
      ]},
      "Andalusia": { lat: 37.3925, lng: -5.9940, zoom: 10, subregions: [
        { name: "Jerez", lat: 36.683, lng: -6.133 },
        { name: "Montilla-Moriles", lat: 37.583, lng: -4.783 },
        { name: "Málaga", lat: 36.717, lng: -4.417 },
        { name: "Sierras de Málaga", lat: 36.800, lng: -4.500 }
      ]},
      "Ribera del Duero": { lat: 41.767, lng: -3.683, zoom: 10, subregions: [
        { name: "Aranda de Duero", lat: 41.667, lng: -3.683 },
        { name: "Roza", lat: 41.700, lng: -3.933 }
      ]},
      "Toro": { lat: 41.517, lng: -5.400, zoom: 10, subregions: [
        { name: "Toro", lat: 41.517, lng: -5.400 },
        { name: "Zamora", lat: 41.500, lng: -5.750 }
      ]}
    }
  },

  Portugal: { 
    lat: 39.3999, lng: -8.2245, zoom: 5,
    regions: {
      "Douro Valley": { lat: 41.160, lng: -7.720, zoom: 10, subregions: [
        { name: "Cima Corgo", lat: 41.117, lng: -7.722 },
        { name: "Baixo Corgo", lat: 41.197, lng: -7.728 },
        { name: "Douro Superior", lat: 41.200, lng: -7.500 },
        { name: "Pinhão", lat: 41.183, lng: -7.550 }
      ]},
      "Alentejo": { lat: 38.641, lng: -7.999, zoom: 10, subregions: [
        { name: "Évora", lat: 38.567, lng: -7.900 },
        { name: "Borba", lat: 38.767, lng: -7.467 },
        { name: "Redondo", lat: 38.650, lng: -7.550 },
        { name: "Reguengos", lat: 38.417, lng: -7.533 }
      ]},
      "Vinho Verde": { lat: 41.736, lng: -8.293, zoom: 10, subregions: [
        { name: "Monção", lat: 41.683, lng: -8.483 },
        { name: "Amarante", lat: 41.273, lng: -8.077 },
        { name: "Lima", lat: 41.750, lng: -8.583 },
        { name: "Basto", lat: 41.500, lng: -8.000 }
      ]},
      "Dão": { lat: 40.530, lng: -7.905, zoom: 10, subregions: [
        { name: "Silgueiros", lat: 40.567, lng: -7.867 },
        { name: "Nelas", lat: 40.533, lng: -7.850 },
        { name: "Carregal do Sal", lat: 40.433, lng: -8.000 },
        { name: "Tondela", lat: 40.517, lng: -8.083 }
      ]},
      "Lisboa": { lat: 39.000, lng: -9.200, zoom: 10, subregions: [
        { name: "Colares", lat: 38.800, lng: -9.467 },
        { name: "Torres Vedras", lat: 39.100, lng: -9.267 }
      ]},
      "Madeira": { lat: 32.667, lng: -16.917, zoom: 10, subregions: [
        { name: "Funchal", lat: 32.650, lng: -16.917 },
        { name: "Câmara de Lobos", lat: 32.633, lng: -16.983 }
      ]}
    }
  },

  Australia: { 
    lat: -25.2744, lng: 133.7751, zoom: 4,
    regions: {
      "Barossa Valley": { lat: -34.554, lng: 138.958, zoom: 10, subregions: [
        { name: "Eden Valley", lat: -34.554, lng: 139.054 },
        { name: "Lyndoch", lat: -34.600, lng: 138.883 },
        { name: "Tanunda", lat: -34.517, lng: 138.967 },
        { name: "Nuriootpa", lat: -34.467, lng: 139.000 }
      ]},
      "McLaren Vale": { lat: -35.219, lng: 138.546, zoom: 10, subregions: [
        { name: "Willunga", lat: -35.270, lng: 138.550 },
        { name: "Aldinga", lat: -35.283, lng: 138.467 },
        { name: "Sellicks Hill", lat: -35.333, lng: 138.450 },
        { name: "McLaren Flat", lat: -35.200, lng: 138.583 }
      ]},
      "Yarra Valley": { lat: -37.750, lng: 145.583, zoom: 10, subregions: [
        { name: "Upper Yarra", lat: -37.700, lng: 145.600 },
        { name: "Lower Yarra", lat: -37.800, lng: 145.567 },
        { name: "Coldstream", lat: -37.733, lng: 145.383 },
        { name: "Healesville", lat: -37.650, lng: 145.533 }
      ]},
      "Hunter Valley": { lat: -32.750, lng: 151.167, zoom: 10, subregions: [
        { name: "Pokolbin", lat: -32.783, lng: 151.300 },
        { name: "Broke", lat: -32.817, lng: 151.083 },
        { name: "Lovedale", lat: -32.767, lng: 151.367 },
        { name: "Mount View", lat: -32.833, lng: 151.283 }
      ]},
      "Margaret River": { lat: -33.950, lng: 115.067, zoom: 10, subregions: [
        { name: "Wilyabrup", lat: -33.800, lng: 115.033 },
        { name: "Yallingup", lat: -33.633, lng: 115.033 },
        { name: "Karridale", lat: -34.200, lng: 115.100 }
      ]},
      "Coonawarra": { lat: -37.283, lng: 140.833, zoom: 10, subregions: [
        { name: "Coonawarra", lat: -37.283, lng: 140.833 },
        { name: "Penola", lat: -37.383, lng: 140.833 }
      ]}
    }
  },

  "New Zealand": { 
    lat: -40.9006, lng: 174.8860, zoom: 5,
    regions: {
      "Marlborough": { lat: -41.5134, lng: 173.9612, zoom: 10, subregions: [
        { name: "Wairau Valley", lat: -41.517, lng: 173.916 },
        { name: "Awatere Valley", lat: -41.667, lng: 174.050 },
        { name: "Southern Valleys", lat: -41.550, lng: 173.950 },
        { name: "Blenheim", lat: -41.517, lng: 173.950 }
      ]},
      "Central Otago": { lat: -45.033, lng: 169.217, zoom: 10, subregions: [
        { name: "Bannockburn", lat: -45.050, lng: 169.150 },
        { name: "Gibbston", lat: -45.017, lng: 169.200 },
        { name: "Wanaka", lat: -44.700, lng: 169.133 }, // Added Wanaka
        { name: "Cromwell", lat: -45.033, lng: 169.200 },
        { name: "Alexandra", lat: -45.250, lng: 169.383 }
      ]},
      "Hawke’s Bay": { lat: -39.633, lng: 176.850, zoom: 10, subregions: [
        { name: "Gimblett Gravels", lat: -39.650, lng: 176.833 },
        { name: "Te Mata", lat: -39.617, lng: 176.867 },
        { name: "Bridge Pa Triangle", lat: -39.650, lng: 176.767 },
        { name: "Havelock North", lat: -39.667, lng: 176.883 }
      ]},
      "Martinborough": { lat: -41.217, lng: 175.450, zoom: 10, subregions: [
        { name: "Huangarua", lat: -41.233, lng: 175.467 },
        { name: "Pahiatua", lat: -40.817, lng: 175.833 },
        { name: "Te Muna", lat: -41.250, lng: 175.450 },
        { name: "Masterton", lat: -40.950, lng: 175.667 }
      ]},
      "Waiheke Island": { lat: -36.783, lng: 175.083, zoom: 10, subregions: [
        { name: "Onetangi", lat: -36.783, lng: 175.083 },
        { name: "Oneroa", lat: -36.783, lng: 175.017 }
      ]}
    }
  },

  "South Africa": { 
    lat: -30.5595, lng: 22.9375, zoom: 5,
    regions: {
      "Stellenbosch": { lat: -33.934, lng: 18.860, zoom: 10, subregions: [
        { name: "Simonsberg", lat: -33.890, lng: 18.860 },
        { name: "Bottelary", lat: -33.917, lng: 18.783 },
        { name: "Jonkershoek Valley", lat: -33.967, lng: 18.933 },
        { name: "Helderberg", lat: -34.033, lng: 18.833 }
      ]},
      "Paarl": { lat: -33.730, lng: 18.967, zoom: 10, subregions: [
        { name: "Franschhoek", lat: -33.911, lng: 19.125 },
        { name: "Wellington", lat: -33.633, lng: 19.017 },
        { name: "Simonsvlei", lat: -33.800, lng: 18.950 }
      ]},
      "Constantia": { lat: -34.050, lng: 18.433, zoom: 10, subregions: [
        { name: "Tokai", lat: -34.067, lng: 18.417 },
        { name: "Groot Constantia", lat: -34.033, lng: 18.450 },
        { name: "Steenberg", lat: -34.083, lng: 18.417 }
      ]},
      "Swartland": { lat: -33.350, lng: 18.750, zoom: 10, subregions: [
        { name: "Malmesbury", lat: -33.467, lng: 18.733 },
        { name: "Riebeek", lat: -33.383, lng: 18.883 },
        { name: "Darling", lat: -33.383, lng: 18.383 },
        { name: "Piketberg", lat: -32.900, lng: 18.767 }
      ]},
      "Walker Bay": { lat: -34.417, lng: 19.233, zoom: 10, subregions: [
        { name: "Hermanus", lat: -34.417, lng: 19.233 },
        { name: "Hemel-en-Aarde", lat: -34.400, lng: 19.267 }
      ]},
      "Robertson": { lat: -33.800, lng: 19.883, zoom: 10, subregions: [
        { name: "Bonnievale", lat: -34.000, lng: 20.100 },
        { name: "McGregor", lat: -33.950, lng: 19.833 }
      ]}
    }
  },

  Argentina: { 
    lat: -38.4161, lng: -63.6167, zoom: 4,
    regions: {
      "Mendoza": { lat: -32.889, lng: -68.845, zoom: 10, subregions: [
        { name: "Luján de Cuyo", lat: -32.970, lng: -68.880 },
        { name: "Uco Valley", lat: -33.610, lng: -69.210 },
        { name: "Maipú", lat: -32.950, lng: -68.780 },
        { name: "Agrelo", lat: -33.000, lng: -68.883 },
        { name: "Tupungato", lat: -33.367, lng: -69.150 }
      ]},
      "Salta": { lat: -24.783, lng: -65.417, zoom: 10, subregions: [
        { name: "Cafayate", lat: -26.067, lng: -65.967 },
        { name: "Molinos", lat: -25.933, lng: -66.283 },
        { name: "Cachi", lat: -25.117, lng: -66.167 }
      ]},
      "San Juan": { lat: -31.537, lng: -68.536, zoom: 10, subregions: [
        { name: "Tulum Valley", lat: -31.600, lng: -68.500 },
        { name: "Pedernal Valley", lat: -31.667, lng: -68.667 },
        { name: "Zonda Valley", lat: -31.550, lng: -68.750 }
      ]},
      "Patagonia": { lat: -39.033, lng: -67.583, zoom: 10, subregions: [
        { name: "Neuquén", lat: -38.950, lng: -68.067 },
        { name: "Río Negro", lat: -39.033, lng: -67.583 },
        { name: "San Patricio del Chañar", lat: -38.600, lng: -68.150 }
      ]},
      "La Rioja": { lat: -29.417, lng: -66.850, zoom: 10, subregions: [
        { name: "Famatina Valley", lat: -29.417, lng: -66.850 },
        { name: "Chilecito", lat: -29.167, lng: -67.500 }
      ]}
    }
  },

  Chile: { 
    lat: -35.6751, lng: -71.5430, zoom: 4,
    regions: {
      "Maipo Valley": { lat: -33.772, lng: -70.675, zoom: 10, subregions: [
        { name: "Alto Maipo", lat: -33.650, lng: -70.700 },
        { name: "Pirque", lat: -33.800, lng: -70.550 },
        { name: "Isla de Maipo", lat: -33.750, lng: -70.900 }
      ]},
      "Colchagua Valley": { lat: -34.650, lng: -71.200, zoom: 10, subregions: [
        { name: "Apalta", lat: -34.667, lng: -71.200 },
        { name: "Marchigüe", lat: -34.400, lng: -71.600 },
        { name: "Lolol", lat: -34.717, lng: -71.283 },
        { name: "Santa Cruz", lat: -34.633, lng: -71.367 }
      ]},
      "Aconcagua Valley": { lat: -32.830, lng: -70.706, zoom: 10, subregions: [
        { name: "Panquehue", lat: -32.800, lng: -70.850 },
        { name: "San Felipe", lat: -32.750, lng: -70.717 },
        { name: "Aconcagua Costa", lat: -32.600, lng: -71.200 }
      ]},
      "Itata Valley": { lat: -36.675, lng: -72.792, zoom: 10, subregions: [
        { name: "Chillán", lat: -36.600, lng: -72.100 },
        { name: "Quirihue", lat: -36.283, lng: -72.533 },
        { name: "Portezuelo", lat: -36.533, lng: -72.417 }
      ]},
      "Casablanca Valley": { lat: -33.317, lng: -71.417, zoom: 10, subregions: [
        { name: "Casablanca", lat: -33.317, lng: -71.417 },
        { name: "Las Dichas", lat: -33.400, lng: -71.450 }
      ]},
      "Maule Valley": { lat: -35.417, lng: -71.667, zoom: 10, subregions: [
        { name: "Talca", lat: -35.417, lng: -71.667 },
        { name: "San Clemente", lat: -35.533, lng: -71.483 }
      ]}
    }
  },

  Germany: { 
    lat: 51.1657, lng: 10.4515, zoom: 5,
    regions: {
      "Mosel": { lat: 49.744, lng: 6.627, zoom: 10, subregions: [
        { name: "Bernkastel", lat: 49.915, lng: 6.920 },
        { name: "Piesport", lat: 49.867, lng: 6.867 },
        { name: "Saar", lat: 49.600, lng: 6.550 },
        { name: "Trier", lat: 49.750, lng: 6.633 }
      ]},
      "Rheingau": { lat: 50.023, lng: 8.075, zoom: 10, subregions: [
        { name: "Rüdesheim", lat: 49.983, lng: 7.917 },
        { name: "Geisenheim", lat: 50.000, lng: 8.067 },
        { name: "Hochheim", lat: 50.017, lng: 8.350 },
        { name: "Eltville", lat: 50.033, lng: 8.117 }
      ]},
      "Pfalz": { lat: 49.432, lng: 8.215, zoom: 10, subregions: [
        { name: "Deidesheim", lat: 49.417, lng: 8.200 },
        { name: "Wachenheim", lat: 49.450, lng: 8.217 },
        { name: "Bad Dürkheim", lat: 49.467, lng: 8.167 },
        { name: "Forst", lat: 49.433, lng: 8.183 }
      ]},
      "Rheinhessen": { lat: 49.850, lng: 8.250, zoom: 10, subregions: [
        { name: "Nierstein", lat: 49.867, lng: 8.333 },
        { name: "Bingen", lat: 49.967, lng: 7.900 },
        { name: "Mainz", lat: 50.000, lng: 8.271 },
        { name: "Worms", lat: 49.633, lng: 8.350 }
      ]},
      "Franken": { lat: 49.800, lng: 9.933, zoom: 10, subregions: [
        { name: "Würzburg", lat: 49.800, lng: 9.933 },
        { name: "Iphofen", lat: 49.700, lng: 10.267 }
      ]},
      "Baden": { lat: 48.500, lng: 8.200, zoom: 10, subregions: [
        { name: "Kaiserstuhl", lat: 48.083, lng: 7.667 },
        { name: "Ortenau", lat: 48.467, lng: 8.000 }
      ]}
    }
  },

  Austria: { 
    lat: 47.5162, lng: 14.5501, zoom: 5,
    regions: {
      "Wachau": { lat: 48.300, lng: 15.400, zoom: 10, subregions: [
        { name: "Spitz", lat: 48.333, lng: 15.417 },
        { name: "Dürnstein", lat: 48.400, lng: 15.533 },
        { name: "Weissenkirchen", lat: 48.400, lng: 15.467 },
        { name: "Loiben", lat: 48.383, lng: 15.567 }
      ]},
      "Burgenland": { lat: 47.750, lng: 16.500, zoom: 10, subregions: [
        { name: "Neusiedlersee", lat: 47.833, lng: 16.800 },
        { name: "Mittelburgenland", lat: 47.667, lng: 16.500 },
        { name: "Eisenberg", lat: 47.600, lng: 16.567 },
        { name: "Leithaberg", lat: 47.900, lng: 16.700 }
      ]},
      "Styria": { lat: 47.050, lng: 15.400, zoom: 10, subregions: [
        { name: "Südsteiermark", lat: 46.833, lng: 15.500 },
        { name: "Vulkanland", lat: 47.000, lng: 15.900 },
        { name: "Weststeiermark", lat: 46.900, lng: 15.200 }
      ]},
      "Kremstal": { lat: 48.383, lng: 15.617, zoom: 10, subregions: [
        { name: "Krems", lat: 48.400, lng: 15.600 },
        { name: "Göttweig", lat: 48.367, lng: 15.633 },
        { name: "Rohrendorf", lat: 48.417, lng: 15.667 }
      ]},
      "Kamptal": { lat: 48.467, lng: 15.700, zoom: 10, subregions: [
        { name: "Langenlois", lat: 48.467, lng: 15.700 },
        { name: "Zöbing", lat: 48.483, lng: 15.683 }
      ]}
    }
  },

  Greece: { 
    lat: 39.0742, lng: 21.8243, zoom: 5,
    regions: {
      "Peloponnese": { lat: 37.500, lng: 22.500, zoom: 10, subregions: [
        { name: "Nemea", lat: 37.850, lng: 22.667 },
        { name: "Mantinia", lat: 37.600, lng: 22.400 },
        { name: "Patras", lat: 38.250, lng: 21.733 },
        { name: "Monemvasia", lat: 36.683, lng: 23.050 }
      ]},
      "Macedonia": { lat: 40.750, lng: 22.500, zoom: 10, subregions: [
        { name: "Naoussa", lat: 40.633, lng: 22.067 },
        { name: "Goumenissa", lat: 40.900, lng: 22.400 },
        { name: "Amyndeon", lat: 40.683, lng: 21.683 },
        { name: "Drama", lat: 41.150, lng: 24.150 }
      ]},
      "Crete": { lat: 35.500, lng: 24.500, zoom: 10, subregions: [
        { name: "Archanes", lat: 35.233, lng: 25.167 },
        { name: "Peza", lat: 35.100, lng: 25.133 },
        { name: "Dafnes", lat: 35.200, lng: 24.900 },
        { name: "Sitia", lat: 35.200, lng: 26.100 }
      ]},
      "Aegean Islands": { lat: 37.000, lng: 25.500, zoom: 10, subregions: [
        { name: "Santorini", lat: 36.400, lng: 25.433 },
        { name: "Paros", lat: 37.083, lng: 25.150 },
        { name: "Samos", lat: 37.750, lng: 26.983 },
        { name: "Rhodes", lat: 36.167, lng: 28.000 }
      ]},
      "Thessaly": { lat: 39.500, lng: 22.000, zoom: 10, subregions: [
        { name: "Rapsani", lat: 39.900, lng: 22.550 },
        { name: "Tyrnavos", lat: 39.733, lng: 22.283 }
      ]}
    }
  },

  // New European Countries
  "United Kingdom": { 
    lat: 54.0000, lng: -2.0000, zoom: 5,
    regions: {
      "South East England": { lat: 51.200, lng: 0.500, zoom: 10, subregions: [
        { name: "Sussex", lat: 50.900, lng: -0.400 },
        { name: "Kent", lat: 51.200, lng: 0.800 },
        { name: "Surrey", lat: 51.250, lng: -0.400 }
      ]},
      "South West England": { lat: 50.900, lng: -3.500, zoom: 10, subregions: [
        { name: "Devon", lat: 50.700, lng: -3.800 },
        { name: "Cornwall", lat: 50.400, lng: -4.800 }
      ]},
      "East of England": { lat: 52.200, lng: 0.500, zoom: 10, subregions: [
        { name: "Essex", lat: 51.800, lng: 0.600 },
        { name: "Norfolk", lat: 52.600, lng: 1.300 }
      ]}
    }
  },

  "Switzerland": { 
    lat: 46.8182, lng: 8.2275, zoom: 5,
    regions: {
      "Valais": { lat: 46.200, lng: 7.350, zoom: 10, subregions: [
        { name: "Sion", lat: 46.233, lng: 7.367 },
        { name: "Fully", lat: 46.133, lng: 7.117 },
        { name: "Visperterminen", lat: 46.267, lng: 7.900 }
      ]},
      "Vaud": { lat: 46.500, lng: 6.600, zoom: 10, subregions: [
        { name: "La Côte", lat: 46.467, lng: 6.400 },
        { name: "Lavaux", lat: 46.500, lng: 6.750 },
        { name: "Chablais", lat: 46.400, lng: 6.950 }
      ]},
      "Ticino": { lat: 46.200, lng: 9.000, zoom: 10, subregions: [
        { name: "Mendrisio", lat: 45.867, lng: 8.983 },
        { name: "Lugano", lat: 46.000, lng: 8.950 }
      ]},
      "Geneva": { lat: 46.200, lng: 6.150, zoom: 10, subregions: [
        { name: "Satigny", lat: 46.217, lng: 6.033 },
        { name: "Dardagny", lat: 46.200, lng: 5.983 }
      ]}
    }
  },

  "Hungary": { 
    lat: 47.1625, lng: 19.5033, zoom: 5,
    regions: {
      "Tokaj": { lat: 48.117, lng: 21.417, zoom: 10, subregions: [
        { name: "Tokaj", lat: 48.117, lng: 21.417 },
        { name: "Mád", lat: 48.183, lng: 21.283 },
        { name: "Tarcal", lat: 48.133, lng: 21.350 }
      ]},
      "Eger": { lat: 47.900, lng: 20.383, zoom: 10, subregions: [
        { name: "Eger", lat: 47.900, lng: 20.383 },
        { name: "Noszvaj", lat: 47.933, lng: 20.483 },
        { name: "Sirok", lat: 47.933, lng: 20.200 }
      ]},
      "Villány": { lat: 45.867, lng: 18.450, zoom: 10, subregions: [
        { name: "Villány", lat: 45.867, lng: 18.450 },
        { name: "Siklós", lat: 45.850, lng: 18.300 }
      ]},
      "Balaton": { lat: 46.833, lng: 17.733, zoom: 10, subregions: [
        { name: "Badacsony", lat: 46.800, lng: 17.500 },
        { name: "Balatonfüred-Csopak", lat: 46.950, lng: 17.850 }
      ]}
    }
  },

  // New North American Countries
  "Canada": { 
    lat: 56.1304, lng: -106.3468, zoom: 4,
    regions: {
      "Okanagan Valley": { lat: 49.500, lng: -119.500, zoom: 10, subregions: [
        { name: "Kelowna", lat: 49.883, lng: -119.483 },
        { name: "Naramata", lat: 49.600, lng: -119.600 },
        { name: "Oliver", lat: 49.183, lng: -119.550 },
        { name: "Osoyoos", lat: 49.033, lng: -119.467 }
      ]},
      "Niagara Peninsula": { lat: 43.167, lng: -79.250, zoom: 10, subregions: [
        { name: "Niagara-on-the-Lake", lat: 43.250, lng: -79.067 },
        { name: "St. Catharines", lat: 43.167, lng: -79.250 },
        { name: "Beamsville", lat: 43.200, lng: -79.483 }
      ]},
      "Prince Edward County": { lat: 44.000, lng: -77.250, zoom: 10, subregions: [
        { name: "Picton", lat: 44.000, lng: -77.133 },
        { name: "Wellington", lat: 43.950, lng: -77.350 }
      ]},
      "Nova Scotia": { lat: 45.000, lng: -64.000, zoom: 10, subregions: [
        { name: "Annapolis Valley", lat: 45.067, lng: -64.500 },
        { name: "Wolfville", lat: 45.083, lng: -64.367 }
      ]}
    }
  },

  "Mexico": { 
    lat: 23.6345, lng: -102.5528, zoom: 4,
    regions: {
      "Baja California": { lat: 30.500, lng: -115.500, zoom: 10, subregions: [
        { name: "Valle de Guadalupe", lat: 32.100, lng: -116.567 },
        { name: "Valle de San Antonio de las Minas", lat: 32.050, lng: -116.600 },
        { name: "Valle de Santo Tomás", lat: 31.550, lng: -116.417 }
      ]},
      "Querétaro": { lat: 20.600, lng: -100.383, zoom: 10, subregions: [
        { name: "Tequisquiapan", lat: 20.517, lng: -99.883 },
        { name: "Ezequiel Montes", lat: 20.667, lng: -99.900 }
      ]},
      "Coahuila": { lat: 27.500, lng: -103.000, zoom: 10, subregions: [
        { name: "Parras Valley", lat: 25.433, lng: -102.183 },
        { name: "Saltillo", lat: 25.433, lng: -100.983 }
      ]},
      "Guanajuato": { lat: 21.000, lng: -101.250, zoom: 10, subregions: [
        { name: "San Miguel de Allende", lat: 20.917, lng: -100.750 },
        { name: "Dolores Hidalgo", lat: 21.150, lng: -100.933 }
      ]}
    }
  }
};

  // Initialize MapBox GL JS globe with adjusted center and zoom to match the desired view
  const map = new mapboxgl.Map({
    container: "globeViz",
    style: "mapbox://styles/mapbox/satellite-streets-v12",
    center: [10, 40], // Centered on Europe (lng, lat)
    zoom: 2.5, // Slightly closer zoom to match the desired view
    pitch: 0, // Ensure a flat view for horizontal rotation
    projection: "globe",
    maxZoom: 22,
    minZoom: 0
  });

  // Add navigation controls
  map.addControl(new mapboxgl.NavigationControl(), "top-right");

  // Disable scroll zoom initially, enable on interaction
  map.scrollZoom.disable();
  globeContainer.addEventListener("mousedown", () => map.scrollZoom.enable());
  globeContainer.addEventListener("touchstart", () => map.scrollZoom.enable());

 // Adjust atmosphere for minimal glow and reduced stars, and customize labels
map.on("style.load", () => {
  map.setFog({
    color: "rgba(0, 0, 0, 0.1)", // Minimal glow
    "high-color": "#1a1a1a", // Darker, less prominent
    "horizon-blend": 0.01, // Reduced blend
    "star-intensity": 0.1 // Minimal stars
  });

  // Get all layers in the style
  const style = map.getStyle();
  const layers = style.layers;

  // Hide all default label layers
  layers.forEach(layer => {
    if (
      layer.id.includes("label") || // Hide all label layers, including country-label
      layer.id.includes("place") || // Matches layers like "place-city"
      layer.id.includes("poi") ||   // Matches points of interest
      layer.id.includes("water")    // Matches water labels like "South Atlantic Ocean"
    ) {
      map.setLayoutProperty(layer.id, "visibility", "none");
    }
  });
});

// Add a custom source and layer for country labels after the map loads
map.on("load", () => {
  // Define major wine-producing countries (based on global production data)
  const majorWineCountries = [
    "Italy", "France", "Spain", "USA", "Argentina", "Chile",
    "Australia", "South Africa", "Germany", "Portugal"
  ];

  // Dynamically generate the list of all wine-producing countries from wineRegions
  const allWineCountries = Object.keys(wineRegions);

  // Define approximate centroids for each country (you can refine these with more precise data)
  const countryCentroids = {
    "USA": { lat: 39.8283, lng: -98.5795 },
    "France": { lat: 46.6034, lng: 1.8883 },
    "Italy": { lat: 41.8719, lng: 12.5674 },
    "Spain": { lat: 40.4637, lng: -3.7492 },
    "Portugal": { lat: 39.3999, lng: -8.2245 },
    "Australia": { lat: -25.2744, lng: 133.7751 },
    "New Zealand": { lat: -40.9006, lng: 174.8860 },
    "South Africa": { lat: -30.5595, lng: 22.9375 },
    "Argentina": { lat: -38.4161, lng: -63.6167 },
    "Chile": { lat: -35.6751, lng: -71.5430 },
    "Germany": { lat: 51.1657, lng: 10.4515 },
    "Austria": { lat: 47.5162, lng: 14.5501 },
    "Greece": { lat: 39.0742, lng: 21.8243 },
    "United Kingdom": { lat: 54.0000, lng: -2.0000 },
    "Switzerland": { lat: 46.8182, lng: 8.2275 },
    "Hungary": { lat: 47.1625, lng: 19.5033 },
    "Canada": { lat: 56.1304, lng: -106.3468 },
    "Mexico": { lat: 23.6345, lng: -102.5528 }
  };

  // Create GeoJSON features for country labels
  const countryFeatures = allWineCountries.map(country => {
    const isMajor = majorWineCountries.includes(country);
    return {
      type: "Feature",
      geometry: {
        type: "Point",
        coordinates: [countryCentroids[country].lng, countryCentroids[country].lat]
      },
      properties: {
        name: country,
        isMajor: isMajor // Flag to determine visibility at different zoom levels
      }
    };
  });

  // Add a GeoJSON source for country labels
  map.addSource("country-labels", {
    type: "geojson",
    data: {
      type: "FeatureCollection",
      features: countryFeatures
    }
  });

  // Add a custom layer for country labels
  map.addLayer({
    id: "custom-country-labels",
    type: "symbol",
    source: "country-labels",
    layout: {
      "text-field": ["get", "name"],
      "text-size": [
        "interpolate",
        ["linear"],
        ["zoom"],
        0, 12,
        5, 16,
        10, 20
      ],
      "text-offset": [0, 0.5],
      "text-anchor": "top",
      "text-allow-overlap": [
        "step",
        ["zoom"],
        false, // No overlap at low zoom levels
        4, true // Allow overlap at zoom 4 and above
      ],
      "text-ignore-placement": [
        "step",
        ["zoom"],
        false, // Respect placement rules at low zoom levels
        4, true // Ignore placement at zoom 4 and above
      ]
    },
    paint: {
      "text-color": "#ffffff",
      "text-halo-color": "#000000",
      "text-halo-width": 2,
      "text-halo-blur": 1
    },
    filter: [
      "any",
      ["==", ["get", "isMajor"], true], // Always show major countries
      [">=", ["zoom"], 4] // Show all countries at zoom 4 and above
    ]
  });

  // Add a source for subregion labels (already in your code, keeping it here for context)
  map.addSource("subregion-labels", {
    type: "geojson",
    data: {
      type: "FeatureCollection",
      features: []
    }
  });

  map.addLayer({
    id: "subregion-labels-layer",
    type: "symbol",
    source: "subregion-labels",
    layout: {
      "text-field": ["get", "name"],
      "text-size": 14,
      "text-offset": [0, 1.5],
      "text-anchor": "top",
      "visibility": "visible"
    },
    paint: {
      "text-color": "#ffffff",
      "text-halo-color": "#000000",
      "text-halo-width": 2,
      "text-halo-blur": 1
    },
    minzoom: 4,
    maxzoom: 15
  });

  // Start rotation (already in your code)
  rotateGlobe();
});

  // Add a source for subregion labels (initially empty)
  map.on("load", () => {
    map.addSource("subregion-labels", {
      type: "geojson",
      data: {
        type: "FeatureCollection",
        features: []
      }
    });

    map.addLayer({
      id: "subregion-labels-layer",
      type: "symbol",
      source: "subregion-labels",
      layout: {
        "text-field": ["get", "name"],
        "text-size": 14,
        "text-offset": [0, 1.5],
        "text-anchor": "top",
        "visibility": "visible"
      },
      paint: {
        "text-color": "#ffffff",
        "text-halo-color": "#000000",
        "text-halo-width": 2,
        "text-halo-blur": 1
      },
      minzoom: 4, // Show labels at a slightly wider zoom level for country view
      maxzoom: 15 // Hide at very close zooms to avoid clutter
    });

    // Start rotation
    rotateGlobe(); // Start the rotation after the map loads
  });

  // Auto-rotation
  let autoRotate = true;
  const rotationSpeed = 0.03; // Adjusted for a smoother, natural rotation

  function rotateGlobe() {
    if (autoRotate) {
      const currentBearing = map.getBearing();
      map.easeTo({ 
        bearing: currentBearing + rotationSpeed, 
        pitch: 0, // Enforce flat rotation
        duration: 0 
      });
      requestAnimationFrame(rotateGlobe);
    }
  }

  // Stop auto-rotation on interaction
  function stopAutoRotate() {
    autoRotate = false;
  }

  globeContainer.addEventListener("mousedown", stopAutoRotate);
  globeContainer.addEventListener("touchstart", stopAutoRotate);

  // Track and manage zoom level
  let currentZoomLevel = 2.5; // Initial zoom level

  function stopAndZoom(lat, lng, zoom) {
    console.log(`📌 Zooming to Lat: ${lat}, Lng: ${lng}, Zoom: ${zoom}`);
    stopAutoRotate();
    currentZoomLevel = zoom;
    map.easeTo({
      center: [lng, lat],
      zoom: zoom,
      duration: 3000, // Slow animation for user tracking
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
    avaFilter.innerHTML = '<option value="">Select an AVA</option>';
    avaFilter.disabled = true;
    avaGroup.style.display = "none";

    // Clear existing subregion labels
    if (map.getSource("subregion-labels")) {
      map.getSource("subregion-labels").setData({
        type: "FeatureCollection",
        features: []
      });
    }

    if (country) {
      // Populate the region dropdown with subregions (e.g., Bordeaux, Burgundy for France)
      const regions = Object.keys(wineRegions[country].regions);
      regions.forEach(region => {
        const option = document.createElement("option");
        option.value = region;
        option.textContent = region;
        regionFilter.appendChild(option);
      });

      // Zoom to the country
      stopAndZoom(wineRegions[country].lat, wineRegions[country].lng, wineRegions[country].zoom);

      // Add subregion labels for the country (e.g., Bordeaux, Burgundy, Champagne, Rhône Valley for France)
      const subregionFeatures = regions.map(region => {
        const regionData = wineRegions[country].regions[region];
        return {
          type: "Feature",
          geometry: {
            type: "Point",
            coordinates: [regionData.lng, regionData.lat]
          },
          properties: {
            name: region
          }
        };
      });

      map.getSource("subregion-labels").setData({
        type: "FeatureCollection",
        features: subregionFeatures
      });
    }
  });

  // Region Selection (States for USA, or subregions like Bordeaux for France)
  regionFilter.addEventListener("change", () => {
    const country = countryFilter.value;
    const region = regionFilter.value;
    console.log("🔍 Selected Region:", region);

    subregionFilter.innerHTML = '<option value="">Select a Subregion</option>';
    subregionFilter.disabled = true;
    subregionGroup.style.display = "none";
    avaFilter.innerHTML = '<option value="">Select an AVA</option>';
    avaFilter.disabled = true;
    avaGroup.style.display = "none";

    // Clear existing subregion labels
    map.getSource("subregion-labels").setData({
      type: "FeatureCollection",
      features: []
    });

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

        // Add subregion labels dynamically (e.g., Médoc, Saint-Émilion for Bordeaux)
        const subregionFeatures = regionData.subregions.map(subregion => ({
          type: "Feature",
          geometry: {
            type: "Point",
            coordinates: [subregion.lng, subregion.lat]
          },
          properties: {
            name: subregion.name
          }
        }));

        map.getSource("subregion-labels").setData({
          type: "FeatureCollection",
          features: subregionFeatures
        });
      }
    }
  });

  // Subregion Selection (Wine Regions within States for USA, or smaller areas like Médoc for Bordeaux)
  subregionFilter.addEventListener("change", () => {
    const country = countryFilter.value;
    const region = regionFilter.value;
    const subregion = subregionFilter.value;
    console.log("🔍 Selected Subregion:", subregion);

    avaFilter.innerHTML = '<option value="">Select an AVA</option>';
    avaFilter.disabled = true;
    avaGroup.style.display = "none";

    if (subregion) {
      const subregionData = wineRegions[country].regions[region].subregions.find(s => s.name === subregion);
      stopAndZoom(subregionData.lat, subregionData.lng, 10); // Zoom to subregion level

      // Show AVA dropdown only for USA
      if (country === "USA" && subregionData.avas?.length) {
        console.log(`🟢 Found ${subregionData.avas.length} AVAs for ${subregion}`);
        avaFilter.disabled = false;
        avaGroup.style.display = "block";
        subregionData.avas.forEach(ava => {
          const option = document.createElement("option");
          option.value = ava.name;
          option.textContent = ava.name;
          avaFilter.appendChild(option);
        });
      }
    }
  });

  // AVA Selection (Only for USA)
  avaFilter.addEventListener("change", () => {
    const country = countryFilter.value;
    const region = regionFilter.value;
    const subregion = subregionFilter.value;
    const ava = avaFilter.value;
    console.log("🔍 Selected AVA:", ava);

    if (ava) {
      const avaData = wineRegions[country].regions[region].subregions
        .find(s => s.name === subregion).avas.find(a => a.name === ava);
      stopAndZoom(avaData.lat, avaData.lng, 12); // Zoom closer for AVA level
    }
  });

  console.log("✅ MapBox Globe Initialized with Adjusted Zoom and Subregion Labels!");
});