class APISystem {
    constructor() {
        this.baseURL = CONFIG.NGROK_URL;
        this.isConnected = false;
        this.setupEventListeners();
    }

    setupEventListeners() {
        window.addEventListener('online', () => this.handleConnectivityChange(true));
        window.addEventListener('offline', () => this.handleConnectivityChange(false));
    }

    handleConnectivityChange(isOnline) {
        this.isConnected = isOnline;
        if (isOnline) {
            chartSystem.showStatus('Connected', 'success');
        } else {
            chartSystem.showStatus('Offline', 'error');
        }
    }

    async sendMessage(message) {
        try {
            avatarSystem.setState('thinking');
            const response = await fetch(`${this.baseURL}/chat`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ query: message })
            });

            if (!response.ok) throw new Error('API response was not ok');
            const data = await response.json();

            if (data.trade_data) {
                chartSystem.updateCharts(data.trade_data);
            }

            return {
                text: data.response,
                emotion: 'talking'
            };
        } catch (error) {
            console.error('API Error:', error);
            return {
                text: "I'm having trouble connecting to my backend. Please check the connection.",
                emotion: 'idle'
            };
        }
    }

    async getTradeData() {
        try {
            const response = await fetch(`${this.baseURL}/trade-data`);
            if (!response.ok) throw new Error('Failed to fetch trade data');
            return await response.json();
        } catch (error) {
            console.error('Trade data fetch error:', error);
            return null;
        }
    }
}

window.apiSystem = new APISystem();
