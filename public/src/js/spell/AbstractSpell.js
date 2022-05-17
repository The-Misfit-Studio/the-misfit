import {GameOptions} from "../utils.js";
import SpellHolster from "./SpellHolster.js";

export default class AbstractSpell {

    constructor(scene, type) {
        this._scene = scene;
        this.hero = scene.hero;
        this._mana = 0;
        this._locked = false;
        this.timer = undefined;
        this.type = type;
        this._slot = undefined;
        if (type === SpellHolster.DASH || type === SpellHolster.DOUBLE_JUMP) {
            this.spellNb = 1;
        } else this.spellNb = 2;
    }

    get slot() {
        return this._slot;
    }

    set slot(slot) {
        this._slot=slot;
    }

    isLocked() {
        return this._locked || this.slot <= 0;
    }

    unlockSpell() {
        this._locked = false;
    }

    lockSpell() {
        this._locked = true;
    }

    useSpell() {
        if (this._mana > 0) {
            this._mana--;
            this.doEffect();
        }
    }

    getSpellTimer() {
        switch (this.type) {
            case SpellHolster.DASH:
                return GameOptions.dashTimer;
            case SpellHolster.DOUBLE_JUMP:
                return GameOptions.doubleJumpTimer;
            case SpellHolster.LIGHTER:
                return GameOptions.lightTimer;
            default:
                return GameOptions.shieldTimer;

        }
    }

    setUiSlotUpdate() {
        let spell;
        let spellFilled;
        let spellEmpty;
        let spellTimerText;
        let spellTimer = this.getSpellTimer(this.type);
        if (this.spellNb === 1) {
            spell = this._scene.spells.spell1;
            spellFilled = this._scene.spells.spell1Filled;
            spellEmpty = this._scene.spells.spell1Empty;
            spellTimerText = this._scene.spells.timerSpell1;
        }
        else {
            spell = this._scene.spells.spell2;
            spellFilled = this._scene.spells.spell2Filled;
            spellEmpty = this._scene.spells.spell2Empty;
            spellTimerText = this._scene.spells.timerSpell2;

        }

        for (let i = 0; i < spellFilled.length; i++) {
            if (this.slot >= i+1) {
                spellFilled[i].isVisible = true;
                spellEmpty[i].isVisible = false;
            }
            else {
                spellFilled[i].isVisible = false;
                spellEmpty[i].isVisible = true;
            }
        }
        let timeIt = spellTimer / 1000;

        spellTimerText.color = "#ffffff"
        spell.alpha = .3;
        spellTimerText.text = timeIt;
        let interval = setInterval(() => {
            timeIt--;
            spellTimerText.text = timeIt;
        }, 1000);

        setTimeout(() => {
            clearInterval(interval);
            spellTimerText.text = "";
            spell.alpha = 1;
        }, spellTimer);
    }

    doEffect() {
        this.lockSpell();
        this.slot = this.slot-1;
        this.setUiSlotUpdate()
        setTimeout(() => {
            this.unlockSpell();
        }, this.timer);
    }
}