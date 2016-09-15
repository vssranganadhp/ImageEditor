# ImageEditor
> ImageEditor is a jQuery plugin for edit and annotate images.

## How to use

Load files in the section of your HTML document. Make sure you also add the jQuery library.

```html
<head>
  <link rel="stylesheet" type="text/css" href="dist/jquery.imageedit.min.css" />
  <script type="text/javascript" src="http://ajax.googleapis.com/ajax/libs/jquery/2.1.4/jquery.min.js"></script>
  <script type="text/javascript" src="dist/jquery.imageedit.min.js"></script>
</head>
```

Initialization.
```html
<script>
  $("img").imageEditor();   // This opens editor by clicking on the image.
</script>
```

May also be passed with opional options as object, which will extend the default settings.

Example :
```html
<script>
  $("img").imageEdit({
    color : 'blue',
    onSave : function(src){
    
    }
  }); // all img elements are initialized by the plugin
</script>
```

Programmatic access:
```html
<script>
  $("img").imageEdit("show"); // This opens editor without clicking on image.
</script>
```
## Methods

* **onReady** :  *triggers when image is loaded*
* **onSave**  :  *returns when save button is clicked, returns base64 data of image*

## Properties

* **minScale** :  Minimum value for scale ranges from 0.1 to 1, *default : 0.3*
* **maxScale** :  Maximum value for scale ranges from 0.1 to 10, '*default : 1*'
* **color** : Color for text, shapes, *default : red*
* **font** :  Font family for text, *default : Helvetica*
* **fontSize** : Font size, numeric value, *default : 20*
* **text** :  *default : Enter text here*
* **overlays** : An array of image URLs
<br />Example :
```js
  $("img").imageEdit({
    overlays : ['images/clip/house.png', 'images/clip/landscape.png']
  })
```

## Programmatic options:

* **crop** : Opens crop module of image
* **measure** : Opens measure module
* **save**  : Saves image
<br />Example :```$("img").imageEdit("crop");```


## Dependencies
 1. Fabric.js ( https://github.com/kangax/fabric.js/ )
 2. CanvasAreaDraw ( https://github.com/fahrenheit-marketing/jquery-canvas-area-draw )
 3. Jcrop ( https://github.com/tapmodo/Jcrop )
 4. FontAwesome ( https://github.com/FortAwesome/Font-Awesome )
