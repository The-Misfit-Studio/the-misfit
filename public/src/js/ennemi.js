import {GameOptions} from "./utils.js";

export default class Sphere {
    /**
     *
     * @param {String} name
     * @param {BABYLON.Scene} scene
     * @param {String} spawnMeshName
     * @param {BABYLON.Vector3} basicImpulse
     */
    constructor(name, scene, spawnMeshName, basicImpulse) {
        this._name = name;
        this._diameter = 1.5;
        this._rayon = this._diameter / 2;
        this.scene = scene;
        this.sphere = BABYLON.Mesh.CreateSphere(name, 4, this._diameter, scene);
        this._spawnSphere = this.scene.getMeshByName(spawnMeshName);
        this._basicImpulse = basicImpulse;
        this.configureSphere();
    }

    configureSphere() {
        this.sphere.position = this._spawnSphere.position.clone();
        this.sphere.physicsImpostor = new BABYLON.PhysicsImpostor(
            this.sphere,
            BABYLON.PhysicsImpostor.SphereImpostor,
            GameOptions.sphereImpostor,
            this.scene
        );
        let sphereMaterial = new BABYLON.StandardMaterial(
            `${this._name}Material`,
            this.scene
        );
        sphereMaterial.diffuseColor = new BABYLON.Color3.Random();
        sphereMaterial.emissiveColor = new BABYLON.Color3.Random();
        this.sphere.material = sphereMaterial;
        this.sphere.physicsImpostor.applyImpulse(
            this._basicImpulse,
            this.sphere.getAbsolutePosition()
        );

        let trigger = this.scene.getMeshByName("TriggerHole");
        trigger.actionManager.registerAction(
            new BABYLON.ExecuteCodeAction(
                {
                    trigger: BABYLON.ActionManager.OnIntersectionEnterTrigger,
                    parameter: {
                        mesh: this.sphere,
                        usePreciseIntersection: true
                    }
                },
                () => {
                    console.log("sphere INTERSECTION !")
                    this.disposeSelf()
                }
            )
        )
    }

    attract() {
        let heroMesh = this.scene.hero.heroMesh;
        // let's compute the direction vector that goes from Dude to the tank
        let direction = heroMesh.position.subtract(this.sphere.position);
        let distance = direction.length(); // we take the vector that is not normalized, not the dir vector
        let dir = direction.normalize();
        dir.x *= 5000;
        dir.z *= 5000;
        if (distance < 70) {
            this.sphere.physicsImpostor.applyImpulse(
                dir,
                this.sphere.getAbsolutePosition()
            );
        }
    }

    pushAway() {
        let heroMesh = this.scene.hero.heroMesh;
        // let's compute the direction vector that goes from Dude to the tank
        let direction = heroMesh.position.subtract(this.sphere.position);
        let distance = direction.length(); // we take the vector that is not normalized, not the dir vector
        let dir = direction.normalize();
        dir.x *= 5000;
        dir.z *= 5000;
        dir = new BABYLON.Vector3(-dir.x, dir.y, -dir.z)
        if (distance < 70) {
            this.sphere.physicsImpostor.applyImpulse(
                dir,
                this.sphere.getAbsolutePosition()
            );
        }
    }

    disposeSelfGameOver() {
        this.sphere.dispose();
        delete this;
    }

    disposeSelf() {
        this.sphere.dispose();
        let index = this.scene.sphereList.indexOf(this, 0)
        this.scene.sphereList.splice(index, 1);
        this.scene.score++;
        delete this;
    }
}
