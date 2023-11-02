import {
  AxesHelper,
  PerspectiveCamera,
  Scene,
  Vector3,
  WebGLRenderer
} from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls'

export default new (class ThreeSceneCreator {
  public scene!: THREE.Scene
  public camera!: THREE.PerspectiveCamera
  private renderer!: THREE.WebGLRenderer
  private controls!: OrbitControls
  private sizes!: { width: number; height: number }
  public container!: HTMLDivElement

  constructor() {
    this.sizes = {
      width: window.innerWidth,
      height: window.innerHeight
    }
  }

  /**
   * 初始化场景
   */
  public init(container: HTMLDivElement) {
    this.container = container

    this.createScene()
    this.createCamera()
    this.createRenderer()
    this.createControls()
    this.tic()

    window.addEventListener('resize', this.handleResize.bind(this))
  }

  /**
   * 创建场景
   */
  private createScene() {
    this.scene = new Scene()

    const axesHelper = new AxesHelper(3)
    this.scene.add(axesHelper)
  }

  /**
   * 创建相机
   */
  private createCamera() {
    const fov = 60
    const aspect = this.sizes.width / this.sizes.height
    this.camera = new PerspectiveCamera(fov, aspect, 0.1)
    this.camera.position.set(0, 35, 25)
    this.camera.lookAt(new Vector3(0, 2.5, 0))
  }

  /**
   * 创建渲染器
   */
  private createRenderer() {
    const renderer = new WebGLRenderer({
      antialias: window.devicePixelRatio < 2,
      logarithmicDepthBuffer: true
    })

    this.container.appendChild(renderer.domElement)
    this.renderer = renderer
    this.handleResize()
  }

  /**
   * 创建控制器
   */
  private createControls() {
    this.controls = new OrbitControls(this.camera, this.renderer.domElement)
  }

  /**
   * 处理窗口大小变化
   */
  private handleResize() {
    this.sizes.width = window.innerWidth
    this.sizes.height = window.innerHeight

    this.camera.aspect = this.sizes.width / this.sizes.height
    this.camera.updateProjectionMatrix()

    this.renderer.setSize(this.sizes.width, this.sizes.height)

    const pixelRatio = Math.min(window.devicePixelRatio, 2)
    this.renderer.setPixelRatio(pixelRatio)
  }

  /**
   * 渲染
   */
  private tic() {
    this.controls.update()

    this.renderer.render(this.scene, this.camera)

    requestAnimationFrame(() => {
      this.tic()
    })
  }
})()
