var canvas, selectedObj;

var SVG_START = '<svg version="1.1" xmlns="http://www.w3.org/2000/svg" xlink="http://www.w3.org/1999/xlink" x="{X}px" y="{Y}px" width="{W}px" height="{W}px">'
var SVG_END = '</svg>';
var RECT = '<rect x="{X}" y="{Y}" fill="{FILL}" stroke="{S}" stroke-width="{SW}" width="{W}" height="{H}"></rect>';
var ROUND_RECT = '<rect x="{X}" y="{Y}" fill="{FILL}" stroke="{S}" stroke-width="{SW}" width="{W}" height="{H}" rx="{RX}" ry="{RY}"></rect>';
var CIRCLE = '<circle fill="{FILL}" stroke="{S}" stroke-width="{SW}" cx="{X}" cy="{Y}" r="{R}"></circle>';

$(document).ready(function(){
	showSplash();
	setCanvasSize();
	window.canvas = new fabric.Canvas('canvas');
	canvas.setBackgroundColor('white');
	canvas.on("object:selected",function(event){
		selectedObj = canvas.getActiveObject();
		showProperties();
	});
	canvas.on("object:scaling",function(obj){
		var target = obj.target;
		if(target.type == 'i-text'){
			target.fontSize *= target.scaleX;
			target.scale(1);
			target.setCoords();
			canvas.renderAll();
		}
	});
	$(".elements_panel li[data-type]").bind("click",function(e){
		var type = $(this).attr("data-type");
		switch(type){
			case 'Text':
				addText();
				break;
			case 'Shape':
				toggleShapes(this);
				break;
			case 'Image':
				dropImage();
				break;
			default:
				console.log(type);
		}
		eventHandler(e);
	});
	$("#image_file").bind("change",function(e){
		var file = e.target.files[0];
		var reader = new FileReader();
		reader.onloadend = function(){
			fabric.Image.fromURL(this.result,function(img){
                canvas.add(img);
                canvas.centerObject(img);
			    img.setCoords();
			    canvas.setActiveObject(img);
                canvas.renderAll();
            })
		}
		reader.readAsDataURL(file);
	});
	canvas.renderAll();
	addSidebarIcons(function(){
		hideSplash();
	});
});

function addSidebarIcons(callback){
	var shape_icon = [{"ROUND_RECT":{"X":0,"Y":0,"W":25,"H":25,"RX":2,"RY":2,"FILL":"#FFFFFF","S":"#000000","SW":2}},{"CIRCLE":{"X":20,"Y":20,"R":10,"FILL":"#FFFFFF","S":"#000000","SW":2}}];
	getSVGString(shape_icon,function(svg_str){
		$('<canvas />',{Width:30,Height:30,'id':'shape_icon'}).appendTo($("[data-type='Shape'] i"));
		var t_can = new fabric.Canvas('shape_icon');
		fabric.loadSVGFromString(svg_str,function(objects, options){
			var loadedObject = fabric.util.groupSVGElements(objects, options);
			t_can.add(loadedObject);
		})
		if(typeof callback == 'function'){
			callback();
		}
	})
}

window.onresize = resizeCanvas;

function showSplash(){
	$("#splash").show();
}

function hideSplash(){
	$("#splash").hide();
}

function getSVGString(elem, callback){
	var str = '';
	str += SVG_START.replace('{X}','0').replace('{Y}','0').replace('{W}','30').replace('{H}','30');
	elem.forEach(function(e){
		var key = Object.keys(e)[0];
		var tag = window[key];
		var attrs = e[key];
		for(var i in attrs){
			tag = tag.replace('{'+i+'}',attrs[i]);
		}
		str += tag;
	})
	callback(str);
}

function setCanvasSize(){
	$("#canvas").attr({Width:(innerWidth*0.8),Height:(innerHeight*0.9)});
}

function resizeCanvas(){
	canvas.setWidth(innerWidth*0.8);
	canvas.setHeight(innerHeight*0.9);
	canvas.renderAll();
}

function toggleShapes(that){
	$(that).toggleClass("active");
}

function addText(){
	var text = 'Enter Text Here';
    var textSample = new fabric.IText(text, {
      fontFamily: 'Helvetica',
      angle: 0,
      fontSize: 20,
      fill: 'black',
      hasRotatingPoint: true,
      centerTransform: true,
      editable : true
    });
    canvas.add(textSample);
    canvas.centerObject(textSample);
    textSample.setCoords();
    canvas.setActiveObject(textSample);
    canvas.renderAll();
}

function dropImage(){
	$("#image_file").trigger("click");
}

function showProperties(){
	switch(selectedObj.type){
		case 'i-text': 						// Editable text
			console.log(selectedObj);
			break;
		case 'image':
			console.log(selectedObj);
			break;
	}
}

function eventHandler(e){
	e.preventDefault();
	e.stopPropagation();
	e.stopImmediatePropagation();
	return false;
}