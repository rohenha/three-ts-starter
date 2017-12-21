import * as THREE from 'three';
import * as $ from 'jquery';
import * as dat from 'dat-gui';
import { Elements } from './elements';
// tslint:disable-next-line:no-var-requires
const OrbitControls = require('three-orbit-controls')(THREE);
// tslint:disable-next-line:no-var-requires

export class Loader {
  public isDebug: boolean= false;
  public isGrid: boolean= false;
  public isControls: boolean= false;
  public container: HTMLElement;
  public window: any = { width : 0, height: 0 };
  public scene: THREE.Scene;
  public renderer: THREE.WebGLRenderer;
  public cameras: any[] = [];
  public activeCamera: THREE.PerspectiveCamera;
  public debugCamera: THREE.PerspectiveCamera;
  public controls: any;
  public lights: any[] = [];
  public stats: any;
  public elements: Elements;
  constructor(
    fog: boolean = true,
    shadowMap: boolean = true,
    bg: any,
    fogConfig: any = {
      color: 0x000000,
      near: 1,
      far: 1000
    }
  ) {
    this.setup(fog, fogConfig);
    this.setRender(bg, shadowMap);
    this.addControls(true, 2, 20, 360);
    this.debug();
    this.render(this.activeCamera);
    document.getElementById('controlDebug')
    .addEventListener('click',  (ev) => {
      ev.preventDefault();
      this.setMode('debug');
    }, true);
    document.getElementById('controlControls')
    .addEventListener('click',  (ev) => {
      ev.preventDefault();
      this.setMode('orbit');
    }, true);
    document.getElementById('controlGrid')
    .addEventListener('click',  (ev) => {
      ev.preventDefault();
      this.setMode('grid');
    }, true);
  }

  public getElements(elements: Elements) {
    this.elements = elements;
  }

  public setup(fog: boolean, fogConfig: any) {
    this.isDebug = location.hash.indexOf('debug') > 0;
    this.isControls = location.hash.indexOf('controls') > 0;
    this.isGrid = location.hash.indexOf('grid') > 0;
    this.container = document.getElementById('three');
    this.elements = new Elements(this);
    this.window.width = window.innerWidth;
    this.window.height = window.innerHeight;
    this.scene = new THREE.Scene();
    if (fog) {
      this.scene.fog = new THREE.Fog(fogConfig.color , fogConfig.near, fogConfig.far);
    }
    const baseCamera = this.addCamera(false);
    baseCamera.position.x = 3;
    baseCamera.position.y = 3;
    baseCamera.position.z = 3;
    baseCamera.lookAt(new THREE.Vector3(0, 0, 0));
    this.setCamera(baseCamera);
  }

  public setRender(bg: any, shadowMap: boolean) {
    this.renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    this.renderer.setSize( this.window.width, this.window.height );
    this.renderer.gammaInput = true;
    this.renderer.gammaOutput = true;
    if (bg !== '' ) {
      this.renderer.setClearColor(bg);
    }
    this.renderer.setPixelRatio( window.devicePixelRatio );
    if (shadowMap) {
      this.renderer.shadowMap.enabled = true;
      this.renderer.shadowMap.cullFace = THREE.CullFaceBack; // And the other one
      this.renderer.shadowMap.type = THREE.PCFSoftShadowMap; // default THREE.PCFShadowMap
    }
    this.container.appendChild( this.renderer.domElement );
  }

  public render(camera: THREE.PerspectiveCamera = this.activeCamera): void {
    if (this.isDebug || this.isControls || this.isGrid) {
      this.controls.update();
      this.renderer.render(this.scene, this.debugCamera);
    } else {
      this.renderer.render(this.scene, camera);
    }
  }

  public addCamera(debug: boolean = false): THREE.PerspectiveCamera {
    const camera = new THREE.PerspectiveCamera(
      75, this.window.width / this.window.height, 0.1, 1000
    );
    if (!debug) {
      this.cameras.push(camera);
    }
    this.scene.add(camera);
    return camera;
  }

  public setCamera(camera: THREE.PerspectiveCamera): void {
    this.activeCamera = camera;
  }

  public addControls(
    enableZoom: boolean = true,
    minDis: number = 2,
    maxDist: number = 10,
    maxPolarAngle: number = Math.PI / 2.5,
    enableDamping: boolean = true,
    dampingFactor: number = 0.1,
    rotateSpeed: number = 0.1,
    smoothControls: boolean = true,
    zoomDampingFactor: number = 0.1,
    smoothZoomSpeed: number = 10
  ): void {
    if (this.isDebug || this.isControls || this.isGrid) {
      this.debugCamera = this.addCamera(true);
      this.debugCamera.position.x = 3;
      this.debugCamera.position.y = 3;
      this.debugCamera.position.z = 3;
      this.debugCamera.lookAt(new THREE.Vector3(0, 0, 0));
      this.setCamera(this.debugCamera);
      this.controls = new OrbitControls(this.debugCamera, this.renderer.domElement);
      this.controls.enableZoom = enableZoom;
      this.controls.minDistance = minDis;
      this.controls.maxDistance = maxDist;
      this.controls.maxPolarAngle = maxPolarAngle;
      this.controls.enableDamping = enableDamping;
      this.controls.dampingFactor = dampingFactor;
      this.controls.rotateSpeed = rotateSpeed;
    }
  }

  public debug(): void {
    if (this.isDebug || this.isGrid) {
      const gridHelper = new THREE.GridHelper(20, 20, 0xffffff, 0xffffff);
      this.scene.add(gridHelper);
      const thickness = 10;
      // const vectorsX = [ new THREE.Vector3( -10, 0, 0 ), new THREE.Vector3( 10, 0, 0 ) ];
      const vectorsY = [
        this.elements.createVector(3, [0, -10, 0] ),
        this.elements.createVector(3, [0, 10, 0] )
      ];
      // const vectorsZ = [ new THREE.Vector3( 0, 0, -10 ), new THREE.Vector3( 0, 0, 10 ) ];
      // this.elements.createLine(vectorsX, 0xFFFFFF, thickness);
      this.elements.createLine(vectorsY, 0xFFFFFF, thickness);
      // this.elements.createLine(vectorsZ, 0xFFFFFF, thickness);
    }
    if (this.isDebug) {
      for (const light of this.lights) {
        if (light instanceof THREE.DirectionalLight) {
          const directionalHelper = new THREE.DirectionalLightHelper(light);
          this.scene.add(directionalHelper);
        }
        if (light instanceof THREE.SpotLight) {
          const directionalHelper = new THREE.SpotLightHelper(light);
          this.scene.add(directionalHelper);
        }
      }
      // Helper for the camera
      for (const camera of this.cameras) {
        const helper = new THREE.CameraHelper(camera);
        this.scene.add(helper);
      }
    }
  }

  public setMode(type: string): any {
    switch (type) {
      case 'debug':
      window.location.hash = this.isDebug ? '' : 'debug';
      break;
      case 'orbit':
      window.location.hash = this.isControls ? '' : 'controls';
      break;
      case 'grid':
      window.location.hash = this.isGrid ? '' : 'grid';
      break;
      default:
      break;
    }
    location.reload();
  }

  public getCos(cosTo: number): number {
    return Math.cos(cosTo);
  }

  public getSin(sinTo: number): number {
    return Math.sin(sinTo);
  }

  public getRacine(racine: number): number {
    return Math.sqrt(racine);
  }
}
