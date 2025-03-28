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

  // Wine region data (expanded with more countries, regions, and subregions for broader coverage)
const wineRegions = {
  // Existing USA (expanded)
  USA: { 
    lat: 39.8283, lng: -98.5795, zoom: 2, // Centered on U.S. for global view
    regions: {
      "Napa Valley": { lat: 38.2975, lng: -122.2869, zoom: 10, subregions: [
        { name: "St. Helena AVA", lat: 38.505, lng: -122.470 },
        { name: "Oakville AVA", lat: 38.428, lng: -122.408 },
        { name: "Yountville AVA", lat: 38.401, lng: -122.361 }
      ]},
      "Sonoma County": { lat: 38.433, lng: -122.515, zoom: 10, subregions: [
        { name: "Russian River Valley", lat: 38.495, lng: -122.950 },
        { name: "Alexander Valley", lat: 38.648, lng: -122.867 },
        { name: "Dry Creek Valley", lat: 38.650, lng: -122.950 }
      ]},
      "Willamette Valley": { lat: 45.211, lng: -123.062, zoom: 10, subregions: [
        { name: "Dundee Hills", lat: 45.300, lng: -123.050 },
        { name: "Eola-Amity Hills", lat: 45.050, lng: -123.200 }
      ]},
      "Columbia Valley": { lat: 46.200, lng: -119.500, zoom: 10, subregions: [
        { name: "Walla Walla Valley", lat: 46.067, lng: -118.283 },
        { name: "Yakima Valley", lat: 46.417, lng: -120.450 }
      ]}
    }
  },

  // Existing France (expanded)
  France: { 
    lat: 46.6034, lng: 1.8883, zoom: 3, // Centered on France for global view
    regions: {
      "Bordeaux": { lat: 44.8378, lng: -0.5792, zoom: 10, subregions: [
        { name: "Médoc", lat: 45.100, lng: -0.850 },
        { name: "Saint-Émilion", lat: 44.895, lng: -0.155 },
        { name: "Pomerol", lat: 44.917, lng: -0.183 },
        { name: "Graves", lat: 44.700, lng: -0.550 }
      ]},
      "Burgundy": { lat: 47.0311, lng: 4.8254, zoom: 10, subregions: [
        { name: "Côte de Nuits", lat: 47.200, lng: 4.967 },
        { name: "Côte de Beaune", lat: 47.000, lng: 4.833 },
        { name: "Chablis", lat: 47.817, lng: 3.800 }
      ]},
      "Champagne": { lat: 49.256, lng: 4.033, zoom: 10, subregions: [
        { name: "Reims", lat: 49.250, lng: 4.033 },
        { name: "Épernay", lat: 49.050, lng: 3.950 }
      ]},
      "Rhône Valley": { lat: 44.777, lng: 4.871, zoom: 10, subregions: [
        { name: "Northern Rhône", lat: 45.200, lng: 4.800 },
        { name: "Southern Rhône", lat: 44.100, lng: 4.800 }
      ]}
    }
  },

  // Existing Italy (expanded)
  Italy: { 
    lat: 41.8719, lng: 12.5674, zoom: 3, // Centered on Italy for global view
    regions: {
      "Tuscany": { lat: 43.7711, lng: 11.2486, zoom: 10, subregions: [
        { name: "Chianti", lat: 43.469, lng: 11.046 },
        { name: "Montalcino", lat: 43.056, lng: 11.489 },
        { name: "Montepulciano", lat: 43.100, lng: 11.783 }
      ]},
      "Piedmont": { lat: 44.693, lng: 7.678, zoom: 10, subregions: [
        { name: "Barolo", lat: 44.600, lng: 7.950 },
        { name: "Barbaresco", lat: 44.733, lng: 8.083 },
        { name: "Asti", lat: 44.900, lng: 8.200 }
      ]},
      "Veneto": { lat: 45.500, lng: 11.550, zoom: 10, subregions: [
        { name: "Valpolicella", lat: 45.533, lng: 10.867 },
        { name: "Soave", lat: 45.417, lng: 11.233 }
      ]},
      "Sicily": { lat: 37.599, lng: 14.015, zoom: 10, subregions: [
        { name: "Etna", lat: 37.700, lng: 15.000 },
        { name: "Marsala", lat: 37.800, lng: 12.433 }
      ]}
    }
  },

  // Existing Spain (expanded)
  Spain: { 
    lat: 40.4637, lng: -3.7492, zoom: 3, // Centered on Spain for global view
    regions: {
      "Rioja": { lat: 42.303, lng: -2.427, zoom: 10, subregions: [
        { name: "Alta", lat: 42.418, lng: -2.723 },
        { name: "Alavesa", lat: 42.608, lng: -2.579 },
        { name: "Baja", lat: 42.133, lng: -2.333 }
      ]},
      "Catalonia": { lat: 41.3851, lng: 2.1734, zoom: 10, subregions: [
        { name: "Priorat", lat: 41.200, lng: 0.766 },
        { name: "Penedès", lat: 41.347, lng: 1.698 }
      ]},
      "Galicia": { lat: 42.433, lng: -8.647, zoom: 10, subregions: [
        { name: "Rías Baixas", lat: 42.250, lng: -8.700 },
        { name: "Ribeira Sacra", lat: 42.400, lng: -7.500 }
      ]},
      "Andalusia": { lat: 37.3925, lng: -5.9940, zoom: 10, subregions: [
        { name: "Jerez", lat: 36.683, lng: -6.133 },
        { name: "Montilla-Moriles", lat: 37.583, lng: -4.783 }
      ]}
    }
  },

  // Existing Portugal (expanded)
  Portugal: { 
    lat: 39.3999, lng: -8.2245, zoom: 3, // Centered on Portugal for global view
    regions: {
      "Douro Valley": { lat: 41.160, lng: -7.720, zoom: 10, subregions: [
        { name: "Cima Corgo", lat: 41.117, lng: -7.722 },
        { name: "Baixo Corgo", lat: 41.197, lng: -7.728 },
        { name: "Douro Superior", lat: 41.200, lng: -7.500 }
      ]},
      "Alentejo": { lat: 38.641, lng: -7.999, zoom: 10, subregions: [
        { name: "Évora", lat: 38.567, lng: -7.900 },
        { name: "Borba", lat: 38.767, lng: -7.467 }
      ]},
      "Vinho Verde": { lat: 41.736, lng: -8.293, zoom: 10, subregions: [
        { name: "Monção", lat: 41.683, lng: -8.483 },
        { name: "Amarante", lat: 41.273, lng: -8.077 }
      ]},
      "Dão": { lat: 40.530, lng: -7.905, zoom: 10, subregions: [
        { name: "Silgueiros", lat: 40.567, lng: -7.867 },
        { name: "Nelas", lat: 40.533, lng: -7.850 }
      ]}
    }
  },

  // Existing Australia (expanded)
  Australia: { 
    lat: -25.2744, lng: 133.7751, zoom: 3, // Centered on Australia for global view
    regions: {
      "Barossa Valley": { lat: -34.554, lng: 138.958, zoom: 10, subregions: [
        { name: "Eden Valley", lat: -34.554, lng: 139.054 },
        { name: "Lyndoch", lat: -34.600, lng: 138.883 }
      ]},
      "McLaren Vale": { lat: -35.219, lng: 138.546, zoom: 10, subregions: [
        { name: "Willunga", lat: -35.270, lng: 138.550 },
        { name: "Aldinga", lat: -35.283, lng: 138.467 }
      ]},
      "Yarra Valley": { lat: -37.750, lng: 145.583, zoom: 10, subregions: [
        { name: "Upper Yarra", lat: -37.700, lng: 145.600 },
        { name: "Lower Yarra", lat: -37.800, lng: 145.567 }
      ]},
      "Hunter Valley": { lat: -32.750, lng: 151.167, zoom: 10, subregions: [
        { name: "Pokolbin", lat: -32.783, lng: 151.300 },
        { name: "Broke", lat: -32.817, lng: 151.083 }
      ]}
    }
  },

  // Existing New Zealand (expanded)
  "New Zealand": { 
    lat: -40.9006, lng: 174.8860, zoom: 3, // Centered on New Zealand for global view
    regions: {
      "Marlborough": { lat: -41.5134, lng: 173.9612, zoom: 10, subregions: [
        { name: "Wairau Valley", lat: -41.517, lng: 173.916 },
        { name: "Awatere Valley", lat: -41.667, lng: 174.050 }
      ]},
      "Central Otago": { lat: -45.033, lng: 169.217, zoom: 10, subregions: [
        { name: "Bannockburn", lat: -45.050, lng: 169.150 },
        { name: "Gibbston", lat: -45.017, lng: 169.200 }
      ]},
      "Hawke’s Bay": { lat: -39.633, lng: 176.850, zoom: 10, subregions: [
        { name: "Gimblett Gravels", lat: -39.650, lng: 176.833 },
        { name: "Te Mata", lat: -39.617, lng: 176.867 }
      ]},
      "Martinborough": { lat: -41.217, lng: 175.450, zoom: 10, subregions: [
        { name: "Huangarua", lat: -41.233, lng: 175.467 },
        { name: "Pahiatua", lat: -40.817, lng: 175.833 }
      ]}
    }
  },

  // Existing South Africa (expanded)
  "South Africa": { 
    lat: -30.5595, lng: 22.9375, zoom: 3, // Centered on South Africa for global view
    regions: {
      "Stellenbosch": { lat: -33.934, lng: 18.860, zoom: 10, subregions: [
        { name: "Simonsberg", lat: -33.890, lng: 18.860 },
        { name: "Bottelary", lat: -33.917, lng: 18.783 }
      ]},
      "Paarl": { lat: -33.730, lng: 18.967, zoom: 10, subregions: [
        { name: "Franschhoek", lat: -33.911, lng: 19.125 },
        { name: "Wellington", lat: -33.633, lng: 19.017 }
      ]},
      "Constantia": { lat: -34.050, lng: 18.433, zoom: 10, subregions: [
        { name: "Tokai", lat: -34.067, lng: 18.417 },
        { name: "Groot Constantia", lat: -34.033, lng: 18.450 }
      ]},
      "Swartland": { lat: -33.350, lng: 18.750, zoom: 10, subregions: [
        { name: "Malmesbury", lat: -33.467, lng: 18.733 },
        { name: "Riebeek", lat: -33.383, lng: 18.883 }
      ]}
    }
  },

  // Existing Argentina (expanded)
  Argentina: { 
    lat: -38.4161, lng: -63.6167, zoom: 3, // Centered on Argentina for global view
    regions: {
      "Mendoza": { lat: -32.889, lng: -68.845, zoom: 10, subregions: [
        { name: "Luján de Cuyo", lat: -32.970, lng: -68.880 },
        { name: "Uco Valley", lat: -33.610, lng: -69.210 },
        { name: "Maipú", lat: -32.950, lng: -68.780 }
      ]},
      "Salta": { lat: -24.783, lng: -65.417, zoom: 10, subregions: [
        { name: "Cafayate", lat: -26.067, lng: -65.967 },
        { name: "Molinos", lat: -25.933, lng: -66.283 }
      ]},
      "San Juan": { lat: -31.537, lng: -68.536, zoom: 10, subregions: [
        { name: "Tulum Valley", lat: -31.600, lng: -68.500 },
        { name: "Pedernal Valley", lat: -31.667, lng: -68.667 }
      ]},
      "Patagonia": { lat: -39.033, lng: -67.583, zoom: 10, subregions: [
        { name: "Neuquén", lat: -38.950, lng: -68.067 },
        { name: "Río Negro", lat: -39.033, lng: -67.583 }
      ]}
    }
  },

  // Existing Chile (expanded)
  Chile: { 
    lat: -35.6751, lng: -71.5430, zoom: 3, // Centered on Chile for global view
    regions: {
      "Maipo Valley": { lat: -33.772, lng: -70.675, zoom: 10, subregions: [
        { name: "Alto Maipo", lat: -33.650, lng: -70.700 },
        { name: "Pirque", lat: -33.800, lng: -70.550 }
      ]},
      "Colchagua Valley": { lat: -34.650, lng: -71.200, zoom: 10, subregions: [
        { name: "Apalta", lat: -34.667, lng: -71.200 },
        { name: "Marchigüe", lat: -34.400, lng: -71.600 }
      ]},
      "Aconcagua Valley": { lat: -32.830, lng: -70.706, zoom: 10, subregions: [
        { name: "Panquehue", lat: -32.800, lng: -70.850 },
        { name: "San Felipe", lat: -32.750, lng: -70.717 }
      ]},
      "Itata Valley": { lat: -36.675, lng: -72.792, zoom: 10, subregions: [
        { name: "Chillán", lat: -36.600, lng: -72.100 },
        { name: "Quirihue", lat: -36.283, lng: -72.533 }
      ]}
    }
  },

  // Existing Germany (expanded)
  Germany: { 
    lat: 51.1657, lng: 10.4515, zoom: 3, // Centered on Germany for global view
    regions: {
      "Mosel": { lat: 49.744, lng: 6.627, zoom: 10, subregions: [
        { name: "Bernkastel", lat: 49.915, lng: 6.920 },
        { name: "Piesport", lat: 49.867, lng: 6.867 }
      ]},
      "Rheingau": { lat: 50.023, lng: 8.075, zoom: 10, subregions: [
        { name: "Rüdesheim", lat: 49.983, lng: 7.917 },
        { name: "Geisenheim", lat: 50.000, lng: 8.067 }
      ]},
      "Pfalz": { lat: 49.432, lng: 8.215, zoom: 10, subregions: [
        { name: "Deidesheim", lat: 49.417, lng: 8.200 },
        { name: "Wachenheim", lat: 49.450, lng: 8.217 }
      ]},
      "Rheinhessen": { lat: 49.850, lng: 8.250, zoom: 10, subregions: [
        { name: "Nierstein", lat: 49.867, lng: 8.333 },
        { name: "Bingen", lat: 49.967, lng: 7.900 }
      ]}
    }
  },

  // Additional Major Wine-Producing Country: Austria
  Austria: { 
    lat: 47.5162, lng: 14.5501, zoom: 3, // Centered on Austria for global view
    regions: {
      "Wachau": { lat: 48.300, lng: 15.400, zoom: 10, subregions: [
        { name: "Spitz", lat: 48.333, lng: 15.417 },
        { name: "Dürnstein", lat: 48.400, lng: 15.533 }
      ]},
      "Burgenland": { lat: 47.750, lng: 16.500, zoom: 10, subregions: [
        { name: "Neusiedlersee", lat: 47.833, lng: 16.800 },
        { name: "Mittelburgenland", lat: 47.667, lng: 16.500 }
      ]},
      "Styria": { lat: 47.050, lng: 15.400, zoom: 10, subregions: [
        { name: "Südsteiermark", lat: 46.833, lng: 15.500 },
        { name: "Vulkanland", lat: 47.000, lng: 15.900 }
      ]},
      "Kremstal": { lat: 48.383, lng: 15.617, zoom: 10, subregions: [
        { name: "Krems", lat: 48.400, lng: 15.600 },
        { name: "Göttweig", lat: 48.367, lng: 15.633 }
      ]}
    }
  },

  // Additional Major Wine-Producing Country: Greece
  Greece: { 
    lat: 39.0742, lng: 21.8243, zoom: 3, // Centered on Greece for global view
    regions: {
      "Peloponnese": { lat: 37.500, lng: 22.500, zoom: 10, subregions: [
        { name: "Nemea", lat: 37.850, lng: 22.667 },
        { name: "Mantinia", lat: 37.600, lng: 22.400 }
      ]},
      "Macedonia": { lat: 40.750, lng: 22.500, zoom: 10, subregions: [
        { name: "Naoussa", lat: 40.633, lng: 22.067 },
        { name: "Goumenissa", lat: 40.900, lng: 22.400 }
      ]},
      "Crete": { lat: 35.500, lng: 24.500, zoom: 10, subregions: [
        { name: "Archanes", lat: 35.233, lng: 25.167 },
        { name: "Peza", lat: 35.100, lng: 25.133 }
      ]},
      "Aegean Islands": { lat: 37.000, lng: 25.500, zoom: 10, subregions: [
        { name: "Santorini", lat: 36.400, lng: 25.433 },
        { name: "Paros", lat: 37.083, lng: 25.150 }
      ]}
    }
  }
};

// Main countries (using coordinates from wineRegions)
const mainCountries = [
  { name: "USA", lat: 39.8283, lng: -98.5795 },
  { name: "France", lat: 46.6034, lng: 1.8883 },
  { name: "Italy", lat: 41.8719, lng: 12.5674 },
  { name: "Spain", lat: 40.4637, lng: -3.7492 },
  { name: "Portugal", lat: 39.3999, lng: -8.2245 },
  { name: "Australia", lat: -25.2744, lng: 133.7751 },
  { name: "New Zealand", lat: -40.9006, lng: 174.8860 },
  { name: "South Africa", lat: -30.5595, lng: 22.9375 },
  { name: "Argentina", lat: -38.4161, lng: -63.6167 },
  { name: "Chile", lat: -35.6751, lng: -71.5430 },
  { name: "Germany", lat: 51.1657, lng: 10.4515 },
  { name: "Austria", lat: 47.5162, lng: 14.5501 },
  { name: "Greece", lat: 39.0742, lng: 21.8243 }
];

// Specific wine regions (filtered to exclude broader regions)
const specificWineRegions = [
  // USA
  { name: "Napa Valley", country: "USA", lat: 38.2975, lng: -122.2869 },
  { name: "Sonoma County", country: "USA", lat: 38.433, lng: -122.515 },
  { name: "Willamette Valley", country: "USA", lat: 45.211, lng: -123.062 },
  { name: "Columbia Valley", country: "USA", lat: 46.200, lng: -119.500 },

  // France
  { name: "Bordeaux", country: "France", lat: 44.8378, lng: -0.5792 },
  { name: "Burgundy", country: "France", lat: 47.0311, lng: 4.8254 },
  { name: "Champagne", country: "France", lat: 49.256, lng: 4.033 },
  { name: "Rhône Valley", country: "France", lat: 44.777, lng: 4.871 },

  // Italy
  { name: "Tuscany", country: "Italy", lat: 43.7711, lng: 11.2486 },
  { name: "Piedmont", country: "Italy", lat: 44.693, lng: 7.678 },
  { name: "Veneto", country: "Italy", lat: 45.500, lng: 11.550 },
  { name: "Sicily", country: "Italy", lat: 37.599, lng: 14.015 },

  // Spain (excluding broader regions like Catalonia, Galicia, Andalusia)
  { name: "Rioja", country: "Spain", lat: 42.303, lng: -2.427 },
  { name: "Priorat", country: "Spain", lat: 41.200, lng: 0.766 }, // Specific region within Catalonia
  { name: "Penedès", country: "Spain", lat: 41.347, lng: 1.698 }, // Specific region within Catalonia
  { name: "Rías Baixas", country: "Spain", lat: 42.250, lng: -8.700 }, // Specific region within Galicia
  { name: "Ribeira Sacra", country: "Spain", lat: 42.400, lng: -7.500 }, // Specific region within Galicia
  { name: "Jerez", country: "Spain", lat: 36.683, lng: -6.133 }, // Specific region within Andalusia

  // Portugal
  { name: "Douro Valley", country: "Portugal", lat: 41.160, lng: -7.720 },
  { name: "Alentejo", country: "Portugal", lat: 38.641, lng: -7.999 },
  { name: "Vinho Verde", country: "Portugal", lat: 41.736, lng: -8.293 },
  { name: "Dão", country: "Portugal", lat: 40.530, lng: -7.905 },

  // Australia
  { name: "Barossa Valley", country: "Australia", lat: -34.554, lng: 138.958 },
  { name: "McLaren Vale", country: "Australia", lat: -35.219, lng: 138.546 },
  { name: "Yarra Valley", country: "Australia", lat: -37.750, lng: 145.583 },
  { name: "Hunter Valley", country: "Australia", lat: -32.750, lng: 151.167 },

  // New Zealand
  { name: "Marlborough", country: "New Zealand", lat: -41.5134, lng: 173.9612 },
  { name: "Central Otago", country: "New Zealand", lat: -45.033, lng: 169.217 },
  { name: "Hawke’s Bay", country: "New Zealand", lat: -39.633, lng: 176.850 },
  { name: "Martinborough", country: "New Zealand", lat: -41.217, lng: 175.450 },

  // South Africa
  { name: "Stellenbosch", country: "South Africa", lat: -33.934, lng: 18.860 },
  { name: "Paarl", country: "South Africa", lat: -33.730, lng: 18.967 },
  { name: "Constantia", country: "South Africa", lat: -34.050, lng: 18.433 },
  { name: "Swartland", country: "South Africa", lat: -33.350, lng: 18.750 },

  // Argentina (excluding broader regions like Patagonia, Salta, San Juan)
  { name: "Mendoza", country: "Argentina", lat: -32.889, lng: -68.845 },
  { name: "Cafayate", country: "Argentina", lat: -26.067, lng: -65.967 }, // Specific region within Salta
  { name: "Tulum Valley", country: "Argentina", lat: -31.600, lng: -68.500 }, // Specific region within San Juan
  { name: "Neuquén", country: "Argentina", lat: -38.950, lng: -68.067 }, // Specific region within Patagonia
  { name: "Río Negro", country: "Argentina", lat: -39.033, lng: -67.583 }, // Specific region within Patagonia

  // Chile
  { name: "Maipo Valley", country: "Chile", lat: -33.772, lng: -70.675 },
  { name: "Colchagua Valley", country: "Chile", lat: -34.650, lng: -71.200 },
  { name: "Aconcagua Valley", country: "Chile", lat: -32.830, lng: -70.706 },
  { name: "Itata Valley", country: "Chile", lat: -36.675, lng: -72.792 },

  // Germany
  { name: "Mosel", country: "Germany", lat: 49.744, lng: 6.627 },
  { name: "Rheingau", country: "Germany", lat: 50.023, lng: 8.075 },
  { name: "Pfalz", country: "Germany", lat: 49.432, lng: 8.215 },
  { name: "Rheinhessen", country: "Germany", lat: 49.850, lng: 8.250 },

  // Austria
  { name: "Wachau", country: "Austria", lat: 48.300, lng: 15.400 },
  { name: "Burgenland", country: "Austria", lat: 47.750, lng: 16.500 },
  { name: "Styria", country: "Austria", lat: 47.050, lng: 15.400 },
  { name: "Kremstal", country: "Austria", lat: 48.383, lng: 15.617 },

  // Greece
  { name: "Peloponnese", country: "Greece", lat: 37.500, lng: 22.500 },
  { name: "Macedonia", country: "Greece", lat: 40.750, lng: 22.500 },
  { name: "Crete", country: "Greece", lat: 35.500, lng: 24.500 },
  { name: "Aegean Islands", country: "Greece", lat: 37.000, lng: 25.500 }
];

// Combine main countries and specific wine regions
const allLabels = [...mainCountries, ...specificWineRegions];

// Add this: Define generateRings function here
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

// Initialize MapBox GL JS globe with closer zoom and centered position
const map = new mapboxgl.Map({
  container: "globeViz",
  style: "mapbox://styles/mapbox/satellite-streets-v12",
  center: [-98.5795, 39.8283], // Center on the USA (lng, lat)
  zoom: 2,
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

  // List of main wine-producing countries
  const wineCountries = [
    "USA", "France", "Italy", "Spain", "Portugal", "Australia", "New Zealand",
    "South Africa", "Argentina", "Chile", "Germany", "Austria", "Greece"
  ];

  // Iterate through all layers and modify label visibility
  layers.forEach(layer => {
    const layerId = layer.id;

    // Handle country labels: show only wine-producing countries
    if (layerId === "country-label") {
      map.setFilter(layerId, [
        "in",
        ["get", "name_en"],
        ["literal", wineCountries]
      ]);
    }
    // Disable all other label layers
    else if (
      layerId.includes("label") || // Matches layers like "state-label", "settlement-label", etc.
      layerId.includes("place") || // Matches layers like "place-city"
      layerId.includes("poi") ||   // Matches points of interest
      layerId.includes("water")    // Matches water labels like "South Atlantic Ocean"
    ) {
      map.setLayoutProperty(layerId, "visibility", "none");
    }
  });

  // Add the custom labels source
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

  // Add the custom labels layer on top
  map.addLayer({
    id: "labels-layer",
    type: "symbol",
    source: "labels",
    layout: {
      "text-field": ["get", "name"],
      "text-size": 14, // Increased for better readability
      "text-offset": [0, 1.5],
      "text-anchor": "top",
      "visibility": "visible"
    },
    paint: {
      "text-color": "#ffffff",
      "text-halo-color": "#000000",
      "text-halo-width": 2 // Increased for better contrast
    },
    minzoom: 2, // Show at country level
    maxzoom: 12 // Hide at subregional zooms for clarity
  });
});

  const ringsData = allLabels.flatMap(generateRings);

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
          0, ["get", "radius"],
          22, ["*", ["get", "radius"], 5]
        ],
        "circle-color": ["get", "color"],
        "circle-opacity": 0.6
      }
    });
  
    // Animate rings with controlled expansion
    function animateRings(timestamp) {
      ringsData.forEach((ring, index) => {
        const properties = ring.properties;
        const progress = (timestamp % properties.period) / properties.period;
        const radius = properties.radius * (1 + Math.sin(progress * Math.PI * 2) * properties.speed);
        ring.properties.radius = Math.min(radius, 0.5);
      });
      map.getSource("rings").setData({
        type: "FeatureCollection",
        features: ringsData
      });
      requestAnimationFrame(animateRings);
    }
    requestAnimationFrame(animateRings);
  
    // Start rotation
    rotateGlobe(); // Start the rotation after the map loads
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

  // Stop auto-rotation on interaction
  function stopAutoRotate() {
    autoRotate = false;
  }

  globeContainer.addEventListener("mousedown", stopAutoRotate);
  globeContainer.addEventListener("touchstart", stopAutoRotate);

  // Track and manage zoom level
  let currentZoomLevel = 2.0; // Updated to match initial zoom

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
      stopAndZoom(subregionData.lat, subregionData.lng, 11); // Maintains context at subregion level
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

  console.log("✅ MapBox Globe Initialized with Front-and-Center View and Closer Initial Zoom!");
});