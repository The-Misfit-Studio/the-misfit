import {addUIControlMenuButton, GameLevel, GameOptions, GameState, progress} from "../utils.js";
import {soundLoader} from "../sound.js";

export default class AbstractScene extends BABYLON.Scene {

    constructor(engine, canvas) {
        super(engine);

        this.engine = engine;
        this.canvas = canvas;
        this.camera = this.createCamera();
        this.score = 0;
        this.gui = null;
        this.hero = null;
        this.center = null;
        this.endScenePosition = undefined;
        this.currentMusic = undefined;
        this.currentStartMusic = undefined;
        this.enablePhysics(
            new BABYLON.Vector3(0, GameOptions.gravity, 0)
        );
        this.createBackground();
    }

    createLights() {
        if (this.currentLevel.type === GameLevel.HELL) {
            this.currentMusic = soundLoader.hellThemeMusic;
            this.currentStartMusic = soundLoader.hellStartMusic;
        } else {
            this.currentMusic = soundLoader.heavenMusic;
            this.currentStartMusic = soundLoader.heavenStartMusic;
        }

        if (this.currentLevel.type === GameLevel.HEAVEN) {
            this.light = new BABYLON.HemisphericLight("light2", new BABYLON.Vector3(0, 100, 20), this);
            this.light.intensity = 1;
        } else {
            this.light = new BABYLON.SpotLight("light1", new BABYLON.Vector3(0, -1, 0), new BABYLON.Vector3(0, -1, 0), Math.PI / 2, 1, this);
            this.secondLight = new BABYLON.PointLight("light1", new BABYLON.Vector3(0, -1, 0), this);
            this.light.intensity = 0.5;
            this.secondLight.intensity = 0.1;
        }
    }

    createBackground() {
        let background = new BABYLON.Layer("back", "./assets/menuBackground.jpg", this);
        background.isBackground = true;
        background.texture.level = 0;
    }

    createCamera() {
        let followCamera = new BABYLON.FlyCamera("heroFollowCamera", new BABYLON.Vector3(0, 50, 0), this, true);
        followCamera.cameraRotation.x = 0.05;
        return followCamera;
    }

    async pauseMenu() {
        let advancedTexture = BABYLON.GUI.AdvancedDynamicTexture.CreateFullscreenUI("mainMenuUI", true, this);

        let loadedGUI = await advancedTexture.parseFromURLAsync("./assets/ui/json/pauseMenuUI.json");
        let currentMusic;

        this.currentMusic.pause();
        this.lastPositionHero = this.hero.bounder.position.clone();
        this.lastLifeHero = this.hero.life;
        this.lastVelocity = this.hero.bounder.physicsImpostor.getLinearVelocity();

        this.hero.bounder.position = BABYLON.Vector3.Zero();
        this.hero.bounder.physicsImpostor.setLinearVelocity(BABYLON.Vector3.Zero());
        this.hero.bounder.physicsImpostor.dispose();

        document.exitPointerLock();


        addUIControlMenuButton(advancedTexture, "mainMenu", "Red", () => {
            GameState.state = GameState.START_MENU;
            soundLoader.gameOverMusic.pause();
            soundLoader.sceneMusic.pause();
            advancedTexture.dispose();
        });

        addUIControlMenuButton(advancedTexture, "restart", "Red", () => {
            GameState.state = GameState.RESTARTING;
            advancedTexture.dispose();
        });

        addUIControlMenuButton(advancedTexture, "start", "Red", () => {
            this.resume();
            advancedTexture.dispose();
        });

        addUIControlMenuButton(advancedTexture, "options", "Red", async () => {
            await this.optionsMenu();
        });
    }

    resume() {
        this.currentMusic.play();

        this.hero.bounder.position = this.lastPositionHero;
        this.hero.bounder.physicsImpostor.setLinearVelocity(this.lastVelocity);
        this.hero.life = this.lastLifeHero;
        this.hero.applyPhysics();
        this.canvas.requestPointerLock();
        GameState.state = GameState.IN_GAME;
    }

    async optionsMenu() {
        let advancedTexture = BABYLON.GUI.AdvancedDynamicTexture.CreateFullscreenUI("mainMenuUI", true, this);

        let loadedGUI = await advancedTexture.parseFromURLAsync("./assets/ui/json/optionsMenuUI.json");


        addUIControlMenuButton(advancedTexture, "cross", "Red", async () => {
            advancedTexture.dispose();
        })

        let effectSlider = advancedTexture.getControlByName("effectSlider")
        effectSlider.value = soundLoader.jumpEffect.volume;
        effectSlider.onValueChangedObservable.add((value) => {
            soundLoader.modifyEffectvolume(value);
        })
        effectSlider.onPointerUpObservable.add(() => {
            soundLoader.playSound(soundLoader.jumpEffect);
        })


        let musicSlider = advancedTexture.getControlByName("musicSlider")
        musicSlider.value = soundLoader.sceneMusic.volume;
        musicSlider.onValueChangedObservable.add((value) => {
            soundLoader.modifyMusicVolume(value);
        })
    }
}