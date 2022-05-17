import {GameLevel, GameOptions, GameState} from "./utils.js";
import {soundLoader} from "./sound.js";
import SpellHolster from "./spell/SpellHolster.js";


export default class Hero {
    _isMoving = false;
    _tmpCoins = 0;

    constructor(scene) {
        this.scene = scene;
        this.inputStates = {};
        this.bounder = null;
        this.heroMesh = null;
        this.immune = false;
        this.intervalFadeout = null;
        this.speed = GameOptions.heroSpeed;
        this.spells = new SpellHolster(this.scene);

        this.center = this.scene.getMeshByName("GroundTileStart.002").position;
        this.scene.center = this.center.x;
        this._cursor = 1;
        this._oldCursor = 1;
        this._sides = {
            0: {
                "coords": this.scene.getMeshByName("GroundTileStart.001").position
            },
            1: {
                "coords": this.center
            },
            2: {
                "coords": this.scene.getMeshByName("GroundTileStart.003").position
            }
        }

        this.createHero();
        this.createBounder();
        this.initHeroEvent();
        this.life = this.scene.currentLevel.heroLife;
    }

    addCoins() {
        this._tmpCoins++;
    }


    set isMoving(value) {
        this._isMoving = value;
    }

    get isMoving() {
        return this._isMoving;
    }

    /**
     *
     * @returns {number}
     */
    get tmpCoins() {
        return this._tmpCoins;
    }

    createHero() {
        let type = this.scene.currentLevel.type;
        this.heroMesh = this.scene.getMeshByName(GameLevel.getHeroMeshByLevelType(type));
        let body = new BABYLON.StandardMaterial("body", this.scene);
        body.diffuseTexture = new BABYLON.Texture(GameLevel.getHeroBodyTextureByType(type), this.scene);
        this.heroMesh.material = body;
        this.heroMesh.alpha = 0.4;

        // console.log(body.diffuseTexture);

        this.hatMesh = this.scene.getMeshByName(GameLevel.getHeroHatByLevelType(type));
        let hat = new BABYLON.StandardMaterial("body", this.scene);
        hat.diffuseTexture = new BABYLON.Texture(GameLevel.getHeroHatTextureByType(type), this.scene);
        this.hatMesh.material = hat;

        this.heroMesh.addChild(this.hatMesh);
        this.heroMesh.scaling = new BABYLON.Vector3(1, 1, 1);

        let spawnHero = this.scene.getMeshByName("SpawnHero");
        this.heroMesh = this.scene.getMeshByName(GameLevel.getHeroMeshByLevelType(this.scene.currentLevel.type));
        this.heroMesh.position = spawnHero.position.clone();
        this.heroMesh.position.y -= .2;
        this.heroMesh.speed = 0.4;
        this.heroMesh.frontVector = new BABYLON.Vector3(0, 0, 1);
        this.heroMesh.actionManager = new BABYLON.ActionManager(this.scene);
        this._rayHandler = new RayHandler(this.heroMesh, this.scene);
    }

    createBounder() {
        this.bounder = new BABYLON.MeshBuilder.CreateSphere("bounderHero", GameOptions.heroBounder, this.scene);
        // let bounderMaterial = new BABYLON.StandardMaterial("bounderTankMaterial", this.scene);

        this.bounder.position = this.heroMesh.position.clone();
        this.bounder.visibility = false;
        this.bounder.checkCollisions = true;

        this.bounder.frontVector = new BABYLON.Vector3(0, 0, 1);
    }

    applyPhysics() {
        this.bounder.physicsImpostor = new BABYLON.PhysicsImpostor(
            this.bounder,
            BABYLON.PhysicsImpostor.SphereImpostor,
            GameOptions.heroImpostor,
            this.scene
        );
    }

    skill() {
        if (!this.spells.spell1.isLocked() && this.inputStates.spell1) {
            this.spells.spell1.doEffect();
        }
        if (!this.spells.spell2.isLocked() && this.inputStates.spell2) {
            this.spells.spell2.doEffect();
        }
    }

    updateHeart() {
        for (let i = 0; i < 3; i++) {
            if (i >= this.life) {
                this.scene.hearts[i].isVisible = false;
                this.scene.hearts[i+3].isVisible = true;
            }
        }
    }

    takeDamage(nbDamage) {
        if (!this.immune) {
            if (this.spells.spell2.type === SpellHolster.SHIELD && this.spells.spell2.isActive) {
                this.spells.spell2.fadeOut();
                soundLoader.playSound(soundLoader.shieldBlockEffect);
                return;
            }
            soundLoader.playSound(soundLoader.spikeEffect);
            this.life -= nbDamage
            if (this.life <= 0) {
                this.scene.gameOver();
            } else {
                this.updateHeart()
                this.immune = true;
                this.intervalFadeout = setInterval(() => {
                    if (this.heroMesh.visibility === 0) {
                        this.heroMesh.visibility = 1;
                    } else {
                        this.heroMesh.visibility = 0;
                    }

                }, 100);
                setTimeout(() => {
                    this.immune = false;
                    clearInterval(this.intervalFadeout);
                    this.heroMesh.visibility = 1;
                }, GameOptions.heroImmuneTime);
            }
        }
    }

    updateParticles(color1, color2, colorDead) {
        // Create a particle system
        var particleSystem = new BABYLON.ParticleSystem("particles", 1000, this.scene);

        //Texture of each particle
        particleSystem.particleTexture = new BABYLON.Texture("./assets/flare.png", this.scene);

        // Where the particles come from
        particleSystem.emitter = this.heroMesh.position;

        particleSystem.minEmitBox = new BABYLON.Vector3(-2.5, 3, 0); // Starting all from
        particleSystem.maxEmitBox = new BABYLON.Vector3(2.5, 3.5, 0); // To...
        // Colors of all particles
        particleSystem.color1 = color1;
        particleSystem.color2 = color2;
        particleSystem.colorDead = colorDead;

        // // Size of each particle (random between...
        particleSystem.minSize = 0.1;
        particleSystem.maxSize = 0.5;

        // Life time of each particle (random between...
        particleSystem.minLifeTime = 0.05;
        particleSystem.maxLifeTime = 0.2;

        // Emission rate
        particleSystem.emitRate = 1000;


        /******* Emission Space ********/
        particleSystem.createSphereEmitter(2);


        // Speed
        particleSystem.minEmitPower = 1;
        particleSystem.maxEmitPower = 7;
        particleSystem.updateSpeed = 0.005;

        particleSystem.targetStopDuration = 0.07;

        // Start the particle system
        particleSystem.start();
    }

    moveHero() {
        if (!this.bounder) return;

        this.bounder.physicsImpostor.setAngularVelocity(BABYLON.Vector3.Zero());
        let vec = this.bounder.physicsImpostor.getLinearVelocity();
        vec.x = 0;

        this.heroMesh.position = this.bounder.position.clone();

        vec.z = this.speed;
        if (!this._isMoving) {
            this._oldCursor = this._cursor;
            if (this.inputStates.left && this._cursor > 0) {
                this.inputStates.left = false;
                vec.x = -this.speed;
                this._cursor--;
            }
            if (this.inputStates.right && this._cursor < 2) {
                this.inputStates.right = false;
                vec.x = this.speed;
                this._cursor++;
            }
        }
        if (this.inputStates.space && this._rayHandler.isOnGround()) {
            vec.y = GameOptions.heroSpeedJump;
            this._rayHandler.onObject = false;
            soundLoader.playSound(soundLoader.jumpEffect);
            // playSound(this.jumpEffect);
            this.updateParticles(
                new BABYLON.Color4(1, 0, 0, .0),
                new BABYLON.Color4(0, 1, 0, 0),
                new BABYLON.Color4(0, 0, 1)
            );
        }


        switch (this._cursor) {
            // Left
            case 0:
                if (this.bounder.position.x > this._sides[this._cursor]["coords"].x) {
                    vec.x = -this.speed;
                    this._isMoving = true;

                } else {
                    this._isMoving = false;
                }
                break;
            // Middle
            case 1:
                let direction = 0;
                if (this._oldCursor === 0) {
                    direction = 1; // right
                } else if (this._oldCursor === 2) {
                    direction = 0; // left
                }
                if ((direction === 0 && this.bounder.position.x <= this._sides[this._cursor]["coords"].x) ||
                    (direction === 1 && this.bounder.position.x >= this._sides[this._cursor]["coords"].x) ||
                    (BABYLON.Vector3.Distance(this.bounder.position,
                        new BABYLON.Vector3(this._sides[this._cursor]["coords"].x, this.heroMesh.position.y, this.heroMesh.position.z)) <= .01)) {
                    this.bounder.position.x = this._sides[this._cursor]["coords"].x;
                    this._isMoving = false;
                    break;
                }
                // go left
                if (this.bounder.position.x > this._sides[this._cursor]["coords"].x && direction === 0) {
                    vec.x = -this.speed;
                }
                // go right
                else if (this.bounder.position.x < this._sides[this._cursor]["coords"].x) {
                    vec.x = this.speed;
                }

                this._isMoving = true;
                break;
            // Right
            case 2:
                if (this.bounder.position.x < this._sides[this._cursor]["coords"].x) {
                    vec.x = this.speed;
                    this._isMoving = true;

                } else {
                    this._isMoving = false;
                }
                break;
        }

        this.bounder
            .physicsImpostor
            .setLinearVelocity(vec);
    }

    activateHeroEvents() {
        if (!this.scene.isGameOver) {
            this.moveHero();
            this.skill();
        }
    }

    initHeroEvent() {
        this.inputStates.left = false;
        this.inputStates.right = false;
        this.inputStates.up = false;
        this.inputStates.down = false;
        this.inputStates.space = false;
        this.inputStates.spell1 = false;
        this.inputStates.spell2 = false;

        window.addEventListener('keydown', (event) => {
            if ((event.key === "q") || (event.key === "Q") || (event.key === "ArrowLeft")) {
                this.inputStates.left = true;
            } else if ((event.key === "z") || (event.key === "Z")) {
                this.inputStates.up = true;
            } else if ((event.key === "d") || (event.key === "D") || (event.key === "ArrowRight")) {
                this.inputStates.right = true;
            } else if ((event.key === "s") || (event.key === "S")) {
                this.inputStates.down = true;
            } else if ((event.key === " ") || (event.key === "ArrowUp")) {
                this.inputStates.space = true;
            } else if (event.key === "j" || (event.key === "J") || (event.key === "&") || (event.key === "Shift")) {
                this.inputStates.spell1 = true;
            } else if (event.key === "k" || (event.key === "K") || (event.key === "é") || (event.key === "Control")) {
                this.inputStates.spell2 = true;
            }
        }, false);

        window.addEventListener('keyup', (event) => {
            if ((event.key === "q") || (event.key === "Q") || (event.key === "ArrowLeft")) {
                this.inputStates.left = false;
            } else if ((event.key === "z") || (event.key === "Z")) {
                this.inputStates.up = false;
            } else if ((event.key === "d") || (event.key === "D") || (event.key === "ArrowRight")) {
                this.inputStates.right = false;
            } else if ((event.key === "s") || (event.key === "S")) {
                this.inputStates.down = false;
            } else if ((event.key === " ") || (event.key === "ArrowUp")) {
                this.inputStates.space = false;
            } else if (event.key === "j" || (event.key === "J") || (event.key === "&") || (event.key === "Shift")) {
                this.inputStates.spell1 = false;
            } else if (event.key === "k" || (event.key === "K") || (event.key === "é") || (event.key === "Control")) {
                this.inputStates.spell2 = false;
            }
        }, false);
    }
}

class RayHandler {
    constructor(heroMesh, scene) {
        this.heroMesh = heroMesh;
        this.scene = scene;
        this.ray = new BABYLON.Ray(this.heroMesh.position, new BABYLON.Vector3(0, -1, 0));
        this.rayHelper = new BABYLON.RayHelper(this.ray);
        this.rayHelper.attachToMesh(this.heroMesh, new BABYLON.Vector3(0, -1, 0), new BABYLON.Vector3(0, 0, 0), 1);
        this.onObject = false;
    }

    isOnGround() {
        const pick = this.scene.pickWithRay(this.ray, (mesh) => {
            return mesh.name.startsWith("Ground");
        }, true);
        if (pick) this.onObject = pick.hit;
        return this.onObject;
    }
}