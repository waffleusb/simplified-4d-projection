//imports 3js and pointerlock 3js addon for cam rotation
import * as THREE from 'three';
import { PointerLockControls } from 'three/addons/controls/PointerLockControls.js';


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
const geometry = new THREE.BoxGeometry( 1, 1, 1 );
const material = new THREE.MeshBasicMaterial( { color: 0x00ff00 } );
const cube = new THREE.Mesh( geometry, material );
scene.add( cube );
//////////////////END SCENE CREATION//////////////////


//CAM CONTROLS
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

/////////////////GAMELOOP/////////////////
var loopInterval = 10;

setInterval(function() {
  // Code to be executed repeatedly

 //camera.position.z = 2;
  

  renderer.render( scene, camera );

}, loopInterval)

