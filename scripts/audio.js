// scripts/audio.js
class AudioSystem {
    constructor() {
        this.recognition = new (window.SpeechRecognition || window.webkitSpeechRecognition)();
        this.synthesis = window.speechSynthesis;
        this.isListening = false;
        this.setupRecognition();
        this.setupVoice();
    }

    setupRecognition() {
        this.recognition.continuous = false;
        this.recognition.interimResults = false;

        this.recognition.onstart = () => {
            this.isListening = true;
            avatarSystem.setState('thinking');
            document.getElementById('voice-btn').classList.add('bg-red-600');
        };

        this.recognition.onend = () => {
            this.isListening = false;
            avatarSystem.setState('idle');
            document.getElementById('voice-btn').classList.remove('bg-red-600');
        };

        this.recognition.onresult = (event) => {
            const transcript = event.results[0][0].transcript;
            document.getElementById('message-input').value = transcript;
            this.handleInput(transcript);
        };
    }

    setupVoice() {
        // Wait for voices to load
        speechSynthesis.onvoiceschanged = () => {
            this.voice = speechSynthesis.getVoices()
                .find(voice => voice.name.includes('Google US English Female') || voice.name.includes('Microsoft Zira'));
        };
    }

    async handleInput(text) {
        try {
            // Add user message to chat
            this.addChatMessage(text, 'user');

            // Show thinking state
            avatarSystem.setState('thinking');

            // Get response from your API
            const response = await fetch(CONFIG.NGROK_URL + '/chat', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ message: text })
            });

            const data = await response.json();
            
            // Add Zephyr's response to chat
            this.addChatMessage(data.response, 'zephyr');
            
            // Speak the response
            this.speak(data.response);

        } catch (error) {
            console.error('Error handling input:', error);
            this.addChatMessage('Sorry, I encountered an error.', 'zephyr');
        }
    }

    addChatMessage(text, sender) {
        const chat = document.getElementById('chat-container');
        const message = document.createElement('div');
        message.className = `message ${sender}-message`;
        message.textContent = text;
        chat.appendChild(message);
        chat.scrollTop = chat.scrollHeight;
    }

    speak(text) {
        const utterance = new SpeechSynthesisUtterance(text);
        utterance.voice = this.voice;
        utterance.pitch = 1.1;
        utterance.rate = 1;

        utterance.onstart = () => avatarSystem.startTalking();
        utterance.onend = () => avatarSystem.stopTalking();

        this.synthesis.speak(utterance);
    }

    toggleListening() {
        if (this.isListening) {
            this.recognition.stop();
        } else {
            this.recognition.start();
        }
    }
}

// Initialize Audio System
window.audioSystem = new AudioSystem();

// Set up event listeners
document.getElementById('voice-btn').addEventListener('click', () => {
    audioSystem.toggleListening();
});

document.getElementById('send-btn').addEventListener('click', () => {
    const input = document.getElementById('message-input');
    if (input.value.trim()) {
        audioSystem.handleInput(input.value);
        input.value = '';
    }
});

document.getElementById('message-input').addEventListener('keypress', (e) => {
    if (e.key === 'Enter' && e.target.value.trim()) {
        audioSystem.handleInput(e.target.value);
        e.target.value = '';
    }
});