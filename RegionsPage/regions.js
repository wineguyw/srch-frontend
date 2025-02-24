document.addEventListener("DOMContentLoaded", () => {
    // Wine production data for 2023 and 2024 (in million hectoliters, mhl)
    const wineProductionData = {
      labels: ["Italy", "France", "Spain", "USA", "Australia", "Argentina", "Chile", "South Africa", "New Zealand", "Portugal", "Germany", "Austria", "Greece"],
      datasets: [{
        label: "2023 (Provisional, mhl)",
        backgroundColor: "#1a1a5e", // Dark navy to match your design
        borderColor: "#1a1a5e",
        borderWidth: 2,
        borderRadius: 5,
        data: [38.3, 47.9, 28.4, 24.3, 9.6, 8.8, 11.0, 9.3, 3.6, 7.5, 8.6, 2.4, 1.4],
      }, {
        label: "2024 (Preliminary, mhl)",
        backgroundColor: "#b9bb44", // Golden yellow to match your design
        borderColor: "#b9bb44",
        borderWidth: 2,
        borderRadius: 5,
        data: [41.0, 36.9, 33.6, 23.6, 10.2, 10.9, 9.3, 8.8, 2.8, 6.9, 8.1, 2.2, 1.4],
      }]
    };
  
    // Chart configuration
    const chartConfig = {
      type: "bar",
      data: wineProductionData,
      options: {
        responsive: true,
        maintainAspectRatio: true,
        aspectRatio: 1.5, // Wider chart for better fit in the visualization
        scales: {
          y: {
            beginAtZero: true,
            title: {
              display: false
            },
            ticks: {
              color: "#666",
              font: {
                family: 'Montserrat',
                size: 12
              }
            },
            grid: {
              color: "rgba(26, 26, 94, 0.1)", // Light navy grid lines
              borderColor: "#1a1a5e"
            }
          },
          x: {
            title: {
              display: false
            },
            ticks: {
              color: "#666",
              font: {
                family: 'Montserrat',
                size: 12
              },
              autoSkip: true,
              maxRotation: 45,
              minRotation: 0
            },
            grid: {
              display: false
            }
          }
        },
        plugins: {
          legend: {
            labels: {
              color: "#1a1a5e",
              font: {
                family: 'Montserrat',
                size: 14,
                weight: '600'
              }
            },
            position: "top",
            align: "center"
          },
          title: {
            display: false
          },
          tooltip: {
            backgroundColor: "#1a1a5e",
            titleColor: "#faf3e0",
            bodyColor: "#faf3e0",
            borderColor: "#b9bb44",
            borderWidth: 2
          }
        },
        animation: {
          duration: 2000,
          easing: 'easeInOutQuart'
        }
      }
    };
  
    // Create the chart
    const ctx = document.getElementById("wineProductionChart").getContext("2d");
    const chart = new Chart(ctx, chartConfig);
  
    // Optional: Resize observer to ensure chart stability on window resize
    window.addEventListener("resize", () => {
      chart.resize(); // Force chart to redraw on resize, maintaining stability
    });
  });