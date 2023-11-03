import {
  Camera,
  Clock,
  MathUtils,
  Mesh,
  MeshNormalMaterial,
  PlaneGeometry,
  Raycaster,
  Scene,
  Vector2,
  Vector3
} from 'three'
import { RoundedBoxGeometry } from 'three/examples/jsm/geometries/RoundedBoxGeometry'

import AIController from './ai-controller'
import Ball from './ball'
import Paddle from './paddle'

export default class GameSceneCreator {
  private scene: Scene
  private camera: Camera
  private bodundaries = new Vector2(20, 20)
  private clock = new Clock()
  private plane!: Mesh
  private ball!: Ball
  private playerPaddle!: Paddle
  private pcPaddle!: Paddle
  private cursor = new Vector2(0, 0)
  private raycaster = new Raycaster()
  private aiController!: AIController

  constructor(scene: Scene, camera: Camera) {
    this.scene = scene
    this.camera = camera
  }

  public init() {
    this.createPlaneScene()
    this.createBall()
    this.createWall()
    this.aiController = new AIController(this.pcPaddle, this.ball)
    this.tic()

    window.addEventListener('mousemove', (e: MouseEvent) => {
      this.cursor.x = 2 * (e.clientX / window.innerWidth) - 1
      this.cursor.y = -2 * (e.clientY / window.innerHeight) + 1
    })
  }

  private createPlaneScene() {
    const bodundaries = this.bodundaries
    const planeGeometry = new PlaneGeometry(
      bodundaries.x * 20,
      bodundaries.y * 20,
      bodundaries.x * 20,
      bodundaries.y * 20
    )
    planeGeometry.rotateX(-Math.PI / 2)
    const planeMaterial = new MeshNormalMaterial({
      wireframe: true,
      transparent: true,
      opacity: 0.2
    })

    this.plane = new Mesh(planeGeometry, planeMaterial)
    this.scene.add(this.plane)
  }

  private createBall() {
    this.playerPaddle = new Paddle(
      this.scene,
      this.bodundaries,
      new Vector3(0, 0, 15)
    )
    this.pcPaddle = new Paddle(
      this.scene,
      this.bodundaries,
      new Vector3(0, 0, -15)
    )
    this.ball = new Ball(this.scene, this.bodundaries, [
      this.playerPaddle,
      this.pcPaddle
    ])
  }

  private createWall() {
    const boundGeometry = new RoundedBoxGeometry(
      1,
      2,
      this.bodundaries.y * 2,
      5,
      5
    )
    const boundMaterial = new MeshNormalMaterial()
    const leftBound = new Mesh(boundGeometry, boundMaterial)
    leftBound.position.x = -this.bodundaries.x - 0.5
    const rightBound = leftBound.clone()
    rightBound.position.x *= -1

    this.scene.add(leftBound, rightBound)
  }

  private tic() {
    const deltaTime = this.clock.getDelta()

    this.raycaster.setFromCamera(this.cursor, this.camera)
    const [intersection] = this.raycaster.intersectObject(this.plane)

    if (intersection) {
      const nextX = intersection.point.x
      const prevX = this.playerPaddle.mesh.position.x
      this.playerPaddle.setX(MathUtils.lerp(prevX, nextX, 0.1))
    }

    this.ball.update(deltaTime)
    this.aiController.update(deltaTime)

    requestAnimationFrame(() => {
      this.tic()
    })
  }
}
