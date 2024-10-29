// scripts/avatar.js - Updated with pre-made assets
class AvatarSystem {
    constructor() {
        // Keep existing constructor code but update backgroundColor
        this.app = new PIXI.Application({
            width: CONFIG.AVATAR_SETTINGS.WIDTH,
            height: CONFIG.AVATAR_SETTINGS.HEIGHT,
            backgroundColor: 0x0A192F, // Sleek dark blue background
            antialias: true,
            resolution: window.devicePixelRatio || 1,
        });

        document.getElementById('avatar-container').appendChild(this.app.view);
        
        // Enhanced state management
        this.states = {
            idle: { 
                url: 'https://cdnjs.cloudflare.com/ajax/libs/file-icons/2.1.46/svg/ai.svg',
                frames: 1
            },
            talking: {
                url: 'https://cdnjs.cloudflare.com/ajax/libs/file-icons/2.1.46/svg/ai.svg',
                frames: 1
            },
            thinking: {
                url: 'https://cdnjs.cloudflare.com/ajax/libs/file-icons/2.1.46/svg/ai.svg',
                frames: 1
            }
        };

        this.currentState = null;
        this.sprite = null;
        this.glowFilter = null;
        
        this.init();
    }

    async init() {
        // Create glow effect
        this.glowFilter = new PIXI.filters.GlowFilter({
            distance: 15,
            outerStrength: 2,
            innerStrength: 1,
            color: 0x00ff00,
            quality: 0.5
        });

        await this.loadAssets();
        this.setupSprite();
        this.addPulseEffect();
        this.setState('idle');
    }

    async loadAssets() {
        // Load the SVG as a sprite
        this.sprite = await PIXI.Sprite.from(this.states.idle.url);
        
        // Configure sprite
        this.sprite.anchor.set(0.5);
        this.sprite.x = this.app.screen.width / 2;
        this.sprite.y = this.app.screen.height / 2;
        this.sprite.width = 200;
        this.sprite.height = 200;
        this.sprite.filters = [this.glowFilter];
        
        this.app.stage.addChild(this.sprite);
    }

    setupSprite() {
        // Add interactive features
        this.sprite.interactive = true;
        this.sprite.buttonMode = true;
        
        // Hover effects
        this.sprite.on('mouseover', () => {
            gsap.to(this.glowFilter, {
                outerStrength: 4,
                duration: 0.3
            });
        });
        
        this.sprite.on('mouseout', () => {
            gsap.to(this.glowFilter, {
                outerStrength: 2,
                duration: 0.3
            });
        });
    }

    addPulseEffect() {
        gsap.to(this.sprite.scale, {
            x: 1.05,
            y: 1.05,
            duration: 1,
            repeat: -1,
            yoyo: true,
            ease: "power1.inOut"
        });
    }

    setState(state) {
        if (!this.states[state]) return;
        this.currentState = state;

        switch(state) {
            case 'talking':
                this.glowFilter.color = 0x00ff00; // Green for talking
                break;
            case 'thinking':
                this.glowFilter.color = 0x0088ff; // Blue for thinking
                break;
            case 'idle':
                this.glowFilter.color = 0x00ff88; // Cyan for idle
                break;
        }
    }

    startTalking() {
        this.setState('talking');
        gsap.to(this.sprite.scale, {
            x: 1.1,
            y: 1.1,
            duration: 0.3,
            yoyo: true,
            repeat: -1
        });
    }

    stopTalking() {
        this.setState('idle');
        gsap.to(this.sprite.scale, {
            x: 1,
            y: 1,
            duration: 0.3
        });
    }
}

window.avatarSystem = new AvatarSystem();