import AbstractSpell from "./AbstractSpell.js";
import {GameOptions} from "../utils.js";
import SpellHolster from "./SpellHolster.js";
import {soundLoader} from "../sound.js";

export default class DoubleJump extends AbstractSpell {

    constructor(scene) {
        super(scene, SpellHolster.DOUBLE_JUMP);
        this.timer = GameOptions.doubleJumpTimer;
    }

    doEffect() {
        super.doEffect();
        let vec = this._scene.hero.bounder.physicsImpostor.getLinearVelocity();
        vec.y = GameOptions.heroSpeedJump;
        this._scene.hero.updateParticles(
            new BABYLON.Color4(1, 0, 0, 0),
            new BABYLON.Color4(1, 0, 0, 0),
            new BABYLON.Color4(0, 0, 0, 1)
        );
        soundLoader.playSound(soundLoader.doubleJumpEffect)
        this._scene.hero.bounder.physicsImpostor.setLinearVelocity(vec);
    }
}