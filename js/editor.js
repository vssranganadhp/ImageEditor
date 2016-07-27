var canvas, selectedObj;

var SVG_START = '<svg version="1.1" xmlns="http://www.w3.org/2000/svg" xlink="http://www.w3.org/1999/xlink" x="{X}px" y="{Y}px" width="{W}px" height="{H}px">'
var SVG_END = '</svg>';
var RECT = '<rect x="{X}" y="{Y}" fill="{FILL}" stroke="{S}" stroke-width="{SW}" width="{W}" height="{H}"></rect>';
var ROUND_RECT = '<rect x="{X}" y="{Y}" fill="{FILL}" stroke="{S}" stroke-width="{SW}" width="{W}" height="{H}" rx="{RX}" ry="{RY}"></rect>';
var CIRCLE = '<circle fill="{FILL}" stroke="{S}" stroke-width="{SW}" cx="{X}" cy="{Y}" r="{R}"></circle>';
var LINE = '<line x1="{X1}" y1="{Y1}" x2="{X2}" y2="{Y2}" marker-end="url(#triangle)" stroke="{S}" stroke-width="{SW}"></line>';
var MARKER = '<marker xmlns="http://www.w3.org/2000/svg" id="triangle" refX="0" refY="5" markerUnits="strokeWidth" markerHeight="2" markerWidth="2"><path d="M 40 5 L 50 10 L 40 15 z"/></marker>';
var REVMARKER = '<marker xmlns="http://www.w3.org/2000/svg" id="triangle" refX="0" refY="5" markerUnits="strokeWidth" markerHeight="2" markerWidth="2"><path d="M 0 10 L 10 5 L 10 15 z"/><path d="M 40 5 L 50 10 L 40 15 z"/></marker>';
var fonts = ["Aclonica", "Acme", "Akronim", "Aladin", "Alegreya", "Allerta", "Allura", "Amita", "Arbutus", "Architects Daughter", "Archivo Black", "Atomic Age", "Aubrey", "Bangers", "Basic", "Baumans", "Belleza", "BenchNine", "Berkshire Swash", "Bigshot One", "Bilbo", "Butcherman", "Caesar Dressing", "Cambo", "Candal", "Capriola", "Carrois Gothic", "Carter One", "Caveat Brush", "Cherry Cream Soda", "Codystar", "Convergence", "Covered By Your Grace", "Croissant One", "Crushed", "Days One", "Devonshire", "Dhurjati", "Diplomata", "Droid Sans Mono", "Duru Sans", "Engagement", "Englebert", "Ewert", "Faster One", "Griffy", "Helvetica","Iceberg", "Jacques Francois", "Lato", "Londrina Outline", "Marko One", "Marvel", "Monoton", "Mrs Sheppards", "Mystery Quest", "Nosifer", "Nova Cut", "Open Sans", "Oregano", "Oswald", "Oxygen Mono", "Press Start 2P", "Quicksand", "Ribeye", "Roboto", "Rosario", "Russo One", "Shojumaru", "Source Code Pro", "Swanky and Moo Moo", "The Girl Next Door", "Ubuntu", "UnifrakturMaguntia", "Voces", "Zeyada"];
var coords = {};
var croppedImage = null;
var properties = {
	'default':{
		'angle' : 'number',
		'backgroundColor' : 'color',
		'fill' : 'color',
		'flipX' : 'checkbox',
		'flipY' : 'checkbox',
		'globalCompositeOperation' : ['source-over', 'source-atop', 'source-in', 'source-out', 'destination-over', 'destination-atop', 'destination-in', 'destination-out', 'lighter', 'copy', 'xor'],
		'height': 'number',
		'left' : 'number',
		'opacity' : 'range',
		'originX' : ['left', 'center', 'right'],
		'originY' : ['top', 'center', 'bottom'],
		'stroke' : 'color',
		'strokeDashArray' : [],
		'strokeLineCap' : ['round', 'butt', 'square'],
		'strokeLineJoin' : ['round', 'bevel', 'miter'],
		'strokeMiterLimit' : 'number',
		'strokeWidth' : 'number',
		'top' : 'number',
		'visible' : 'checkbox',
		'width' : 'number'
	},
	'i-text' : {
		'fontFamily' : fonts,
		'fontSize' : 'number',
		'fontStyle' : ['normal', 'italic', 'oblique'],
		'fontWeight' : ['normal', 'bold', '400', '600', '800'],
		'lineHeight' : 'number',
		'text' : 'text',
		'textAlign' : ['left', 'center', 'right', 'justify'],
		'textBackgroundColor' : 'color',
		'textDecoration' : ['', 'underline','overline','line-through']
	},
	'image' :{
		'alignX' : ['none', 'mid', 'min', 'max'],
		'alignY' : ['none', 'mid', 'min', 'max'],
		'crossOrigin' : ['', 'anonymous', 'use-credentials'],
		'meetOrSlice' : ['meet', 'slice'],
		'src' : 'string'
	}
}

$(document).ready(function(){
	showSplash();
	setCanvasSize();
	window.canvas = new fabric.Canvas('canvas');
	canvas.setBackgroundColor('white');
	canvas.on("object:selected",function(event){
		selectedObj = canvas.getActiveObject();
		if(selectedObj){
			$(".prop_body").show();
			selectedObj.bringToFront();
			showProperties();
			setProperties();
		} else {
			$(".prop_body").hide();
		}
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
	canvas.on("selection:cleared",function(e){
		selectedObj = null;
	})
	canvas.on("object:modified",function(){
		if(selectedObj){
			setProperties();
		}
	})
	$(".elements_panel li[data-type]").bind("click",function(e){
		var type = $(this).attr("data-type");
		var removeClass = false;
		switch(type){
			case 'Text':
				addText();
				break;
			case 'Shape':
				toggleShapes(this);
				removeClass = true;
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
			case 'Crop':
				canvas.discardActiveObject()
				croppedImage = canvas.toDataURL();
				$(this).addClass("active");
				$("#canvas_container").hide();
				$("#crop_image_ops").show();
				$('#image_el').attr("src",croppedImage);
				$('#image_el').Jcrop({
					onSelect : updateCoords
				});
				startInterval();
				removeClass = true;
				break;
			case 'Measure':
				canvas.discardActiveObject()
				croppedImage = canvas.toDataURL();
				$(this).addClass("active");
				$("#canvas_container").hide();
				$("#measure_image_ops").show();
				// croppedImage = 'http://farm8.staticflickr.com/7259/6956772778_2fa755a228.jpg';
				$('#measure_image').attr("data-image-url",croppedImage);
				$("#measure_image").addClass("canvas-area");
				$('.canvas-area[data-image-url]').canvasAreaDraw();
				removeClass = true;
				break;
			default:
				console.log(type);
		}
		if(!removeClass){
			$(".elements_panel ul li.active").removeClass("active")
		}
		// if(type != 'Crop'){
		// 	$("[data-type='Crop']").removeClass("active");
		// } else if(type != 'Measure'){
		// 	$("[data-type='Measure']").removeClass("active");
		// }
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
		$(".prop_body input").bind("input",function(){
			var val = $(this).val();
			var el_prop = $(this).attr('title');
			if($(this).attr("type") == "number"){
				val = parseFloat(val);
			}
			if(selectedObj){
				if(el_prop in selectedObj)
					selectedObj[el_prop] = val;
				selectedObj.setCoords();
				canvas.renderAll();
			}
		})
		$(".prop_body input[type='checkbox']").bind("change",function(){
			var val = $(this).is(":checked");
			var el_prop = $(this).attr('title');
			if(selectedObj){
				if(el_prop in selectedObj)
					selectedObj[el_prop] = val;
				selectedObj.setCoords();
				canvas.renderAll();
			}
		})
		$(".prop_body select").bind("change",function(){
			var val = $(this).val();
			var el_prop = $(this).attr('title');
			if(selectedObj){
				if(el_prop in selectedObj)
					selectedObj[el_prop] = val;
				selectedObj.setCoords();
				canvas.renderAll();
				setTimeout(function(){
					if(canvas)
						canvas.renderAll();
				},1000);
			}
		})
	});

	$("#canvas_container").bind("contextmenu",function(e){
		// console.log(e.pageX,e.pageY);
		var focussedEl = canvas.findTarget(e);
		if(focussedEl)
			canvas.setActiveObject(focussedEl);
		e.preventDefault();
	})

	$("body").bind("keydown",function(e){
		var keyCode = e.keyCode;
		var preventDefault = false;
		if(selectedObj && e.target.nodeName == 'BODY'){
	        switch(keyCode){
	        	case 8:
	        		deleteSelectedObj();
	        		preventDefault = true;
	        		break;
			}
			if(preventDefault)
				eventHandler(e);
		}
	});
	$("#search_el").bind("input",function(){
		var q = $(this).val();
		if(q == ""){
			$(".searchable").show();
		} else {
			$(".searchable").hide();
			$(".searchable[title*='"+q+"']").show();
		}
	})
	$("#prop_head span").bind("mousedown",function(event){
		var clientX = event.offsetX;
		var clientY = event.offsetY;
		$("*").bind("mousemove",function(e){
			var left = e.pageX-clientX;
			var top = e.pageY-clientY;
			$("#properties_dialogs").css('transform','translate3d('+left+'px,'+top+'px,0px)');
			// $("#properties_dialogs").css({left:left+'px',top:top+'px'});
		});
		$("*").bind("mouseup",function(){
			$("*").unbind("mousemove mouseup");
		})
		// $("body").bind("mouseout",function(e){
		// 	$("*").unbind("mousemove mouseup mouseout");
		// })
	})
	$("#coords_div i").bind("click",function(){
		$("#coords_div").hide();
		$("#measure_image_ops").hide();
		$("#canvas_container").show();
		$("#measure_image_ops > *").not("textarea").remove();
		$("#measure_image_ops textarea").removeAttr("data-image-url");
		$(".elements_panel ul li.active").removeClass("active");
	})
	$("#properties_dialogs").css("transform","translate3d("+(innerWidth-240)+"px,20px,0)");
	loadFonts();
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
	createPropertyDialogs(function(){
		if(typeof callback == 'function'){
			callback();
		}
	})
}

function createPropertyDialogs(callback){
	var mainPropEl = $('<div />',{'class':'prop_body'});
	for(var i in properties){
		var parentEl = $('<div />',{'class':i});
		var props = properties[i];
		for(var j in props){
			var val = props[j];
			switch(val){
				case 'number':
					parentEl.append($('<div class="searchable" title="'+j+'"><span>'+j+'</span><input type="number" title="'+j+'" min="0" /></div>'));
					break;
				case 'text':
					parentEl.append($('<div class="searchable" title="'+j+'"><span>'+j+'</span><input type="text" title="'+j+'" /></div>'));
					break;
				case 'checkbox':
					parentEl.append($('<div class="searchable" title="'+j+'"><span>'+j+'</span><input type="checkbox" title="'+j+'" /></div>'));
					break;
				case 'range':
					parentEl.append($('<div class="searchable" title="'+j+'"><span>'+j+'</span><input type="range" title="'+j+'" min="0" step="0.01" max="1" value="1" /></div>'));
					break;
				case 'color':
					parentEl.append($('<div class="searchable" title="'+j+'"><span>'+j+'</span><input type="color" title="'+j+'" /></div>'));
					break;
				default:
					if(typeof(val) == 'object' && val.length > 0){
						var subParentEl = $('<div />',{'class':'searchable','title':j});
						subParentEl.append($('<span />').text(j));
						var selectEl = $('<select />',{'title':j});
						for(var el in val){
							selectEl.append($('<option />',{'value':val[el]}).text(val[el]));
						}
						subParentEl.append(selectEl);
					}
					parentEl.append(subParentEl);
					break;
			}
		}
		mainPropEl.append(parentEl);
	}
	$("#properties_dialogs").append(mainPropEl);
	setTimeout(function(){
		if(typeof callback == 'function'){
			callback();
		}
	},500);
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

function addPolygon(){
	var polyObj = new fabric.Polygon([{x: 75, y: 0},{x: 150, y: 60},{x: 120, y: 135},{x: 30, y: 135},{x: 0, y: 60}], {
		fill: 'white',
		strokeWidth : 2,
		stroke : 'black'
	})
    makeCenterAndRedraw(polyObj);
}

function addStar(){
	var str = SVG_START.replace('{X}','0').replace('{Y}','0').replace('{W}','238').replace('{H}','226');
	str += '<polygon points="119,0 148,86 238,86 166,140 192,226 119,175 46,226 72,140 0,86 90,86" fill="transparent" stroke="black" stroke-width="2" />';
	str += SVG_END;
	fabric.loadSVGFromString(str,function(objects, options){
		var starObj = fabric.util.groupSVGElements(objects, options);
		makeCenterAndRedraw(starObj);
	})
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
	$(".prop_body > div").hide();
	switch(selectedObj.type){
		case 'i-text': 						// Editable text
			$(".prop_body .i-text").show();
			break;
		case 'image':
			$(".prop_body .image").show();
			break;
	}
	$(".prop_body .default").show();
}

function setProperties(){
	$(".searchable input, .searchable select").each(function(){
		var title = $(this).attr('title');
		var selectedVal = selectedObj[title];
		if($(this).is(":checkbox")){
			if(selectedVal){
				$(this).prop("checked",true);
			} else {
				$(this).removeAttr("checked");
			}
		}
		// console.log(title);
		$(this).val(selectedVal);
	})
	$("#properties_dialogs").css("transform","translate3d("+(innerWidth-240)+"px,20px,0)");
}

function deleteSelectedObj(){
    var activeObject = canvas.getActiveObject(), activeGroup = canvas.getActiveGroup();
    if(confirm("Are you sure you want to remove this element?")){
	    if (activeGroup) {
	        var objectsInGroup = activeGroup.getObjects();
	        canvas.discardActiveGroup();
	        objectsInGroup.forEach(function(object) {
	            canvas.remove(object);
	        });
	    } else if (activeObject) {
	        canvas.remove(activeObject);
	    }
    }
}

function startInterval(){
	var target_el = $(".jcrop-holder > div:eq(0) > div:eq(0)");
	var tick_icon = $('<span />',{'class':'crop_icon tick'});
	var close_icon = $('<span />',{'class':'crop_icon close'});
	tick_icon.insertAfter(target_el);
	close_icon.insertAfter(target_el);
	tick_icon.bind("click",function(){
		console.log(coords);
		var can = document.createElement('canvas');
		var img = new Image();
		img.onload = function(){
			can.width = img.naturalWidth;
			can.height = img.naturalHeight;
			var cxt = can.getContext('2d');
			cxt.drawImage(img,0,0);
			var data = cxt.getImageData(coords.x,coords.y,coords.w,coords.h);
			var temp_can = document.createElement('canvas');
			temp_can.width = coords.w;
			temp_can.height = coords.h;
			var temp_cxt = temp_can.getContext('2d');
			temp_cxt.putImageData(data,0,0);
			var croppedSrc = temp_can.toDataURL();
			$("#canvas_container").show();
			$("#crop_image_ops").hide();
			// canvas.clear();
			fabric.Image.fromURL(croppedSrc,function(nimg){
                canvas.add(nimg);
                canvas.centerObject(nimg);
			    nimg.setCoords();
			    canvas.setActiveObject(nimg);
                canvas.renderAll();
                $("[data-type='Crop']").removeClass("active");
            })
		}
		img.src = croppedImage;
	})
}

function updateCoords(e){
	coords = {
		x : e.x,
		y : e.y,
		w : e.w,
		h : e.h
	}
}

function loadFonts(callback){
    var str = '';
    fonts.forEach(function(font){
    	font = font.replace(/ /g,'+');
        str += font+":400,700|";
    });
    str = str.slice(0,-1);
    $("<link href='https://fonts.googleapis.com/css?family="+str+"' rel='stylesheet' type='text/css' />").appendTo($('head'));
    if(typeof callback == 'function'){
        callback();
    }
}

function eventHandler(e){
	e.preventDefault();
	e.stopPropagation();
	e.stopImmediatePropagation();
	return false;
}

window.onbeforeunload = function(){
	if(canvas.toObject().objects.length > 0){
		return true;
	}
}