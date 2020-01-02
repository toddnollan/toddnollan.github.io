const scriptVersion = "Script v.023"; //declare version, write to main
document.getElementById("versionlabel").innerHTML = scriptVersion;
//Declare Variables and constants
const hullspane = document.getElementById("hullspane");
const settingspane = document.getElementById("settingspane");
let hulls = [];
let struts = [];


//end declare
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




function resizeCanvas(){ //runs when the window size changes, hopefully.
        canvas.height = window.innerHeight - 20;
        canvas.width = (window.innerWidth/2)-20;
        return;
}

//end of babylon init stuff

main(); // shhh

function main(){
        addHull(-1);
}

function addHull(hRoot){
        let hull={ // base objects of any craft.
                root    :hRoot, //Hulls index of parent hull. If negative, offsets are taken as absolute
                offset  :[0,0,0], //XYZ right-left,up-down,forward-back, offset from parent
                scale   :[1,1,5], //width/hieght/length. Not inherited by hulls, situationally inherited by others
                bias    :[0,0,0], //XYZ generation bulge bias
                wings   :[], //array of wing objects owned by this
                details :[], //array of detail objects owned by this
                style   :0, //style selector. This is fed to the generator
        
                validRoot:function(){ //returns boolean of whether root points to a proper parent
                        if (this.root>=0 && this.root<hulls.length){return true;}
                        return false;
                },
                
                position:function(){ //returns 3 item array of xyz positions.
                        if (!this.validRoot()){return this.offsets;}
                        let rootPos = hulls[this.root].position();
                        let out = [];
                        let i;
                        for (i = 0; i < 3; i++) {
                                out[i]=rootPos[i]+this.offset[i];
                        }
                        return out;
                },
                
                addWing :function(){
                        let wing={ //large, forward-aligned details.
                                //TODO
                                this.wings.push(wing);
                        } 
                },
                
                addDetail:function(){
                        let detail={
                                boolType:-1 //0=join, 1=cut, 2=both
                                //TODO
                                this.details.push(detail);
                        }       
                }
                
        //TODO
        }
        hulls.push(hull);
        renderHullsPane();
}

function addStrut(){
        if (hulls.length < 2){return;}
        
        let strut={ //large, forward aligned connectors between hulls
                roots   :[-1,-1], //indexes of parent hulls. required to generate, changeable in details panel.
                scale   :[1,1], //y-z scale. X is set by hulls distance
                bias    :[0,0,0], //xyz bias of curve
                details :[],
                style   :0
        }
        //TODO
        struts.push(strut);
        renderHullsPane();
}

function renderHullsPane(){
        //clear pane
        let child = hullspane.lastElementChild;  
        while (child) { 
            hullspane.removeChild(child); 
            child = hullspane.lastElementChild; 
        } 
        
        let newli;
        let i;
        //Add Hulls title
        newli = document.createElement("li");
        addButton(newli,"+","Add Hull","addHull(-1)");
        newli.append(" Hulls: " + hulls.length.toString());
        hullspane.appendChild(newli);
        //Add Hulls
        for (i = 0; i < hulls.length; i++) {
                newli = document.createElement("li");
                addButton(newli,"-","Remove Hull","removeHull("+i.toString()+")");
                newli.append(" Hull "+i.toString()+" ");
                addButton(newli,"→","Expand to Options Pane","expandHull("+i.toString()+")");
                hullspane.appendChild(newli);
        }
        //Add Struts title
        newli = document.createElement("li");
        addButton(newli,"+","Add Strut","addStrut(-1)");
        newli.append(" Struts: " + struts.length.toString());
        hullspane.appendChild(newli);
        //Add Struts
        for (i = 0; i < struts.length; i++) {
                newli = document.createElement("li");
                addButton(newli,"-","Remove Strut","removeStrut("+i.toString()+")");
                newli.append(" Strut "+i.toString()+" ");
                addButton(newli,"→","Expand to Options Pane","expandStrut("+i.toString()+")");
                hullspane.appendChild(newli);
        }
}
function addButton(element, text, mouseover, funct){//Adds a button w/ arguments to the passed element
        let newbutton = document.createElement("button");
        newbutton.innerHTML = text;
        newbutton.title = mouseover;
        newbutton.setAttribute("onClick",funct);
        element.appendChild(newbutton);
}

function removeHull(index){
        hulls.splice(index,1);
        let i;
        for (i=0; i<hulls.length; i++){
                if(hulls[i].root == index){
                     hulls[i].root = -1;   
                } else if (hulls[i].root > index) {
                        hulls[i].root--;
                }
        }
        for (i=0; i<struts.length; i++){
                if(struts[i].roots[0] == index){
                     struts[i].roots[0] = -1;   
                } else if (struts[i].roots[0] > index) {
                        struts[i].roots[0]--;
                }
                if(struts[i].roots[1] == index){
                     struts[i].roots[1] = -1;   
                } else if (struts[i].roots[1] > index) {
                        struts[i].roots[1]--;
                }
        }
        renderHullsPane();
}

function removeStrut(index){
        struts.splice(index,1);
        renderHullsPane();
}

function expandHull(index){//expands a hull's options to the settings pane
        
}

function expandStrut(index){//expands a strut's options to the settings pane
        
}


