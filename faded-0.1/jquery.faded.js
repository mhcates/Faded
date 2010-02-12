/*
 * 	faded 0.1 - jQuery plugin
 *	written by Nathan Searles	
 *	http://nathansearles.com/faded/
 *
 *	Copyright (c) 2009 Nathan Searles (http://nathansearles.com/)
 *	Dual licensed under the MIT (MIT-LICENSE.txt)
 *	and GPL (GPL-LICENSE.txt) licenses.
 *
 *	Built for jQuery library
 *	http://jquery.com
 *	Compatible with jQuery 1.3.2+
 *
 */
if(typeof jQuery != "undefined") {
	jQuery(function($) {
		$.fn.extend({
			faded: function(options) {
				var settings = $.extend({}, $.fn.faded.defaults, options);
				return this.each(
					function() {
						if($.fn.jquery < "1.3.1") {return;}
						var $t = $(this);
						var $c = $t.children(":nth-child(1)");
						var o = $.metadata ? $.extend({}, settings, $t.metadata()) : settings;
						var total = $c.children().size();
				        var next = 0;
						var prev = 0;
						var number = 0;
						var currentitem = 0;
						var loaded,active,imgSrc,clicked,current;						
						$c.css({position:"relative"});					
						$c.children().css({
							position:"absolute",
							top: 0, 
							left: 0,
							zIndex: 0,
							display:"none"
						 });
						if (o.autoheight) {
							$c.animate({height: $c.children(":eq(0)").outerHeight()},o.autoheight);
						}
						if (o.pagination) {
							$t.append("<ul class="+o.pagination+"");
							$c.children().each(function(){
								$("."+o.pagination+"",$t).append("<li><a rel="+number+" href=\"#\" >"+(number+1)+"</a></li>");
								number = number+1;
							});
							$("."+o.pagination+" li a:eq(0)",$t).parent().addClass("current");
							$("."+o.pagination+" li a",$t).click(function(){
								current = $("."+o.pagination+" li.current a",$t).attr("rel");									
								clicked = $(this).attr("rel");
								if (current != clicked) {animate("pagination",clicked,current);}
								return false;
							});
						}
						if (o.sequentialloading&&$c.children()[0].tagName=="IMG") {
							$c.css({background:"url("+o.loadingimg+") no-repeat 50% 50%"});
							imgSrc = $("img:eq(0)",$c).attr("src");
							$("img:eq(0)",$c).attr("src", imgSrc).load(function() { 
								$c.css({background:"none"});
								$(this).fadeIn(o.speed,function(){
									loaded = true;
								});
							});
						} else {
							$c.find(":eq(0)").fadeIn(o.speed,function(){
								loaded = true;
							});
						}
						if (o.bigtarget) {
							$c.css({"cursor":"pointer"});
							$c.click(function(){
								animate("next");
								return false;
							});									
						}
						$("."+o.nextbtn,$t).click(function(){
							animate("next");
							return false;
						});					
						$("."+o.prevbtn,$t).click(function(){
							animate("prev");
							return false;
						});
						function animate(dir,clicked,current){
							if (!active&&loaded) {
								active=true;
								switch(dir) {
									case "next":
										prev = next;
										next = currentitem*1+1;
										if (total === next) next = 0;
									break;
									case "prev":
										prev = next;
										next = currentitem*1-1;
										if (next === -1) next = total-1;
									break;
									case "pagination":
										next = clicked;
										prev = current;
									break;
								}
								if (o.pagination) {
									$(".pagination li.current",$t).removeClass("current");
									$(".pagination li a:eq("+next+")",$t).parent().addClass("current");
								}
								if (o.crossfade) {
									$c.children(":eq("+next+")").css({zIndex:10}).fadeIn(o.speed,function(){
										$c.children(":eq("+prev+")").css({display:"none",zIndex:0});
										$(this).css({zIndex:0});
										currentitem = next;
										active = false;
									});
								} else {
									$c.children(":eq("+prev+")").fadeOut(o.speed,function(){
										if (o.autoheight) {
											$c.animate({height: $c.children(":eq("+next+")").outerHeight()},o.autoheight,function(){
												$c.children(":eq("+next+")").fadeIn(o.speed);
											});
										} else {
											$c.children(":eq("+next+")").fadeIn(o.speed);
										}
										currentitem = next;
										active = false;
									});
								}
							}
						}	
					}
				);
				}
		});
		$.fn.faded.defaults = {
			speed: 300,
			crossfade: false,
			bigtarget: false,
			sequentialloading: false,
			autoheight: false,
			pagination: "pagination",
			nextbtn: "next",
			prevbtn: "prev",
			loadingimg: false
		};
	});
}