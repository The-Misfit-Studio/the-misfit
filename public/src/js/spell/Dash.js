import AbstractSpell from "./AbstractSpell.js";
import {GameOptions} from "../utils.js";
import SpellHolster from "./SpellHolster.js";
import {soundLoader} from "../sound.js";

export default class Dash extends AbstractSpell {

    constructor(scene) {
        super(scene, SpellHolster.DASH);
        this.timer = GameOptions.dashTimer;
    }

    doEffect() {
        super.doEffect();
        soundLoader.playSound(soundLoader.dashEffect);
        let hero = this._scene.hero;
        hero.speed = GameOptions.heroSpeed + GameOptions.dashImpulse;


        this._scene.activeCamera.fov = 0.82;

        let zeroGravity = setInterval(() => {
            let vec = this._scene.hero.bounder.physicsImpostor.getLinearVelocity();
            vec.y = 0;
            this._scene.hero.bounder.physicsImpostor.setLinearVelocity(vec);
            hero.updateParticles(
                new BABYLON.Color4(0, 0, 1, 0),
                new BABYLON.Color4(0, 0, .5, 0),
                new BABYLON.Color4(1, 1, 1, 0)
            );
        }, 10);

        setTimeout(() => {
            hero.speed = GameOptions.heroSpeed;
            this._scene.activeCamera.fov = 0.8;
            clearInterval(zeroGravity);
        }, GameOptions.dashTime);
    }
}