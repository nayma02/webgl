import './style.css'
import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import * as dat from 'lil-gui'
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js'
import { DRACOLoader } from 'three/examples/jsm/loaders/DRACOLoader.js'
import vertex from "./shaders/vertex.glsl"
import fragment from "./shaders/fragment.glsl"

/**
 * Base
 */
// Debug
const gui = new dat.GUI()
const debugObject = {
    uProgress: 0
}

// Canvas
const canvas = document.querySelector('canvas.webgl')

// Scene
const scene = new THREE.Scene()

/**
 * Models
 */
const dracoLoader = new DRACOLoader()
dracoLoader.setDecoderPath('/draco/')

const gltfLoader = new GLTFLoader()
gltfLoader.setDRACOLoader(dracoLoader)

let mixer = null

// gltfLoader.load(
//     '/Fox.gltf',
//     (gltf) =>
//     {
//         gltf.scene.scale.set(0.025, 0.025, 0.025)
//         scene.add(gltf.scene)
//     }
// )

/**
 * Geometry
 */
const geometry = new THREE.IcosahedronGeometry(1, 3)
const material = new THREE.ShaderMaterial({
    vertexShader: vertex,
    fragmentShader: fragment,
    uniforms: {
        uTime: {value: 0},
        uProgress: {value: 0}
    },
    wireframe: true
})
const plane = new THREE.Mesh(geometry, material)

// const floor = new THREE.Mesh(
//     new THREE.PlaneGeometry(3, 3, 100, 100),
//     new THREE.MeshStandardMaterial({color: 0xffffff, side: THREE.DoubleSide })
// )
// floor.rotation.x = -Math.PI * 0.5 ;
// floor.position.y = -1.8;
// scene.add(floor)
// TODO: 43.38
const len = geometry.attributes.position.count;
let randoms = new Float32Array(len*3);
for(let i = 0; i<len; i+=3) {
    const r = Math.random()
    randoms[i] = r
    randoms[i+1] = r
    randoms[i+2] = r
}
geometry.setAttribute('aRandom', new THREE.BufferAttribute(randoms, 1))
console.log(geometry)
scene.add(plane)

gui.add(debugObject, 'uProgress', 0, 1, 0.1).name('uProgress').onChange(val => {
    material.uniforms.uProgress.value = val;
    console.log(material.uniforms.uProgress.value)
})
/**
 * Lights
 */
const ambientLight = new THREE.AmbientLight(0xffffff, 0.8)
scene.add(ambientLight)

const directionalLight = new THREE.DirectionalLight(0xffffff, 0.6)
directionalLight.castShadow = true
directionalLight.shadow.mapSize.set(1024, 1024)
directionalLight.shadow.camera.far = 15
directionalLight.shadow.camera.left = - 7
directionalLight.shadow.camera.top = 7
directionalLight.shadow.camera.right = 7
directionalLight.shadow.camera.bottom = - 7
directionalLight.position.set(- 5, 5, 0)
scene.add(directionalLight)

// const axesHelper = new THREE.AxesHelper(5); // Size of the axes
// scene.add(axesHelper);

const spotLight = new THREE.SpotLight(0xffffff, 100);
spotLight.position.set(0.5, 4, -2);
spotLight.angle = Math.PI / 14;
spotLight.penumbra = 1;
spotLight.decay = 2;
spotLight.distance = 0;
spotLight.castShadow = true;
spotLight.shadow.mapSize.width = 2048;
spotLight.shadow.mapSize.height = 1024;
spotLight.shadow.camera.near = 1;
spotLight.shadow.camera.far = 10;
spotLight.shadow.focus = 1;
scene.add(spotLight);

// Add a SpotLightHelper
// const spotLightHelper = new THREE.SpotLightHelper(spotLight);
// scene.add(spotLightHelper);

// Update the helper in the render loop to ensure it reflects changes
/**
 * Sizes
 */
const sizes = {
    width: window.innerWidth,
    height: window.innerHeight
}

window.addEventListener('resize', () =>
{
    // Update sizes
    sizes.width = window.innerWidth
    sizes.height = window.innerHeight

    // Update camera
    camera.aspect = sizes.width / sizes.height
    camera.updateProjectionMatrix()

    // Update renderer
    renderer.setSize(sizes.width, sizes.height)
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
})

/**
 * Camera
 */
// Base camera
const camera = new THREE.PerspectiveCamera(75, sizes.width / sizes.height, 1, 1000)
camera.position.set(0, 0, 4)
scene.add(camera)

// Controls
const controls = new OrbitControls(camera, canvas)
controls.target.set(0, 0.75, 0)
controls.enableDamping = true

/**
 * Renderer
 */
const renderer = new THREE.WebGLRenderer({
    canvas: canvas
})
renderer.shadowMap.enabled = true
renderer.shadowMap.type = THREE.PCFSoftShadowMap
renderer.setSize(sizes.width, sizes.height)
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))

/**
 * Animate
 */
const clock = new THREE.Clock()

const tick = () =>
{
    const elapsedTime = clock.getElapsedTime()
    material.uniforms.uTime.value = elapsedTime

    // Update controls
    controls.update()

    // Render
    renderer.render(scene, camera)

    // Call tick again on the next frame
    window.requestAnimationFrame(tick)
}

tick()

// function animate() {
//     requestAnimationFrame(animate);
//
//     // Update the SpotLightHelper
//     spotLightHelper.update();
//
//     renderer.render(scene, camera);
// }
// animate();
