var canvas, selectedObj, settings, coords, filename, controls, shape_controls, drawPoints, selectedPoint;
(function($, _window){
	settings = {
		contWidth : 0,
		contHeight : 0,
		minScale : 0.3,
		maxScale : 1,
		minDistance : 6,
		color : 'red',
		overlays : [],
		fontSize : 20,
		font : 'Helvetica',
		text : 'Enter text here',
		controlsColor : 'blue',
		borderColor : 'blue',
		drawStrokeColor : 'rgb(255,20,20)',
		drawFillColor : 'rgba(255,0,0,0.3)'
	};
	coords = {};
	var measured_scale = 1;
	var isCleaned = false;
	var method, selector;
	var SVG_START = '<svg version="1.1" xmlns="http://www.w3.org/2000/svg" xlink="http://www.w3.org/1999/xlink" x="{X}px" y="{Y}px" width="{W}px" height="{H}px">'
	var SVG_END = '</svg>';
	var RECT = '<rect x="{X}" y="{Y}" fill="{FILL}" stroke="{S}" stroke-width="{SW}" width="{W}" height="{H}"></rect>';
	var ROUND_RECT = '<rect x="{X}" y="{Y}" fill="{FILL}" stroke="{S}" stroke-width="{SW}" width="{W}" height="{H}" rx="{RX}" ry="{RY}"></rect>';
	var CIRCLE = '<circle fill="{FILL}" stroke="{S}" stroke-width="{SW}" cx="{X}" cy="{Y}" r="{R}"></circle>';
	var LINE = '<line x1="{X1}" y1="{Y1}" x2="{X2}" y2="{Y2}" marker-end="url(#triangle)" stroke="{S}" stroke-width="{SW}"></line>';
	var MARKER = '<marker xmlns="http://www.w3.org/2000/svg" id="triangle" refX="0" refY="5" markerUnits="strokeWidth" markerHeight="2" markerWidth="2" fill="red"><path d="M 40 5 L 50 10 L 40 15 z"/></marker>';
	var REVMARKER = '<marker xmlns="http://www.w3.org/2000/svg" id="triangle" refX="0" refY="5" markerUnits="strokeWidth" markerHeight="2" markerWidth="2" fill="red"><path d="M 0 10 L 10 5 L 10 15 z"/><path d="M 40 5 L 50 10 L 40 15 z"/></marker>';
	var fonts = ["Aclonica", "Acme", "Akronim", "Aladin", "Alegreya", "Allerta", "Allura", "Amita", "Arbutus", "Architects Daughter", "Archivo Black", "Atomic Age", "Aubrey", "Bangers", "Basic", "Baumans", "Belleza", "BenchNine", "Berkshire Swash", "Bigshot One", "Bilbo", "Butcherman", "Caesar Dressing", "Cambo", "Candal", "Capriola", "Carrois Gothic", "Carter One", "Caveat Brush", "Cherry Cream Soda", "Codystar", "Convergence", "Covered By Your Grace", "Croissant One", "Crushed", "Days One", "Devonshire", "Dhurjati", "Diplomata", "Droid Sans Mono", "Duru Sans", "Engagement", "Englebert", "Ewert", "Faster One", "Griffy", "Helvetica","Iceberg", "Jacques Francois", "Lato", "Londrina Outline", "Marko One", "Marvel", "Monoton", "Mrs Sheppards", "Mystery Quest", "Nosifer", "Nova Cut", "Open Sans", "Oregano", "Oswald", "Oxygen Mono", "Press Start 2P", "Quicksand", "Ribeye", "Roboto", "Rosario", "Russo One", "Shojumaru", "Source Code Pro", "Swanky and Moo Moo", "The Girl Next Door", "Ubuntu", "UnifrakturMaguntia", "Voces", "Zeyada"];
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
			'skewX' : 'number',
			'skewY' : 'number',
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
			'crossOrigin' : ['', 'Anonymous', 'use-credentials'],
			'meetOrSlice' : ['meet', 'slice'],
			'src' : 'string'
		}
	};
	controls = {'text':'fa-pencil-square-o', 'draw':'fa-pencil', 'shape':'fa-square-o', 'crop':'fa-crop', 'measure':'fa-expand', 'save': 'fa-download'};
	shape_controls = {'arrow':'fa-long-arrow-right', 'double sided arrow':'fa-arrows-h', 'line':'fa-minus', 'rectangle':'fa-square-o', 'circle':'fa-circle-thin'};
	// var canvas, selectedObj;
	$.fn.imageEdit = function(options){
		selector = this;
		if(!$(selector).is("img")){
			console.error("This plugin works for images only!");
			return false;
		}
		if(typeof options != 'object'){
			method = options;
			options = {};
		}
		if(options.overlays && options.overlays.length > 0){
			shape_controls['overlays'] = 'fa-file-image-o';
			setOverlaysImgs(options,0);
		}
		this.each(function(index, element){
			destructor.apply(element, [index, element, options]);
			init.apply(element, [index, element, options]);
		});
		$("<div />",{"id":"IEcontainer"}).appendTo($("body"));
		$("<div />",{"id":"IEcontrols"}).appendTo($("#IEcontainer"));
		for(var i in controls){
			var $div = $('<div />',{'class':'IEcontrol_icons '+i,'data-control-type':i})
			$div.append($('<i />',{'class':'fa '+controls[i],'aria-hidden':true}));
			$div.append($('<span />').text(i.toUpperCase()));
			$div.appendTo($("#IEcontrols"));
		}
		$("<div />",{"id":"IEshape_controls"}).appendTo($("#IEcontainer"));
		for(var i in shape_controls){
			var $div = $('<div />',{'class':'IEcontrol_icons '+i,'data-control-type':i})
			$div.append($('<i />',{'class':'fa '+shape_controls[i],'aria-hidden':true}));
			if(i == 'double sided arrow'){
				$div.append($('<span />',{'style':'font-size:10px;'}).text(i.toUpperCase()));
			} else {
				$div.append($('<span />').text(i.toUpperCase()));
			}
			$div.appendTo($("#IEshape_controls"));
		}
		if(shape_controls['overlays']){
			$("#IEshape_controls .IEcontrol_icons").css("width","16.66%");
		}
		$("#IEcontrols div").bind("click",function(){
			if($(this).hasClass("active"))
				return false;
			closeMeasure();
			var control_type = $(this).attr('data-control-type');
			$(".canvas-container").show();
			$("#IEcrop_image_ops, #IEmeasure_image_ops").hide();
			removeJcrop();
			$("#IEcoords_div").hide();
			$("#IEpoints, #IEmeasure_image").val('');
			$("#IEmeasure_image_ops > *").not("textarea").remove();
			$("#IEmeasure_image_ops textarea").removeAttr("data-image-url");
			switch(control_type){
				case 'text':
					addText();
					break;
				case 'draw':
					$(".canvas-container").hide();
					var widt = canvas.width*settings.curScale;
					var heig = canvas.height*settings.curScale;
					var le = canvas.width/2;
					var to = canvas.height/2;
					// $("#IEdraw_cont").css({width:widt,height:heig});
					$("#IEdraw_cont").css({'left':'calc(50% - '+le+'px)','top':'calc(50% - '+to+'px)'});
					$("#IEdraw_cont").css({width:canvas.width,height:canvas.height});
					$("#IEdraw_cont").show();
					canvas.discardActiveObject();
					var can = $("#IEdraw_canvas")[0];
					can.width = canvas.width;
					can.height = canvas.height;
					var cxt = can.getContext("2d");
					var img = new Image();
					img.onload = function(){
						cxt.drawImage(img,0,0,canvas.width,canvas.height);
						initDraw(cxt, img);
						showDialog('Press <kbd>escape</kbd> to close draw!', function(){
							setPoints();
						});
					}
					img.src = canvas.toDataURL();
					break;
				case 'shape':
					$("#IEshape_controls").addClass("active");
					break;
				case 'crop':
					canvas.discardActiveObject();
					croppedImage = canvas.toDataURL();
					// $("#IEcrop_image_ops").css({width:$(".canvas-container").width(),height:$(".canvas-container").height(),left:$(".canvas-container").css("left")});
					var widt = canvas.width*settings.curScale;
					var heig = canvas.height*settings.curScale;
					var le = widt/2;
					var to = heig/2;
					$("#IEcrop_image_ops").css({'left':'calc(50% - '+le+'px)','top':'calc(50% - '+to+'px)'});
					$("#IEcrop_image_ops").css({width:widt,height:heig});
					$(".canvas-container").hide();
					$("#IEcrop_image_ops").show();
					$('#IEimage_el').css({width:widt,height:heig});
					$('#IEimage_el').attr("src",croppedImage);
					$('#IEimage_el').Jcrop({
						onSelect : updateCoords,
						bgColor : ''
					});
					initCrop();
					break;
				case 'measure':
					measured_scale = 1;
					isCleaned = false;
					$("#IEratio, #IEreal_distance, #IEarea, #IEcalculated_distance").val('');
					canvas.discardActiveObject();
					croppedImage = canvas.toDataURL();
					// $("#IEmeasure_image_ops").css({width:$(".canvas-container").width(),height:$(".canvas-container").height(),left:$(".canvas-container").css("left")});
					$("#IEmeasure_image_ops").css({width:canvas.width,height:canvas.height});
					$(".canvas-container").hide();
					$("#IEmeasure_image_ops").show();
					// croppedImage = 'http://farm8.staticflickr.com/7259/6956772778_2fa755a228.jpg';
					var img = new Image();
					img.onload = function(){
						$("#IEmeasure_popup").addClass("active");
						$('#IEmeasure_image').attr("data-image-url",img.src);
						$("#IEmeasure_image").addClass("canvas-area");
						$('.canvas-area[data-image-url]').canvasAreaDraw({
							_resetPoint : function(e){
								// var point = e.offsetX+','+e.offsetY;
								var points = $('.canvas-area[data-image-url]').data("points");
								var set = vertex(points);
								$('#IEcalculated_distance').val(totalDistance(set).toFixed(2));
								$('#IEarea').val(calculateArea(set).toFixed(2));
							}
						});
						hideLoading();
					}
					showLoading();
					img.src = croppedImage;
					break;
				case 'save':
					var src = canvas.toDataURL();
					if(typeof settings.onSave == 'function'){
						settings.onSave(src);
					} else {
						var anchor_el = $('<a />',{'href':src,'download':filename+'.png'})[0];
						anchor_el.click();
					}
					break;
			}
			if(control_type == 'crop' || control_type == 'measure' || control_type == 'draw'){
				$(this).addClass("active");
			} else {
				$('#IEcontrols div').removeClass("active");
			}
		});
		$("#IEshape_controls div").bind("click",function(){
			var shape_control_type = $(this).attr('data-control-type');
			switch(shape_control_type){
				case 'arrow':
					addArrow();
					break;
				case 'double sided arrow':
					addDoubleArrow();
					break;
				case 'line':
					addLine();
					break;
				case 'rectangle':
					addRectangle();
					break;
				case 'circle':
					addCircle();
					break;
				case 'overlays':
					$(this).addClass("active");
					showOverlays();
					return false;
					break;
			}
			$(".IEcontrol_icons").removeClass("active");
			$("#IEshape_controls").removeClass("active");
		})
		$("<canvas />",{"id":"IEcanvas"}).appendTo($("#IEcontainer"));
		$('<div id="IEdraw_cont"><canvas id="IEdraw_canvas"></canvas></div>').appendTo($("#IEcontainer"));
		$('<div id="IEcrop_image_ops"><img id="IEimage_el" /></div>').appendTo($("#IEcontainer"));
		$('<div id="IEmeasure_image_ops"><textarea id="IEmeasure_image"></textarea></div>').appendTo($("#IEcontainer"));
		$('<div id="IEcoords_div"><div><textarea id="IEpoints"></textarea><i></i></div></div>').appendTo($("#IEcontainer"));
		$("<div />",{"id":"IEsettings"}).appendTo($("#IEcontainer"));
		$("#IEsettings").append($("<input type='range' id='IEscale' class='range-slider__range' min='0.1' step='0.01' />"))
		$("#IEsettings").append($("<div id='IEclose_icon'><i class='fa fa-times' aria-hidden='true'></i></div>"))
		$("<div />",{"id":"IEmeasure_popup"}).appendTo($("#IEcontainer"));
		$('<div />',{"id":"IEmessage"}).appendTo($("#IEcontainer"));
		$("#IEcontainer").append($("<div />",{"id":"IEloader"}));
		$("#IEcontainer").bind("dragover",function(e){
			eventHandler(e);
		});
		$("#IEcontainer").bind("drop",function(e){
			var files = e.originalEvent.dataTransfer.files;
			var fr = new FileReader();
			fr.onloadend = function(ev){
				var src = ev.target.result;
				fabric.Image.fromURL(src,function(nimg){
					makeCenterAndRedraw(nimg);
	            });
			}
			fr.readAsDataURL(files[0]);
			eventHandler(e);
		})
		// $("#IEloader").append($('<i />'));
		// $("#IEloader").html('<div class="blockG" id="rotateG_01"></div><div class="blockG" id="rotateG_02"></div><div class="blockG" id="rotateG_03"></div><div class="blockG" id="rotateG_04"></div><div class="blockG" id="rotateG_05"></div><div class="blockG" id="rotateG_06"></div><div class="blockG" id="rotateG_07"></div><div class="blockG" id="rotateG_08"></div>');
		var measure_props = ["Real Distance","Ratio", "Calculated Area", "Calculated Distance"];
		var $div = $('<div />',{'class':'IEmeasure_popup_head'});
		$div.append($('<span />').text('Measure properties'));
		$("#IEmeasure_popup").append($div);
		measure_props.forEach(function(a){
			var $div = $('<div />',{'class':'IEmeasure_popup_opts'});
			$div.append($('<span />').text(a));
			var id = '';
			var isDisabled = false;
			switch(a){
				case 'Real Distance':
					id = 'IEreal_distance';
					break;
				case 'Ratio':
					id = 'IEratio';
					isDisabled = true;
					break;
				case 'Calculated Area':
					id = 'IEarea';
					isDisabled = true;
					break;
				case 'Calculated Distance':
					id = 'IEcalculated_distance';
					isDisabled = true;
					break;
			}
			$div.append($('<input />',{'type':'text','data-measure_prop':a,'id':id,'disabled':isDisabled}));
			$("#IEmeasure_popup").append($div);
		})
		var $div = $('<div />',{'class':'IEmeasure_popup_opts'});
		$div.append($('<button />',{'type':'button','class':'IEclear_measure'}).text("Clear"));
		$div.append($('<button />',{'type':'button','class':'IEclose_measure'}).text("Close"));
		$("#IEmeasure_popup").append($div);
		$("#IEmeasure_popup").css("transform","translate3d(20px,"+(innerHeight-270)+"px,0)");
		if(options.show_props){
			$("<div />",{"id":"IEproperties_dialogs"}).appendTo($("#IEcontainer"));
		}
		$("#IEreal_distance").bind("input",function(){
			if(!isCleaned){
				var real_dis = parseFloat($("#IEreal_distance").val()) || 0;
				var calc_dis = parseFloat($("#IEcalculated_distance").val());
				if(calc_dis > 0){
					measured_scale = parseFloat(real_dis/calc_dis);
					$("#IEratio").val(measured_scale);
				}
			}
		})
		$("#IEclose_icon").bind("click",function(){
			closeEditor();
		});
		$("#IEscale").on("input",function(){
			var scale = $(this).val();
			var transform = $(".canvas-container")[0].style.transform;
			var translate = "";
			var st_left=0, st_top=0;
			if(transform.indexOf("translate") > -1){
				translate = transform.match(/translate.*?\)/)[0];
				if(translate){
					var translateInfo = translate.match(/[^(]\d+px/g);
					st_left = parseInt(translateInfo[0].replace(/[\spx]/g,''));
					st_top = parseInt(translateInfo[1].replace(/[\spx]/g,''));
				}
			}
			if(!$(this).data("isChangedProg")){
				if(scale > settings.curScale){
					$(".canvas-container, #IEmeasure_image_ops").addClass("IEmove_cursor");
				} else {
					$(".canvas-container, #IEmeasure_image_ops").removeClass("IEmove_cursor");
				}
				$(".canvas-container, #IEmeasure_image_ops, #IEdraw_cont").css("transform","translate3d("+st_left+"px,"+st_top+"px,0px) scale("+scale+")");
			}
		});
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
		$("#IEcoords_div i").bind("click",function(){
			closeMeasure();
		})
		initSettings(function(){
			if(method){
				if(selector.length > 1){
					console.error("Mathcing selectors are more than one.");
					return false;
				}
				switch(method){
					case 'show':
						selector.trigger('click');
						break;
					case 'hide':
						closeEditor();
						break;
					case 'measure':
						selector.trigger('click');
						settings.onReady = function(){
							$(".IEcontrol_icons.measure").click();
						}
						break;
					case 'crop':
						selector.trigger('click');
						settings.onReady = function(){
							$(".IEcontrol_icons.crop").click();
						}
						break;
					case 'save':
						selector.trigger('click');
						settings.onReady = function(){
							$(".IEcontrol_icons.save").click();
						}
						break;
				}
			}
		});
	}

	var init = function(index, element, options){
		$(element).bind("click",function(e){
			isCleaned = false;
			measured_scale = 1;
			if(options.onClick == 'function'){
				options.onClick(e);
			}
			$("#IEreal_distance, #IEarea, #IEcalculated_distance").val('');
			var src = $(this).attr("src");
			if(src.indexOf('data:') == 0){
				filename = 'image_'+(Date.now()%10000).toString();
			}
			filename = getFileName(src);
			if(src){
				var img = new Image();
				img.onload = function(){
					var imgWidth = img.naturalWidth;
					var imgHeight = img.naturalHeight;
					settings.imgWidth = imgWidth;
					settings.imgHeight = imgHeight;
					if(settings.contHeight < settings.imgHeight){
						settings.contWidth = settings.imgWidth*settings.contHeight/settings.imgHeight;
					} else if(settings.contWidth < settings.imgWidth) {
						settings.contHeight = settings.imgHeight*settings.contWidth/settings.imgWidth;
					}
					var canvasWidth = Math.min(imgWidth,settings.contWidth);
					var canvasHeight = Math.min(imgHeight,settings.contHeight);
					canvasWidth = imgWidth;
					canvasHeight = imgHeight;
					$("#IEcanvas").attr({Width:canvasWidth,Height:canvasHeight});
					fabric.Object.prototype.cornerColor = settings.controlsColor;
					fabric.Object.prototype.borderColor = settings.borderColor;
					fabric.Object.prototype.borderOpacityWhenMoving = 1;
					canvas = new fabric.Canvas('IEcanvas',{
						// fillStyle : 'red',
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
					canvas.on("object:selected",function(event){
						selectedObj = canvas.getActiveObject();
						if(selectedObj){
							$("#IEproperties_dialogs").show();
							if(!selectedObj.isMain){
								selectedObj.bringToFront();
							}
							showProperties();
							setProperties();
						} else {
							$("#IEproperties_dialogs").hide();
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
					setPositionsOfInnerElements();
					showLoading();
					getBase64(img.src,function(src){
						fabric.Image.fromURL(src,function(nimg){
							nimg.selectable = false;
							nimg.hasControls = false;
							nimg.hasBorders = false;
							nimg.mainImage = true;
							if((settings.contWidth - nimg.width)/2 < 0){
								if(settings.contHeight/settings.imgHeight < settings.contWidth/settings.imgWidth){
									settings.curScale = settings.contHeight/settings.imgHeight;
								} else {
									settings.curScale = settings.contWidth/settings.imgWidth;
								}
								// nimg.scale(currentScale);
								$(".canvas-container, #IEmeasure_image_ops, #IEdraw_cont").css("transform","scale("+settings.curScale+")");
								// $(".canvas-container").css("transform","scale(1)");
							}
			            	canvas.add(nimg);
			                canvas.centerObject(nimg);
						    nimg.setCoords();
						    canvas.renderAll();
						    nimg.isMain = true;
						    hideLoading();
						    if(settings.onReady == 'function')
							    settings.onReady();
			            });
			            resetScaleLimit();
					});
		            $(".canvas-container, #IEmeasure_image_ops, #IEdraw_cont").bind("mousewheel",function(e){
						var delta = e.originalEvent.wheelDelta/120;
						var curScale = parseFloat($("#IEscale").val());
						if(delta > 0){
							curScale -= 0.01;
						} else if(delta < 0){
							curScale += 0.01;
						}
						$("#IEscale").val(curScale).trigger("input");
						eventHandler(e);
						return false;
					})
		            // if((settings.contWidth - imgWidth)/2 < 0){
		            // 	var currentScale = (settings.contWidth/imgWidth).toFixed(2);
		            // 	$(".canvas-container").css("transform","scale("+currentScale+")");
		            // }
		            // hideLoading();
				}
				showLoading();
				img.crossOrigin = 'Anonymous';
				img.src = src;
			}
			$("#IEcontainer").addClass("active");
		});
		var options = $.extend(settings,options);
		$(element).data("ImageEdit",options);
		$(element).attr("crossOrigin","Anonymous");
	}

	var destructor = function(index, element, options){
		if($(element).data("ImageEdit")){
			$("#IEcontainer").remove();
			$(element).removeData('ImageEdit');
			$(element).unbind('click');
			$(element).removeAttr("crossOrigin");
		}
	}

	var resetSize = function(){
		resetScaleLimit();
	}
	var setPositionsOfInnerElements = function(){
		var containerWidth = $(".canvas-container").width()/2;
		var containerHeight = $(".canvas-container").height()/2;
        $(".canvas-container, #IEmeasure_image_ops, #IEdraw_cont").css("left","calc(50% - "+containerWidth+"px)");
        $(".canvas-container, #IEmeasure_image_ops, #IEdraw_cont").css("top","calc(50% - "+containerHeight+"px)");
	}
	var resetScaleLimit = function(){
		settings.contWidth = innerWidth*0.8;
		settings.contHeight = innerHeight*0.8;
		if(settings.contHeight/settings.imgHeight < settings.contWidth/settings.imgWidth){
			settings.curScale = settings.contHeight/settings.imgHeight;
		} else {
			settings.curScale = settings.contWidth/settings.imgWidth;
		}
		if(settings.curScale > 1){
			settings.curScale = 1;
		}
		fabric.Object.prototype.borderScaleFactor = settings.curScale;
        $("#IEscale").data("isChangedProg",true);
        if(settings.minScale > settings.curScale){
        	settings.minScale = settings.curScale.toFixed(2);
        }
        $("#IEscale").attr("min",settings.minScale);
        $("#IEscale").attr("max",settings.maxScale);
        $("#IEscale").val(settings.curScale);
        $(".canvas-container, #IEmeasure_image_ops, #IEdraw_cont").css("transform","scale("+settings.curScale+")");
        $("#IEscale").data("isChangedProg","");
        $(".canvas-container, #IEmeasure_image_ops, #IEdraw_cont").unbind("mousedown");
        $(".canvas-container, #IEmeasure_image_ops, #IEdraw_cont").bind("mousedown",function(event){
			var clientX = event.pageX;
			var clientY = event.pageY;
			var transform = $(".canvas-container")[0].style.transform;
			var scale = "", translate = "";
			var st_left=0, st_top=0;
			if(transform.indexOf("scale") > -1){
				scale = transform.match(/scale.*?\)/)[0];
			}
			if(transform.indexOf("translate") > -1){
				translate = transform.match(/translate.*?\)/)[0];
				if(translate){
					var translateInfo = translate.match(/[^(]\d+px/g);
					st_left = parseInt(translateInfo[0].replace(/[\spx]/g,''));
					st_top = parseInt(translateInfo[1].replace(/[\spx]/g,''));
				}
			}
			$("#IEcontainer").bind("mousemove",function(e){
				if(e.shiftKey){
					var left = e.pageX-clientX+st_left;
					var top = e.pageY-clientY+st_top;
					$(".canvas-container, #IEmeasure_image_ops, #IEdraw_cont").css("transform",'translate3d('+left+'px,'+top+'px,0px) '+scale+'');
				}
			});
			$("#IEcontainer").bind("mouseup",function(){
				$("#IEcontainer").unbind("mousemove mouseup");
			})
		})
	}
	var initSettings = function(callback){
		// resetSize();
		createPropertyDialogs(function(){
			$("#search_el").bind("input",function(){
				var q = $(this).val();
				if(q == ""){
					$(".searchable").show();
				} else {
					q = q.toLowerCase();
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
					$("#IEproperties_dialogs").css('transform','translate3d('+left+'px,'+top+'px,0px)');
				});
				$("*").bind("mouseup",function(){
					$("*").unbind("mousemove mouseup");
				})
			})
			$(".prop_body input").bind("input",function(){
				var val = $(this).val();
				var el_prop = $(this).attr('title');
				if($(this).attr("type") == "number"){
					val = parseFloat(val);
				}
				applyProp(el_prop, val);
			})
			$(".prop_body input[type='checkbox']").bind("change",function(){
				var val = $(this).is(":checked");
				var el_prop = $(this).attr('title');
				applyProp(el_prop, val);
			})
			$(".prop_body select").bind("change",function(){
				var val = $(this).val();
				var el_prop = $(this).attr('title');
				applyProp(el_prop, val);
			})
			// Measure bindings

			$("#IEmeasure_popup .IEmeasure_popup_head").bind("mousedown",function(event){
				var clientX = event.offsetX;
				var clientY = event.offsetY;
				$("#IEcontainer").bind("mousemove",function(e){
					var left = e.pageX-clientX;
					var top = e.pageY-clientY;
					$("#IEmeasure_popup").css('transform','translate3d('+left+'px,'+top+'px,0px)');
				});
				$("#IEcontainer").bind("mouseup",function(){
					$("#IEcontainer").unbind("mousemove mouseup");
				})
			})
			$(".IEclear_measure").bind("click",function(){
				isCleaned = true;
				$("#IEreal_distance").val('');
				$("#IEarea").val('');
				$("#IEcalculated_distance").val('');
				$("#IEmeasure_image").data("points",[]);
				var reset = $("#IEmeasure_image").data("reset");
				if(typeof reset == 'function'){
					reset();
				}
			})
			$(".IEclose_measure").bind("click",function(){
				closeMeasure();
			});
			if(typeof callback == 'function'){
				callback();
			}
		});
	}
	var applyProp = function(el_prop, val){
		if(selectedObj){
			if(el_prop in selectedObj)
				selectedObj[el_prop] = val;
			if(selectedObj.type == 'path-group'){
				selectedObj.paths.forEach(function(a){
					if(el_prop in a){
						a[el_prop] = val;
						if(el_prop == 'fill' || el_prop == 'stroke'){
							a['fill'] = val;
							a['stroke'] = val;
						}
					}
				})
			}
			selectedObj.setCoords();
			canvas.renderAll();
			setTimeout(function(){
				if(canvas)
					canvas.renderAll();
			},1000);
		}
	}
	var deleteSelectedObj = function(){
	    var activeObject = canvas.getActiveObject(), activeGroup = canvas.getActiveGroup();
	    if(!activeObject.mainImage && confirm("Are you sure you want to remove this element?")){
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
	var closeEditor = function(){
		canvas.dispose();
		$("#IEcontainer").removeClass("active");
		closeMeasure();
	}
	var addText = function(){
		var text = settings.text;
	    var textSample = new fabric.IText(text, {
			fontFamily: settings.font,
			angle: 0,
			fontSize: settings.fontSize,
			fill: settings.color,
			hasRotatingPoint: true,
			centerTransform: true,
			editable : true
	    });
	    makeCenterAndRedraw(textSample);
	}
	var makeCenterAndRedraw = function(elem){
		canvas.add(elem);
		canvas.centerObject(elem);
	    elem.setCoords();
	    canvas.setActiveObject(elem);
	    canvas.renderAll();
	}
	var createPropertyDialogs = function(callback){
		var mainPropEl = $('<div />',{'class':'prop_body'});
		for(var i in properties){
			var parentEl = $('<div />',{'class':i});
			var props = properties[i];
			for(var j in props){
				var val = props[j];
				var j_title = j.toLowerCase();
				switch(val){
					case 'number':
						parentEl.append($('<div class="searchable" title="'+j_title+'"><span>'+j+'</span><input type="number" title="'+j+'" min="0" /></div>'));
						break;
					case 'text':
						parentEl.append($('<div class="searchable" title="'+j_title+'"><span>'+j+'</span><input type="text" title="'+j+'" /></div>'));
						break;
					case 'checkbox':
						parentEl.append($('<div class="searchable" title="'+j_title+'"><span>'+j+'</span><input type="checkbox" title="'+j+'" /></div>'));
						break;
					case 'range':
						parentEl.append($('<div class="searchable" title="'+j_title+'"><span>'+j+'</span><input type="range" title="'+j+'" min="0" step="0.01" max="1" value="1" /></div>'));
						break;
					case 'color':
						parentEl.append($('<div class="searchable" title="'+j_title+'"><span>'+j+'</span><input type="color" title="'+j+'" /></div>'));
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
		$("#IEproperties_dialogs").append('<div id="prop_head"><span>Properties</span><input type="search" id="search_el" placeholder="Search properties" /></div>');
		$("#IEproperties_dialogs").append(mainPropEl);
		setTimeout(function(){
			if(typeof callback == 'function'){
				callback();
			}
		},500);
	}

	var showProperties = function(){
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

	var setOverlaysImgs = function(opts, idx){
		if(idx == 0){
			settings.overlayImgs = [];
		}
		if(opts.overlays[idx]){
			var img = new Image();
			img.onload = function(){
				settings.overlayImgs.push(img);
				idx++;
				setOverlaysImgs(opts, idx);
			}
			img.src = opts.overlays[idx];
		} else {
			$('<div />',{'id':'IEoverlays'}).appendTo($('.overlays'));
			$('<div />',{'class':'IEtriangle'}).appendTo($('#IEoverlays'));
			$('<div />',{'id':'IEoverlay_box'}).appendTo($('#IEoverlays'));
			settings.overlayImgs.forEach(function(img){
				$(img).appendTo($('#IEoverlay_box'));
			});
			$('#IEoverlay_box img').bind("click",function(){
				var src = $(this).attr('src');
				fabric.Image.fromURL(src,function(nimg){
					makeCenterAndRedraw(nimg);
	            });
			})
		}
	}

	function showOverlays(){
		$("#IEcontainer").one('click',function(){
			$(".IEcontrol_icons.overlays").removeClass("active");
			$("#IEshape_controls").removeClass("active");
		})
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
			if(selectedVal !== "" && selectedVal != null && selectedVal != undefined){
				if(this.type == 'color'){
					if(selectedVal.indexOf('rgb') == -1){
						var d = document.createElement("div");
						d.style.color = selectedVal;
						document.body.appendChild(d);
						selectedVal = window.getComputedStyle(d).color;
						document.body.removeChild(d);
					}
					selectedVal = rgbToHex(selectedVal);
				}
				$(this).val(selectedVal);
			}
		})
		$("#IEproperties_dialogs").css("transform","translate3d("+(innerWidth-220)+"px,60px,0)");
	}

	var loadFonts = function(callback){
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

	var initDraw = function(cxt, img){
		drawPoints = [];
		$("#IEdraw_cont").bind("mousedown",function(e){
			var x = e.offsetX;
			var y = e.offsetY;
			if(e.shiftKey){
				return false;
			}
			selectedPoint = nearestPoint(x,y);
			if(!selectedPoint){
				drawPoints.push([x,y]);
				showPointsOnDraw(cxt, img);
			}
			$("#IEdraw_cont").bind("mousemove",function(ev){
				var x1 = ev.offsetX;
				var y1 = ev.offsetY;
				var idx = drawPoints.indexOf(selectedPoint);
				selectedPoint = [x1,y1];
				drawPoints.splice(idx,1,selectedPoint);
				showPointsOnDraw(cxt, img);
			});
			$("#IEdraw_cont").bind("mouseup",function(){
				$("#IEdraw_cont").unbind("mousemove mouseup");
			})
			eventHandler(e);
		});
	}

	var showPointsOnDraw = function(cxt, img){
		cxt.clearRect(0,0,cxt.canvas.width,cxt.canvas.height);
		cxt.globalCompositeOperation = 'destination-over';
		cxt.fillStyle = 'white';
		cxt.strokeStyle = settings.drawStrokeColor;
		cxt.lineWidth = 1;
		cxt.beginPath();
		cxt.moveTo(drawPoints[0][0], drawPoints[0][1]);
		for (var i = 0; i < drawPoints.length; i+=1) {
			cxt.fillRect(drawPoints[i][0]-3, drawPoints[i][1]-3, 6, 6);
			cxt.strokeRect(drawPoints[i][0]-3, drawPoints[i][1]-3, 6, 6);
			if (drawPoints.length >= 2 && i >= 1) {
				cxt.lineTo(drawPoints[i][0], drawPoints[i][1]);
			}
		}
		cxt.closePath();
		cxt.fillStyle = settings.drawFillColor;
		cxt.fill();
		cxt.stroke();
		cxt.globalCompositeOperation = 'destination-over';
		cxt.drawImage(img,0,0,cxt.canvas.width,cxt.canvas.height);
	}

	var nearestPoint = function(x,y){
		var distances = {};
		drawPoints.forEach(function(p){
			var dist = Math.sqrt(Math.pow((x-p[0]),2) + Math.pow((y-p[1]),2));
			distances[dist] = p;
		});
		var sortedKeys = Object.keys(distances);
		sortedKeys = sortedKeys.map(function(k){
			return parseFloat(k);
		})
		sortedKeys.sort(function(a,b){
			return a-b;
		});
		var idxOfDrawPoints = false;
		if(sortedKeys[0] < settings.minDistance){
			// if(sortedKeys.length > 2){
			// 	var a = distances[sortedKeys[0]];
			// 	var b = distances[sortedKeys[1]];
			// 	var c = [x,y];
			// 	if(calcPerpendicularDistance(a,b,c) < settings.minDistance){
			// 		idxOfDrawPoints = Math.min(drawPoints.indexOf(distances[sortedKeys[0]]),drawPoints.indexOf(distances[sortedKeys[1]]));
			// 	}
			// }
			// if(idxOfDrawPoints == false)
				return distances[sortedKeys[0]];
		}
		return idxOfDrawPoints;
	}

	var calcPerpendicularDistance = function(a, b, c){
		return 2*areaOfTriangle(a,b,c) / distance(a[0], a[1], b[0], b[1]);
		// return ((b[0]-a[0])*(a[1]-b[1]) - (a[0]-c[0])*(b[1]-a[1]))/(Math.sqrt((b[0]-a[0])**2 + (b[1]-a[1])**2));
	}

	var areaOfTriangle = function(a, b, c){
		return Math.abs(a[0]*(b[1]-c[1]) + b[0]*(c[1]-a[1]) + c[0]*(a[1]-b[1]))/2;
	}

	var setPoints = function(){
		if(drawPoints.length > 2){
			var x_min = Math.min.apply([],drawPoints.map(function(p){return p[0];}));
			var y_min = Math.min.apply([],drawPoints.map(function(p){return p[1];}));
			drawPoints = drawPoints.map(function(p){return [p[0]-x_min,p[1]-y_min];});
			var x_max = Math.max.apply([],drawPoints.map(function(p){return p[0];}));
			var y_max = Math.max.apply([],drawPoints.map(function(p){return p[1];}));
			var svg_str = '<svg width="'+x_max+'" height="'+y_max+'"><polygon points="'+drawPoints.join(' ')+'" style="fill:'+settings.drawFillColor+';stroke:'+settings.drawStrokeColor+';stroke-width:1" /></svg>';
			fabric.loadSVGFromString(svg_str,function(objects, options){
				var loadedObject = fabric.util.groupSVGElements(objects, options);
				loadedObject.left = x_min;
				loadedObject.top = y_min;
				loadedObject.selectable = false;
				loadedObject.hasControls = false;
				loadedObject.hasBorders = false;
				canvas.add(loadedObject);
				loadedObject.setCoords();
			    canvas.renderAll();
				$(".canvas-container").show();
				$("#IEdraw_cont").hide();
				$(".IEcontrol_icons").removeClass('active');
			})
		} else if(drawPoints.length == 0){
			$(".canvas-container").show();
			$("#IEdraw_cont").hide();
			$(".IEcontrol_icons").removeClass('active');
		} else {
			alert("Please set atleast 3 points to create an overlay!");
			return false;
		}
	}

	function initCrop(recurred_again){
		setPositionsOfInnerElements();
		var target_el = $(".jcrop-holder > div:eq(0) > div:eq(0)");
		if(target_el.length == 0 && !recurred_again){
			initCrop(true);
		}
		var tick_icon = $('<span />',{'class':'crop_icon tick'});
		var close_icon = $('<span />',{'class':'crop_icon close'});
		tick_icon.insertAfter(target_el);
		close_icon.insertAfter(target_el);
		close_icon.bind("click",function(){
			removeJcrop();
			$(".canvas-container").show();
			$("#IEcrop_image_ops").hide();
			$("#IEscale").show();
			$('#IEcontrols div').removeClass("active");
		});
		tick_icon.bind("click",function(){
			var can = document.createElement('canvas');
			var img = new Image();
			img.onload = function(){
				can.width = img.naturalWidth;
				can.height = img.naturalHeight;
				var cxt = can.getContext('2d');
				coords.x *= devicePixelRatio;
				coords.y *= devicePixelRatio;
				coords.w *= devicePixelRatio;
				coords.h *= devicePixelRatio;
				// adjusting coords to scale
				coords.x /= settings.curScale;
				coords.y /= settings.curScale;
				coords.w /= settings.curScale;
				coords.h /= settings.curScale;
				cxt.drawImage(img,0,0);
				var data = cxt.getImageData(coords.x,coords.y,coords.w,coords.h);
				var temp_can = document.createElement('canvas');
				temp_can.width = coords.w;
				temp_can.height = coords.h;
				var temp_cxt = temp_can.getContext('2d');
				temp_cxt.putImageData(data,0,0);
				var croppedSrc = temp_can.toDataURL();
				$(".canvas-container").show();
				$("#IEcrop_image_ops").hide();
				// canvas.clear();
				fabric.Image.fromURL(croppedSrc,function(nimg){
					canvas.clear();
					canvas.setWidth(nimg.width);
					canvas.setHeight(nimg.height);
					nimg.selectable = false;
					nimg.hasControls = false;
					nimg.hasBorders = false;
					nimg.mainImage = true;
					settings.imgWidth = nimg.width;
					settings.imgHeight = nimg.height;
					canvas.add(nimg);
					resetSize();
					setTimeout(function(){
						setPositionsOfInnerElements();
			            removeJcrop();
					},300);
					$('#IEcontrols div').removeClass("active");
		            hideLoading();
					// canvas.add(nimg);
					// canvas.centerObject(nimg);
					// nimg.setCoords();
					// canvas.setActiveObject(nimg);
					// canvas.renderAll();
	            })
			}
			showLoading();
			// img.crossOrigin = 'Anonymous';
			img.src = croppedImage;
		});
		$("#IEscale").hide();
	}

	var removeJcrop = function(){
		var jcrop_obj = $('#IEimage_el').data('Jcrop');
		if(jcrop_obj)
			jcrop_obj.destroy();
		$("#IEcrop_image_ops, #IEimage_el").removeAttr("style");
		$("#IEimage_el").removeAttr("src");
		resetScaleLimit();
		$("#IEscale").show();
	}

	var updateCoords = function(e){
		coords = {
			x : e.x,
			y : e.y,
			w : e.w,
			h : e.h
		}
	}

	var closeMeasure = function(){
		$('#IEcontrols div').removeClass("active");
		$("#IEmeasure_popup").removeClass("active");
		$("#IEcoords_div").hide();
		$("#IEmeasure_image_ops").hide();
		$("#IEdraw_cont").hide();
		$(".canvas-container").show();
		$("#IEmeasure_image_ops > *").not("textarea").remove();
		$("#IEmeasure_image_ops textarea").removeAttr("data-image-url");
	}
	/*Measure methods*/

	var vertex = function(group) {
		var pairArray = [];
		for (var i = 0; i < group.length; i++) {
			var pair = { x: parseInt(group[i]), y: parseInt(group[i + 1]) }
			pairArray.push(pair);
			i++;
		}
		return pairArray;
	}

	var totalDistance = function(vertices) {
		var total = 0;
		for (var i = 0; i < vertices.length - 1; i++) {
			var x1 = vertices[i + 1].x;
			var x2 = vertices[i].x;
			var y1 = vertices[i + 1].y;
			var y2 = vertices[i].y;
			total += distance(x1, y1, x2, y2);
		}
		/*	distance between first and last vertex */
		if(vertices.length > 2){
			var x1 = vertices[vertices.length - 1].x;
			var x2 = vertices[0].x;
			var y1 = vertices[vertices.length - 1].y;
			var y2 = vertices[0].y;
			total += distance(x1, y1, x2, y2);
		}
		return total;
	}

	var calculateArea = function(vertices) {
		var area = 0;
		var j = vertices.length - 1;
		for (var i = 0; i < vertices.length; i++) {
			area += ((vertices[j].x + vertices[i].x) * measured_scale) * ((vertices[j].y - vertices[i].y) * measured_scale);
			j = i;
		}
		return Math.abs(area / 2);
	}

	var distance = function (x1, y1, x2, y2) {
		var a = (x1 - x2) * measured_scale;
		var b = (y1 - y2) * measured_scale;
		var currentDistance = Math.sqrt(a * a + b * b);
		return currentDistance;
	}

	/*shapes*/

	var addArrow = function(){
		var obj = canvas.getCenter();
		var top = Math.round(obj.top);
		var left = Math.round(obj.left);
		var str = '';
		str += SVG_START.replace('{X}','0').replace('{Y}','0').replace('{W}','50').replace('{H}','20');
		str += MARKER+''+LINE.replace('{X1}',2).replace('{X2}',45).replace('{Y1}',10).replace('{Y2}',10).replace('{S}',settings.color).replace('{SW}','5');
		str += SVG_END;
		fabric.loadSVGFromString(str,function(objects, options){
			objects.forEach(function(a){
				a.fill = settings.color;
			})
			var loadedObject = fabric.util.groupSVGElements(objects, options);
			makeCenterAndRedraw(loadedObject);
		})
	}

	var addDoubleArrow = function(){
		var obj = canvas.getCenter();
		var top = Math.round(obj.top);
		var left = Math.round(obj.left);
		var str = '';
		str += SVG_START.replace('{X}','0').replace('{Y}','0').replace('{W}','50').replace('{H}','20');
		str += REVMARKER+''+LINE.replace('{X1}',10).replace('{X2}',45).replace('{Y1}',10).replace('{Y2}',10).replace('{S}',settings.color).replace('{SW}','5');
		str += SVG_END;
		fabric.loadSVGFromString(str,function(objects, options){
			objects.forEach(function(a){
				a.fill = settings.color;
			})
			var loadedObject = fabric.util.groupSVGElements(objects, options);
			makeCenterAndRedraw(loadedObject);
		})
	}

	var addLine = function(){
		var lineObj = new fabric.Line([ 0, 100, 100, 100], {
	      stroke : settings.color,
	      strokeWidth : 2
	    });
	    makeCenterAndRedraw(lineObj);
	}

	var addRectangle = function(){
		var rectObj = new fabric.Rect({
	      fill: 'transparent',
	      width: 150,
	      height: 100,
	      stroke : settings.color,
	      strokeWidth : 2
	    })
	    makeCenterAndRedraw(rectObj);
	}

	var addCircle = function(){
		var cirObj = new fabric.Circle({
			fill: 'transparent',
			radius: 50,
			stroke : settings.color,
			strokeWidth : 2
		})
		makeCenterAndRedraw(cirObj);
	}
	var getBase64 = function(remote_src,callback){
		var img = new Image();
		img.onload = function(){
			var can = document.createElement('canvas');
			can.width = img.naturalWidth;
			can.height = img.naturalHeight;
			var cxt = can.getContext('2d');
			cxt.drawImage(img,0,0);
			hideLoading();
			callback(can.toDataURL());
		}
		showLoading();
		img.crossOrigin = 'Anonymous';
		img.src = remote_src;
	}
	var rgbToHex = function(color) {
	    if (color.substr(0, 1) === "#") {
	        return color;
	    }
	    var nums = /(.*?)rgb\((\d+),\s*(\d+),\s*(\d+)\)/i.exec(color),
	        r = parseInt(nums[2], 10).toString(16),
	        g = parseInt(nums[3], 10).toString(16),
	        b = parseInt(nums[4], 10).toString(16);
	    return "#"+ (
	        (r.length == 1 ? "0"+ r : r) +
	        (g.length == 1 ? "0"+ g : g) +
	        (b.length == 1 ? "0"+ b : b)
	    );
	}
	var eventHandler = function(e){
		e.preventDefault();
		e.stopPropagation();
		e.stopImmediatePropagation();
		return false;
	}
	var getFileName = function(url){
	   if (url){
	      var m = url.toString().match(/.*\/(.+?)\./);
	      if (m && m.length > 1){
	         return m[1];
	      }
	   }
	   return "";
	}

	var showLoading = function(){
		$("#IEloader").addClass("active");
	}
	var hideLoading = function(){
		$("#IEloader").removeClass("active");
	}
	var showDialog = function(msg, callback){
		$("#IEmessage").html(msg).removeClass().addClass('bounceIn animated');
		setTimeout(function(){
			$("#IEmessage").removeClass().addClass('bounceOut animated');
			setTimeout(function(){
				$("#IEmessage").removeClass().html('');
			},1000);
		},3000);
		$("body").unbind("keyup");
		$("body").bind("keyup",function(e){
			if(e.keyCode == 27 && typeof(callback) == 'function'){		// on pressing escape key
				callback();
				callback = '';
			}
		})
	}
	$(_window).on("resize",resetSize);
})(jQuery, window);