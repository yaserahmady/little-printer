import './style.css'
import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import * as dat from 'dat.gui'
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader'
import { gsap, Elastic, Power4, Linear } from 'gsap'
import anime from 'animejs/lib/anime.es.js'

var alphaOne = 1.0
var alphaTwo = 0.2
const loader = new THREE.TextureLoader()

// Canvas
const canvas = document.querySelector('.webgl')

// debug ui
const gui = new dat.GUI({ closed: true })
dat.GUI.toggleHide()

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

/* Models */
const gltfLoader = new GLTFLoader()

let tl = gsap.timeline()

gltfLoader.load('/assets/little_printer/scene.gltf', (gltf) => {
  const model = gltf.scene.children[0]
  const paper =
    model.children[0].children[0].children[0].children[0].children[1]

  // paper = modelSiblings.find((el) => el.name === 'Paper')
  model.scale.set(0.75, 0.75, 0.75)
  model.position.y = -1.4
  scene.add(model)

  const shadowMesh = new THREE.CircleGeometry(3, 128)

  const shadowMaterial = new THREE.MeshBasicMaterial({
    map: loader.load('assets/little_printer/shadow.png'),
    depthWrite: false
  })
  shadowMaterial.transparent = true
  const shadow = new THREE.Mesh(shadowMesh, shadowMaterial)
  shadow.position.y = -1.5
  shadow.rotation.x = -1.6
  scene.add(shadow)

  model.castShadow = true
  model.receiveShadow = true

  gui.add(gradientParams, 'position').min(0.0).max(1.0).step(0.001)
  gui.add(model.position, 'x').min(-20).max(20).step(0.001).name('X Cam')
  gui.add(camera.rotation, 'y').min(-20).max(20).step(0.001).name('Y Cam')
  gui.add(camera.rotation, 'z').min(-20).max(20).step(0.001).name('Z Cam')
  gui.add(camera.position, 'x').min(-20).max(20).step(0.001).name('X Cam')
  gui.add(camera.position, 'y').min(-20).max(20).step(0.001).name('Y Cam')
  gui.add(camera.position, 'z').min(-20).max(20).step(0.001).name('Z Cam')

  tl.from(model.rotation, {
    x: model.rotation.x,
    y: model.rotation.y,
    z: -2,
    duration: 3,
    ease: Elastic.easeOut.config(1, 0.5)
  })
    .from(
      model.position,
      {
        x: 10,
        y: model.position.y,
        z: model.position.z,
        duration: 3,
        ease: Elastic.easeOut.config(1, 0.4)
      },
      '<'
    )
    .to(
      camera.position,
      {
        y: 0.7,
        z: 5.4,
        duration: 1.4,
        ease: Elastic.easeOut.config(1, 0.4)
      },
      '-=1.3'
    )
    .to(
      model.position,
      {
        x: 0.1,
        y: model.position.y,
        z: model.position.z,
        duration: 1.4,
        ease: Elastic.easeOut.config(1, 0.4)
      },
      '<'
    )
    .to(
      camera.position,
      {
        x: 0.29,
        y: 2.5,
        z: 8.9,
        duration: 1.4,
        ease: Power4.easeOut
      },
      '<'
    )
    .to(
      model.scale,
      {
        x: 2,
        y: 2,
        z: 2,
        duration: 1.5,
        ease: Power4.easeInOut
      },
      '-=1'
    )
    .to(gradientParams, { position: 0, duration: 2, ease: 'expo.in' }, '-=1')
    .to(
      model.position,
      {
        x: 0.1,
        y: 8.3,
        z: model.position.z,
        duration: 3,
        ease: Elastic.easeIn.config(0.6, 1)
      },
      '<'
    )
    .to(
      shadowMaterial,
      {
        opacity: 0,
        duration: 3,
        ease: Elastic.easeIn.config(0.6, 1)
      },
      '<'
    )
    .to(
      'main',
      {
        y: -sizes.height,
        duration: 3,
        ease: Elastic.easeIn.config(0.6, 1)
      },
      '<'
    )
    .to(paper.scale, { y: 4, duration: 1.3, ease: Linear.easeNone })

  let whiteButtonMaterial = new THREE.MeshToonMaterial({
    color: 0xffffff
  })
  let legMaterial = new THREE.MeshToonMaterial({
    color: 0xfd591a
  })

  let plateMaterial = new THREE.MeshToonMaterial({
    color: 0x97a0a8
  })

  model.traverse((o) => {
    if (o.name == 'Receipt_Mask_0') {
      o.material = paperMaterial
    } else if (o.name == 'Plate_Plate_0') {
      o.material = plateMaterial
    } else if (o.name == 'Body_White_Plastic_0') {
      o.material = whiteButtonMaterial
    } else if (
      ['Leg_Orange_Plastic_0', 'Leg_2_Orange_Plastic_0'].indexOf(o.name) >= 0
    ) {
      o.material = legMaterial
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
const ambientLight = new THREE.AmbientLight(0xffffff, 0.75)
scene.add(ambientLight)

const pointLight = new THREE.PointLight(0xffffff, 0.5)
pointLight.position.x = 4
pointLight.position.y = 5
pointLight.position.z = 8
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
  // update the camera
  camera.left = sizes.width / -2
  camera.right = sizes.width / 2
  camera.top = sizes.height / 2
  camera.bottom = sizes.height / -2
  camera.updateProjectionMatrix()

  //update renderer
  renderer.setSize(sizes.width, sizes.height)
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
})

// Camera
const camera = new THREE.OrthographicCamera(
  sizes.width / -2,
  sizes.width / 2,
  sizes.height / 2,
  sizes.height / -2,
  0.5,
  500
)

camera.zoom = 100.0
camera.position.set(1.59, 3.3, 5.4)
camera.updateProjectionMatrix()

scene.add(camera)
const renderer = new THREE.WebGLRenderer({
  canvas
})

// Controls
const controls = new OrbitControls(camera, canvas)
controls.enableDamping = true
controls.enabled = false

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
