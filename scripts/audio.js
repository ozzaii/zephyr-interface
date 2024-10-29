class AudioManager {
    constructor() {
        this.recognition = new (window.SpeechRecognition || window.webkitSpeechRecognition)();
        this.synthesis = window.speechSynthesis;
        this.setupRecognition();
    }

    setupRecognition() {
        this.recognition.continuous = true;
        this.recognition.interimResults = true;
        
        this.recognition.onresult = (event) => {
            const transcript = Array.from(event.results)
                .map(result => result[0].transcript)
                .join('');
                
            if (event.results[0].isFinal) {
                this.handleSpeech(transcript);
            }
        };
    }

    async handleSpeech(transcript) {
        const response = await api.sendMessage(transcript);
        this.speak(response.text);
        avatar.setEmotion(response.emotion);
    }

    speak(text) {
        const utterance = new SpeechSynthesisUtterance(text);
        utterance.voice = this.synthesis.getVoices()
            .find(voice => voice.lang === 'en-US' && voice.name.includes('Female'));
        utterance.pitch = 1.2;
        utterance.rate = 1.1;
        this.synthesis.speak(utterance);
    }

    startListening() {
        this.recognition.start();
    }

    stopListening() {
        this.recognition.stop();
    }
}
