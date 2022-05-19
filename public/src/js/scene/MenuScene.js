import AbstractScene from "./AbstractScene.js";
import {
    addUIControlMenuButton,
    arrayContains,
    createRect,
    GameLevel,
    GameOptions,
    GameState,
    progress
} from "../utils.js";
import {soundLoader} from "../sound.js";

export default class MenuScene extends AbstractScene {

    constructor(engine, canvas) {
        super(null, engine, canvas);
    }

    async mainMenu() {
        if (soundLoader.sceneMusic.paused) {
            soundLoader.playSound(soundLoader.sceneMusic);
        }

        let advancedTexture = BABYLON.GUI.AdvancedDynamicTexture.CreateFullscreenUI("mainMenuUI", true, this);
        let loadedGUI = await advancedTexture.parseFromURLAsync("./assets/ui/json/mainMenuUI.json");

        let logo = advancedTexture.getControlByName("Logo");
        logo.source = "./assets/ui/Logo.png";

        let playButton = advancedTexture.getControlByName("playButton");
        let optionsButton = advancedTexture.getControlByName("optionsButton");

        addUIControlMenuButton(advancedTexture, "play", "Red", async () => {
            if (soundLoader.sceneMusic.paused) {
                soundLoader.playSound(soundLoader.sceneMusic);
            }
            this.clearColor = new BABYLON.Color4(0, 0, 0);
            playButton.dispose();
            optionsButton.dispose();
            await this.levelMenu();
            this.render();
            advancedTexture.dispose();
        });

        addUIControlMenuButton(advancedTexture, "options", "Red", async () => {
            await this.optionsMenu();
            advancedTexture.dispose();
        });
    }

    async optionsMenu() {
        let advancedTexture = BABYLON.GUI.AdvancedDynamicTexture.CreateFullscreenUI("mainMenuUI", true, this);
        let loadedGUI = await advancedTexture.parseFromURLAsync("./assets/ui/json/optionsMenuUI.json");


        addUIControlMenuButton(advancedTexture, "cross", "Red", async () => {
            await this.mainMenu()
            advancedTexture.dispose();
        })

        let effectSlider = advancedTexture.getControlByName("effectSlider");
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

    async levelMenu() {

        let advancedTexture = BABYLON.GUI.AdvancedDynamicTexture.CreateFullscreenUI("mainMenuUI", true, this);

        let loadedGUI = await advancedTexture.parseFromURLAsync("./assets/ui/json/levelSelectorUI.json");

        let lastLevelCompleted = progress.levelsCompleted.length + 1;

        for (let levelIndex = 1; levelIndex <= GameLevel.NB_LEVEL; levelIndex++) {
            let state = "Done";
            let name = "level" + levelIndex;
            if (levelIndex <= lastLevelCompleted) {
                if (levelIndex === lastLevelCompleted) {
                    state = "Unlocked";
                }
                addUIControlMenuButton(advancedTexture, name, state, () => {
                    if (levelIndex > 4) {
                        alert("Niveau pas encore implémenté");
                    } else {
                        advancedTexture.dispose();
                        progress.currentSelectedPath = "Level" + levelIndex + ".json";
                        progress.currentSelectedLevel = "Level" + levelIndex;

                        GameState.state = GameState.STARTING;
                        this.clearColor = new BABYLON.Color4(0, 0, 0);
                        soundLoader.sceneMusic.pause();
                        this.render();
                    }
                }, "levels", state);

            } else {
                state = "Locked";
                addUIControlMenuButton(advancedTexture, name, state, () => {
                }, "levels", state);
            }
        }
        window.addEventListener("keydown", async(e) => {
            if (e.key === "²") {
                progress.unlockLevels();
                await this.levelMenu();
                advancedTexture.dispose();
            }
        });

        addUIControlMenuButton(advancedTexture, "mainMenu", "Red", async () => {
            await this.mainMenu();
            advancedTexture.dispose();
        });
        addUIControlMenuButton(advancedTexture, "reset", "Blue", async () => {
            progress.resetProgression();
            await this.levelMenu();
            advancedTexture.dispose();
        });
    }

    async gameOverMenu() {
        let advancedTexture = BABYLON.GUI.AdvancedDynamicTexture.CreateFullscreenUI("mainMenuUI", true, this);

        let loadedGUI = await advancedTexture.parseFromURLAsync("./assets/ui/json/gameOverMenu.json")

        addUIControlMenuButton(advancedTexture, "mainMenu", "Red", () => {
            this.mainMenu();
            soundLoader.resetAllSound();
            advancedTexture.dispose();
        });

        addUIControlMenuButton(advancedTexture, "restart", "Red", () => {
            GameState.state = GameState.RESTARTING;
            advancedTexture.dispose()
            soundLoader.resetAllSound();
        });
    }

    async winMenu() {
        let advancedTexture = BABYLON.GUI.AdvancedDynamicTexture.CreateFullscreenUI("mainMenuUI", true, this);

        let loadedGUI = await advancedTexture.parseFromURLAsync("./assets/ui/json/winMenuUI.json")

        document.exitPointerLock();

        addUIControlMenuButton(advancedTexture, "mainMenu", "Red", () => {
            this.mainMenu();
            soundLoader.resetAllSound();
            advancedTexture.dispose();
        });

        addUIControlMenuButton(advancedTexture, "options", "Red", async () => {
            await this.optionsMenu();
            advancedTexture.dispose();
        });

        addUIControlMenuButton(advancedTexture, "restart", "Red", () => {
            GameState.state = GameState.RESTARTING;
            soundLoader.resetAllSound();
            advancedTexture.dispose();
        });
        addUIControlMenuButton(advancedTexture, "next", "Red",  async () => {
            if (progress.levelsCompleted.length < 4) {
                soundLoader.resetAllSound();
                advancedTexture.dispose();
                progress.nextLevel();
                GameState.state = GameState.STARTING;
                this.clearColor = new BABYLON.Color4(0, 0, 0);
                this.render();
            } else {
                alert("Niveau pas encore implémenté");
                await this.levelMenu();
                advancedTexture.dispose();
            }

        });
    }
}
