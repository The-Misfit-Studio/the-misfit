import {GameState, progress} from "./src/js/utils.js";
import GameScene from "./src/js/scene/GameScene.js";
import MenuScene from "./src/js/scene/MenuScene.js";
import {soundLoader} from "./src/js/sound.js";
import createJson from "./src/js/loadingJsonBlender.js";

let engine;
let scene;
let menuScene;
// let divFps = document.getElementById("fps");
let canvas = document.querySelector("#myCanvas");

function startGame() {
    engine = new BABYLON.Engine(canvas, true);
    menuScene = new MenuScene(null, engine, canvas);
    modifySettings();
    gameLoop();
    setTimeout(() => {
        if (soundLoader.sceneMusic.paused) {
            soundLoader.playSound(soundLoader.sceneMusic);
        }
    }, 200);
}

function gameLoop() {
    engine.runRenderLoop(() => {
        switch (GameState.state) {
            case GameState.START_MENU:
                menuScene.mainMenu().then(() => {
                    menuScene.render();
                });
                GameState.state = GameState.IN_MENU;
                break;
            case GameState.STARTING:
                scene = new GameScene(engine, canvas);
                break;
            case GameState.LOADING:
                // do nothing but loading
                break;
            case GameState.IN_GAME:
                scene.computeScene();
                scene.hero.activateHeroEvents();
                scene.render();
                break;
            case GameState.RESTARTING:
                // scene = new GameScene(progress.currentSelectedPath, engine, canvas);
                scene.restart();
                // scene.loadScene();
                break;
            case GameState.OPTIONS:
                break;
            case GameState.IN_MENU:
                menuScene.render();
                break;
            case GameState.WAIT_START:
                scene.computeScene();
                scene.render();
                break;
            case GameState.PAUSE:
                scene.render();
                break;
            case GameState.GAME_OVER:
                menuScene.gameOverMenu().then(() => {
                    GameState.state = GameState.IN_MENU;
                    menuScene.render();
                });
                break;
            case GameState.WIN:
                menuScene.winMenu().then(() => {
                    GameState.state = GameState.IN_MENU;
                    menuScene.render();

                })
                break;
            default:
                break;
        }
        // divFps.innerHTML = engine.getFps().toFixed() + " fps";
    });
}

function modifySettings() {
    window.addEventListener("resize", () => {
        engine.resize();
    });

    document.onpointerlockchange = () => {
        if (document.pointerLockElement !== canvas && !scene.isGameOver) {
            if (GameState.state === GameState.IN_GAME) {
                GameState.state = GameState.PAUSE;
                scene.pauseMenu();
            }
        }
    }

    window.addEventListener("keydown", (e) => {
        if (e.key === "p" || e.key === "P" || e.key === "Escape") {
            if (GameState.state === GameState.IN_GAME) {
                GameState.state = GameState.PAUSE;
                scene.pauseMenu();
            }
        }
    });

    canvas.addEventListener("wheel", evt => evt.preventDefault());
}

window.onload = () => {
    // createJson("Hell2.babylon", canvas);
    startGame();
}