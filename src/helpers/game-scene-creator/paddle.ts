import {
  CapsuleGeometry,
  Mesh,
  MeshNormalMaterial,
  Scene,
  Vector2,
  Vector3
} from 'three'

const GEOMETRY = new CapsuleGeometry(0.5, 5, 20, 20)
const HELPER_GEOMETRY = new CapsuleGeometry(0.5 + 0.5, 5, 20, 8)
GEOMETRY.rotateZ(Math.PI / 2)
HELPER_GEOMETRY.rotateZ(Math.PI / 2)
HELPER_GEOMETRY.rotateX(Math.PI / 8)
const MATERIAL = new MeshNormalMaterial()

export default class Paddle {
  private scene: Scene
  private bodundaries: Vector2
  public mesh: Mesh
  private collisionHelper: Mesh

  constructor(scene: Scene, bodundaries: Vector2, positin: Vector3) {
    this.scene = scene
    this.bodundaries = bodundaries

    this.mesh = new Mesh(GEOMETRY, MATERIAL)
    this.collisionHelper = new Mesh(
      HELPER_GEOMETRY,
      new MeshNormalMaterial({
        transparent: true,
        opacity: 0.5
      })
    )

    this.mesh.position.copy(positin)
    this.mesh.add(this.collisionHelper)

    this.scene.add(this.mesh)
  }

  setX(x: number) {
    if (x > this.bodundaries.x - 3) {
      x = this.bodundaries.x - 3
    } else if (x < -this.bodundaries.x + 3) {
      x = -this.bodundaries.x + 3
    }

    this.mesh.position.x = x
  }
}
