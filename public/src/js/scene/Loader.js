import {GameLevel, GameOptions, GameState, progress} from "../utils.js";
import Hero from "../hero.js";
import CoinItem from "../items/CoinItem.js";
import TextureLoader from "./TextureLoader.js";
import TutoLoader from "./TutoLoader.js";

export default class Loader {

    static ASSETS_FILE_NAME = "assets.babylon";
    static ASSETS_FILE_PATH = "./models/scene/";

    constructor(scene, engine) {
        this.scene = scene;
        this.engine = engine;
        this.textureLoader = new TextureLoader(scene);
        this.tutoLoader = new TutoLoader(scene);
        this.instances = [];
        this.items = [];
        this.jsonFile = progress.currentSelectedPath;
        this.jsonData = undefined;
    }

    load() {
        GameState.state = GameState.LOADING;
        fetch(`${Loader.ASSETS_FILE_PATH}${this.jsonFile}`)
            .then(response => response.json())
            .then((json) => {
                this.jsonData = json;
                this.loadScene();
            });
    }

    loadScene() {
        let meshTask = this.scene.assetsManager.addMeshTask(
            "loadingScene", "", Loader.ASSETS_FILE_PATH, Loader.ASSETS_FILE_NAME
        );
        meshTask.onSuccess = (task) => {
            task.loadedMeshes.forEach(mesh => {
                if (mesh.animations.length > 0) {
                    mesh.animations = mesh.animations.filter(anim => anim.targetProperty === 'rotation');
                }

                this.textureLoader.setTexture(mesh);
            });
            this.scene.hero = new Hero(this.scene);
            this.setupLevel();
            this.scene.executeWhenReady(() => {
                GameState.state = GameState.WAIT_START;
            })
        }
        this.scene.assetsManager.load();
    }

    setupLevel() {
        for (let entry of this.jsonData) {

            let mesh = this.scene.getMeshByName(entry.name);
            this.setupProperties(entry, mesh);
        }
        if (this.scene.currentLevel.type === GameLevel.HELL) {
            let skybox = BABYLON.MeshBuilder.CreateBox("skyBox", {size:2000.0}, this.scene);
            let skyboxMaterial = new BABYLON.StandardMaterial("skyBox", this.scene);
            skyboxMaterial.backFaceCulling = false;
            skyboxMaterial.reflectionTexture = new BABYLON.CubeTexture("./assets/textures/skybox/skybox", this.scene);
            skyboxMaterial.reflectionTexture.coordinatesMode = BABYLON.Texture.SKYBOX_MODE;
            skyboxMaterial.diffuseColor = new BABYLON.Color3(0, 0, 0);
            skyboxMaterial.specularColor = new BABYLON.Color3(0, 0, 0);
            skybox.material = skyboxMaterial;
        }
        else {
            let skybox = BABYLON.MeshBuilder.CreateBox("skyBox", {size:2000.0}, this.scene);
            let skyboxMaterial = new BABYLON.StandardMaterial("skyBox", this.scene);
            skyboxMaterial.backFaceCulling = false;
            skyboxMaterial.reflectionTexture = new BABYLON.CubeTexture("./assets/textures/skybox/skybox", this.scene);
            skyboxMaterial.reflectionTexture.coordinatesMode = BABYLON.Texture.SKYBOX_MODE;
            skyboxMaterial.diffuseColor = new BABYLON.Color3(0, 0, 0);
            skyboxMaterial.specularColor = new BABYLON.Color3(0, 0, 0);
            skybox.material = skyboxMaterial;
        }

    }

    setupProperties(entry, mesh) {
        if (entry.name === "EndTrigger") {
            this.setupEndTrigger(entry, mesh);
        } else if (entry.name === "HoleTrigger") {
            this.setupHoleTrigger(entry, mesh);
        } else if (entry.name === "SpawnCoin") {
            this.items.push(new CoinItem(entry, this.scene, this.scene.currentLevel.type));
        } else if (entry.name === "SpawnHero") {
            mesh.visibility = 0;
        } else if (entry.name.includes("Trigger")) {
            this.setupTrapProperties(entry, mesh);
        } else if (entry.name.includes("Spinning")) {
            let instance = this.setupInstance(entry, mesh);
            this.scene.beginAnimation(instance, 0, 40, true);
        } else if (entry.name.includes("Ground")) {
            this.setupGround(entry, mesh);
        } else if (entry.name.includes("Tuto")) {
            this.tutoLoader.processTuto(entry);
        }
        else {
            this.setupInstance(entry, mesh);
        }
    }

    setupRestart() {
        for (let i = 0; i < this.items.length; i++) {
            this.items[i].coin.dispose();
        }
        this.items = [];
        for (let entry of this.jsonData) {
            if (entry.name === "SpawnCoin") {
                this.items.push(new CoinItem(entry, this.scene, this.scene.currentLevel.type));
            } if (entry.name === "EndTrigger") {
                let mesh = this.scene.getMeshByName(entry.name);
                this.setupEndTrigger(entry, mesh);
            } else if (entry.name === "HoleTrigger") {
                let mesh = this.scene.getMeshByName(entry.name);
                this.setupHoleTrigger(entry, mesh);
            } else if (entry.name === "SpawnCoin") {
                this.items.push(new CoinItem(entry, this.scene, this.scene.currentLevel.type));
            } else if (entry.name.includes("Trigger")) {
                let mesh = this.scene.getMeshByName(entry.name);
                this.setupTrapProperties(entry, mesh);
            }
        }
    }

    setupInstance(entry, mesh) {
        let instance = mesh.createInstance(entry.name + "Instance");

        instance.position = new BABYLON.Vector3(entry.position._x, entry.position._y, entry.position._z);
        instance.rotation = new BABYLON.Vector3(entry.rotation._x, entry.rotation._y, entry.rotation._z);
        this.instances.push(instance);

        return instance;
    }

    setupGround(entry, mesh) {
        let instance = this.setupInstance(entry, mesh);
        // console.log(entry.name, entry.position._x, entry.position._z);
        instance.physicsImpostor = new BABYLON.PhysicsImpostor(
            instance,
            BABYLON.PhysicsImpostor.BoxImpostor,
            GameOptions.groundWallImpostor,
            this.scene
        )
        instance.position = new BABYLON.Vector3(entry.position._x, entry.position._y, entry.position._z);
        instance.rotation = new BABYLON.Vector3(entry.rotation._x, entry.rotation._y, entry.rotation._z);
        this.instances.push(instance);
    }

    setupEndTrigger(entry, mesh) {
        let instance = this.setupInstance(entry, mesh);
        this.scene.endScenePosition = entry.position;
        instance.actionManager = new BABYLON.ActionManager(this.scene);
        instance.actionManager.registerAction(
            new BABYLON.ExecuteCodeAction(
                {
                    trigger: BABYLON.ActionManager.OnIntersectionEnterTrigger,
                    parameter: {
                        mesh: this.scene.hero.heroMesh
                    }
                },
                () => {
                    this.scene.win();
                }
            )
        );
    }

    setupHoleTrigger(entry, mesh) {
        mesh.actionManager = new BABYLON.ActionManager(this.scene);
        mesh.actionManager.registerAction(
            new BABYLON.ExecuteCodeAction(
                {
                    trigger: BABYLON.ActionManager.OnIntersectionEnterTrigger,
                    parameter: {
                        mesh: this.scene.hero.bounder,
                        usePreciseIntersection: true
                    }
                },
                () => {
                    this.scene.gameOver()
                }
            )
        );
    }

    setupTrapProperties(entry, mesh) {
        let instance = this.setupInstance(entry, mesh);
        this.scene.hero.heroMesh.actionManager.registerAction(
            new BABYLON.ExecuteCodeAction(
                {
                    trigger: BABYLON.ActionManager.OnIntersectionEnterTrigger,
                    parameter: {
                        mesh: instance,
                    }
                },
                () => {
                    if (!this.scene.hero.immune) {
                        this.scene.hero.takeDamage(1);
                    }
                }
            )
        );
    }
}