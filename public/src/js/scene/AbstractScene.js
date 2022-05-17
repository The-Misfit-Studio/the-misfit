import {addUIControlMenuButton, GameLevel, GameOptions, GameState} from "../utils.js";
import Hero from "../hero.js";
import {soundLoader} from "../sound.js";
import Tuto from "./tuto.js";

export default class AbstractScene extends BABYLON.Scene {

    constructor(modelPath, engine, canvas) {
        super(engine);

        this.engine = engine;
        this.canvas = canvas;
        this.modelPath = modelPath;
        this.camera = this.createCamera();
        this.assetsManager = new BABYLON.AssetsManager(this);
        this.zone = null;
        this.score = 0;
        this.sphereList = [];
        this.gui = null;
        this.hero = null;
        this.center = null;
        this.endScenePosition = undefined;
        this.meshToProcess = [];
        this.shadowGenerator = undefined;
        this.currentMusic = undefined;
        this.currentStartMusic = undefined;
        this.items = [];
        this.coinPos = [];

        this.enablePhysics(
            new BABYLON.Vector3(0, GameOptions.gravity, 0)
        );

        this.createBackground();
    }

    createLights() {
        this.currentLevel = GameLevel.getLevelByName(this.modelPath);
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

    createLoadingZone() {
        let zone = new BABYLON.MeshBuilder.CreateBox("loadingZone", GameOptions.loadingZone, this);

        zone.material = new BABYLON.StandardMaterial("zoneMaterial", this);
        zone.visibility = 0;

        zone.actionManager = new BABYLON.ActionManager(this);
        return zone;
    }

    loadScene() {
        if (this.modelPath !== null) {
            this.loadAssets();
            this.assetsManager.onFinish = () => {
                this.hero = new Hero(this);
                if (this.currentLevel.isTuto) {
                    this.tuto = new Tuto(this);
                }
                this.setupMeshes();
                this.executeWhenReady(() => {
                    GameState.state = GameState.WAIT_START;
                });
            }
            this.assetsManager.load();
            GameState.state = GameState.LOADING;
        }
    }

    setupMeshes() {
        for (let i = 0; i < this.meshToProcess.length; i++) {
            let mesh = this.meshToProcess[i];
            if (mesh.name.includes("Tuto")) {
                this.tuto.processTuto(mesh)
                continue;
            }
            if (mesh.name.includes("Instance")) {
                continue;
            }
            if (mesh.name === "TriggerEnd") {
                this.endScenePosition = mesh.position;
            }
            if (mesh.name.includes("SpikeTileTile")) {
                let testMaterial = new BABYLON.StandardMaterial("testMaterial", this);
                testMaterial.diffuseColor = new BABYLON.Color3(0.7, 0.7, 0.7);
                testMaterial.specularColor = new BABYLON.Color3(1, 1, 1);
                mesh.material = testMaterial;
            }
            if (mesh.name.includes("SpikeTileSpike")) {
                let testMaterial = new BABYLON.StandardMaterial("testMaterial", this);
                testMaterial.diffuseColor = new BABYLON.Color3(0, 0, 0);
                testMaterial.specularColor = new BABYLON.Color3(1, 1, 1);
                mesh.material = testMaterial;
            }
            if (mesh.name.includes("SpinningBlade")) {
                let testMaterial = new BABYLON.StandardMaterial("testMaterial", this);

                testMaterial.diffuseTexture = new BABYLON.Texture("./models/scene/SpinningBlade.jpg", this);
                mesh.material = testMaterial;
            }
            if (mesh.name.includes("GroundTileHell")) {
                let testMaterial = new BABYLON.StandardMaterial("testMaterial", this);

                testMaterial.diffuseTexture = new BABYLON.Texture("./models/scene/GroundTileHell.jpg", this);
                mesh.material = testMaterial;
            }
            if (mesh.name.includes("GroundTileHeaven1")) {
                let testMaterial = new BABYLON.StandardMaterial("testMaterial", this);

                testMaterial.diffuseTexture = new BABYLON.Texture("./models/scene/GroundTileHeaven1.jpg", this);
                mesh.material = testMaterial;
            }
            if (mesh.name.includes("GroundTileHeaven2")) {
                let testMaterial = new BABYLON.StandardMaterial("testMaterial", this);

                testMaterial.diffuseTexture = new BABYLON.Texture("./models/scene/GroundTileHeaven2.jpg", this);
                mesh.material = testMaterial;
            }

            this.addMeshToScene(mesh);
        }
    }

    loadAssets() {
        console.log("Loading assets...")
    }

    /**
     *
     * @param mesh
     */
    addMeshToScene(mesh) {
        if (!mesh.name.includes("Wall")) {
            mesh.visibility = 0;
        }
        if (mesh.name.includes("TriggerEnd")) {
            this.setWinTrigger(mesh);
        } else if (mesh.name.includes("TriggerHole")) {
            this.setTrapGameOver(mesh);
        } else if (mesh.name.includes("SpawnHero")) {
            // nothing for now
        } else if (mesh.name.includes("WallTile")) {
            let dist = 6;
            var testMaterial = new BABYLON.StandardMaterial("testMaterial", this);

            testMaterial.diffuseTexture = new BABYLON.Texture("./models/scene/WallTileHell.jpg", this);
            mesh.material = testMaterial;
            mesh.visibility = 1;

            for (let i = 0; i < 150; i++) {
                let newWall = mesh.createInstance("WallInstance" + i);
                newWall.position.z += dist;
                dist += 6;
            }
        } else {
            this.zone.actionManager.registerAction(
                new BABYLON.ExecuteCodeAction(
                    {
                        trigger: BABYLON.ActionManager.OnIntersectionEnterTrigger,
                        parameter: {
                            mesh: mesh,
                        }
                    },
                    this.getCallBack(mesh)
                )
            );
        }

        this.zone.actionManager.registerAction(
            new BABYLON.ExecuteCodeAction(
                {
                    trigger: BABYLON.ActionManager.OnIntersectionExitTrigger,
                    parameter: {
                        mesh: mesh,
                    }
                },
                () => {
                    if (!mesh.name.includes("Wall") && !mesh.name.includes("Pillar")) {
                        mesh.visibility = 0;
                        this.stopAnimation(mesh);
                    }
                    if (mesh.name.includes("Ground")) {
                        mesh.physicsImpostor.dispose();
                    }
                }
            )
        );
    }

    getCallBack(mesh) {
        if (mesh.name.includes("TriggerSpikes")
            || mesh.name.includes("SpinningBladeTrigger")
            || mesh.name.includes("SpinningWoodTrigger")
            || mesh.name.includes("TriggerFlower")) {
            return () => {
                this.hero.heroMesh.actionManager.registerAction(
                    new BABYLON.ExecuteCodeAction(
                        {
                            trigger: BABYLON.ActionManager.OnIntersectionEnterTrigger,
                            parameter: {
                                mesh: mesh,
                            }
                        },
                        () => {
                            mesh.visibility = 0;

                            if (!this.hero.immune) {
                                this.hero.takeDamage(1);
                            }
                        }
                    )
                );
            };
        } else if (mesh.name.includes("Spinning")) {
            return () => {
                if (mesh.material !== null) {
                    mesh.material.unfreeze();
                }

                mesh.unfreezeWorldMatrix();
                mesh.visibility = 1;
                setTimeout(() => {
                    this.beginAnimation(mesh, 0, 40, true);
                },500);
            };
        } else if (mesh.name.includes("Ground")) {
            return () => {
                mesh.unfreezeWorldMatrix();
                mesh.visibility = 1;
                mesh.physicsImpostor = new BABYLON.PhysicsImpostor(
                    mesh,
                    BABYLON.PhysicsImpostor.BoxImpostor,
                    GameOptions.groundWallImpostor,
                    this
                );

            }
        } else return () => {
            if (mesh.material !== null) {
                mesh.material.unfreeze();
            }
            mesh.unfreezeWorldMatrix();
            if (!mesh.name.includes("Wall")) {
                mesh.visibility = 1;
            }
        };
    }

    setWinTrigger(mesh) {
        mesh.actionManager = new BABYLON.ActionManager(this);
        mesh.actionManager.registerAction(
            new BABYLON.ExecuteCodeAction(
                {
                    trigger: BABYLON.ActionManager.OnIntersectionEnterTrigger,
                    parameter: {
                        mesh: this.hero.heroMesh
                    }
                },
                () => {
                    this.win();
                }
            )
        );
    }

    setTrapGameOver(trigger) {
        if (trigger != null) {
            trigger.actionManager = new BABYLON.ActionManager(this);
            trigger.actionManager.registerAction(
                new BABYLON.ExecuteCodeAction(
                    {
                        trigger: BABYLON.ActionManager.OnIntersectionEnterTrigger,
                        parameter: {
                            mesh: this.hero.bounder,
                            usePreciseIntersection: true
                        }
                    },
                    () => {
                        this.gameOver()
                    }
                )
            );
        }
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

    computeScene() {
        console.log("Compute Scene is not defined.");
    }
}