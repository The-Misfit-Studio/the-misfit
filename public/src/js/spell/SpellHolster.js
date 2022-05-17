import DoubleJump from "./DoubleJump.js";
import Dash from "./Dash.js";
import Shield from "./Shield.js";
import Lighter from "./Lighter.js";
import {GameLevel} from "../utils.js";

export default class SpellHolster {

    static DOUBLE_JUMP = 1;
    static DASH = 2;
    static SHIELD = 3;
    static LIGHTER = 4;

    constructor(scene) {
        let type = scene.currentLevel.type;
        this.scene = scene;
        if (type === GameLevel.HELL) {
            this.spell1 = new Dash(this.scene);
            this.spell2 = new Lighter(this.scene);
        }
        else if (type === GameLevel.HEAVEN) {
            this.spell1 = new DoubleJump(this.scene);
            this.spell2 = new Shield(this.scene);
        }
        else {
            this.spell1 = new DoubleJump(this.scene);
            this.spell2 = new Shield(this.scene);
        }
        this.spell1.slot = scene.currentLevel.spell1_slot;
        this.spell2.slot = scene.currentLevel.spell2_slot;
    }
}