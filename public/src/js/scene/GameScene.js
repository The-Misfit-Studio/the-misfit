import {
    addUIControlMenuButton,
    createEllipse,
    GameLevel,
    GameOptions,
    GameState,
    progress,
    setupBlackScreen
} from "../utils.js";
import AbstractScene from "./AbstractScene.js";
import {soundLoader} from "../sound.js";
import Hero from "../hero.js";
import Loader from "./Loader.js";

export default class GameScene extends AbstractScene {

    constructor(engine, canvas) {
        super(engine, canvas);

        this.score = 0;
        this.gui = {};
        this.hero = null;
        this.center = null;
        this.typePath = undefined;
        this.progressBar = [];
        this.currentLevel = undefined;
        this.isGameOver = false;
        this.assetsManager = new BABYLON.AssetsManager(this);
        this.currentLevel = GameLevel.getLevelByName(progress.currentSelectedLevel);
        this.loader = new Loader(this, engine)
        this.loader.load();

        this.enablePhysics(
            new BABYLON.Vector3(0, GameOptions.gravity, 0)
        );

        this.createGUI();
        this.createLights();
        this.createBackground();
    }

    setupUI(advancedTexture) {
        if (this.currentLevel.type === GameLevel.HELL) {
            this.typePath = "heaven";
        } else this.typePath = "hell";

        let path = `./assets/ui/gui/${this.typePath}Spell`;

        this.spells = {
            spell1: undefined,
            spell1Filled: [],
            spell1Empty: [],
            timerSpell1: undefined,
            spell2: undefined,
            spell2Filled: [],
            spell2Empty: [],
            timerSpell2: undefined
        }

        if (this.currentLevel.spell1_slot > 0) {
            this.spells.spell1 = advancedTexture.getControlByName("Spell1");
            this.spells.timerSpell1 = advancedTexture.getControlByName("timerSpell1");



            this.spells.spell1.source = `${path}/${this.typePath}Spell1.png`;
            for (let i = 1; i <= this.currentLevel.spell1_slot; i++) {
                let slotName = `Slot1${i}`;
                let slotFilled = advancedTexture.getControlByName(slotName + "Filled");
                let slotEmpty = advancedTexture.getControlByName(slotName + "Empty");
                slotFilled.source = `${path}/${this.typePath}FilledSlot.png`;
                slotEmpty.source = `${path}/emptySlot.png`;
                slotFilled.isVisible = true;
                slotEmpty.isVisible = false;
                this.spells.spell1Filled.push(slotFilled);
                this.spells.spell1Empty.push(slotEmpty);
            }
        }
        if (this.currentLevel.spell2_slot > 0) {
            this.spells.spell2 = advancedTexture.getControlByName("Spell2");
            this.spells.timerSpell2 = advancedTexture.getControlByName("timerSpell2");

            this.spells.spell2.source = `${path}/${this.typePath}Spell2.png`;
            for (let i = 1; i <= this.currentLevel.spell2_slot; i++) {
                let slotName = `Slot2${i}`;
                let slotFilled = advancedTexture.getControlByName(slotName + "Filled");
                let slotEmpty = advancedTexture.getControlByName(slotName + "Empty");
                slotFilled.source = `${path}/${this.typePath}FilledSlot.png`;
                slotEmpty.source = `${path}/emptySlot.png`;
                slotFilled.isVisible = true;
                slotEmpty.isVisible = false;
                this.spells.spell2Filled.push(slotFilled);
                this.spells.spell2Empty.push(slotEmpty);
            }
        }
    }

    setupHeart(advancedTexture) {
        this.hearts = [6];
        for (let i = 1; i <= 3; i++) {
            let hF = advancedTexture.getControlByName("heart"+i+"Filled");
            let hE = advancedTexture.getControlByName("heart"+i+"Empty");

            hE.source = "./assets/ui/gui/heart/heartGrey.png"
            hF.source = "./assets/ui/gui/heart/heartRed.png"
            hE.isVisible = false;
            hF.isVisible = true;
            this.hearts[i-1] = hF;
            this.hearts[i+2] = hE;
        }
    }

    async createGUI() {

        let advancedTexture = BABYLON.GUI.AdvancedDynamicTexture.CreateFullscreenUI(
            "mainMenuUI",
            true,
            this
        );

        await advancedTexture.parseFromURLAsync("./assets/ui/json/inGameUI.json");
        this.setupUI(advancedTexture);

        for (let i = 0; i < 10; i++) {
            let progress = advancedTexture.getControlByName(`progress${i}`);
            progress.source = `./assets/ui/gui/progressBar/progressBar${i}.png`;
            progress.isVisible = false;
            this.progressBar.push(progress);
        }

        this.setupHeart(advancedTexture)

        let h = this.canvas.height;
        let w = this.canvas.width;
        let sizePx = 100;
        let recs = [];

        setupBlackScreen(recs, h, w, sizePx, 1, advancedTexture);

        let startButton = advancedTexture.getControlByName("startButton");
        advancedTexture.removeControl(startButton);
        advancedTexture.addControl(startButton);
        addUIControlMenuButton(advancedTexture, "start", "Blue", () => {

            soundLoader.playSound(this.currentStartMusic);
            this.currentStartMusic.onended = () => {
                soundLoader.playSound(this.currentMusic);
            }
            soundLoader.sceneMusic.pause();
            this.hero.updateHeart();

            startButton.dispose();

            if (this.currentLevel.isTuto) {
                this.loader.tutoLoader.mainTuto.isVisible = false;
            }
            this.canvas.requestPointerLock();
            let lenRec = recs.length;
            let i = 0;
            let interv = setInterval(() => {
                if (i >= lenRec) {
                    clearInterval(interv);
                    this.hero.applyPhysics();
                    GameState.state = GameState.IN_GAME;
                    for (let j = 0; j < recs.length; j++) {
                        recs[j].dispose();
                    }
                } else {
                    recs[i].alpha = 0;
                    i++;
                }
            }, 5);
        },)

        this.render();
        this.gui.advancedTexture = advancedTexture;
    }

    updateProgressBar() {
        if (this.progressBar.length > 0) {
            this.progressBar[0].isVisible = true;
            let percentage = (this.hero.heroMesh.position.z - this.hero.center.z) / (this.endScenePosition.z - this.hero.center.z);
            for (let i = 0; i < this.progressBar.length; i++) {
                this.progressBar[i].isVisible = i === Math.floor(percentage * 10);
            }
        }
    }

    gameOver() {
        document.exitPointerLock();
        this.currentMusic.pause();
        soundLoader.playSound(soundLoader.gameOverMusic);

        this.isGameOver = true;
        this.hero.bounder.dispose();
        let ellipses = [];
        let perc = Math.max(this.canvas.width, this.canvas.height) * 1.2;
        while (perc > 0) {
            let r = createEllipse(this.gui.advancedTexture, perc, perc, 100);
            r.alpha = 0;
            ellipses.push(r);
            perc -= 30;
        }
        let i = 0;
        let len = ellipses.length;
        let interval = setInterval(() => {
            if (i >= len) {
                clearInterval(interval);
                GameState.state = GameState.GAME_OVER;
            } else {
                ellipses[i].alpha = 1;
                i++;
            }
        }, 0);
    }

    win() {
        progress.addCoins(this.hero.tmpCoins);
        document.exitPointerLock();
        this.currentMusic.pause()
        soundLoader.playSound(soundLoader.winMusic);
        soundLoader.gameOverMusic.onpause = () => {
            if (soundLoader.sceneMusic.paused && GameState.state !== GameState.LOADING) {
                soundLoader.playSound(soundLoader.sceneMusic);
            }
        }
        this.isGameOver = true;
        this.hero.bounder.dispose();

        let h = this.canvas.height;
        let w = this.canvas.width;
        let sizePx = 100;
        let recs = [];

        setupBlackScreen(recs, h, w, sizePx, 0, this.gui.advancedTexture);

        let lenRec = recs.length;
        let i = 0;
        let interv = setInterval(() => {
            if (i >= lenRec) {
                clearInterval(interv);
                progress.addCompletedLevel(progress.currentSelectedLevel);
                GameState.state = GameState.WIN;
            } else {
                recs[i].alpha = 1;
                i++;
            }
        }, 5);
    }

    restart() {
        this.hero = new Hero(this);
        this.createGUI();

        if (this.currentLevel.isTuto) {
            this.loader.tutoLoader.mainTuto.isVisible = true;
        }

        this.loader.setupRestart();

        GameState.state = GameState.WAIT_START;
        this.gui.advancedTexture.dispose();
        this.isGameOver = false;
    }

    moveLight() {
        this.light.intensity = GameOptions.baseLightHell;
        this.light.position = this.hero.heroMesh.position.clone()
        this.light.position.y += 15;
        this.secondLight.position = this.hero.heroMesh.position.clone()
        this.secondLight.position.y += 15;
    }

    computeScene() {
        if (!this.isGameOver) {
            this.camera.position.z = this.hero.heroMesh.position.z - 25;
            this.camera.position.x = this.center; // to define with global var in the mesh as the center of the map.
            this.camera.position.y = this.hero.heroMesh.position.y + 15;

            if (this.currentLevel.type === GameLevel.HELL) {
                this.moveLight();
            }

            this.updateProgressBar();
        }
    }

}