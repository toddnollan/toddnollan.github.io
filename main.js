const scriptVersion = "Script v.015"; //declare version, write to main
document.getElementById("versionlabel").innerHTML = scriptVersion;
//Declare Variables and constants
const hullsOut = document.getElementById("hullspane");
const settingsOut = document.getElementById("settingspane");
let hulls = [];
let struts = [];


//end declare

 //Babylon init crap
var canvas = document.getElementById("renderCanvas"); // Get the canvas element 
resizeCanvas();
var engine = new BABYLON.Engine(canvas, true); // Generate the BABYLON 3D engine
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


var createScene = function () { // Create the scene, populate initial objects
        // Create the scene space
        var scene = new BABYLON.Scene(engine);
        // Add a camera to the scene and attach it to the canvas
        var camera = new BABYLON.ArcRotateCamera("Camera", Math.PI / 2, Math.PI / 2, 2, new BABYLON.Vector3(0,0,0), scene);
        camera.attachControl(canvas, true);
        // Add lights to the scene
        var light1 = new BABYLON.HemisphericLight("light1", new BABYLON.Vector3(1, 1, 0), scene);
        var light2 = new BABYLON.PointLight("light2", new BABYLON.Vector3(0, 1, -1), scene);
        // Add and manipulate meshes in the scene
        var sphere = BABYLON.MeshBuilder.CreateSphere("sphere", {diameter:2}, scene);
        return scene;
};

function resizeCanvas(){ //runs when the window size changes, hopefully.
        canvas.height = window.innerHeight - 20;
        canvas.width = (window.innerWidth/2)-20;
        return;
}

//end of babylon init stuff

main(); // I hate javascript... what if I just pretended I wasn't using it.

function main(){
        addHull(-1);
}

function addHull(hRoot){
        let hull{ // base objects of any craft.
                root    :hRoot; //Hulls index of parent hull. If negative, offsets are taken as absolute
                offset  :[0,0,0]; //XYZ right-left,up-down,forward-back, offset from parent
                scale   :[1,1,5]; //width/hieght/length. Not inherited by hulls, situationally inherited by others
                bias    :[0,0,0]; //XYZ generation bulge bias
                cStruts :[]; //array of index values for child struts
                cHulls  :[]; //array of index values for child hulls
                wings   :[]; //array of wing objects owned by this
                details :[]; //array of detail objects owned by this
                cMenu   :null; //child settings pane menu, if any
                style   :0; //style selector. This is fed to the generator
        
                validRoot:function(){ //returns boolean of whether root points to a proper parent
                        if (this.root>=0 && this.root<hulls.length){return true;}
                        return false;
                };
                
                position:function(){ //returns 3 item array of xyz positions.
                        if (!this.validRoot()){return this.offsets;}
                        let rootPos = hulls[this.root].position();
                        let out = [];
                        let i;
                        for (i = 0; i < 3; i++) {
                                out[i]=rootPos[i]+this.offset[i];
                        }
                        return out;
                };
                
                addWing :function(){
                        let wing{ //large, forward-aligned details.
                                root    :-1 //index of parent hull
                                //TODO
                        } 
                }
                
                addDetail:function(){
                        let detail{
                                root    :-1 //index of parent hull or strut
                                boolType:-1 //0=join, 1=cut, 2=both
                                //TODO
                        }       
                }
                
        //TODO
        }
        renderHullsPane();
}

function addStrut(){
        if (hulls.length < 2){return;}
        
        let strut{ //large, forward aligned connectors between hulls
                roots   :[-1,-1]; //indexes of parent hulls. required to generate, changeable in details panel.
                scale   :[1,1]; //y-z scale. X is set by hulls distance
                bias    :[0,0,0]; //xyz bias of curve
                details :[];
                style   :0;
        }
        //TODO
}

function renderHullsPane{
        hullsOut.innerHTML = "begin here";
}
        



