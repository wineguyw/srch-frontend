document.addEventListener('DOMContentLoaded', () => {
    const regionCards = document.querySelectorAll('.region-card, .country-card, .state-card');
    const tabButtons = document.querySelectorAll('.tab-button');
  
    // Redirect to region page on card click (for region cards only)
    regionCards.forEach(card => {
      if (!card.classList.contains('country-card') && !card.classList.contains('state-card')) { // Only apply to region cards
        card.addEventListener('click', () => {
          const link = card.getAttribute('data-link');
          if (link) window.location.href = link;
        });
      }
    });
  
    // Data for continents, countries, states, and regions
    const regionsData = {
      europe: {
        countries: {
          france: ['bordeaux', 'burgundy', 'loirevalley', 'champagne'],
          italy: ['tuscany', 'piedmont'],
          spain: ['rioja', 'priorat']
        }
      },
      americas: {
        countries: {
          usa: {
            states: {
              california: ['napavalley', 'sonoma', 'centralcoast', 'mendocino', 'sierrafoothills'],
              oregon: ['willamettevalley', 'roguevalley', 'umpquavalley', 'columbiagorge', 'southernoregon'],
              washington: ['wallawalla', 'yakimavalley', 'columbiavalley', 'redmountain', 'pugetsound'],
              newyork: ['fingerlakes', 'longisland', 'hudsonvalley', 'niagaraescarpment', 'cayugalake'],
              texas: ['texashillcountry', 'highplains', 'panhandle', 'masoncounty', 'fredericksburg']
            }
          },
          argentina: ['mendoza', 'salta', 'patagonia', 'sanjuan', 'larioja'],
          canada: ['okanaganvalley', 'niagarapeninsula', 'similkameenvalley', 'peleeisland', 'princeedwardcounty'],
          mexico: ['bajacalifornia', 'sonora', 'aguascalientes', 'queretaro', 'guadalajara'],
          chile: ['maipovalley', 'colchaguavalley', 'casablancavalley', 'aconcaguavalley', 'biobiovalley']
        }
      },
      australia: {
        countries: {}
      },
      africa: {
        countries: {}
      },
      asia: {
        countries: {}
      }
    };
  
    // Track current view state (continent, country, state, or region)
    let currentView = 'continent';
    let currentContinent = 'europe'; // Default to Europe
    let currentCountry = null;
    let currentState = null;
  
    // Function to show cards based on type and filters
    function showCards(type, filter = null, subFilter = null) {
      regionCards.forEach(card => {
        const cardContinent = card.getAttribute('data-continent');
        const cardCountry = card.getAttribute('data-country');
        const cardState = card.getAttribute('data-state');
        const cardRegion = card.getAttribute('data-link')?.split('/').pop().toLowerCase();
  
        if (type === 'continent') {
          // Show only country cards for the selected continent
          if (cardContinent === filter && card.classList.contains('country-card')) {
            card.style.display = 'block';
          } else {
            card.style.display = 'none';
          }
        } else if (type === 'country') {
          // For USA, show state cards; for other countries, show region cards
          if (cardCountry === filter) {
            if (filter === 'usa' && card.classList.contains('state-card')) {
              card.style.display = 'block';
            } else if (filter !== 'usa' && !card.classList.contains('country-card') && !card.classList.contains('state-card')) {
              card.style.display = 'block';
            } else {
              card.style.display = 'none';
            }
          } else {
            card.style.display = 'none';
          }
        } else if (type === 'state') {
          // Show region cards for the selected state (USA only)
          if (cardState === filter && !card.classList.contains('country-card') && !card.classList.contains('state-card')) {
            card.style.display = 'block';
          } else {
            card.style.display = 'none';
          }
        }
      });
    }
  
    // Function to set the active tab visually
    function setActiveTab(continent) {
      tabButtons.forEach(button => {
        button.classList.remove('active');
        if (button.getAttribute('data-continent') === continent) {
          button.classList.add('active');
        }
      });
    }
  
    // Handle continent tab clicks
    tabButtons.forEach(button => {
      button.addEventListener('click', () => {
        tabButtons.forEach(btn => btn.classList.remove('active'));
        button.classList.add('active');
  
        currentContinent = button.getAttribute('data-continent');
        currentView = 'continent';
        currentCountry = null;
        currentState = null;
  
        showCards('continent', currentContinent);
      });
    });
  
    // Handle country card clicks (for Americas and other continents)
    const countryCards = document.querySelectorAll('.country-card');
    countryCards.forEach(card => {
      card.addEventListener('click', () => {
        currentCountry = card.getAttribute('data-country');
        currentView = 'country';
        currentState = null;
  
        if (currentCountry === 'usa') {
          showCards('country', currentCountry); // Show USA states
        } else {
          showCards('country', currentCountry); // Show subregions for other countries
        }
      });
    });
  
    // Handle state card clicks (for USA only)
    const stateCards = document.querySelectorAll('.state-card');
    stateCards.forEach(card => {
      card.addEventListener('click', () => {
        currentState = card.getAttribute('data-state');
        currentView = 'state';
  
        showCards('state', currentState);
      });
    });
  
    // On page load, ensure Europe is selected and displayed
    setActiveTab('europe');
    currentContinent = 'europe';
    showCards('continent', currentContinent);
  });