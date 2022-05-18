import {GameOptions} from "./utils.js";

/*
// ########### TRIGGER ON INSTANCES !! ###########


    let sph = scene.getMeshByName("mySphere");
    sph.actionManager = new BABYLON.ActionManager(scene);
    if (mesh.name === "CoinHell") {
        sph.actionManager.registerAction(
            new BABYLON.ExecuteCodeAction(
                {
                    trigger: BABYLON.ActionManager.OnIntersectionEnterTrigger,
                    parameter: {
                        mesh: mesh
                    }
                },
                () => {
                    console.log("INTER !");
                    console.log(mesh.name);
                }
            )
        )
        let newCoin = mesh.createInstance('test');
        newCoin.position.x += 3;
        sph.actionManager.registerAction(
            new BABYLON.ExecuteCodeAction(
                {
                    trigger: BABYLON.ActionManager.OnIntersectionEnterTrigger,
                    parameter: {
                        mesh: newCoin
                    }
                },
                () => {
                    console.log("INTER !");
                    console.log(newCoin.name);
                }
            )
        )
    }


//########  PhysicsImpostors ON INSTANCE ###########

    let sph = scene.getMeshByName("mySphere");
    sph.physicsImpostor = new BABYLON.PhysicsImpostor(
        sphere,
        BABYLON.PhysicsImpostor.SphereImpostor,
        GameOptions.heroImpostor,
        scene
    );

    let newS
    if (sph !== null) {
        newS = sph.createInstance("test");
        newS.physicsImpostor = new BABYLON.PhysicsImpostor(
            newS,
            BABYLON.PhysicsImpostor.SphereImpostor,
            GameOptions.heroImpostor,
            scene
        );
        newS.position.x += 5;
    }

    setTimeout(() => {
        newS.dispose();
        sph.physicsImpostor.applyImpulse(new BABYLON.Vector3(0, 1000, 0), sph.position)
        console.log("Impulse !")
    }, 1000)




//  ########### ANIMATION ON INSTANCES ###########

    if (mesh.name === "CoinHell") {
        mesh.animations = mesh.animations.filter(anim => anim.targetProperty === 'rotation');
        scene.beginAnimation(mesh, 0, 40, true);

        let newCoin = mesh.createInstance('test');
        newCoin.position.x += 3;
        setTimeout(() => {

            scene.beginAnimation(newCoin, 0, 40, true)
            scene.stopAnimation(mesh)
        }, 5000)
    }

    if (mesh.name === "CoinHell") {
        mesh.animations = mesh.animations.filter(anim => anim.targetProperty ==='rotation');

        console.log(mesh.animations);
        let newCoin = mesh.clone();
        console.log(newCoin.animations);
        newCoin.position.x += 10;
        scene.beginAnimation(mesh, 0, 40, true);
        scene.beginAnimation(newCoin, 0, 40, true);
    }
*/

function createScene(canvas, engine) {
    let scene = new BABYLON.Scene(engine);

    let camera = new BABYLON.FreeCamera("myCamera", new BABYLON.Vector3(0, 30, -50), scene);
    // This targets the camera to scene origin
    camera.setTarget(new BABYLON.Vector3(0, 0, 0));
    camera.attachControl(canvas);
    let light = new BABYLON.HemisphericLight("myLight", new BABYLON.Vector3(0, 100, 0), scene);
    light.intensity = 1;
    light.diffuse = new BABYLON.Color3(1, 1, 1);
    return scene;
}

function download(content, fileName, contentType) {
    var a = document.createElement("a");
    var file = new Blob([content], {type: contentType});
    a.href = URL.createObjectURL(file);
    a.download = fileName;
    a.click();
}

function spawnCoin(scene, jsonMesh) {
    let mesh = scene.getMeshByName("CoinHell");
    for (let entry of jsonMesh) {
        if (entry.name.includes("SpawnCoin")) {
            let newCoin = mesh.createInstance('test');
            newCoin.position = entry.position;
            scene.beginAnimation(newCoin, 0, 40, true);
        }

    }
}

export default function createJson(babylonFile, canvas) {
    let engine = new BABYLON.Engine(canvas, true);
    let scene = createScene(canvas, engine);

    scene.assetsManager = new BABYLON.AssetsManager(scene);
    // this.currentLevel = GameLevel.getLevelByName(this.modelPath);
    let meshTask = scene.assetsManager.addMeshTask(
        "loadingScene", "", "./models/scene/", babylonFile);

    let jsonMesh = []

    meshTask.onSuccess = (task) => {
        jsonMesh = task.loadedMeshes.map(mesh => ({
            name: mesh.name,
            position: mesh.position,
            rotation: mesh.rotation,
        }))
        for (let entry of jsonMesh) {
            entry.name = entry.name.replace(/\.[0-9]*/, '' );
            // console.log(entry.name);
        }
        download(JSON.stringify(jsonMesh), 'level.json', 'text/plain');
    }
    scene.assetsManager.load();

    window.addEventListener("resize", () => {
        engine.resize()
    })

    engine.runRenderLoop(() => {

        scene.render();
    });
}

function setupLevel(scene, jsonFile) {

}

export function testScene(babylonFile, canvas) {
    let engine = new BABYLON.Engine(canvas, true);
    let scene = createScene(canvas, engine);

    scene.assetsManager = new BABYLON.AssetsManager(scene);
    // this.currentLevel = GameLevel.getLevelByName(this.modelPath);
    let meshTask = scene.assetsManager.addMeshTask(
        "loadingScene", "", "./models/modelsToLoad/", babylonFile);

    let assetMeshes = []

    meshTask.onSuccess = (task) => {
        task.loadedMeshes.forEach(mesh => {
            console.log(mesh.name);
            if (mesh.animations.length > 0) {
                mesh.animations = mesh.animations.filter(anim => anim.targetProperty ==='rotation');
            }
            assetMeshes.push(mesh);
        })
        setupLevel(scene, "level1.json", );
        console.log(assetMeshes.length);
    }
    scene.assetsManager.load();

    window.addEventListener("resize", () => {
        engine.resize()
    })

    engine.runRenderLoop(() => {

        scene.render();
    });
}