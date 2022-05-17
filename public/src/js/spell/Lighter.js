import AbstractSpell from "./AbstractSpell.js";
import SpellHolster from "./SpellHolster.js";
import {GameOptions} from "../utils.js";
import {soundLoader} from "../sound.js";

export default class Lighter extends AbstractSpell {

    constructor(scene) {
        super(scene, SpellHolster.LIGHTER);
        this.timer = GameOptions.lightTimer;
    }

    doEffect() {
        super.doEffect();
        soundLoader.playSound(soundLoader.lightsOnEffect);
        let interval = setInterval(() => {
            this._scene.secondLight.intensity = Math.min(GameOptions.baseLightHell, this._scene.secondLight.intensity+0.01);
        }, 10)

        let timeOut = setTimeout(() => {
            clearInterval(interval);
            this.fadeOut();
        }, GameOptions.lightTime);
    }

    fadeOut() {
        let interval = setInterval(() => {
            this._scene.secondLight.intensity = Math.max(0.1, this._scene.secondLight.intensity-0.01);
        }, 10)

        let timeOut = setTimeout(() => {
            clearInterval(interval);
        }, GameOptions.lightTime);
    }
}