import AbstractSpell from "./AbstractSpell.js";
import SpellHolster from "./SpellHolster.js";
import {GameOptions} from "../utils.js";
import {soundLoader} from "../sound.js";

export default class Shield extends AbstractSpell {

    constructor(scene) {
        super(scene, SpellHolster.SHIELD);
        this.isActive = false;
        this.timer = GameOptions.shieldTimer;
        this.shield = undefined;
        this.activeTimeout = undefined;
    }

    doEffect() {
        super.doEffect();
        let hero = this._scene.hero;
        soundLoader.playSound(soundLoader.shieldActivationEffect);

        this.shield = BABYLON.MeshBuilder.CreateSphere(
            "shield",
            {
                segment: 20,
                diameter: 4
            },
            this._scene
        );
        let material = new BABYLON.StandardMaterial("vibe", this._scene);
        material.diffuseColor = new BABYLON.Color3.Yellow();
        material.alpha = 0.2;
        this.shield.material = material;
        this.shield.position = hero.heroMesh.position.clone();
        hero.heroMesh.addChild(this.shield);
        hero.updateParticles(
            new BABYLON.Color4(1, 0, 0, 0),
            new BABYLON.Color4(1, 0, 0, 0),
            new BABYLON.Color4(1, 1, 1, 0)
        );
        this.isActive = true;
        this.activeTimeout = setTimeout(() => {
            this.isActive = false;
            this.shield.dispose();
        }, GameOptions.shieldTime);
    }

    fadeOut() {
        let hero = this._scene.hero;
        hero.immune = true;

        let intervalFadeout = setInterval(() => {
            if (this.shield.visibility === 0) {
                this.shield.visibility = 1;
            } else {
                this.shield.visibility = 0;
            }
        }, 100);
        setTimeout(() => {
            hero.immune = false;
            clearInterval(intervalFadeout);
            clearInterval(this.activeTimeout);
            this.shield.visibility = 0;
            this.isActive = false;
            this.shield.dispose();

        }, GameOptions.heroImmuneTime);
    }
}