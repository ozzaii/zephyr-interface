class API {
    constructor() {
        this.ngrokUrl = 'YOUR_NGROK_URL';
    }

    async sendMessage(text) {
        const response = await fetch(`${this.ngrokUrl}/chat`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ message: text })
        });
        
        return await response.json();
    }

    async getTradeData() {
        const response = await fetch(`${this.ngrokUrl}/trade-data`);
        return await response.json();
    }
}
