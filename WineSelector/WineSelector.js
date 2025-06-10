document.addEventListener('DOMContentLoaded', () => {
  const form = document.getElementById('selector-form');
  const questions = form.querySelectorAll('.question');
  const result = document.getElementById('result');
  const currentStepDisplay = document.getElementById('current-step');
  const totalStepsDisplay = document.getElementById('total-steps');
  const wineRecommendation = document.getElementById('wine-recommendation');
  const whyRecommendation = document.getElementById('why-recommendation');
  const terroirNotes = document.getElementById('terroir-notes');
  const aromaNotes = document.getElementById('aroma-notes');
  const valueNotes = document.getElementById('value-notes');
  const startOverBtn = document.getElementById('start-over');
  let currentStep = 1;
  let answers = {};
  let wineDatabase = []; // Will be populated from MongoDB

  // Set total steps
  totalStepsDisplay.textContent = questions.length;

  // Show first question
  questions[0].classList.add('active');
  currentStepDisplay.textContent = currentStep;

  // Fetch wine data from the backend
  fetch('http://localhost:5001/api/wines')
    .then(response => response.json())
    .then(data => {
      wineDatabase = data; // Store the fetched data
      console.log('Wine data fetched:', wineDatabase); // For debugging
    })
    .catch(error => {
      console.error('Error fetching wine data:', error);
      alert('Failed to load wine data. Please try again later.');
    });

  // Handle button clicks
  form.addEventListener('click', (e) => {
    if (e.target.tagName === 'BUTTON' && e.target.dataset.value) {
      const step = parseInt(e.target.closest('.question').dataset.step);
      answers[`step${step}`] = e.target.dataset.value;

      if (step < questions.length) {
        questions[step - 1].classList.remove('active');
        questions[step].classList.add('active');
        currentStep++;
        currentStepDisplay.textContent = currentStep;
      } else {
        showResult();
      }
    }
  });

  // Helper function to get a random element from an array
  function getRandomElement(arr) {
    if (!arr || arr.length === 0) return null;
    return arr[Math.floor(Math.random() * arr.length)];
  }

  // Map MongoDB flavorProfiles to form flavor options
  function mapFlavorProfile(flavorProfiles) {
    if (!flavorProfiles || !Array.isArray(flavorProfiles)) return [];
    const flavorMap = {
      dry: ['dry', 'crisp', 'mineral'],
      light: ['light', 'fresh', 'crisp', 'citrus', 'herbs'],
      bold: ['bold', 'rich', 'oaky', 'full-bodied'],
      sweet: ['sweet', 'fruity', 'honeyed'],
    };

    const mappedFlavors = [];
    for (const flavor of Object.keys(flavorMap)) {
      if (flavorProfiles.some(profile => flavorMap[flavor].includes(profile))) {
        mappedFlavors.push(flavor);
      }
    }
    return mappedFlavors;
  }

  // Recommendation Logic
  function showResult() {
    questions.forEach(q => q.classList.remove('active'));
    result.classList.remove('hidden');

    const { step1: scenario, step2: flavor, step3: pairing, step4: budget, step5: color } = answers;

    // Step 1: Build the wine pool with color and budget as primary filters
    let winePool = [];
    wineDatabase.forEach(region => {
      if (!region.subregions) return;
      region.subregions.forEach(subregion => {
        if (!subregion.wines) return;
        subregion.wines.forEach(wine => {
          // Match color
          if (color === 'either' || wine.color === color) {
            // Match budget
            if (wine.priceRange.includes(budget)) {
              const mappedFlavors = mapFlavorProfile(wine.flavorProfiles);
              winePool.push({
                grape: wine.grape,
                color: wine.color,
                flavorProfiles: mappedFlavors,
                aromas: wine.aromas || [],
                priceRange: wine.priceRange || [],
                subregion: subregion.name,
                terroir: subregion.terroir,
                region: region.region,
                country: region.country,
              });
            }
          }
        });
      });
    });

    // Step 2: Filter by flavor profile (secondary filter)
    let filteredPool = winePool.filter(wine => wine.flavorProfiles.includes(flavor));

    // Step 3: Apply scenario-based weighting (tertiary filter)
    const scenarioWeights = {
      'date-night': { light: 0.4, dry: 0.3, bold: 0.2, sweet: 0.1 },
      'important-occasion': { bold: 0.4, dry: 0.3, sweet: 0.2, light: 0.1 },
      'casual': { sweet: 0.3, light: 0.3, dry: 0.2, bold: 0.2 },
    };
    const weights = scenarioWeights[scenario] || {};
    filteredPool = filteredPool.filter(wine => {
      const weight = weights[flavor] || 0;
      return Math.random() < weight + 0.5; // Increase base probability for more matches
    });

    // Step 4: Select a wine
    let selectedWine = getRandomElement(filteredPool);
    if (!selectedWine) {
      // Fallback 1: Ignore flavor and scenario, match on color and budget
      selectedWine = getRandomElement(winePool);
    }
    if (!selectedWine) {
      // Fallback 2: Ignore budget, match on color only
      winePool = [];
      wineDatabase.forEach(region => {
        if (!region.subregions) return;
        region.subregions.forEach(subregion => {
          if (!subregion.wines) return;
          subregion.wines.forEach(wine => {
            if (color === 'either' || wine.color === color) {
              const mappedFlavors = mapFlavorProfile(wine.flavorProfiles);
              winePool.push({
                grape: wine.grape,
                color: wine.color,
                flavorProfiles: mappedFlavors,
                aromas: wine.aromas || [],
                priceRange: wine.priceRange || [],
                subregion: subregion.name,
                terroir: subregion.terroir,
                region: region.region,
                country: region.country,
              });
            }
          });
        });
      });
      selectedWine = getRandomElement(winePool);
    }
    if (!selectedWine) {
      // Fallback 3: Select any wine (should never happen with 24 options)
      winePool = [];
      wineDatabase.forEach(region => {
        if (!region.subregions) return;
        region.subregions.forEach(subregion => {
          if (!subregion.wines) return;
          subregion.wines.forEach(wine => {
            const mappedFlavors = mapFlavorProfile(wine.flavorProfiles);
            winePool.push({
              grape: wine.grape,
              color: wine.color,
              flavorProfiles: mappedFlavors,
              aromas: wine.aromas || [],
              priceRange: wine.priceRange || [],
              subregion: subregion.name,
              terroir: subregion.terroir,
              region: region.region,
              country: region.country,
            });
          });
        });
      });
      selectedWine = getRandomElement(winePool);
    }

    // Step 5: Generate recommendation (guaranteed to have a selectedWine)
    const recommendation = {
      wine: selectedWine.grape,
      subregion: selectedWine.subregion,
      why: generateWhyText(scenario, flavor, pairing, selectedWine.grape),
      terroir: selectedWine.terroir,
      aromas: generateAromaText(selectedWine.aromas),
      value: generateValueText(budget, selectedWine.subregion),
    };

    // Step 6: Display recommendation
    wineRecommendation.textContent = `${recommendation.wine} from ${recommendation.subregion}, ${selectedWine.region}, ${selectedWine.country}`;
    whyRecommendation.textContent = `Why It’s Perfect: ${recommendation.why}`;
    terroirNotes.textContent = `Terroir Insights: ${recommendation.terroir}`;
    aromaNotes.textContent = `Aroma Profile: ${recommendation.aromas}`;
    valueNotes.textContent = `Value for Money: ${recommendation.value}`;
  }

  // Helper function to generate dynamic "Why" text
  function generateWhyText(scenario, flavor, pairing, wine) {
    const scenarioReasons = {
      'date-night': [
        `A ${flavor} ${wine} is an elegant choice for a romantic date night, offering a refined profile that complements a restaurant setting.`,
        `For a date night, this ${flavor} ${wine} brings sophistication and charm, perfect for an intimate dining experience.`,
        `This ${flavor} ${wine} is a great pick for a date night, balancing elegance with approachability to impress your partner.`,
      ],
      'important-occasion': [
        `A ${flavor} ${wine} is a prestigious choice for an important occasion, sure to impress your guests with its depth and character.`,
        `For a special occasion, this ${flavor} ${wine} offers a luxurious profile that elevates any event.`,
        `This ${flavor} ${wine} is perfect for an important occasion, bringing sophistication and a memorable taste to the table.`,
      ],
      'casual': [
        `A ${flavor} ${wine} is an easygoing choice for a casual night, offering a relaxed and enjoyable sipping experience.`,
        `For a casual evening, this ${flavor} ${wine} provides a laid-back yet flavorful option to unwind with.`,
        `This ${flavor} ${wine} is great for casual sipping, delivering a balanced and approachable taste for any night in.`,
      ],
    };

    let whyText = getRandomElement(scenarioReasons[scenario]) || `A ${flavor} ${wine} is a great choice for your occasion.`;

    // Adjust for pairing
    const pairingReasons = {
      'red-meat': ` It pairs beautifully with red meat, balancing the richness with its structure.`,
      'seafood': ` Its bright acidity complements seafood, enhancing the flavors of your meal.`,
      'pasta': ` This wine’s versatility makes it a great match for pasta dishes.`,
      'cheese': ` It pairs wonderfully with cheese, bringing out creamy and savory notes.`,
      'none': '',
    };
    whyText += pairingReasons[pairing] || '';

    return whyText;
  }

  // Helper function to generate dynamic aroma text
  function generateAromaText(aromas) {
    if (!aromas || aromas.length === 0) return 'No aroma profile available.';
    const selectedAromas = [];
    const numAromas = Math.floor(Math.random() * 2) + 2; // 2-3 aromas
    const shuffledAromas = aromas.sort(() => Math.random() - 0.5);
    for (let i = 0; i < numAromas && i < shuffledAromas.length; i++) {
      selectedAromas.push(shuffledAromas[i]);
    }
    const additionalNotes = ['with a subtle finish', 'with a lingering aftertaste', 'and a hint of complexity'];
    return `Expect aromas of ${selectedAromas.join(', ')} ${getRandomElement(additionalNotes) || ''}.`;
  }

  // Helper function to generate dynamic value text
  function generateValueText(budget, subregion) {
    const valueReasons = {
      'under-20': [
        `This subregion is known for offering excellent value under $20, making it a great pick for budget-conscious buyers.`,
        `At under $20, wines from ${subregion} provide fantastic quality for the price, often from smaller producers.`,
        `You’ll find great value under $20 in ${subregion}, with bottles that punch above their weight.`,
      ],
      '20-50': [
        `In the $20–$50 range, wines from ${subregion} offer a fantastic balance of quality and price, reflecting the region’s prestige.`,
        `For $20–$50, ${subregion} produces wines that deliver exceptional quality and terroir expression.`,
        `Wines from ${subregion} in the $20–$50 range are a great investment, offering depth and character.`,
      ],
      'over-50': [
        `For over $50, ${subregion} is renowned for producing premium wines that are worth the splurge, especially from top vintages.`,
        `At over $50, wines from ${subregion} are a luxurious treat, showcasing the best of the region.`,
        `Spending over $50 on a wine from ${subregion} ensures a high-quality, memorable experience.`,
      ],
    };
    return getRandomElement(valueReasons[budget]) || `Wines from ${subregion} offer great value.`;
  }

  // Reset Form
  startOverBtn.addEventListener('click', () => {
    result.classList.add('hidden');
    questions[0].classList.add('active');
    currentStep = 1;
    currentStepDisplay.textContent = currentStep;
    answers = {};
  });
});