import {GameLevel, GameOptions} from "../utils.js";
import {soundLoader} from "../sound.js";

export default class AbstractItem {

    constructor(entry, scene, gameLevelType) {
        this.entry = entry;
        this.scene = scene;
        this.gameLevelType = gameLevelType;
        this.coin = undefined;
        this.setupItem();
    }

    setupItem() {
        let coinMesh;
        if (this.gameLevelType === GameLevel.HELL) {
            coinMesh = this.scene.getMeshByName("CoinHeaven")
        }
        else {
            coinMesh = this.scene.getMeshByName("CoinHell")
        }
        this.coin = coinMesh.createInstance("CoinInstance");
        this.coin.position = this.entry.position;
        this.coin.rotation = this.entry.rotation;
        this.scene.beginAnimation(this.coin, 0, 40, true);

        this.coin.actionManager = new BABYLON.ActionManager(this.scene);
        this.coin.actionManager.registerAction(
            new BABYLON.ExecuteCodeAction(
                {
                    trigger: BABYLON.ActionManager.OnIntersectionEnterTrigger,
                    parameter: {
                        mesh: this.scene.hero.heroMesh
                    }
                },
                () => {
                    this.effect();
                    this.coin.dispose();
                }
            )
        );
    }

    effect() {
        soundLoader.playSound(soundLoader.itemPickUpEffect);
    }
}