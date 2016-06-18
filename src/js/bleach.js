(function(factory) {
    
    if (typeof define === 'function' && define.amd) {
        define(['jquery'], factory);
    } else if (typeof exports !== 'undefined') {
        module.exports = factory(require('jquery'));
    } else {
        factory(jQuery);
    }

}(function($){
	//'use strict';
	var Bleach = window.Bleach || {};

	Bleach = (function(){

		var Components = function(){

		   	var _ = this ;

		   	var circleLoader = function(elem,opt){
								var _ = this;
						   		$(elem).append('<canvas class="loader" width=120 height=120 ></canvas>');	
								var bg = $(elem).find('.loader')[0];

								var circle = bg.getContext('2d');
								var centerX = bg.width / 2;
								var centerY = bg.height / 2;
								var radius = 50;

								  circle.beginPath();
								  circle.arc(centerX, centerY, radius, 0, 2 * Math.PI, false);
								  circle.fillStyle =  "rgba(156, 156, 156, 0.35)";
								  circle.fill();

						   		_.load = function(current) {
											var ctx = bg.getContext('2d');
											var imd = null;
											var circ = Math.PI * 2;
											var quart = Math.PI / 2;

											ctx.beginPath();
											ctx.strokeStyle = opt.loaderColor;
											ctx.lineCap = 'round';
											ctx.closePath();
											ctx.fill();
											ctx.lineWidth = 10.0;

											imd = ctx.getImageData(0, 0, 60, 60);
										    ctx.putImageData(imd, 0, 0);
										    ctx.beginPath();
										    ctx.arc(60, 60, 35, -(quart), ((circ) * current) - quart, false);
										    ctx.stroke();
								_.destroy = function(){ $(elem).find('canvas').remove() }
							   	}
					return _;
		   	};

		   	_.methods = {


			   	svgFilter : function (width,height,src){

			   						var deviation = (height/100) * 22;
			   						
									return  '<svg xmlns="http://www.w3.org/2000/svg"\
										 	xmlns:xlink="http://www.w3.org/1999/xlink"\
											width="'+width+'" height="'+height+'"\
											viewBox="0 0 '+width+' '+height+'">\
											<filter id="blur" filterUnits="userSpaceOnUse" color-interpolation-filters="sRGB">\
											<feGaussianBlur stdDeviation="'+deviation+'" edgeMode="duplicate" />\
											<feComponentTransfer>\
											<feFuncA type="discrete" tableValues="1 1" />\
											</feComponentTransfer>\
											</filter>\
											<image filter="url(#blur)" xlink:href="'+src+'" x="0" y="0" height="'+height+'px" width="'+width+'px"/>\
											</svg>'
								},

			    encodedSvg : function(svg_filter){ return encodeURIComponent(svg_filter)},

			    fetchRealImage : function(element,src,opt){
					    			 var request = new XMLHttpRequest();
					    			 var loader = new circleLoader(element,opt); // initialize circleLoader

					    			 request.open('GET',src,true);

					    			 request.responseType = "blob";

					 

					    			 request.onloadstart = function (){	
					    			 		loader.load(0/100); //default value for start
					    			 }


					    			 request.onprogress = function(e){
					    			 	if(e.lengthComputable){
					    			 		loader.load(e.loaded/e.total);
					    			 	}
					    			 }

					    			 request.onloadend = function(e){
								    			 	loader.load(e.loaded/e.total);

								    			 	var reader = new FileReader();

								    			 	reader.readAsDataURL(this.response);
								    			 	reader.onload = function(){
								    			 		loader.destroy();
								    			  		$(element).css('background-image','url('+reader.result+')');
								    			  	}
								     }

					    			 request.onreadystatechange = function() {
									    if (request.readyState == 4 && request.status == 404)
									        	$(element).addClass("broken");  
									 };

									
				    			 	request.send();
			   				}

			    };

		    _.methods = $.extend({},_.methods);
		   
		    _.readIMG = function (properties,opt){
		    	var _method = _.methods;
		    	var http = new XMLHttpRequest();
		    	var file = new FileReader(),encoded_image;
		    	var imgframe = properties.element;

		    	imgframe.css({"width":properties.width+"px","height":properties.height+"px"});

				http.open("GET","resize.php?file="+properties.src,true);
				http.responseType = "blob";

				http.onload = function() {
				 	var blob = http.response;
				 	file.readAsDataURL(blob);

				 	file.onloadend = function() {
				 	   encoded_image = file.result;
					   encoded_svg = _method.encodedSvg(_method.svgFilter(properties.width,properties.height,encoded_image));
					   imgframe.css('background-image',"url('data:image/svg+xml;charset=utf-8,"+encoded_svg+"')");
					   _method.fetchRealImage(imgframe, properties.src,opt);
					  
					}

				};

				http.send();
		    }

		    return _;
		}();

		var init = function(properties,opt){
			Components.readIMG(properties,opt);
		}

		return init;
	}());


	$.bleach = function(opt){
		var opt = $.extend( {}, $.bleach.defaults, opt );
		
		$('.bleach').each(function(i,_elem_){
			var _ = $(this);
			properties = {
				element:_,
				width : _.attr('bl-width'),
				height : _.attr('bl-height'),
				src : _.attr('bl-src'),
			}
			new Bleach(properties,opt);
		})
		
	}

	$.bleach.defaults = {
		loaderColor:'#92d367',
		bgColor:'#fff'
	} 

}));
