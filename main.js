const scriptVersion = "Script v.035"; //declare version, write to main
document.getElementById("versionlabel").innerHTML = scriptVersion;
//Declare Variables and constants
const countPane = document.getElementById("countpane");
const leftPane = document.getElementById("leftpane");
const hullStyles = ["Spheroid","Beveled Cuboid"];


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

addHull(); //just opening with *something*. Strictly speaking, is not needed.

function addHull(){
        let hull={ // base objects of any craft.
                root    :-1, //Hulls index of parent hull. If negative, offsets are taken as absolute
                name    :"unnamed", //displays in hulls list
                offset  :[0,0,0], //XYZ right-left,up-down,forward-back, offset from parent
                scale   :[1,1,5], //width/hieght/length. Not inherited by hulls, situationally inherited by others
                bias    :[0,0,0], //XYZ generation bulge bias
                wings   :[], //array of wing objects owned by this
                details :[], //array of detail objects owned by this
                style   :0, //style selector. This is fed to the generator
                posSearch       :false, //is searching for position value to prevent loops
                dropState	:[false,false,false], //state of drop-down menus in settings
        
                validRoot:function(){ //returns boolean of whether root points to a proper parent
                        if (this.root>=0 && this.root<hulls.length){return true;}
                        return false;
                },
                
                position:function(){ //returns 3 item array of xyz positions.
                        if (!this.validRoot()){return this.offsets;}
                        this.posSearch = true;
                        if (hulls[this.root].posSearch){
                                this.posSearch = false;
                                this.root = -1;
                                return this.offsets;
                        }
                        let rootPos = hulls[this.root].position();
                        let out = [];
                        let i;
                        for (i = 0; i < 3; i++) {
                                out[i]=rootPos[i]+this.offset[i];
                        }
                        this.posSearch = false;
                        return out;
                },
                
                addWing :function(){
                        let wing={ //large, forward-aligned details.
                                //TODO
                        } 
                        this.wings.push(wing);
                },
                
                addDetail:function(){
                        let detail={
                                type:0, //supercategory of style, will index to things like engines and blocky and such
                                style:0
                                //TODO
                        }     
                        this.details.push(detail);  
                }
              
        }
        hulls.push(hull);
        renderSettings();
}

function addStrut(){
        if (hulls.length < 2){return;}
        
        let strut={ //large, forward aligned connectors between hulls
                roots   :[-1,-1], //indexes of parent hulls. required to generate, changeable in details panel.
                name    :"unnamed", // displays in hulls list
                scale   :[1,1], //y-z scale. X is set by hulls distance
                pathBias        :[0,0,0], //xyz bias of curve
                thickBias       :[0,0,0], //xyz bias of thickness
                details :[],
                style   :0,
                dropState	:[false,false,false] //state of drop-down menus in settings
        }
        //TODO
        struts.push(strut);
        renderSettings();
}

function renderSettings(){//redraws all settings fields
        renderCountPane();
        //clear all (but first, which contains imporant things)
        let child = leftPane.children[1];
        while (child) { 
                leftPane.removeChild(child); 
                child = leftPane.children[1];
        }
        //create elements and call filler function
        let newDiv;
        let i;
        for (i=0;i<hulls.length;i++){
                newDiv = document.createElement("div");
                newDiv.style = "float:left; position:static; padding:3px;";
                renderHullSettings(newDiv, i);
                leftPane.appendChild(newDiv);
        }
        for (i=0;i<struts.length;i++){
                newDiv = document.createElement("div");
                newDiv.style = "float:left; position:static; padding:3px;";
                renderStrutSettings(newDiv, i);
                leftPane.appendChild(newDiv);
        }
}

function renderHullHandler(index){renderHullSettings(leftPane.children[index+1],index);}

function renderStrutHandler(index){renderStrutSettings(leftPane.children[index+1+hulls.length],index);}

function renderHullSettings(node, index){//fills the passed node with data from the given index
        let hullData = hulls[index];
        let nodeIndex = index+1;
        let newNode;
        let i;
        let child = node.children[0];
        while (child) {
                node.removeChild(child);
                child = node.children[0];
        }
        node.innerText = "";
        
        
        
        if (!hullData.dropState[0]){
                node.append(hullData.name + " ");
                addButton(node,"▼","Expand options","redrawButton("+nodeIndex.toString()+",0,true)");
                return;
        }
        //Name and collapse settings
        newNode = document.createElement("input");
        newNode.type = "text";
        newNode.value = hullData.name;
        newNode.setAttribute("onchange","changeHullSetting("+index.toString()+",0,this.value)");
        node.append(newNode);
        addButton(node,"◄","Collapse options","redrawButton("+nodeIndex.toString()+",0,false)");
        node.append(document.createElement("br"));
        
        //delete hull
        addButton(node,"Delete Hull","Removes this Hull.","removeHull("+index.toString()+")");
        node.append(document.createElement("br"));
        
        //parent
        node.append("Parent: ");
        newNode = [];
        newNode[0] = document.createElement("select");
        newNode[1] = document.createElement("option");
        newNode[1].value = -1;
        newNode[1].innerText = "None";
        newNode[0].append(newNode[1]);
        for (i = index + 1; i<hulls.length; i++){
                newNode[1] = document.createElement("option");
                newNode[1].value = i;
                newNode[1].innerText = hulls[i].name;
                newNode[0].append(newNode[1]);
        }
        newNode[0].title = "If a parent is set, position is inherited from it. If you don't know what this means, leave it at None";
        newNode[0].value = hullData.root.toString();
        newNode[0].setAttribute("onchange","changeHullSetting("+index.toString()+",1,this.value)");
        node.append(newNode[0]);
        node.append(document.createElement("br"));
        
        //style
        node.append("Style: ");
        newNode = [];
        newNode[0] = document.createElement("select");
        for (i = 0; i<hullStyles.length; i++){
                newNode[1] = document.createElement("option");
                newNode[1].value = i;
                newNode[1].innerText = hullStyles[i];
                newNode[0].append(newNode[1]);
        }
        newNode[0].setAttribute("onchange","changeHullSetting("+index.toString()+",2,this.value)");
        newNode[0].value = hullData.style.toString();
        node.append(newNode[0]);
        node.append(document.createElement("br"));
        
        //offset
        node.append("Position: ");
        for (i=0;i<3;i++){
                newNode = document.createElement("input");
                newNode.type = "number";
                newNode.style = "width:40px; background-color:#202020; border-color:#101010; color:#909090;";
                newNode.value = hullData.offset[i];
                newNode.setAttribute("onchange","changeHullSetting("+index.toString()+","+(3+i).toString()+",this.value)");
                node.append(newNode);
        }     
        node.append(document.createElement("br"));
        
        //scale
        node.append("Scale: ");
        for (i=0;i<3;i++){
                newNode = document.createElement("input");
                newNode.type = "number";
                newNode.style = "width:40px; background-color:#202020; border-color:#101010; color:#909090;";
                newNode.value = hullData.scale[i];
                newNode.setAttribute("onchange","changeHullSetting("+index.toString()+","+(6+i).toString()+",this.value)");
                node.append(newNode);
        }     
        node.append(document.createElement("br"));
        
        //bias
        node.append("Bias: ");
        for (i=0;i<3;i++){
                newNode = document.createElement("input");
                newNode.type = "number";
                newNode.style = "width:40px; background-color:#202020; border-color:#101010; color:#909090;";
                newNode.value = hullData.bias[i];
                newNode.setAttribute("onchange","changeHullSetting("+index.toString()+","+(9+i).toString()+",this.value)");
                node.append(newNode);
        }     
        node.append(document.createElement("br"));
        
        //wings
        node.append("Wings ");
        if (hullData.dropState[1]){
                addButton(node,"◄","Collapse options","redrawButton("+nodeIndex.toString()+",1,false)"); 
                
                //TODO: DRAW WINGS DATA
                
        } else {
                addButton(node,"▼","Expand options","redrawButton("+nodeIndex.toString()+",1,true)");
        }
        node.append(document.createElement("br"));
        
        //details
        node.append("Details ");
        if (hullData.dropState[2]){
                addButton(node,"◄","Collapse options","redrawButton("+nodeIndex.toString()+",2,false)"); 
                
                //TODO: DRAW DETAILS DATA
                
        } else {
                addButton(node,"▼","Expand options","redrawButton("+nodeIndex.toString()+",2,true)");
        }
        node.append(document.createElement("br"));
        
        
        
        
        
}

function renderStrutSettings(node, index){//fills the passed node with data from the given index
        
}

function renderCountPane(){
        let child = countPane.children[0];
        while (child) { 
                countPane.removeChild(child); 
                child = countPane.children[0];
        }
        
        let newDiv;
        //Add Hulls title
        newDiv = document.createElement("div");
        newDiv.style = "width:100; float:left";
        addButton(newDiv,"+","Add Hull","addHull(-1)");
        newDiv.append(" Hulls: " + hulls.length.toString());
        countPane.appendChild(newDiv);
        //Add Struts title
        newDiv = document.createElement("div");
        newDiv.style = "width:100; float:right";
        addButton(newDiv,"+","Add Strut","addStrut(-1)");
        newDiv.append(" Struts: " + struts.length.toString());
        countPane.appendChild(newDiv);
}

function addButton(element, text, mouseover, funct){//Adds a button w/ arguments to the passed element
        let newbutton = document.createElement("button");
        newbutton.innerHTML = text;
        newbutton.title = mouseover;
        newbutton.setAttribute("onClick",funct);
        element.appendChild(newbutton);
}

function removeHull(index){
        let i;
        for (i=0; i<hulls.length; i++){
                if(hulls[i].root == index){
                        hulls[i].offset = hulls[i].position();
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
        hulls.splice(index,1);
        renderSettings();
}

function removeStrut(index){
        struts.splice(index,1);
        renderSettings();
}

function redrawButton(nodeIndex,setting,state){//handles settings buttons that cause a settings panel redraw
        //inputs are index of source node, index of dropstate value, state to set
        if (nodeIndex>hulls.length){
                let i = nodeIndex-(1+hulls.length);
                struts[i].dropState[setting] = state;
                renderStrutSettings(leftPane.children[nodeIndex],i);
                return;
        }
        let i = nodeIndex-1;
        hulls[i].dropState[setting] = state;
        renderHullSettings(leftPane.children[nodeIndex],i);
}

function changeHullSetting(index, uSetting, state){ //handles normal setting changes for hulls
        //inputs are hulls index of target, setting case index (kludgy AF) and setting state (generally int or string)
        
        console.log(index.toString() + " " + uSetting.toString() + " " + state.toString());
        
        let setting = parseInt(uSetting);
        
        let parsed = 0;
        switch(setting) {
                case 0:
                break;
                case 1:
                        parsed = parseInt(index);
                break;
                case 2:
                        parsed = parseInt(index);
                break;
                default:
                        parsed = parseFloat(index);
        }
        if (parsed == NaN){return;}
        
        switch(setting) {
                case 0:
                        hulls[index].name = state;
                break;
                case 1:
                        hulls[index].root = parsed;
                break;
                case 2:
                        hulls[index].style = parsed;
                break;
                case 3:
                        hulls[index].offset[0] = parsed;
                break;
                case 4:
                        hulls[index].offset[1] = parsed;
                break;
                case 5:
                        hulls[index].offset[2] = parsed;
                break;
                case 6:
                        hulls[index].scale[0] = parsed;
                break;
                case 7:
                        hulls[index].scale[1] = parsed;
                break;
                case 8:
                        hulls[index].scale[2] = parsed;
                break;
                case 9:
                        hulls[index].bias[0] = parsed;
                break;
                case 10:
                        hulls[index].bias[1] = parsed;
                break;
                case 11:
                        hulls[index].bias[2] = parsed;
                break;
                default:
                        return;
        }
        console.log(hulls[index].bias[2].toString() + "," + parsed.toString());
}
function changeStrutSetting (){
        
}














