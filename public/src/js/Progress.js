import {arrayContains, progress} from "./utils.js";

function removeItem(arr, value) {
    let index = arr.indexOf(value);
    if (index > -1) {
        arr.splice(index, 1);
    }
    return arr;
}

class Progress {
    _currentSelectedLevel = undefined;
    _currentSelectedPath = undefined;
    _levelsCompleted = [];
    _remainingLevels = [];
    _totalCoins = 0;

    constructor() {

    }

    /**
     * @returns{number}
     */
    get totalCoins() {
        return this._totalCoins;
    }

    /**
     * @param{number} value
     */
    set totalCoins(value) {
        this._totalCoins = value;
    }

    /**
     *
     * @param{Number} coins
     */
    addCoins(coins) {
        this._totalCoins += coins;
    }

    /**
     *
     * @returns {String}
     */
    get currentSelectedPath() {
        return this._currentSelectedPath;
    }

    /**
     *
     * @param{String} value
     */
    set currentSelectedPath(value) {
        this._currentSelectedPath = value;
    }

    /**
     *
     * @returns{String}
     */
    get currentSelectedLevel() {
        return this._currentSelectedLevel;
    }

    /**
     *
     * @param{String} level
     */
    set currentSelectedLevel(level) {
        this._currentSelectedLevel = level;
    }

    /**
     *
     * @returns {BABYLON.Nullable<BABYLON.GUI.Control>[]}
     */
    get levelsCompleted() {
        return this._levelsCompleted;
    }

    /**
     *
     * @returns {BABYLON.Nullable<BABYLON.GUI.Control>[]}
     */
    set levelsCompleted(value) {
        this._levelsCompleted = value;
    }

    /**
     *
     * @returns {BABYLON.Nullable<BABYLON.GUI.Control>[]}
     */
    get remainingLevels() {
        return this._remainingLevels;
    }

    /**
     *
     * @param{String} value
     */
    set currentSelectedLevelPath(value) {
        this._currentSelectedLevelPath = value;
    }

    /**
     *
     * @param{String} level
     */
    addCompletedLevel(level) {
        if (!arrayContains(this.levelsCompleted, level)) {
            this._levelsCompleted.push(level);
        }
    }

    /**
     *
     * @param{BABYLON.Nullable<BABYLON.GUI.Control>} level
     */
    removeRemainingLevel(level) {
        this._remainingLevels = removeItem(this._remainingLevels, level);
    }

    nextLevel() {
        this.currentSelectedPath = `Level${progress.levelsCompleted.length + 1}.babylon`;
        this.currentSelectedLevel = `Level${progress.levelsCompleted.length + 1}`;
    }

    /**
     *
     * @param{BABYLON.Nullable<BABYLON.GUI.Control>} level
     */
    removeLevelCompleted(level) {
        this._levelsCompleted = removeItem(this._levelsCompleted, level);
    }

    resetProgression() {
        this.levelsCompleted = [];
        this.currentSelectedLevel = "Level1";
        this.currentSelectedLevelPath = "Level1.babylon";
        this.totalCoins = 0;
    }

    unlockLevels() {
        for (let i = 1; i < 5; i++) {
            this.addCompletedLevel(`Level${i}`)
        }
    }
}

export {Progress};