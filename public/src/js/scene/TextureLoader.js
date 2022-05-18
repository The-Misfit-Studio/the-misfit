export default class TextureLoader {

    constructor(scene) {
        this.scene = scene;
    }

    setTexture(mesh) {
        let material = new BABYLON.StandardMaterial("testMaterial", this.scene);
        if (mesh.name === "SpikeTileSpike") {
            material.diffuseColor = new BABYLON.Color3(0, 0, 0);
            material.specularColor = new BABYLON.Color3(1, 1, 1);
            mesh.material = material;
        } else if (mesh.name === "SpikeTileTile") {
            material.diffuseColor = new BABYLON.Color3(0.7, 0.7, 0.7);
            material.specularColor = new BABYLON.Color3(1, 1, 1);
            mesh.material = material;
        } else if (mesh.name === "GroundTileHell") {
            material.diffuseTexture = new BABYLON.Texture("./models/scene/GroundTileHell.jpg", this.scene);
            mesh.material = material;
        } else if (mesh.name === "WallTileHell") {
            material.diffuseTexture = new BABYLON.Texture("./models/scene/WallTileHell.jpg", this.scene);
            mesh.material = material;
        }
        else if (mesh.name === "GroundTileHeaven1") {
            material.diffuseTexture = new BABYLON.Texture("./models/scene/GroundTileHeaven1.jpg", this.scene);
            mesh.material = material;
        }
        else if (mesh.name === "GroundTileHeaven2") {
            material.diffuseTexture = new BABYLON.Texture("./models/scene/GroundTileHeaven2.jpg", this.scene);
            mesh.material = material;
        }
        else if (mesh.name === "CoinHell") {
            material.diffuseColor = new BABYLON.Color3(1, 0.1, 0.4);
            mesh.material = material;
        }
        else if (mesh.name === "CoinHeaven") {
            material.diffuseColor = new BABYLON.Color3(0.2, 1, 1);
            mesh.material = material;
        }
        else if (mesh.name.includes("Trigger")) {
            mesh.visibility = 0;
        } else if (mesh.name.includes("SpinningBlade") && !mesh.name.includes("Tile")) {
            material.diffuseTexture = new BABYLON.Texture("./models/scene/SpinningBlade.jpg", this.scene);
            mesh.material = material;
        }
    }
}