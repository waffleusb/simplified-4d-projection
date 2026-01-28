//imports 3js and pointerlock 3js addon for cam rotation
import * as THREE from 'three';
import { PointerLockControls } from 'three/addons/controls/PointerLockControls.js';
//import { float } from 'three/tsl';

//all the points in a unit hypercube
var hypercube_verts = [
  [0,0,0,0], [1,0,0,0],
  [0,0,0,1], [1,0,0,1],
  [0,0,1,0], [1,0,1,0],
  [0,0,1,1], [1,0,1,1],
  [0,1,0,0], [1,1,0,0],
  [0,1,0,1], [1,1,0,1],
  [0,1,1,0], [1,1,1,0],
  [0,1,1,1], [1,1,1,1]
];

//check if an array contains a specific array
function isArrayInArray(haystack, needle) {
  return haystack.some(currentArray => {
    //check if the lengths are the same first
    if (currentArray.length === needle.length) {
      //then check if every element in the current array matches
      return currentArray.every((value, index) => value === needle[index]);
    }
    return false;
  });
}

//code to generate hypercube edge array, gonna re-use this for
//a function later prob.
var hypercube_edges = [];
hypercube_verts.forEach(function(currentElementA, indexA) {
    hypercube_verts.forEach(function(currentElementB, indexB) {
    
    var distance = Math.sqrt(((currentElementA[0]-currentElementB[0]) ** 2)+((currentElementA[1]-currentElementB[1]) ** 2)+((currentElementA[2]-currentElementB[2]) ** 2)+((currentElementA[3]-currentElementB[3]) ** 2));

    var edge = [hypercube_verts.indexOf(currentElementA),hypercube_verts.indexOf(currentElementB)]
    var edge_reverse = [hypercube_verts.indexOf(currentElementB),hypercube_verts.indexOf(currentElementA)]

    if (distance == 1 && !isArrayInArray(hypercube_edges, edge_reverse)) {
      hypercube_edges.push(edge)
    } 
      
    });
});

//REMOVE THIS
console.log(hypercube_edges);


///////START 4D OBJECTS///////
var fourObs = [];

class fourOb {
  constructor(name, verts, edges, firstVerts) {
    this.rotationAnimation = this.rotationAnimation.bind(this)
    this.name = name;
    this.verts = verts;
    this.edges = edges;

    this.firstVerts = firstVerts;
    console.log(firstVerts);

    //transformed version
    

    fourObs.push(this);
  }
   rotationAnimation(t, a, b, c, d, s) {
    var verts2 = [];
    var firstVerts2 = this.firstVerts;
   (this.verts).forEach(function(curElementB, indexB) {
    var curFirstElementB = firstVerts2[indexB];
    //var x = 20+s*((Math.cos((a*t)+b))+(Math.sin((a*t)+b)));
    //var y = 20+s*(((-1)*(Math.sin((a*t)+b)))+(Math.cos((a*t)+b)));
    //var z = 20+s*(Math.cos(((c*t)+d))+Math.sin(((c*t)+d)));
    //var w = 20+s*(((-1)*Math.cos(((c*t)+d)))+Math.sin(((c*t)+d)));

    var x = s*curFirstElementB[0]+(curFirstElementB[0]*Math.sin(t+a));
    var y = s*curFirstElementB[1]+(curFirstElementB[1]*Math.sin(t+b));
    var z = s*curFirstElementB[3]+(curFirstElementB[2]*Math.sin(t+c));
    var w = (s*curFirstElementB[3]+(curFirstElementB[3]*Math.sin(t+d)));
    
    
  
    verts2.push([x,y,z,w]);
   });
   this.verts = verts2;
  }
}

//tesseract
const aTesseract = new fourOb("aTesseract",hypercube_verts, hypercube_edges,hypercube_verts);
console.log(fourObs)
///////END 4D OBJECTS///////

/////// START VECTORS (REMOVE ALL THIS?)///////
class Vector4D {
  constructor(x, y, z, w) {
    this.x = x || 0;
    this.y = y || 0;
    this.z = z || 0;
    this.w = w || 0;
  }

  // Example function: Calculate the magnitude (length)
  magnitude() {
    return Math.sqrt(this.x * this.x + this.y * this.y + this.z * this.z + this.w * this.w);
  }

  add(v) {
    this.x += v.x;
    this.y += v.y;
    this.z += v.z;
    this.w += v.w;
    return this;
  }
  sub(v) {
    this.x -= v.x;
    this.y -= v.y;
    this.z -= v.z;
    this.w -= v.w;
    return this;
  }

  // Example function: Dot product
  dot(v) {
    return this.x * v.x + this.y * v.y + this.z * v.z + this.w * v.w;
  }

  // Example function: Return a string representation
  toString() {
    return `{x: ${this.x}, y: ${this.y}, z: ${this.z}, w: ${this.w}}`;
  }
}

// Example Usage:
const vec1 = new Vector4D(1, 2, 3, 4);
const vec2 = new Vector4D(5, 6, 7, 8)

console.log(vec1.dot(vec2))

/////// END VECTORS ///////

////////START PROJECTION////////
//distance of a light in 4d space casting a 3d shadow
var lightDis = 2;

var threeObs = [];

class threeOb {
  constructor(name, verts, edges) {
    this.name = name;
    this.verts = verts;
    this.edges = edges;

    threeObs.push(this);
  }
}
//0:x 1:y 2:z 3:w
function project() {
  threeObs = [];
fourObs.forEach(function(cur4Ob, indexA) { 

  var threeVerts = [];

  //console.log("verts are"+cur4Ob.tranVerts);

  (cur4Ob.verts).forEach(function(curVert, indexA) { 
    var threeVert = [curVert[0]/(lightDis-curVert[3]), curVert[1]/(lightDis-curVert[3]), curVert[2]/(lightDis-curVert[3])]
    threeVerts.push(threeVert);
  });

  new threeOb(cur4Ob.name, threeVerts, cur4Ob.edges);
});
}




////////END PROJECTION////////

//////////////////START SCENE CREATION//////////////////
const scene = new THREE.Scene();

//////camera//////
//GAME WINDOW THING 1
const camera = new THREE.PerspectiveCamera( 75, window.innerWidth / window.innerHeight, 0.1, 1000 );
camera.position.z = 5;

//cam controls
const camControls = new PointerLockControls( camera, document.body );

//add cam lock event listener
document.body.addEventListener( 'click', function () {
    //lock mouse on screen
    camControls.lock();
}, false );

//renderer setup 
const renderer = new THREE.WebGLRenderer();
//GAME WINDOW THING 2
renderer.setSize( window.innerWidth, window.innerHeight );
//renderer.setAnimationLoop( animate ); idk what this is usefull for but it stays
document.body.appendChild( renderer.domElement );

//test cube
var geometry = new THREE.BoxGeometry( 1, 1, 1 );
var material = new THREE.MeshBasicMaterial( { color: 0x00ff00 } );
var cube = new THREE.Mesh( geometry, material );
cube.position.set(10, 0, 0);
scene.add( cube );



//////ADDING PROJECTION/




//////////////////END SCENE CREATION//////////////////


/////START CAM CONTROLS///////
const speedFactor = 0.07;

const direction = new THREE.Vector3();
var direction2 = new THREE.Vector3();

const upVector = new THREE.Vector3(0, 1, 0);
const leftVector = new THREE.Vector3();

document.addEventListener('keydown', (event) => {
  switch (event.key) {
    case 'w':
      camera.getWorldDirection(direction);
      camera.position.add(direction.multiplyScalar(speedFactor));
      

      break;
    case 'a':   
    camera.getWorldDirection(direction);
    direction2 = direction.clone();
    direction2.y = 0;
  
     
      leftVector.crossVectors(upVector, direction2); // Cross product of up and forward gives left
      leftVector.normalize(); // Ensure it's a unit vector
      camera.position.add(leftVector.multiplyScalar(speedFactor));
      
      break;
    case 's':

      camera.getWorldDirection(direction);
      camera.position.add(direction.multiplyScalar(-speedFactor));
      break;
    case 'd':
       camera.getWorldDirection(direction);
    direction2 = direction.clone();
    direction2.y = 0;
  
     
      leftVector.crossVectors(upVector, direction2); // Cross product of up and forward gives left
      leftVector.normalize(); // Ensure it's a unit vector
      camera.position.add(leftVector.multiplyScalar(-speedFactor));
    
      break;
    case ' ':
      console.log("space");
      break;
  }
});
/////END CAM CONTROLS///////


/////////////////GAMELOOP/////////////////
 var lines = [];
var loopInterval = 10;
var time = 0.0;

setInterval(function() {
  time += 0.005;

  //apply 4d animation
  fourObs.forEach(function(cur4Ob, cur4ObIndex) {
    cur4Ob.rotationAnimation(time, 493,10,1,1.6,0.5);

  });
  project();

  // Code to be executed repeatedly

 //camera.position.z = 2;
 
 //TODO fix this horrible formating
 //WIREFRAME DRAWING
 //TODO see if this really draws the edges right as lines
lines.forEach(function(cur, curIndex) {
   scene.remove(lines[curIndex]);
});
lines=[];
 
const lineMaterial = new THREE.LineBasicMaterial( { color: 0x0000ff } );
threeObs.forEach(function(cur3Ob, cur3ObIndex) {
  
  (cur3Ob.edges).forEach(function(cur3edge, cur3VertIndex) {

    var points = [];
    var probe1 = cur3Ob.edges;
    var probe2 = cur3Ob.verts[cur3edge[0]];
    
    points.push( new THREE.Vector3( cur3Ob.verts[cur3edge[0]][0], cur3Ob.verts[cur3edge[0]][1], cur3Ob.verts[cur3edge[0]][2] ) );
    points.push( new THREE.Vector3( cur3Ob.verts[cur3edge[1]][0], cur3Ob.verts[cur3edge[1]][1], cur3Ob.verts[cur3edge[1]][2] ) );
    console.log(new THREE.Vector3( cur3Ob.verts[cur3edge[0]][0], cur3Ob.verts[cur3edge[0]][1], cur3Ob.verts[cur3edge[0]][2] ) );

    lines.push(null);
  var geometry = new THREE.BufferGeometry().setFromPoints( points );
  lines[lines.length-1] = new THREE.Line( geometry, material );
  scene.add( lines[lines.length-1] );
  });
  
  
  
});
  console.log(lines)

  renderer.render( scene, camera );

}, loopInterval)

