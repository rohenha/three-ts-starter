import * as THREE from 'three';
import { Loader } from './loader';

export class Elements {
  public loader: Loader;
  constructor(loader: Loader) {
    this.loader = loader;
  }

  public addAmbLight(
    color: number = 0xFFFFFF,
    intensity: number = 1,
    castShadow: boolean = true
  ): THREE.AmbientLight {
    const light = new THREE.AmbientLight( color, intensity ); // soft white light
    light.castShadow = castShadow;
    this.loader.scene.add( light );
    this.loader.lights.push(light);
    return light;
  }

  public addDirLight(
    color: number = 0xFFFFFF,
    intensity: number = 1,
    castShadow: boolean = true,
    far: number = 20
  ): THREE.DirectionalLight {
    const light = new THREE.DirectionalLight(color, intensity);
    // light.shadow.camera.far = far;
    light.castShadow = castShadow;
    this.loader.scene.add( light );
    this.loader.lights.push(light);
    return light;
  }

  public addSpotlightLight(
    color: number = 0xFFFFFF,
    intensity: number = 1,
    castShadow: boolean = true,
    distance: number = 10,
    angle: number = 45,
    exponent: number = 5,
    decay: number = 10,
  ): THREE.SpotLight {
    const light = new THREE.SpotLight(color, intensity);
    light.castShadow = castShadow;
    this.loader.scene.add( light );
    this.loader.lights.push(light);
    return light;
  }

  public add3DMaterial(colorHex: number): THREE.MeshLambertMaterial {
    const material = new THREE.MeshLambertMaterial( { color: colorHex } );
    return material;
  }

  public add3DTMaterial(
    colorHex: any,
    specularVal: any,
    shininessVal: number,
    opacityVal: number,
    transparentVal: boolean
  ): any {
    const material = new THREE.MeshPhongMaterial( {
      color: colorHex,
      specular: specularVal,
      shininess: shininessVal,
      opacity: opacityVal,
      transparent: transparentVal
    } );
    return material;
  }

  public add2DMaterial(colorHex: any): THREE.MeshBasicMaterial {
    const material = new THREE.MeshBasicMaterial( {
      color: colorHex,
      side: THREE.DoubleSide // Il existe d'autres méthodes : THREE.FrontSide et THREE.BackSide
    });
    return material;
  }

  public addCube(width: number, height: number, depth: number, material: any): THREE.Mesh {
    const geometry = new THREE.BoxGeometry( width, height, depth );
    const cube = new THREE.Mesh( geometry, material );
    this.loader.scene.add( cube );
    return cube;
  }

  public addSphere(
    material: any,
    radius: number,
    wSegments: number,
    hSegments: number
    ): THREE.Mesh {
    const geometry = new THREE.SphereGeometry( radius, wSegments, hSegments );
    const sphere = new THREE.Mesh( geometry, material );
    this.loader.scene.add( sphere );
    return sphere;
  }

  public addPlane(
    shadow: boolean = false,
    material: any,
    width: number = 1,
    length: number = 1,
    wSegments: number = 0,
    hSegments: number = 0
  ): THREE.Mesh {
    const geometry = new THREE.PlaneBufferGeometry(width, length, wSegments, hSegments);
    const plane = new THREE.Mesh(geometry, material);
    plane.rotation.x = Math.PI / 2;
    plane.receiveShadow = shadow;
    this.loader.scene.add(plane);
    return plane;
  }

  public addCylinder(
    material: any,
    radiusTop: number = 2,
    radiusBottom: number = 2,
    height: number = 2,
    rSegments: number = 5,
    hSegments: number = 10,
    endedOpened: boolean = false,
    thethaStart: number = 0,
    thethaLength: number = 6.3,
  ): THREE.Mesh {
    const geometry = new THREE.CylinderGeometry(
      radiusTop,
      radiusBottom,
      height,
      rSegments,
      hSegments,
      endedOpened,
      thethaStart,
      thethaLength
    );
    const cylindre = new THREE.Mesh(geometry, material);
    this.loader.scene.add(cylindre);
    return cylindre;
  }

  public createLine(vectors: any[], matColor: any = 0xFFFFFF, thickness: number) {
    const material = new THREE.LineBasicMaterial( {
      color: matColor,
      linewidth: thickness,
      linecap: 'round', // ignored by WebGLRenderer
      linejoin:  'round' // ignored by WebGLRenderer
    } );
    const geometry = new THREE.Geometry();
    for (const vector of vectors) {
      geometry.vertices.push(vector);
    }
    const line = new THREE.Line( geometry, material );
    this.loader.scene.add( line );
  }

  public createVector(
    nbrVector: number = 2,
    points: any[] = [1, 0]
  ): any {
    let vector;
    switch (nbrVector) {
      case 2:
      vector = new THREE.Vector2(points[0], points[1]);
      break;
      case 3:
      vector = new THREE.Vector3(points[0], points[1], points[2]);
      break;
      case 4:
      vector = new THREE.Vector4(points[0], points[1], points[2], points[3]);
      break;
      default:
        break;
    }
    return vector;
  }

  public create3DObject(objects: any[]): THREE.Object3D {
    const object = new THREE.Object3D();
    for (const element of objects) {
      object.add(element);
    }
    this.loader.scene.add(object);
    return object;
  }
}
