import {GameLevel, GameOptions} from "../utils.js";
import {soundLoader} from "../sound.js";

export default class AbstractItem {
    /**
     *
     * @param{number} position
     * @param{BABYLON.Scene} scene
     * @param gameLevelType
     */
    constructor(position, scene, gameLevelType) {
        this.oldPos = position;
        this.scene = scene;
        this.gameLevelType = gameLevelType;
        this.mesh = undefined;
        this.setupItem();
    }

    setupItem() {
        let coinMaterial = new BABYLON.StandardMaterial("CoinMaterial", this.scene);
        let coinMesh;
        if (this.gameLevelType === GameLevel.HELL) {
            coinMesh = this.scene.getMeshByName("CoinHeaven").clone();
            coinMaterial.diffuseColor = new BABYLON.Color3(0.2, 1, 1);

        }
        else {
            coinMesh = this.scene.getMeshByName("CoinHell").clone();
            coinMaterial.diffuseColor = new BABYLON.Color3(1, 0.1, 0.4);

        }
        this.mesh = coinMesh;
        this.mesh.material = coinMaterial;
        this.mesh.position = this.oldPos;
        this.mesh.visibility = 1;
        this.mesh.actionManager = new BABYLON.ActionManager(this.scene);
        this.mesh.actionManager.registerAction(
            new BABYLON.ExecuteCodeAction(
                {
                    trigger: BABYLON.ActionManager.OnIntersectionEnterTrigger,
                    parameter: {
                        mesh: this.scene.hero.heroMesh
                    }
                },
                () => {
                    this.effect();
                    this.mesh.dispose();
                }
            )
        );

    }

    effect() {
        soundLoader.playSound(soundLoader.itemPickUpEffect);
    }
}