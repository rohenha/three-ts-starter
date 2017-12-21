# Tree JS Typescript Starter kit

## Features
- Gulp (BrowserSync, clean files)
- Scss (Autoprefixer, Minimify)
- Typescript (Linter, Browserify)
- ThreeJS (Library, Orbit Control, Debug)
- TweenJS (Animation Library)
## Start Project

Clone the project

Install Nodes modules

```
npm install
```

Launch project 

```
gulp project
```

It will open a new window in your browser at **localhost:3000**

## Project Structure

- App is the folder where all your compiled files are (HTML, CSS, JS)
- Dev is the folder where all your work files are (HTML, SCSS, TS)

## Tree JS Custom Library

My custom library is in the **loader.ts** and **elements.ts**.
**loader.ts** is the general configuration to develop on Three JS with many features.
**elements.ts** contain all functions to easily create Three JS objects

## Use The library

Import in your development class both libraries :

```
import { Loader } from './loader';
const TWEEN = require('@tweenjs/tween.js');
```

Then create a new instance of Loader in your constructor :

```
this.three = new Loader(true, false, '');
```

If you want to create objects : 

```
const cube = this.three.elements.addCube(1, 1, 1, material);
```

Create the function to render and animate :

```
public animate(time: any): void {
  requestAnimationFrame( this.animate.bind(this) );
  this.three.render();
  TWEEN.update(time);
}
```

And call it in your constructor :

```
requestAnimationFrame( this.animate.bind(this) );
```

Now you just have to play with it !

# Enjoy !