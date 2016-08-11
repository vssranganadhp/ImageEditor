(function($, _window){
	var settings = {
		contWidth : 0,
		contHeight : 0,
		minScale : 0.3,
		maxScale : 1
	};
	var controls = {'text':'fa-pencil-square-o', 'shape':'fa-square-o', 'crop':'fa-crop', 'measure':'fa-expand'};
	var canvas;
	$.fn.imageEdit = function(options){
		this.each(function(index, element){
			init.apply(element, [index, element, options]);
		});
		$("<div />",{"id":"image_editor_container"}).appendTo($("body"));
		$("<div />",{"id":"image_editor_controls"}).appendTo($("#image_editor_container"));
		for(var i in controls){
			var $div = $('<div />',{'class':'image_editor_control_icons '+i,'data-control-type':i})
			$div.append($('<i />',{'class':'fa '+controls[i],'aria-hidden':true}));
			$div.append($('<span />').text(i.toUpperCase()));
			$div.appendTo($("#image_editor_controls"));
		}
		$("#image_editor_controls div").bind("click",function(){
			var control_type = $(this).attr('data-control-type');
			switch(control_type){
				case 'text':
					addText();
					break;
			}
		})
		$("<canvas />",{"id":"image_editor_canvas"}).appendTo($("#image_editor_container"));
		$("<div />",{"id":"image_editor_settings"}).appendTo($("#image_editor_container"));
		$("#image_editor_settings").append($("<input type='range' id='image_editor_scale' />"))
		$("#image_editor_settings").append($("<div id='image_editor_close_icon'><i class='fa fa-times' aria-hidden='true'></i></div>"))
		$("#image_editor_close_icon").bind("click",function(){
			closeEditor();
		});
		$("#image_editor_scale").on("change",function(){

		});
		initSettings();
	}

	var init = function(index, element, options){
		$(element).bind("click",function(){
			var src = $(this).attr("src");
			if(src){
				var img = new Image();
				img.onload = function(){
					var imgWidth = img.naturalWidth;
					var imgHeight = img.naturalHeight;
					var canvasWidth = Math.min(imgWidth,settings.contWidth);
					var canvasHeight = Math.min(imgHeight,settings.contHeight);
					$("#image_editor_canvas").attr({Width:canvasWidth,Height:canvasHeight});
					canvas = new fabric.Canvas('image_editor_canvas');
					fabric.Image.fromURL(img.src,function(nimg){
						nimg.selectable = false;
						nimg.hasControls = false;
						nimg.hasBorders = false;
						if((settings.contWidth - nimg.width)/2 < 0){
							var currentScale = (settings.contWidth/nimg.width).toFixed(2);
							nimg.scale(currentScale);
						}
		            	canvas.add(nimg);
		                canvas.centerObject(nimg);
					    nimg.setCoords();
					    canvas.renderAll();
		            });
		            settings.maxScale = settings.contHeight/imgHeight;
		            var containerWidth = $(".canvas-container").width()/2;
		            $(".canvas-container").css("left","calc(50% - "+containerWidth+"px)");
		            // if((settings.contWidth - imgWidth)/2 < 0){
		            // 	var currentScale = (settings.contWidth/imgWidth).toFixed(2);
		            // 	$(".canvas-container").css("transform","scale("+currentScale+")");
		            // }
				}
				img.src = src;
			}
			$("#image_editor_container").addClass("active");
		});
		$(element).data("ImageEdit",options);
	}
	var resetSize = function(){
		settings.contWidth = innerWidth*0.9;
		settings.contHeight = innerHeight*0.9;
	}
	var initSettings = function(){
		resetSize();
	}
	var closeEditor = function(){
		canvas.dispose();
		$("#image_editor_container").removeClass("active");
	}
	var addText = function(){
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
	var makeCenterAndRedraw = function(elem){
		canvas.add(elem);
		canvas.centerObject(elem);
	    elem.setCoords();
	    canvas.setActiveObject(elem);
	    canvas.renderAll();
	}
	$(_window).on("resize",resetSize);
})(jQuery, window);