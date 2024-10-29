// scripts/charts.js
class ChartSystem {
    constructor() {
        this.charts = {};
        this.setupCharts();
    }

    setupCharts() {
        const container = document.getElementById('charts-container');
        container.innerHTML = `
            <div class="grid grid-cols-2 gap-4 h-full">
                <div class="bg-gray-900 rounded-lg p-4">
                    <canvas id="volumeChart"></canvas>
                </div>
                <div class="bg-gray-900 rounded-lg p-4">
                    <canvas id="priceChart"></canvas>
                </div>
                <div class="bg-gray-900 rounded-lg p-4 col-span-2">
                    <canvas id="marketShareChart"></canvas>
                </div>
            </div>
        `;

        this.initializeCharts();
    }

    initializeCharts() {
        // Initialize Volume Chart
        this.charts.volume = new Chart(
            document.getElementById('volumeChart').getContext('2d'),
            {
                type: 'line',
                data: {
                    labels: [],
                    datasets: [{
                        label: 'Trade Volume (KG)',
                        data: [],
                        borderColor: '#60A5FA',
                        backgroundColor: '#60A5FA33',
                        fill: true,
                        tension: 0.4
                    }]
                },
                options: this.getChartOptions('Trade Volume')
            }
        );

        // Initialize Price Chart
        this.charts.price = new Chart(
            document.getElementById('priceChart').getContext('2d'),
            {
                type: 'line',
                data: {
                    labels: [],
                    datasets: [{
                        label: 'Price per KG (USD)',
                        data: [],
                        borderColor: '#34D399',
                        backgroundColor: '#34D39933',
                        fill: true,
                        tension: 0.4
                    }]
                },
                options: this.getChartOptions('Price Trends')
            }
        );

        // Initialize Market Share Chart
        this.charts.marketShare = new Chart(
            document.getElementById('marketShareChart').getContext('2d'),
            {
                type: 'bar',
                data: {
                    labels: [],
                    datasets: [{
                        label: 'Market Share (%)',
                        data: [],
                        backgroundColor: ['#60A5FA', '#34D399', '#F472B6', '#FBBF24']
                    }]
                },
                options: this.getChartOptions('Market Share by Company', true)
            }
        );
    }

    getChartOptions(title, isBar = false) {
        return {
            responsive: true,
            maintainAspectRatio: false,
            animation: {
                duration: 500,
                easing: 'easeOutQuart'
            },
            plugins: {
                legend: {
                    labels: {
                        color: '#E5E7EB'
                    }
                },
                title: {
                    display: true,
                    text: title,
                    color: '#E5E7EB',
                    font: {
                        size: 16
                    }
                }
            },
            scales: {
                x: {
                    grid: {
                        color: '#374151'
                    },
                    ticks: {
                        color: '#E5E7EB'
                    }
                },
                y: {
                    grid: {
                        color: '#374151'
                    },
                    ticks: {
                        color: '#E5E7EB'
                    },
                    beginAtZero: true,
                    suggestedMax: isBar ? 100 : undefined
                }
            }
        };
    }

    updateCharts(data) {
        if (data.volume) this.updateVolumeChart(data.volume);
        if (data.price) this.updatePriceChart(data.price);
        if (data.marketShare) this.updateMarketShareChart(data.marketShare);
    }

    updateVolumeChart(volumeData) {
        const chart = this.charts.volume;
        if (chart.data.labels.length > CONFIG.TRADE_DATA.MAX_POINTS) {
            chart.data.labels.shift();
            chart.data.datasets[0].data.shift();
        }
        chart.data.labels.push(new Date().toLocaleDateString());
        chart.data.datasets[0].data.push(volumeData);
        chart.update('none');
    }

    updatePriceChart(priceData) {
        const chart = this.charts.price;
        if (chart.data.labels.length > CONFIG.TRADE_DATA.MAX_POINTS) {
            chart.data.labels.shift();
            chart.data.datasets[0].data.shift();
        }
        chart.data.labels.push(new Date().toLocaleDateString());
        chart.data.datasets[0].data.push(priceData);
        chart.update('none');
    }

    updateMarketShareChart(marketShareData) {
        const chart = this.charts.marketShare;
        chart.data.labels = Object.keys(marketShareData);
        chart.data.datasets[0].data = Object.values(marketShareData);
        chart.update('none');
    }

    showStatus(message, type) {
        const statusEl = document.getElementById('status');
        if (statusEl) {
            statusEl.textContent = message;
            statusEl.className = `text-sm ${type === 'error' ? 'text-red-500' : 'text-green-500'}`;
        }
    }
}

window.chartSystem = new ChartSystem();