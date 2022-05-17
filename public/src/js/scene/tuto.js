
export default class Tuto {

    constructor(scene) {
        this.manager = new BABYLON.GUI.GUI3DManager(scene);
        this.scene = scene;
        this.mainTuto = undefined;
    }

    createTuto(mesh, sizeButton, scaleText, font, text) {
        var anchor = new BABYLON.AbstractMesh("anchor", this.scene);

        var button = new BABYLON.GUI.Button3D("reset");
        this.manager.addControl(button);
        button.linkToTransformNode(anchor);
        button.position = mesh.position.clone();
        button.scaling = sizeButton

        button.pointerEnterAnimation = null;
        button.pointerDownAnimation = null;
        button.pointerUpAnimation = null;

        var text1 = new BABYLON.GUI.TextBlock();
        text1.text = text;
        text1.horizontalAlignment = BABYLON.GUI.TextBlock.HORIZONTAL_ALIGNMENT_LEFT;
        text1.color = "white";
        text1.fontSize = font;
        text1.scaleY = scaleText;
        button.content = text1;
        mesh.dispose();
        return button;
    }

    processTuto(mesh) {
        let button;
        switch (mesh.name) {
            case "TutoJump":
                this.createTuto(mesh, new BABYLON.Vector3(10, 5, 1), 2,23,
                    "Attention le trou, sautez !\n"+
                    "Espace ou ↑"
                )
                break;
            case "TutoDoubleJump.001":
            case "TutoDoubleJump":
                this.createTuto(mesh, new BABYLON.Vector3(10, 5, 1), 2,23,
                    "Faites un double saut !\n " +
                    "J ou Maj"
                )
                break;
            case "TutoShield":
                this.createTuto(mesh, new BABYLON.Vector3(10, 5, 1), 2,23,
                    "Activez votre bouclier !\n" +
                    "K ou Ctrl"
                )
                break;
            case "TutoMain":
                button = this.createTuto(mesh, new BABYLON.Vector3(20, 10, 1), 2, 10,
                    "Bienvenue dans MistFit !\nVous allez jouer un ange et un démon perdu...\n" +
                    "Les 2 personnages ont des sorts différents !\n" +
                    "Découvrons les avec ce tutoriel...\n" +
                    "Attention vous n'avez qu'une vie !\n\n" +
                    "Touches :\n" +
                    "Saut: Espace / ↑ | Droite: Q / → | Gauche: D / ←\n" +
                    "Sort 1: J / Shift / &\n" +
                    "Sort 2: K / Ctrl / é\n" +
                    "Pause: Echap / P"
                );
                this.mainTuto = button;
                break;
            case "TutoMain2":
                button = this.createTuto(mesh, new BABYLON.Vector3(20, 10, 1), 2, 9,
                    "Bienvenue en enfer...\n" +
                    "Vous vous sentez revigoré...\n" +
                    "Vous avez un peu plus de vie !\n\n" +
                    "Votre moitiée ange s'est perdue dans les enfers.\n" +
                    "Aidez le à retrouver le paradis !\n" +
                    "Votre 1er sort est une impulsion !\n" +
                    "Vous irez plus loin avec...\n" +
                    "Attention il fait sombre ici...\n" +
                    "Votre 2ème sort éclaire un peu !\n" +
                    "Utilisez les avec intelligence...\n" +
                    "Qui sait ce qu'il se cache ici..."
                );
                this.mainTuto = button;
                break;
            case "TutoKeepSpell":
                this.createTuto(mesh, new BABYLON.Vector3(10, 5, 1), 2, 18,
                    "Utilisez vos sort intelligemment !\n" +
                    "Vous en aurez besoin..."
                );
        }
    }
}
