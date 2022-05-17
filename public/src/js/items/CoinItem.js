import AbstractItem from "./AbstractItem.js";

export default class CoinItem extends AbstractItem {

    /**
     *
     * @param meshName
     * @param scene
     * @param gameLevelType
     */
    constructor(meshName, scene, gameLevelType) {
        super(meshName, scene, gameLevelType);
    }

    effect() {
        super.effect();
        this.scene.hero.addCoins();
    }
}