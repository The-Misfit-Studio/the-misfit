import AbstractScene from "../scene/AbstractScene.js";
import {createRect, GameOptions, GameState} from "../utils.js";

export default class GameWinScene extends AbstractScene {

    constructor(engine, canvas) {
        super(engine, canvas);
        this.gui = this.createGUI();
    }

    async createGUI() {
        let advancedTexture = BABYLON.GUI.AdvancedDynamicTexture.CreateFullscreenUI(
            "mainMenuUI",
            true,
            this
        );


        let nextLevelButton = BABYLON.GUI.Button.CreateSimpleButton("but", "Next Level");
        let mainMenuButton = BABYLON.GUI.Button.CreateSimpleButton("but", "Main Menu");
        // let restartButton = BABYLON.GUI.Button.CreateSimpleButton("but", "Restart");


        nextLevelButton.onPointerClickObservable.add(() => {
            GameState.state = GameState.STARTING;
            this.dispose();
        });
        mainMenuButton.onPointerClickObservable.add(() => {
            GameState.state = GameState.START_MENU;
            this.dispose();
        });

        createRect(advancedTexture, 0, 0, 4000, 1);
        advancedTexture.addControl(mainMenuButton);
    }
}