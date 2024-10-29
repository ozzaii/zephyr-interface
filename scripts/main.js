const audio = new AudioManager();
const avatar = new Avatar();
const charts = new ChartManager();
const api = new API();

document.getElementById('start-voice').addEventListener('click', () => {
    audio.startListening();
});

document.getElementById('send-text').addEventListener('click', async () => {
    const input = document.getElementById('text-input');
    const response = await api.sendMessage(input.value);
    audio.speak(response.text);
    avatar.setEmotion(response.emotion);
    input.value = '';
});

// Update trade data periodically
setInterval(async () => {
    const data = await api.getTradeData();
    charts.updateCharts(data);
}, 5000);
