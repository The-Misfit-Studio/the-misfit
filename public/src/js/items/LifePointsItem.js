import {GameOptions} from "../utils.js";
import AbstractItem from "./AbstractItem.js";

export default class LifePointsItem extends AbstractItem {
    /**
     *
     * @param{BABYLON.Scene} scene
     */
    constructor(scene) {
        super("SpawnHero",
            scene
        );
    }

    effect() {
        super.effect();
        if (GameOptions.heroMaxLife < this.scene.hero.life) {
            this.scene.hero.life += 1;
        }
    }
}