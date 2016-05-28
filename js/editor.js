var canvas, selectedObj;

var SVG_START = '<svg version="1.1" xmlns="http://www.w3.org/2000/svg" xlink="http://www.w3.org/1999/xlink" x="{X}px" y="{Y}px" width="{W}px" height="{H}px">'
var SVG_END = '</svg>';
var RECT = '<rect x="{X}" y="{Y}" fill="{FILL}" stroke="{S}" stroke-width="{SW}" width="{W}" height="{H}"></rect>';
var ROUND_RECT = '<rect x="{X}" y="{Y}" fill="{FILL}" stroke="{S}" stroke-width="{SW}" width="{W}" height="{H}" rx="{RX}" ry="{RY}"></rect>';
var CIRCLE = '<circle fill="{FILL}" stroke="{S}" stroke-width="{SW}" cx="{X}" cy="{Y}" r="{R}"></circle>';
var LINE = '<line x1="{X1}" y1="{Y1}" x2="{X2}" y2="{Y2}" marker-end="url(#triangle)" stroke="{S}" stroke-width="{SW}"></line>';
var MARKER = '<marker xmlns="http://www.w3.org/2000/svg" id="triangle" refX="0" refY="5" markerUnits="strokeWidth" markerHeight="2" markerWidth="2"><path d="M 40 5 L 50 10 L 40 15 z"/></marker>';
var REVMARKER = '<marker xmlns="http://www.w3.org/2000/svg" id="triangle" refX="0" refY="5" markerUnits="strokeWidth" markerHeight="2" markerWidth="2"><path d="M 0 10 L 10 5 L 10 15 z"/><path d="M 40 5 L 50 10 L 40 15 z"/></marker>';

$(document).ready(function(){
	showSplash();
	setCanvasSize();
	window.canvas = new fabric.Canvas('canvas');
	canvas.setBackgroundColor('white');
	canvas.on("object:selected",function(event){
		selectedObj = canvas.getActiveObject();
		if(selectedObj)
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
			case 'Arrow':
				addArrow();
				break;
			case 'DoubleArrow':
				addDoubleArrow();
				break;
			case 'Line':
				addLine();
				break;
			case 'Rectangle':
				addRectangle();
				break;
			case 'Circle':
				addCircle();
				break;
			case 'Triangle':
				addTriangle();
				break;
			case 'Diamond':
				addDiamond();
				break;
			case 'Polygon':
				addPolygon();
				break;
			case 'Star':
				addStar();
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
	var obj = {"Shape":[{"ROUND_RECT":{"X":2,"Y":2,"W":25,"H":25,"RX":2,"RY":2,"FILL":"#FFFFFF","S":"black","SW":2}},{"CIRCLE":{"X":20,"Y":20,"R":10,"FILL":"#FFFFFF","S":"black","SW":2}}]};
	var key = 'Shape';
	var el = obj[key];
	getSVGString(el,function(svg_str){
		//	Shapes
		$('<canvas />',{Width:33,Height:33,'id':key+'_icon'}).appendTo($("[data-type='"+key+"'] > i"));
		var t_can = new fabric.Canvas(key+'_icon');
		fabric.loadSVGFromString(svg_str,function(objects, options){
			var loadedObject = fabric.util.groupSVGElements(objects, options);
			loadedObject.hasControls = false;
			loadedObject.selectable = false;
			loadedObject.lockMovementX = true;
			loadedObject.lockMovementY = true;
			t_can.selection = false;
			t_can.add(loadedObject);
		})
	});
	// Triangle
	var key = 'Triangle';
	$('<canvas />',{Width:33,Height:33,'id':key+'_icon'}).appendTo($("[data-type='"+key+"'] > i"));
	var t_can = new fabric.Canvas(key+'_icon');
	var tri_obj = new fabric.Triangle({
		width: 30,
		height: 30,
		strokeWidth : 2,
		stroke : 'black',
		fill : 'white'
	});
	tri_obj.hasControls = false;
	tri_obj.selectable = false;
	tri_obj.lockMovementX = true;
	tri_obj.lockMovementY = true;
	t_can.selection = false;
	t_can.add(tri_obj);
	// Diamond
	var key = 'Diamond';
	$('<canvas />',{Width:33,Height:33,'id':key+'_icon'}).appendTo($("[data-type='"+key+"'] > i"));
	var t_can = new fabric.Canvas(key+'_icon');
	var dia_obj = new fabric.Rect({
		left : 16,
		width: 21,
		height: 21,
		angle : 45,
		strokeWidth : 2,
		stroke : 'black',
		fill : 'white'
    });
	dia_obj.hasControls = false;
	dia_obj.selectable = false;
	dia_obj.lockMovementX = true;
	dia_obj.lockMovementY = true;
	t_can.selection = false;
	t_can.add(dia_obj);
	// Polygon
	var key = 'Polygon';
	$('<canvas />',{Width:33,Height:33,'id':key+'_icon'}).appendTo($("[data-type='"+key+"'] > i"));
	var t_can = new fabric.Canvas(key+'_icon');
	var pol_obj = new fabric.Polygon([{x: 15, y: 0},{x: 30, y: 12},{x: 24, y: 27},{x: 6, y: 27},{x: 0, y: 12}], {
		fill: 'white',
		strokeWidth : 2,
		stroke : 'black'
	});
	pol_obj.hasControls = false;
	pol_obj.selectable = false;
	pol_obj.lockMovementX = true;
	pol_obj.lockMovementY = true;
	t_can.selection = false;
	t_can.add(pol_obj);
	if(typeof callback == 'function'){
		callback();
	}
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
	str += SVG_START.replace('{X}','0').replace('{Y}','0').replace('{W}','33').replace('{H}','33');
	elem.forEach(function(e){
		var key = Object.keys(e)[0];
		var tag = window[key];
		var attrs = e[key];
		for(var i in attrs){
			tag = tag.replace('{'+i+'}',attrs[i]);
		}
		str += tag;
	})
	str += SVG_END;
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
    makeCenterAndRedraw(textSample);
}

function addArrow(){
	var obj = canvas.getCenter();
	var top = Math.round(obj.top);
	var left = Math.round(obj.left);
	var str = '';
	str += SVG_START.replace('{X}','0').replace('{Y}','0').replace('{W}','50').replace('{H}','20');
	str += MARKER+''+LINE.replace('{X1}',2).replace('{X2}',45).replace('{Y1}',10).replace('{Y2}',10).replace('{S}','black').replace('{SW}','5');
	str += SVG_END;
	console.log(str);
	fabric.loadSVGFromString(str,function(objects, options){
		var loadedObject = fabric.util.groupSVGElements(objects, options);
		makeCenterAndRedraw(loadedObject);
	})
}

function addDoubleArrow(){
	var obj = canvas.getCenter();
	var top = Math.round(obj.top);
	var left = Math.round(obj.left);
	var str = '';
	str += SVG_START.replace('{X}','0').replace('{Y}','0').replace('{W}','50').replace('{H}','20');
	str += REVMARKER+''+LINE.replace('{X1}',10).replace('{X2}',45).replace('{Y1}',10).replace('{Y2}',10).replace('{S}','black').replace('{SW}','5');
	str += SVG_END;
	console.log(str);
	fabric.loadSVGFromString(str,function(objects, options){
		var loadedObject = fabric.util.groupSVGElements(objects, options);
		makeCenterAndRedraw(loadedObject);
	})
}

function addLine(){
	var lineObj = new fabric.Line([ 0, 100, 100, 100], {
      stroke : 'black',
      strokeWidth : 2
    });
    makeCenterAndRedraw(lineObj);
}

function addRectangle(){
	var rectObj = new fabric.Rect({
      fill: 'transparent',
      width: 150,
      height: 100,
      stroke : 'black',
      strokeWidth : 2
    })
    makeCenterAndRedraw(rectObj);
}

function addCircle(){
	var cirObj = new fabric.Circle({
		fill: 'transparent',
		radius: 50,
		stroke : 'black',
		strokeWidth : 2
	})
	makeCenterAndRedraw(cirObj);
}

function addTriangle(){
	var triObj = new fabric.Triangle({
		fill: 'transparent',
		stroke : 'black',
		strokeWidth : 2,
		width: 50,
		height: 50
	})
	makeCenterAndRedraw(triObj);
}

function addDiamond(){
	var diamObj = new fabric.Rect({
      fill: 'transparent',
      width: 100,
      height: 100,
      stroke : 'black',
      strokeWidth : 2,
      angle : 45
    })
    makeCenterAndRedraw(diamObj);
}

function makeCenterAndRedraw(elem){
	canvas.add(elem);
	canvas.centerObject(elem);
    elem.setCoords();
    canvas.setActiveObject(elem);
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