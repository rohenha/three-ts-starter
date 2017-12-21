import { Loader } from './loader';
// tslint:disable-next-line:no-var-requires
const TWEEN = require('@tweenjs/tween.js');

class App {
  public three: Loader;
  public greenMaterial: THREE.MeshBasicMaterial;
  public cube: THREE.Object3D;
  public t: number = 0;
  public tween: any;
  constructor() {
    this.three = new Loader(true, false, '');
    this.greenMaterial = this.three.elements.add2DMaterial(0xFFFFFF);
    const cube = this.three.elements.addCube(1, 1, 1, this.greenMaterial);
    const coords = { x: 0, y: -1, z: 0 };
    this.tween = new TWEEN.Tween(coords)
            .to({ x: 0, y: 1, z: 0 }, 1000)
            .easing(TWEEN.Easing.Quadratic.Out)
            // tslint:disable-next-line:only-arrow-functions
            .onUpdate(function() {
                cube.position.x = coords.x;
                cube.position.y = coords.y;
                cube.position.z = coords.z;
            })
            // tslint:disable-next-line:only-arrow-functions
            .repeat(Infinity)
            .yoyo(true)
            .start();
    requestAnimationFrame( this.animate.bind(this) );
  }

  public animate(time: any): void {
    requestAnimationFrame( this.animate.bind(this) );
    this.t += 0.007;
    this.three.cameras[0].position.x = this.three.getCos(this.t) * 3;
    this.three.cameras[0].position.z = this.three.getSin(this.t) * 3;
    this.three.cameras[0].lookAt(this.three.elements.createVector(3, [0, 0, 0]));
    this.three.render();
    TWEEN.update(time);
  }
}

const app = new App();
