import { Loader } from './loader';
import {Power2, Elastic, TimelineMax} from 'gsap';

class App {
  public three: Loader;
  public material: THREE.MeshBasicMaterial;
  public cube: THREE.Object3D;
  public t: number = 0;
  public tween: TimelineMax;
  constructor() {
    this.three = new Loader(true, false, '');
    this.material = this.three.elements.add2DMaterial(0xFFFFFF);
    const cube = this.three.elements.addCube(1, 1, 1, this.material);
    cube.position.y = 0.5;
    this.tween = new TimelineMax({
      paused: false,
      yoyo : true,
      repeat : -1,
      onComplete() {
      }
    });
    this.tween
    .addLabel('in', 0)
    .to(cube.position, 2, {
      y: 0.5,
      ease: Power2.easeInOut
    })
    .to(cube.position, 2, {
      y: 2,
      ease: Power2.easeInOut
    });

    requestAnimationFrame( this.animate.bind(this) );
  }

  public animate(time: any): void {
    requestAnimationFrame( this.animate.bind(this) );
    this.t += 0.007;
    this.three.cameras[0].position.x = this.three.getCos(this.t) * 3;
    this.three.cameras[0].position.z = this.three.getSin(this.t) * 3;
    this.three.cameras[0].lookAt(this.three.elements.createVector(3, [0, 0, 0]));
    this.three.render();
    // TWEEN.update(time);
  }
}

const app = new App();
