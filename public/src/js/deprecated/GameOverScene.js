import {createEllipse, GameOptions, GameState} from "../utils.js";
import AbstractScene from "../scene/AbstractScene.js";

export default class GameOverScene extends AbstractScene {

    constructor(modelPath, engine, canvas) {
        super(modelPath, engine, canvas);
        this.gui = this.createGUI();
    }

    async createGUI() {
        let advancedTexture = BABYLON.GUI.AdvancedDynamicTexture.CreateFullscreenUI(
            "mainMenuUI",
            true,
            this
        );

        let loadedGUI = await advancedTexture.parseFromURLAsync("./assets/ui/json/gameOverMenu.json")
        this.restartButton = advancedTexture.getControlByName("restartButton");
        this.mainMenuButton = advancedTexture.getControlByName("mainMenuButton");
        this.textGameOver = advancedTexture.getControlByName("Textblock");

        this.restartButton.onPointerDownObservable.add(() => {
            GameState.state = GameState.RESTARTING;
            this.dispose();
        });

        this.mainMenuButton.onPointerClickObservable.add(() => {
            GameState.state = GameState.START_MENU;
            this.dispose();
        });

        return advancedTexture;
    }
}