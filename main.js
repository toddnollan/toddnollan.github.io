const scriptVersion = "Script v.014"; //declare version, write to main
document.getElementById("versionlabel").innerHTML = scriptVersion;
//Find and assign the three output panes
const hullsOut = document.getElementById("hullspane");
const settingsOut = document.getElementById("settingspane");

hullsOut.innerHTML = "Sometimes, I dream about cheese.";



/**** BABYLON PREMADE ****/

var canvas = document.getElementById("renderCanvas"); // Get the canvas element 
resizeCanvas();
        var engine = new BABYLON.Engine(canvas, true); // Generate the BABYLON 3D engine

        /******* Add the create scene function ******/
        var createScene = function () {

            // Create the scene space
            var scene = new BABYLON.Scene(engine);

            // Add a camera to the scene and attach it to the canvas
            var camera = new BABYLON.ArcRotateCamera("Camera", Math.PI / 2, Math.PI / 2, 2, new BABYLON.Vector3(0,0,5), scene);
            camera.attachControl(canvas, true);

            // Add lights to the scene
            var light1 = new BABYLON.HemisphericLight("light1", new BABYLON.Vector3(1, 1, 0), scene);
            var light2 = new BABYLON.PointLight("light2", new BABYLON.Vector3(0, 1, -1), scene);

            // Add and manipulate meshes in the scene
            var sphere = BABYLON.MeshBuilder.CreateSphere("sphere", {diameter:2}, scene);

            return scene;
        };
        /******* End of the create scene function ******/    

        var scene = createScene(); //Call the createScene function

        // Register a render loop to repeatedly render the scene
        engine.runRenderLoop(function () { 
                scene.render();
        });

        // Watch for browser/canvas resize events
        window.addEventListener("resize", function () { 
                resizeCanvas();
                engine.resize();
        });

var skybox = BABYLON.MeshBuilder.CreateBox("skyBox", {size:1000.0}, scene);
var skyboxMaterial = new BABYLON.StandardMaterial("skyBox", scene);
skyboxMaterial.backFaceCulling = false;
skyboxMaterial.reflectionTexture = new BABYLON.CubeTexture("Skybox/sky", scene);
skyboxMaterial.reflectionTexture.coordinatesMode = BABYLON.Texture.SKYBOX_MODE;
skyboxMaterial.diffuseColor = new BABYLON.Color3(0, 0, 0);
skyboxMaterial.specularColor = new BABYLON.Color3(0, 0, 0);
skybox.material = skyboxMaterial;

/**** END BABYLON ****/


function resizeCanvas(){
        canvas.height = window.innerHeight - 20;
        canvas.width = (window.innerWidth/2)-20;
        return;
}





