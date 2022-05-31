
class SoundLoader {
    constructor() {
        this.ready = false;

        this.effects = [];
        this.musics = [];

        this.sceneMusic = new Audio("./assets/sound/gameTheme.wav");
        this.sceneMusic.volume = 0.2;
        this.sceneMusic.loop = true;
        this.sceneMusic.alreadyPlayed = false;
        this.musics.push(this.sceneMusic);

        this.gameOverMusic = new Audio("./assets/sound/playLoss.wav");
        this.gameOverMusic.volume = 0.2;
        this.gameOverMusic.alreadyPlayed = false;
        this.musics.push(this.gameOverMusic);

        this.jumpEffect = new Audio("./assets/sound/jumpSound.wav");
        this.jumpEffect.volume = 0.2;
        this.jumpEffect.alreadyPlayed = false;
        this.effects.push(this.jumpEffect);

        this.spikeEffect = new Audio("./assets/sound/spike.wav");
        this.spikeEffect.volume = 0.2;
        this.spikeEffect.alreadyPlayed = false;
        this.effects.push(this.spikeEffect);

        this.buttonClickEffect = new Audio("./assets/sound/buttonClickModified.wav");
        this.buttonClickEffect.volume = 0.2;
        this.buttonClickEffect.alreadyPlayed = false;
        this.effects.push(this.buttonClickEffect);

        this.buttonHoverEffect = new Audio("./assets/sound/buttonHoverModified.wav");
        this.buttonHoverEffect.volume = 0.2;
        this.buttonHoverEffect.alreadyPlayed = false;
        this.effects.push(this.buttonHoverEffect);

        this.doubleJumpEffect = new Audio("./assets/sound/doubleJump.wav");
        this.doubleJumpEffect.volume = 0.2;
        this.doubleJumpEffect.alreadyPlayed = false;
        this.effects.push(this.doubleJumpEffect);

        this.itemPickUpEffect = new Audio("./assets/sound/itemPickUpModified.wav");
        this.itemPickUpEffect.volume = 0.2;
        this.itemPickUpEffect.alreadyPlayed = false;
        this.effects.push(this.itemPickUpEffect);

        this.buttonClickEffect = new Audio("./assets/sound/buttonClickModified.wav");
        this.buttonClickEffect.volume = 0.2;
        this.buttonClickEffect.alreadyPlayed = false;
        this.effects.push(this.buttonClickEffect);

        this.shieldActivationEffect = new Audio("./assets/sound/shieldActivationModfied.wav");
        this.shieldActivationEffect.volume = 0.2;
        this.shieldActivationEffect.alreadyPlayed = false;
        this.effects.push(this.shieldActivationEffect);


        this.shieldBlockEffect = new Audio("./assets/sound/shieldBlockModified.wav");
        this.shieldBlockEffect.volume = 0.2;
        this.shieldBlockEffect.alreadyPlayed = false;
        this.effects.push(this.shieldBlockEffect);

        this.dashEffect = new Audio("./assets/sound/dash.wav");
        this.dashEffect.volume = 0.2;
        this.dashEffect.alreadyPlayed = false;
        this.effects.push(this.dashEffect);

        this.lightsOnEffect = new Audio("./assets/sound/lightsOn.wav");
        this.lightsOnEffect.volume = 0.2;
        this.lightsOnEffect.alreadyPlayed = false;
        this.effects.push(this.lightsOnEffect);

        this.winMusic = new Audio("./assets/sound/win.wav");
        this.winMusic.volume = 0.2;
        this.winMusic.alreadyPlayed = false;
        this.musics.push(this.winMusic);

        this.hellStartMusic = new Audio("./assets/sound/hellLevelStart.wav");
        this.hellStartMusic.volume = 0.2;
        this.hellStartMusic.alreadyPlayed = false;
        this.musics.push(this.hellStartMusic);

        this.heavenStartMusic = new Audio("./assets/sound/heavenStartMusic.wav");
        this.heavenStartMusic.volume = 0.8;
        this.heavenStartMusic.alreadyPlayed = false;
        this.musics.push(this.heavenStartMusic);

        this.hellThemeMusic = new Audio("./assets/sound/hellTheme.wav");
        this.hellThemeMusic.volume = 0.2;
        this.hellThemeMusic.alreadyPlayed = false;
        this.musics.push(this.hellThemeMusic);

        this.heavenMusic = new Audio("./assets/sound/heavenTheme.mp3");
        this.heavenMusic.volume = 0.2;
        this.heavenMusic.alreadyPlayed = false;
        this.musics.push(this.hellStartMusic);

        this.angel = new Audio("./assets/sound/angel.mp3");
        this.angel.volume = 0.2;
        this.angel.alreadyPlayed = false;
        this.effects.push(this.angel);

        this.satan = new Audio("./assets/sound/satan.mp3");
        this.satan.volume = 0.2;
        this.satan.alreadyPlayed = false;
        this.effects.push(this.satan);
    }

    playSound(sound) {
        if (!sound.alreadyPlayed) {
            sound.alreadyPlayed = true;
            setTimeout(() => {
                sound.alreadyPlayed = false;
            },100);

            if(sound.paused) {
                sound.currentTime = 0;
                sound.play();
            }
            else {
                sound.currentTime = 0;
            }
        }
    }

    resetAllSound() {
        for (let i = 0; i <this.musics.length; i++) {
            this.musics[i].pause();
        }
        for (let i = 0; i <this.effects.length; i++) {
            this.effects[i].pause();
        }
    }


    modifyEffectvolume(value) {
        this.modifyVolume(this.effects, value);
    }

    modifyMusicVolume(value) {
        this.modifyVolume(this.musics, value);
    }

    modifyVolume(sounds, value) {
        sounds.forEach(sound => {
            sound.volume = value;
        })
    }
}

export const soundLoader = new SoundLoader();

