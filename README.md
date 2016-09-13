# ImageEditor
> ImageEditor is a jQuery plugin for edit and annotate images.

## Usage

```js
$("img").imageEdit({
  color : 'blue',
  onSave : function(src){
   
  }
}); // all img elements are initialized by the plugin

$("img").imageEdit("show");
```
## Methods

* **onReady** :  *triggers when image is loaded*
* **onSave**  :  *returns when save button is clicked, returns base64 data of image*

## Properties

* **minScale** :  Minimum value for scale ranges from 0.1 to 1
* **maxScale** :  Maximum value for scale ranges from 0.1 to 10
* **color** : Color for text, shapes, *default : red*
* **font** :  Font family for text, *default : Helvetica*
* **text** :  Default text : Enter text here

## Dependencies
 1. Fabric.js ( https://github.com/kangax/fabric.js/ )
 2. CanvasAreaDraw ( https://github.com/fahrenheit-marketing/jquery-canvas-area-draw )
 3. Jcrop ( https://github.com/tapmodo/Jcrop )
 4. FontAwesome ( https://github.com/FortAwesome/Font-Awesome )
