import './style.css'
import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import * as dat from 'dat.gui'
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader'
import { gsap, Bounce, Linear, Power4 } from 'gsap'
import anime from 'animejs/lib/anime.es.js'

var alphaOne = 1.0
var alphaTwo = 0.2
// Canvas
const canvas = document.querySelector('.webgl')

// debug ui
const gui = new dat.GUI({ closed: true })

//scene
const scene = new THREE.Scene()

// const OrbitControls = THREE.OrbitControls;
// Texture
const textureLoader = new THREE.TextureLoader()

let gradientParams = {
  position: 1.0
}
const drawingCanvas = document.getElementById('drawing-canvas')
drawingCanvas.style.display = 'none'
const drawingContext = drawingCanvas.getContext('2d')
let paperMaterial = new THREE.MeshBasicMaterial()
paperMaterial.alphaMap = new THREE.CanvasTexture(drawingCanvas)
paperMaterial.transparent = true
updateGrad(gradientParams.position)
// Fonts
const fontLoader = new THREE.FontLoader()

/*  Models */
const gltfLoader = new GLTFLoader()

let tl = gsap.timeline({ defaults: { duration: 3, ease: Bounce.easeOut } })

gltfLoader.load('assets/little_printer/scene.gltf', (gltf) => {
  const model = gltf.scene.children[0]
  const paper =
    model.children[0].children[0].children[0].children[0].children[1]

  // paper = modelSiblings.find((el) => el.name === 'Paper')
  model.scale.set(0.75, 0.75, 0.75)
  scene.add(model)

  model.castShadow = true
  model.receiveShadow = true

  gui.add(gradientParams, 'position').min(0.0).max(1.0).step(0.001)
  gui.add(camera.rotation, 'x').min(-20).max(20).step(0.001).name('X Cam')
  gui.add(camera.rotation, 'y').min(-20).max(20).step(0.001).name('Y Cam')
  gui.add(camera.rotation, 'z').min(-20).max(20).step(0.001).name('Z Cam')
  gui.add(camera.position, 'x').min(-20).max(20).step(0.001).name('X Cam')
  gui.add(camera.position, 'y').min(-20).max(20).step(0.001).name('Y Cam')
  gui.add(camera.position, 'z').min(-20).max(20).step(0.001).name('Z Cam')

  tl.from(model.position, {
    x: 14,
    y: -0.13,
    z: -2.3
  })
    .to(camera.position, {
      x: 0.3,
      y: 0.7,
      z: 5.4,
      duration: 1.4,
      ease: Power4.easeIn
    })
    .to(gradientParams, { position: 0, duration: 5, ease: Linear.easeNone })

  model.traverse((o) => {
    if (o.name == 'Receipt_Mask_0') {
      o.material = paperMaterial
    }
  })
})

function updateGrad(position) {
  const grad = drawingContext.createLinearGradient(0, 180, 0, 0)
  grad.addColorStop(position, 'black')
  grad.addColorStop(position, 'white')
  drawingContext.fillStyle = grad
  drawingContext.fillRect(0, 0, 128, 128)
  paperMaterial.alphaMap.needsUpdate = true
}
// Cursor
const cursor = {
  x: 0,
  y: 0
}
window.addEventListener('mousemove', (evt) => {
  cursor.x = evt.clientX / sizes.width - 0.5
  cursor.y = -(evt.clientY / sizes.height - 0.5)
})

/* Lights */
const ambientLight = new THREE.AmbientLight(0xffffff, 0.5)
scene.add(ambientLight)

const pointLight = new THREE.PointLight(0xffffff, 0.5)
pointLight.position.x = 2
pointLight.position.y = 3
pointLight.position.z = 4
scene.add(pointLight)
pointLight.castShadow = true

// sizes
const sizes = {
  width: window.innerWidth,
  height: window.innerHeight
}
window.addEventListener('resize', () => {
  sizes.width = window.innerWidth
  sizes.height = window.innerHeight
  camera.aspect = sizes.width / sizes.height
  //when changing properties like aspect, we need to call camera.updateProjectionMatrix()
  camera.updateProjectionMatrix()
  //update renderer
  renderer.setSize(sizes.width, sizes.height)
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
})

// Camera
const camera = new THREE.PerspectiveCamera(
  75,
  sizes.width / sizes.height,
  0.1,
  100
)

camera.position.set(1.59, 3.3, 5.4)
scene.add(camera)
const renderer = new THREE.WebGLRenderer({
  canvas
})

// Controls
const controls = new OrbitControls(camera, canvas)
controls.enableDamping = true

renderer.setSize(sizes.width, sizes.height)
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))

scene.background = new THREE.Color(0xd7efff)

const clock = new THREE.Clock()

const tick = () => {
  const elapsedTime = clock.getElapsedTime()

  controls.update()
  // Render
  updateGrad(gradientParams.position)
  renderer.render(scene, camera)
  window.requestAnimationFrame(tick)
}

tick()
