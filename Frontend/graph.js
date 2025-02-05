document.addEventListener("DOMContentLoaded", async function () {
    let chart; // Store the chart instance globally
    let allData = []; // Store all fetched data

    async function fetchSeaAnimalDeaths() {
        try {
            let response = await fetch("http://localhost:8000/sea-animal-deaths/");
            let data = await response.json();
            allData = data; // Store the complete dataset
            updateGraph(); // Show default graph
        } catch (error) {
            console.error("Error fetching sea animal deaths data:", error);
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
            yearCounts[entry.year] = (yearCounts[entry.year] || 0) + entry.death_count;
        });

        let years = Object.keys(yearCounts).sort((a, b) => a - b);
        let deathCounts = years.map(year => yearCounts[year]);

        const ctx = document.getElementById("seaAnimalDeathsChart").getContext("2d");

        if (chart) {
            chart.destroy();
        }

        chart = new Chart(ctx, {
            type: "bar",
            data: {
                labels: years,
                datasets: [{
                    label: `Sea Animal Deaths (${startYear} - ${endYear})`,
                    data: deathCounts,
                    backgroundColor: "rgba(54, 162, 235, 0.6)",
                    borderColor: "rgba(54, 162, 235, 1)",
                    borderWidth: 1
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: { display: false } 
                },
                scales: {
                    x: {
                        ticks: {
                            autoSkip: false, 
                            maxRotation: 0,
                            minRotation: 0
                        }
                    },
                    y: {
                        beginAtZero: true,
                        ticks: {
                            stepSize: 100000, 
                            callback: function(value) {
                                return value.toLocaleString(); 
                            }
                        }
                    }
                }
            }
        });
    }

    document.getElementById("startYear").addEventListener("change", updateGraph);
    document.getElementById("endYear").addEventListener("change", updateGraph);

    fetchSeaAnimalDeaths();
});