import {Progress} from "./Progress.js";
import GameScene from "./scene/GameScene.js";
import {soundLoader} from "./sound.js";

const progress = new Progress();


class GameState {
    static START_MENU = 0;
    static STARTING = 1;
    static RESTARTING = 2;
    static OPTIONS = 3;
    static IN_GAME = 4;
    static LOADING = 5;
    static GAME_OVER = 6;
    static IN_MENU = 7;
    static WAIT_START = 8;
    static PAUSE = 9;
    static WIN = 10;

    static state = GameState.START_MENU;
    static lastState = 0;
}

class GameOptions {

    static gravity = -60.81;

    static heroImpostor = {
        mass: 100,
        friction: 0,
        restitution: 0.4
    };

    static groundWallImpostor = {
        mass: 0,
        restitution: 0
    };

    static heroBounder = {
        diameter: 1.5,
        segments: 20
    };

    static heroMesh = {
        diameter: 1.5,
        segments: 20
    };

    static loadingZone = {
        width: 80,
        height: 50,
        depth: 180,
    };

    static sphereImpostor = {
        mass: 80,
        restitution: 0,
        gravity: new BABYLON.Vector3(0, -9.81, 0),
    };

    static dashTimer = 2000;
    static doubleJumpTimer = 2000;
    static shieldTimer = 4000;
    static lightTimer = 8000;

    static dashImpulse = 50;
    static dashTime = 250;
    static shieldTime = 4000;
    static heroSpeedJump = 20;
    static lightTime = 4000;

    static heroSpeed = 27;
    static heroLife = 3;
    static heroImmuneTime = 1000; // in milliseconds
    static heroMaxLife = 3;
    static globalVolume = .3;

    static baseLightHell = 0.7;
}

class GameLevel {
    static HELL = 0;
    static HEAVEN = 1;
    static NB_LEVEL = 6;

    static getLevelByName(name) {
        switch (name) {
            case "Level1":
                return GameLevel.level1;
            case "Level2":
                return GameLevel.level2;
            case "Level3":
                return GameLevel.level3;
            case "Level4":
                return GameLevel.level4;
            case "Level5":
                return GameLevel.level5;
            case "Level6":
                return GameLevel.level6;
        }
    }

    static getHeroMeshByLevelType(type) {
        if (type === GameLevel.HELL) {
            return "HeroAngelBody";
        }
        return "HeroDemonBody";
    }

    static getHeroHatByLevelType(type) {
        if (type === GameLevel.HELL) {
            return "HeroAngelHalo";
        }
        return "HeroDemonHorn";
    }

    static getHeroBodyTextureByType(type) {
        if (type === GameLevel.HELL) {
            return "./models/hero/AngelBodyTexture.jpg";
        }
        return "./models/hero/DemonBodyTexture.jpg";
    }

    static getHeroHatTextureByType(type) {
        if (type === GameLevel.HELL) {
            return "./models/hero/AngelHaloTexture.jpg";
        }
        return "./models/hero/DemonHornTexture.jpg";
    }

    static getBabylonHeroByType(type) {
        if (type === GameLevel.HELL) {
            return "Angel.babylon";
        }
        return "Demon.babylon";
    }

    static getCoinMeshByType(type) {
        if (type === GameLevel.HELL) {
            return "CoinHeaven";
        }
        return "CoinHell";
    }

    static level1 = {
        type: GameLevel.HEAVEN,
        spell1_slot: 4,
        spell2_slot: 4,
        isTuto: true,
        heroLife: 3
    };
    static level2 = {
        type: GameLevel.HELL,
        spell1_slot: 2,
        spell2_slot: 3,
        isTuto: true,
        heroLife: 2
    };
    static level3 = {
        type: GameLevel.HEAVEN,
        spell1_slot: 4,
        spell2_slot: 4,
        isTuto: false,
        heroLife: 3
    } ;
    static level4 = {
        type: GameLevel.HELL,
        spell1_slot: 4,
        spell2_slot: 4,
        isTuto: false,
        heroLife: 3
    } ;
    static level5 = {
        type: GameLevel.HEAVEN,
        spell1_slot: 4,
        spell2_slot: 4,
        isTuto: false,
        heroLife: 3
    } ;
    static level6 = {
        type: GameLevel.HELL,
        spell1_slot: 4,
        spell2_slot: 4,
        isTuto: false,
        heroLife: 3
    };
}

function arrayContains(arr, value) {
    for (let i = 0; i < arr.length;i++) {
        if (arr[i] === value) {
            return true;
        }
    }
    return false;
}

function createEllipse (advancedTexture, width, height, thickness) {
    let ellipse = new BABYLON.GUI.Ellipse();
    ellipse.width = width+"px";
    ellipse.height = height+"px";
    ellipse.color = "black";
    ellipse.background = "transparent";
    ellipse.thickness = thickness;
    advancedTexture.addControl(ellipse);
    return ellipse;
}

function createRect(advancedTexture, top, left, size, alpha) {
    let rec = new BABYLON.GUI.Rectangle();
    rec.width = size+"px";
    rec.height = size+"px";
    rec.thickness = 0;
    rec.background = "black";
    rec.top = top;
    rec.left = left;
    rec.alpha = alpha;
    advancedTexture.addControl(rec);
    return rec;
}

function setupBlackScreen(recs, h, w, sizePx, alpha, advancedTexture) {

    let nbH = h/sizePx;
    let nbW = w/sizePx;

    let hBase = -(h/2)+sizePx/2;
    let wBase = -(w/2)+sizePx/2;

    for (let hRange = 0; hRange < nbH; hRange++) {
        for (let wRange = 0; wRange < nbW; wRange++) {
            recs.push(createRect(advancedTexture, hBase+hRange*sizePx, wBase+wRange*sizePx, sizePx, alpha));
        }
    }

    return recs;
}

function addUIControlMenuButton(advancedTexture, name, color, clickCallback, path = '', state = '') {

    let button = advancedTexture.getControlByName(name + "Button");
    let normal = advancedTexture.getControlByName(name + "Normal" + state);
    let hover = advancedTexture.getControlByName(name + "Hover" + state);
    let pressed = advancedTexture.getControlByName(name + "Pressed" + state);

    if (path !== '') {
        path += '/';
    }

    normal.source = `./assets/ui/menu/${path}${name}/${name}Normal${color}.png`;
    hover.source = `./assets/ui/menu/${path}${name}/${name}Hover${color}.png`;
    pressed.source = `./assets/ui/menu/${path}${name}/${name}Pressed${color}.png`;

    pressed.isVisible = false;
    hover.isVisible = false;

    button.pointerEnterAnimation = null;
    button.pointerDownAnimation = null;
    button.pointerUpAnimation = null;

    button.onPointerEnterObservable.add(() => {
        hover.isVisible = true;
        normal.isVisible = false;
        soundLoader.playSound(soundLoader.buttonHoverEffect);
    })
    button.onPointerOutObservable.add(() => {
        hover.isVisible = false;
        normal.isVisible = true;
    })
    button.onPointerDownObservable.add(() => {
        hover.isVisible = false;
        normal.isVisible = false;
        pressed.isVisible = true;
        soundLoader.playSound(soundLoader.buttonClickEffect);
    })
    button.onPointerUpObservable.add(() => {
        hover.isVisible = true;
        pressed.isVisible = false;
        soundLoader.playSound(soundLoader.buttonHoverEffect);
    })
    button.onPointerClickObservable.add(clickCallback);
}

export {GameState, GameOptions, progress, arrayContains, GameLevel, createEllipse, createRect, setupBlackScreen, addUIControlMenuButton}