document.addEventListener("DOMContentLoaded", async function () {
    let chart; // Store the chart instance globally
    let allData = []; // Store all fetched data

    async function fetchErosionData() {
        try {
            let response = await fetch("http://localhost:8000/erosion-data/");
            let data = await response.json();
            
            if (!Array.isArray(data) || data.length === 0) {
                console.error("No erosion data received or incorrect format.");
                alert("No data available to display.");
                return;
            }
    
            allData = data;
            console.log("Fetched Data:", allData); // Debugging log
            updateGraph(); // Show default graph
        } catch (error) {
            console.error("Error fetching erosion data:", error);
        }
    }

    function updateGraph() {
        const startYear = parseInt(document.getElementById("startYear").value);
        const endYear = parseInt(document.getElementById("endYear").value);

        let filteredData = allData.filter(entry => entry.year >= startYear && entry.year <= endYear);

        if (filteredData.length === 0) {
            alert(`No data available from ${startYear} to ${endYear}`);
            return;
        }

        let yearCounts = {};
        filteredData.forEach(entry => {
            yearCounts[entry.year] = (yearCounts[entry.year] || 0) + entry.erosion_rate;
        });

        let years = Object.keys(yearCounts).sort((a, b) => a - b);
        let erosionRates = years.map(year => yearCounts[year] || 0);

        const canvas = document.getElementById("erosionRateChart");
        if (!canvas) {
            console.error("Canvas not found! Make sure #erosionRateChart exists in the HTML.");
            return;
        }
        const ctx = canvas.getContext("2d");


        if (chart) {
            chart.destroy();
        }

        chart = new Chart(ctx, {
            type: "line",
            data: {
                labels: years,
                datasets: [{
                    label: `Erosion Rate (${startYear} - ${endYear})`,
                    data: erosionRates,
                    // textcolor: "rgba(255, 247, 99, 0.6)",
                    backgroundColor: "rgba(255, 250, 99, 0.6)",
                    borderColor: "rgb(255, 221, 99)",
                    borderWidth: 2,
                    fill: true
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: {
                        labels: {
                            font: {
                                family: "Arial", // ✅ Custom Font
                                size: 14
                            },
                            color: "white" // ✅ Change legend text color to white
                        }
                    }
                },
                scales: {
                    x: {
                        ticks: {
                            color: "white",  // ✅ Corrected
                            autoSkip: false,
                            maxRotation: 0,
                            minRotation: 0,
                            font: {
                                family: "Arial", // ✅ Custom Font for X-Axis
                                size: 12
                            }
                        },
                        title: {
                            display: true,
                            text: "Year",  // ✅ X-Axis Label
                            color: "white",
                            font: {
                                family: "Arial",
                                size: 14
                            }
                        }
                    },
                    y: {
                        beginAtZero: true,
                        ticks: {
                            color: "white",  // ✅ Corrected
                            font: {
                                family: "Arial", // ✅ Custom Font for X-Axis
                                size: 12
                            },
                            callback: value => value.toLocaleString()
                        },
                        title: {
                            display: true,
                            text: "Erosion Rate (m/year)",  // ✅ Y-Axis Label
                            color: "white",
                            font: {
                                family: "Arial",
                                size: 14
                            }
                        }
                    }
                }
            }
        });
    }

    document.getElementById("startYear").addEventListener("change", updateGraph);
    document.getElementById("endYear").addEventListener("change", updateGraph);

    fetchErosionData();
});
