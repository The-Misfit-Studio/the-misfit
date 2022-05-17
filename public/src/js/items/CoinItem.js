import AbstractItem from "./AbstractItem.js";

export default class CoinItem extends AbstractItem {

    constructor(entry, scene, gameLevelType) {
        super(entry, scene, gameLevelType);
    }

    effect() {
        super.effect();
        this.scene.hero.addCoins();
    }
}