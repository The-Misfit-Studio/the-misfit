import {addUIControlMenuButton, GameState, progress} from "../utils.js";
import {soundLoader} from "../sound.js";

export default class CutScene extends BABYLON.Scene {

    static ASSETS_FILE_NAME = "cutScene.babylon";
    static ASSETS_FILE_PATH = "./models/cutScene/";

    constructor(engine, canvas) {
        super(engine);
        this.assetsManager = new BABYLON.AssetsManager(this);

        this.isSetup = false;
        this.isGodSpeaking = true;
        this.texts = undefined;
        this.textBlock = undefined;
        this.camera = undefined;
        this.godSpot = undefined;
        this.satanSpot = undefined;
        this.advancedTexture = undefined;
        this.currentTextIndex = -1;
        this.newTextIndex = 0;
        this.setupScene();
        this.load();
        this.loadGUI().then(r => {
        });

    }

    load() {
        GameState.state = GameState.LOADING;
        fetch(`${CutScene.ASSETS_FILE_PATH}texts.json`)
            .then(response => response.json())
            .then((json) => {
                for (let entry of json) {
                    console.log(entry.level)
                    if (entry.level === progress.currentSelectedLevel) {
                        this.texts = entry.text;
                        break;
                    }
                }
                this.loadCutScene();
            });
    }

    setupScene() {
        this.camera = new BABYLON.FreeCamera("camera", new BABYLON.Vector3(0, -3, -20));
        this.camera.setTarget(new BABYLON.Vector3(0, -3, 0));

        this.satanSpot = new BABYLON.SpotLight("satanSpot", new BABYLON.Vector3(-3.5, -6, -5), new BABYLON.Vector3(0, 1, 1), Math.PI / 4, 1, this);

        this.godSpot = new BABYLON.SpotLight("godSpot", new BABYLON.Vector3(3.5, 6, -5), new BABYLON.Vector3(0, -1, 1), Math.PI / 4, 1, this);
        this.godSpot.intensity = 0.5;
        this.satanSpot.intensity = 0.5;

        this.clearColor = new BABYLON.Color4(0, 0, 0);
    }

    async loadGUI() {
        let advancedTexture = BABYLON.GUI.AdvancedDynamicTexture.CreateFullscreenUI(
            "mainMenuUI",
            true,
            this
        );

        await advancedTexture.parseFromURLAsync("./assets/ui/json/cutSceneUI.json");

        let im = advancedTexture.getControlByName("textBackground");
        im.source = "./assets/ui/textBackground.png";

        addUIControlMenuButton(advancedTexture, "pass", "Grey", () => {
            console.log(this.newTextIndex);
            this.newTextIndex++;
            console.log(this.newTextIndex);
        });

        addUIControlMenuButton(advancedTexture, "skip", "Grey", () => {
            GameState.state = GameState.STARTING;
            advancedTexture.dispose();
        });

        this.textBlock = advancedTexture.getControlByName("Textblock");

        this.advancedTexture = advancedTexture;
    }

    loadCutScene() {
        let meshTask = this.assetsManager.addMeshTask(
            "loadingScene", "", CutScene.ASSETS_FILE_PATH, CutScene.ASSETS_FILE_NAME
        );
        meshTask.onSuccess = (task => {
            task.loadedMeshes.forEach(mesh => {
                this.setTextures(mesh);
            });
            this.executeWhenReady(() => {
                GameState.state = GameState.IN_CUTSCENE;
            })
        });
        this.assetsManager.load();
    }

    setTextures(mesh) {
        console.log(mesh.name);
        let material = new BABYLON.StandardMaterial("testMaterial", this.scene);
        switch (mesh.name) {
            case "GodBeard":
                material.diffuseColor = new BABYLON.Color3(0.3, 0.3, 0.3);
                material.specularColor = new BABYLON.Color3(0, 0, 0);
                mesh.material = material;
                break;
            case "GodBody":
                material.diffuseTexture = new BABYLON.Texture("./models/cutScene/GodBody.jpg", this.scene);
                material.specularColor = new BABYLON.Color3(0, 0, 0);
                mesh.material = material;
                break;
            case "GodStaff":
                material.diffuseColor = new BABYLON.Color3(0.193, 0.104, 0.022);
                material.specularColor = new BABYLON.Color3(1, 1, 1);
                mesh.material = material;
                break;
            case "GodHalo":
                material.diffuseColor = new BABYLON.Color3(0.402, 0.8, 0.672);
                material.specularColor = new BABYLON.Color3(1, 1, 1);
                mesh.material = material;
                break;
            case "GodEyes":
                material.diffuseColor = new BABYLON.Color3(1, 1, 1);
                mesh.material = material;
                break;
            case "SatanBody":
                material.diffuseTexture = new BABYLON.Texture("./models/cutScene/SatanBody.jpg", this.scene);
                material.specularColor = new BABYLON.Color3(0, 0, 0);
                mesh.material = material;
                break;
            case "SatanBeard":
                material.diffuseTexture = new BABYLON.Texture("./models/cutScene/SatanBeard.jpg", this.scene);
                mesh.material = material;
                break;
            case "SatanHorn":
                material.diffuseTexture = new BABYLON.Texture("./models/cutScene/SatanHorn.jpg", this.scene);
                mesh.material = material;
                break;
            case "SatanEyes":
                material.diffuseColor = new BABYLON.Color3(1, 0, 0);
                material.specularColor = new BABYLON.Color3(1, 1, 1);
                mesh.material = material;
                break;
            case "SatanStaff":
                material.diffuseTexture = new BABYLON.Texture("./models/cutScene/SatanStaff.jpg", this.scene);
                mesh.material = material;
                break;
            case "SatanStaffRuby":
                material.diffuseColor = new BABYLON.Color3(1, 0, 0);
                material.specularColor = new BABYLON.Color3(1, 1, 1);
                mesh.material = material;
                break;
        }
    }

    computeScene() {
        if (this.currentTextIndex !== this.newTextIndex) {
            if (this.newTextIndex < this.texts.length) {
                this.currentTextIndex = this.newTextIndex;
                let t = this.texts[this.currentTextIndex];
                this.textBlock.text = t.text;
                if (t.isGodSpeaking) {
                    soundLoader.satan.pause();
                    soundLoader.playSound(soundLoader.angel);
                    this.godSpot.intensity = 2;
                    this.satanSpot.intensity = 0.5;
                } else {
                    soundLoader.angel.pause();
                    soundLoader.playSound(soundLoader.satan);
                    this.godSpot.intensity = 0.5;
                    this.satanSpot.intensity = 2;
                }
            } else {
                soundLoader.resetAllSound();
                this.advancedTexture.dispose();
                GameState.state = GameState.STARTING;
            }
        }
    }

}