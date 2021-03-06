// load article
var TAS = TAS || {
	// global
	options: {
		placeholdersToLoad: 6,
		slideshow: true,
	},
	//global
	elem: {
		document: $(document),
		window: $(window),
		body: $('body'),
		header: $('.header'),
		sectionHeader: $('.section-header'),
		articles: $('.articles'),
		section: $('.section'),
		bookmarks: $('.bookmarked-articles'),
		share: $('.share'),
		details: $('.details'),
		album: $('.slides'),
		thumbnails: $('.thumbnails'),
		loadMore: $('.load-more')
	},
	// global
	events: {
		data: "/pages/events",
		loaded: 0,
		name: "events",
		content: "",
		adIndex: 4
	},
	blogs: {
		data: "/pages/blogs",
		loaded: 0,
		name: "blogs",
		content: "",
		adIndex: 4
	},
	pictures: {
		data: "/pages/pictures",
		loaded: 0,
		name: "pictures",
		content: "",
		adIndex: 4
	},
	videos: {
		data: "/pages/videos",
		loaded: 0,
		name: "videos",
		content: "",
		adIndex: 4
	},
	//global
	sections: function(){
		return [this.events,this.blogs,this.pictures,this.videos]	
	},
	// manage content
	saveContent: function(sections) {
		//basic ajax
		for(var x = 0; x < sections.length; x++){
			//run ajax
     		$.ajax({
				url: sections[x].data,
				type: "GET",
				dataType: "xml",
				async: false,
				success: function(result){
					//save xml data to section's object so we can retrieve later
					sections[x].content = $(result).find('articles');
				}
        	})
		}
    },
	// manage content
	addPlaceHolders: function(sections,o) {

		//go through each section
	    for (var x = 0; x < sections.length; x++) {
			var template,
			//detemine number of articles to load
			limit = sections[x].name == "blogs" ? o.placeholdersToLoad + sections[x].loaded - 2 : o.placeholdersToLoad + sections[x].loaded,
			// limit = o.placeholdersToLoad + sections[x].loaded,
			//number of articles
			numofArticles = sections[x].content.children('article').length,
			//max count 
			maxCount = (limit > numofArticles) ? numofArticles : limit;
			console.log(limit);
			//fetch defined number of place holders only
	        for (var y = sections[x].loaded; y < maxCount; y++) {
	        	// console.log(sections[x].name);
	        	// console.log("count " + sections[x].name + " " + y)
	        	// if(y % 3 == 0) {
	        	// 	console.log("something " + sections[x].name)
	        	// }
	        	if(y == 0 && sections[x].name == "events") {
	        		template = $(".event-add-post");
					sections[x].adIndex += sections[x].adIndex;
	        	}else if(y == 0 && sections[x].name == "pictures") {
	        		template = $(".templates .picture-add-post");
					sections[x].adIndex += sections[x].adIndex;
	        	}else if(y == 0 && sections[x].name == "blogs") {
	        		template = $(".templates .blog-add-post");
					sections[x].adIndex += sections[x].adIndex;
	        	}else if(y !== sections[x].adIndex) {
					template = $(".templates ." + sections[x].name + "-template")
				}else{
					if (sections[x].name !== "blogs") {
						template = $(".templates .ads-template");
						sections[x].adIndex += sections[x].adIndex;
					}

				}
				// console.log((y !== sections[x].adIndex) + " y = " + y + " section = " + sections[x].adIndex);
				//Append template to homepage
				if (y == 4 && sections[x].loaded == 0 && sections[x].name !== "blogs" ) {
					template = $(".templates .ads-template");
					sections[x].adIndex += sections[x].adIndex;
					// template.clone().addClass('ad-space').insertBefore(".articles ." + sections[x].name+" .load-more");		
				}else if (y == 3 && sections[x].loaded == 0 && sections[x].name == "blogs" ) {
					template = $(".templates .blogs-ads-template");
					// $(this).addClass("blogs-ads-template");
					sections[x].adIndex += sections[x].adIndex;
					// template.clone().addClass('ad-space').insertBefore(".articles ." + sections[x].name+" .load-more");		
				}
				template.clone().insertBefore(".articles ." + sections[x].name+" .load-more");	
					//Append template to full description
				template.clone().insertBefore(".bookmarked-articles ." + sections[x].name+" .load-more");	
				
				if($(".articles ." + sections[x].name+" .content-box:not('.ads-template')").length === numofArticles){
					$("." + sections[x].name+" .load-more").text('All '+sections[x].name+' have been loaded').addClass('loaded')
				}
	        }
	    }
	},
	//scroll effect
	toggleHeader: function(el){
		//article top
		var passTop = ($('.articles').offset().top - el.window.scrollTop()) < -100,
		//has fixed class
		hasFixedClass = el.body.hasClass('fixed');
				
		if(passTop && !hasFixedClass){
			$("body").addClass('fixed');
		}
		else{
			$("body").removeClass('fixed');
		}

		// var position = ($('.articles').offset().top - el.window.scrollTop()) == -220;

		// if (position == true) {
		// 	window.location.hash = "event_section";
		// 	console.log("pos = "+position);
		// }
		// if(passTop){
		// 	$(".header").addClass('fixed');
		// }
		// else{
		// 	$(".header").removeClass('fixed');
		// }
		// console.log($('.articles').offset().top - el.window.scrollTop());
	},
	
	//mange content
	insertContent: function(article,box){
		var HTML,
		name = article[0].nodeName;
		
		if(name === "image"){
			HTML = "<img src='"+article.text()+"'/>";
			box.find('.'+article[0].nodeName).html(HTML)
		}
		else if(name === "video"){
			HTML = "<source type='video/mp4' src='videos/"+article.text()+".mp4'>"	
			box.find('.'+article[0].nodeName).html(HTML)
		}
		else if(name === "length" || name === "folder"){
			box.attr(name,article.text())	
		}
		else {
			HTML = article.text();
			box.find('.'+article[0].nodeName).html(HTML)
		}
	},
	//scroll effect
	toggleSections: function(){
		var el = TAS.elem;
		$('.main .section-name').each(function(){
			var name = $(this).text().toLowerCase(),
				scrollTop = $(this).offset().top - $(window).scrollTop(),
				isFixed = $('.section-header').hasClass(name);

			if((scrollTop < 60) && isFixed){
				$('.section-header').removeClass(name);
			}
			else if((scrollTop > 60) && !isFixed){
				$('.section-header').addClass(name);
			}
		})
	},
	
	// manage content		
	loadContent: function(e){	
		//determine scroller
		// console.log("load");
		var event_ids = $("#event_ids").val().split(", ");
		var blog_ids = $("#blog_ids").val().split(", ");
		var pic_ids = $("#pic_ids").val().split(", ");
		var video_ids = $("#video_ids").val().split(", ");
		var area = $(".bookmark-open").length ? "bookmarked-articles" : "articles",
		//access other variables
		$this = window.TAS;
		if(($this.elem.bookmarks.scrollTop() > 0)){
			$('.bookmarked-articles').find('.section-name').addClass('open')
		}else{
			$('.bookmarked-articles').find('.section-name').removeClass('open');
		}
		
		if(!$(".bookmark-open").length){
			//toggle header 
			$this.toggleSections($this.elem);
			//toggle header 
			$this.toggleHeader($this.elem);
		}
		//only target div's with no content		
		var type_id = ""
		var i = 0
		$('.'+area+' .no-content').each(function(){
			var box = $(this),
			//define elements scroll top
			elemTop = box.offset().top - $(window).scrollTop();
			//if the element is visible in the window
			if(elemTop < window.innerHeight){	
				//get section name
				section = box.parent('.section').attr("name");
				
				//mark as having content
				
				// console.log(type_id);
				box.removeClass('no-content');
				
				//now, insert the content for each div within box
				x = 0;
				$this[section].content.children('article').eq($this[section].loaded).children().each(function(){
					$this.insertContent($(this),box);
				})
				i = $this[section].loaded++

				if (section == "events") {
					type_id = section + event_ids[i];
				}else if (section == "blogs") {
					type_id = section + blog_ids[i];
				}else if (section == "pictures") {
					type_id = section + pic_ids[i];
				}else if (section == "videos") {
					type_id = section + video_ids[i];
				}

				box.attr('id', type_id);
			}else{
				return false;	
			} 
			
			if($(".bookmark-open").length){
				$('.articles').find('.'+section+' .no-content:eq(0)').replaceWith(box.clone());
			}
		})	
	},
	
	setupDots: function(el){
		var i = 1;
		//make a dot for each image in slideshow
		for(i;i<$(".slides").find('img').length;i++){
			$('.dot:eq(0)').clone().appendTo('.navigation');
		}
		//show first slide as being active
		$('.dot:eq(0)').attr('class','dot fa fa-dot-circle-o')	
		$(".slider-date1").addClass("active-slider-date");

		function ChangeStyleNext(pos) {
			$(".slider-date").removeClass("active-slider-date");
		    $(".slider-date"+ pos).addClass("active-slider-date");		
		}
	},
	
	startSlideshow: function(el){
		var x = 1,
		slides = $(".slides").find('img');
		
		somefunction();
		
		function start() {
			return interval = setInterval(function() { 
				somefunction()
			},  7000);	
		}
		
		var slideshow = start();
		
		function somefunction(){
			if(!window.TAS.options.slideshow){
				 window.clearInterval(slideshow);
				 return false;
			}
			window.TAS.slideshow($('.navigation .dot').eq(x-1))
			x = (x === slides.length) ? 1 : x + 1;	
		}
	}, 
	
	slideshow: function(exist){
		var $this = (!exist.type) ? exist : $(this);
		if(exist.type){
			window.TAS.options.slideshow = false;
		}
		var el = window.TAS.elem,
		index = $this.index(),
		activeImg = $(".slides").find('img').eq(index)
		
		$(".slides").find('.active').removeClass('active');
		activeImg.addClass('active');
		
		$('.caption .headline').text(activeImg.attr('headline'));
		$('.caption .description').text(activeImg.attr('desc'));
		
		
		$('.fa-dot-circle-o').attr('class','dot fa fa-circle-o');
		$this.attr('class','dot fa fa-dot-circle-o');

		var l = $(".dot").length;
		var lall =$(".fa-dot-circle-o").nextAll(".dot").length;
		var pos = (l - lall);
		pos = pos == 5 ? 1 : pos

		if (pos == 1) {
			ChangeStyleNext(pos);
			ShowArrow(pos);
		}else if (pos == 2) {
			ChangeStyleNext(pos);
			ShowArrow(pos);
		}else if (pos == 3) {
			ChangeStyleNext(pos);
			ShowArrow(pos);
		}else if (pos == 4) {
			ChangeStyleNext(pos);
			ShowArrow(pos);
		}	

		function ChangeStyleNext(pos) {
			$(".slider-date").removeClass("active-slider-date");
		    $(".slider-date"+ pos).addClass("active-slider-date");		
		}

		function ShowArrow(pos) {
			if (pos == 1) {
				$('.slider1-arrow-up').show();
				$('.slider2-arrow-up').hide();
				$('.slider3-arrow-up').hide();
				$('.slider4-arrow-up').hide();
			}else if (pos == 2) {
				$('.slider1-arrow-up').hide();
				$('.slider2-arrow-up').show();
				$('.slider3-arrow-up').hide();
				$('.slider4-arrow-up').hide();
			}else if (pos == 3) {
				$('.slider1-arrow-up').hide();
				$('.slider2-arrow-up').hide();
				$('.slider3-arrow-up').show();
				$('.slider4-arrow-up').hide();
			}else if (pos == 4) {
				$('.slider1-arrow-up').hide();
				$('.slider2-arrow-up').hide();
				$('.slider3-arrow-up').hide();
				$('.slider4-arrow-up').show();
			}
		}
	},
	
	/// sort menu
	
	sortByCategory: function(){
	},
	
	sortByTime: function(){
	},
	
	sortByDate: function(){	
	},
	
	sortContent: function(){
	},
	
	selectMenu: function(event){
		//target menu
		var menu = $(this).parent('.menu').parent('.search');
		//remove currently targeted link
		menu.find('.menu .selected').removeClass('selected');
		//mark link as slected
		$(this).addClass('selected');
		//show currently selected text
		menu.find('.currently-selected').text($(this).text())
		//drop menu
		window.TAS.dropMenu();
		//sort content
		window.TAS.sortContent();
		//avoid bubbling
		event.stopPropagation();
	},
	toggleOpen: function(){
		$(this).toggleClass('open')
	},
	
	//manage pictures
	// loadAlbum: function(album, el){
	// 	var x,
	// 	i = 0,
	// 	length = parseInt(album.attr("length")),
	// 	folder = album.attr("folder");
	// 	//clear thumbnails
	// 	$('.thumbnails').empty()
	// 	//load new ones
	// 	for(i;i<length;i++){
	// 		x = (i * .001).toFixed(3).toString().split(".")[1];
	// 		$('.thumbnails').append('<li><img src="albums/'+folder+'/'+x+'.jpg"></li>');
	// 	}
	// 	console.log(folder);
	// },
	
	//manage article
	showDescription: function(box){
		var i,
		className = ["type","title","description"];
		section = box.parent('.section').attr('name');
		$('.main-description').attr('type', section);
		for(i=0;i<className.length;i++){
			$('.article-'+className[i]).html(box.find('.'+className[i]).text());	
		}
		if(section === "pictures"){
			// window.TAS.loadAlbum(box, window.TAS.elem);		
		}
	},	
	
	//manage article
	openArticle: function(e){
		// $('head').append( '<meta name="description" content="this is new">' );
		console.log("something")
		//mark as selected
		$('.event-add-post').hide();
		$('.picture-add-post').hide();
		$('.blog-add-post').hide();
		
		$(this).closest(".content-box").addClass('selected')
		// $(this).addClass('selected')
		//define elements
		var el = window.TAS.elem,
		//define section
		section = $(this).closest(".content-box").parent(el.section);
		//insert section copy + identify it
		// sectionCopy = el.bookmarks.empty().append(section.clone()).find('.section');
		sectionCopy = $('.bookmarked-articles').empty().append(section.clone()).find('.section');
		//reset slider
		$('.bookmarked-articles').animate({ scrollTop: "0px" },0);
		//insert selected section before selected
		sectionCopy.prepend(sectionCopy.find('.selected'));
		//make bookmark say all + [section name]
		sectionCopy.find('.section-name').removeAttr('style')[0].innerHTML = "Other " + section.attr('name');
		
		if(section.attr('name') === "pictures"){
			// window.TAS.loadAlbum(sectionCopy.find('.selected'), el);		
		}
		
		if((section.attr('name') === "videos")){
			if(!$(this).closest(".content-box").find('.is-paused').length){
		el.currentVideo = sectionCopy.find('.selected').find(".player").flowplayer({ swf: "/swf/5.5.0/flowplayer.swf" }).find('.video');
			}
			setTimeout(function(){
				el.currentVideo[0].play();
			},0)
		}
		//show description
		window.TAS.showDescription($(this).closest(".content-box"));
		//show static page
		$("body").addClass('bookmark-open');
	},
	//manage article
	closeArticle: function(event){
		$('.event-add-post').show();
		$('.picture-add-post').show();
		$('.blog-add-post').show();
		//access element
		var el = window.TAS.elem;
		//hide static page
		$("body").removeClass('bookmark-open');
		
		
		if($('.bookmarked-articles .selected').parent('.section').attr('name') === "videos"){
			el.currentVideo[0].pause();
		}
		
		
		//remove selected 
		$('.articles .selected').removeClass('selected');
		//close share
		$('.details').removeClass('open');
		
		//prevent propagation
		event.stopPropagation();
	},
    //manage article
	selectArticle: function(e){
		//clicked element

		var el = window.TAS.elem,
		clickedElem = $(this),
		//top attribute
		top = $(this)[0].getBoundingClientRect().top + el.bookmarks.scrollTop(),	
		//center mark
		centerMark = (window.innerHeight - $(this).outerHeight(true)) / 2;
		//turn off listener
		el.bookmarks.animate({ scrollTop: (top - centerMark) +"px" },300);
				
		if(clickedElem.parent('.section').attr('name') === "videos" && !clickedElem.hasClass('selected')){
			//stop current video
			el.currentVideo[0].pause();
			el.currentVideo = clickedElem.find(".player").find('.video')
		
		if(!$(this).find('.is-paused').length){
			clickedElem.find(".player").flowplayer({ swf: "/swf/5.5.0/flowplayer.swf" });
		}
			setTimeout(function(){
				el.currentVideo[0].play();
			},100)
		}
		// console.log(clickedElem[0].textContent.trim());
		
		//add selected class
		clickedElem.addClass('selected');
		
		//remove class from siblings
		clickedElem.siblings().removeClass('selected');
		//show description
		window.TAS.showDescription($(this));
		//stop propagation
		e.stopPropagation();
	},
	loadMore: function(e){
		var TAS = window.TAS,
		section = [TAS[$(this).parent('.section').attr('name')]];
		TAS.addPlaceHolders(section,TAS.options);
		TAS.loadContent(document);
		e.stopPropagation();
	},
	showPicture: function(e){
		var imgSrc = $(this).find('img').attr('src');
		$('.bookmarked-articles .content-box.selected').find('img').attr('src',imgSrc)
	},
	//global
	addListeners: function(el){
		$('.bookmarked-articles').on("scroll", this.loadContent);
		$(document).on("scroll", this.loadContent);
		$("body").on("click", ".bookmarks .content-box:not('.ads-template')", this.selectArticle);
		$("body").on("click", ".thumbnails li", this.showPicture);
		$("body").on("click", ".bookmarks .close,.bookmarked-articles", this.closeArticle);
		$("body").on("click",".second",this.openArticle);
		$("body").on("click",".load-more",this.loadMore);
		$("body").on("click",".navigation i",this.slideshow);
		$('.details').on("click",this.toggleOpen);
	},
	//global
	init: function(){
		this.saveContent(TAS.sections());
		this.addPlaceHolders(TAS.sections(),TAS.options);
		this.loadContent(document);
		this.addListeners(TAS.elem);	
		this.setupDots(TAS.elem);
		this.startSlideshow(TAS.elem)
	}
}

$(document).ready(function(){

	TAS.init();
	$(".selected-link").on('click', function () {
		$(".ui-state-default").removeClass("ui-state-active");
	});	

	$(".ui-state-default").on('click', function () {
		$(".ui-state-default").removeClass("ui-state-active");
		$(this).addClass("ui-state-active");
	});

	$("#event_circle").on('click', function () {
		// window.location.hash = "event_section";
		$('html,body').animate({scrollTop: $("#event_section").offset().top},'slow');
		$(".icon-circle").removeClass("active_circle");
		$(this).addClass("active_circle");
	});

	$("#blog_circle").on('click', function () {
		// window.location.hash = "blog_section";
		$('html,body').animate({scrollTop: $("#blog_section").offset().top},'slow');
		$(".icon-circle").removeClass("active_circle");
		$(this).addClass("active_circle");
	});

	$("#video_circle").on('click', function () {
		// window.location.hash = "blog_section";
		$('html,body').animate({scrollTop: $("#blog_section").offset().top},'slow');
		$(".icon-circle").removeClass("active_circle");
		$(this).addClass("active_circle");
	});

	$("#pic_circle").on('click', function () {
		// window.location.hash = "pic_section";
		$('html,body').animate({scrollTop: $("#pic_section").offset().top},'slow');
		$(".icon-circle").removeClass("active_circle");
		$(this).addClass("active_circle");
	});

	$(".slider-date1").on('click', function() {
		var pos =1
		$(".dot:nth-of-type("+ pos  +")" ).trigger( "click" );
		ChangeStylePrev(pos);
		ShowArrow(pos);
	});

	$(".slider-date2").on('click', function() {
		var pos =2
		$(".dot:nth-of-type("+ pos  +")" ).trigger( "click" );
		ChangeStylePrev(pos);
		ShowArrow(pos);
	});

	$(".slider-date3").on('click', function() {
		var pos =3
		$(".dot:nth-of-type("+ pos  +")" ).trigger( "click" );
		ChangeStylePrev(pos);
		ShowArrow(pos);
	});

	$(".slider-date4").on('click', function() {
		var pos =4
		$(".dot:nth-of-type("+ pos  +")" ).trigger( "click" );
		ChangeStylePrev(pos);
		ShowArrow(pos);
	});

	var sections = $('.main');
	 
	$(window).on('scroll', function () {
	  	var cur_pos = $(this).scrollTop(), i = 1;
	 

		sections.each(function() {
		    var top = $(this).offset().top,
		        bottom = top + $(this).outerHeight();
		 
		    if (cur_pos >= 728 && cur_pos <= 1661) {
		      	$(".icon-circle").removeClass("active_circle");
				$("#event_circle").addClass("active_circle");
		    }else if (cur_pos >= 1662 && cur_pos <= 2557) {
		      	$(".icon-circle").removeClass("active_circle");
				$("#video_circle").addClass("active_circle");
		    }else if (cur_pos >= 2558 && cur_pos <= 3505) {
		      	$(".icon-circle").removeClass("active_circle");
				$("#pic_circle").addClass("active_circle");
		    }else {
		    	$(".icon-circle").removeClass("active_circle");
		    }
		    console.log("top => "+ top + "\n" + " bottom =>" + bottom);
		});
		// console.log("cur-pos => "+cur_pos);
	});
	
	var type = $("#type").val();
	setTimeout(function(){
		
		if (type != "") {
			$("#"+type).find(".second").trigger( "click" );
			// document.getElementById('events12').click();
			console.log(type);
		}		
	},1000)

	if (type != "") {
		$('html, body').animate({
	       	scrollTop: $('#ev').offset().top
	   	}, 'slow');
	}

	// console.log(type);
	

	$(".slides-previous").on('click',function(){	
		var l = $(".dot").length;
		var lall =$(".fa-dot-circle-o").nextAll(".dot").length;
		var pos = (l - lall) - 1;
		pos = pos == 0 ? 4 : pos
		$(".dot:nth-of-type("+ pos  +")" ).trigger( "click" );

		if (pos == 1) {
			ChangeStylePrev(pos);
			ShowArrow(pos);
		}else if (pos == 2) {
			ChangeStylePrev(pos);
			ShowArrow(pos);
		}else if (pos == 3) {
			ChangeStylePrev(pos);
			ShowArrow(pos);
		}else if (pos == 4) {
			ChangeStylePrev(pos);
			ShowArrow(pos);
		}
	});

	$(".slides-next").on('click',function(){
		var l = $(".dot").length;
		var lall =$(".fa-dot-circle-o").nextAll(".dot").length;
		var pos = (l - lall) + 1;
		pos = pos == 5 ? 1 : pos
		$(".dot:nth-of-type("+ pos  +")" ).trigger( "click" );
		// console.log(pos);
		if (pos == 1) {
			ChangeStyleNext(pos);
			ShowArrow(pos);
		}else if (pos == 2) {
			ChangeStyleNext(pos);
			ShowArrow(pos);
		}else if (pos == 3) {
			ChangeStyleNext(pos);
			ShowArrow(pos);
		}else if (pos == 4) {
			ChangeStyleNext(pos);
			ShowArrow(pos);
		}
		
		// console.log(pos-1);
	});

	function ShowArrow(pos) {
		if (pos == 1) {
			$('.slider1-arrow-up').show();
			$('.slider2-arrow-up').hide();
			$('.slider3-arrow-up').hide();
			$('.slider4-arrow-up').hide();
		}else if (pos == 2) {
			$('.slider1-arrow-up').hide();
			$('.slider2-arrow-up').show();
			$('.slider3-arrow-up').hide();
			$('.slider4-arrow-up').hide();
		}else if (pos == 3) {
			$('.slider1-arrow-up').hide();
			$('.slider2-arrow-up').hide();
			$('.slider3-arrow-up').show();
			$('.slider4-arrow-up').hide();
		}else if (pos == 4) {
			$('.slider1-arrow-up').hide();
			$('.slider2-arrow-up').hide();
			$('.slider3-arrow-up').hide();
			$('.slider4-arrow-up').show();
		}
	}

	function ChangeStyleNext(pos) {
		$(".slider-date").removeClass("active-slider-date");
	    $(".slider-date"+ pos).addClass("active-slider-date");		
	}

	function ChangeStylePrev(pos) {
	    $(".slider-date").removeClass("active-slider-date");
	    $(".slider-date"+ pos).addClass("active-slider-date");
	}

	function Trigger() {
		setTimeout(function(){
		var type = $("#type").val();
			if (type != "") {
				$("#events12").trigger( "click" );
			}		
		},1000)
	} 

	$('.fb-share-btn').click(function(e) {
		var type = "";
		if ($(".selected").hasClass("events-template")) {
			type = "events";
		}else if ($(".selected").hasClass("blogs-template")) {
			type = "blogs";
		}else if ($(".selected").hasClass("videos-template")) {
			type = "videos";
		}else if ($(".selected").hasClass("pictures-template")) {
			type = "pictures";
		}
		var id = $(".section").children(".selected").last().find(".id").html();
		var image = window.location.host + "/" + $(".section").children(".selected").last().find(".image > img").attr("src");
		var title = $(".section").children(".selected").last().find(".title").html();
		var descr = $(".section").children(".selected").last().find(".description").html();
		$(".fb-share").attr("href", "https://www.facebook.com/sharer/sharer.php?u=" + window.location.host + "?type="+type + id+"&picture="+ image +"&title="+title+"&description="+descr)
        				.trigger("click");
    });    

    $('.twitter-share-btn').click(function(e) {
		var type = "";
		if ($(".selected").hasClass("events-template")) {
			type = "events";
		}else if ($(".selected").hasClass("blogs-template")) {
			type = "blogs";
		}else if ($(".selected").hasClass("videos-template")) {
			type = "videos";
		}else if ($(".selected").hasClass("pictures-template")) {
			type = "pictures";
		}
		var id = $(".section").children(".selected").last().find(".id").html();
		var image = window.location.host + "/" + $(".section").children(".selected").last().find(".image > img").attr("src");
		var title = $(".section").children(".selected").last().find(".title").html();
		var descr = $(".section").children(".selected").last().find(".description").html();
		var hashtag  = "SocialiteApproved, TheAustinSocialite, ATX "; 
		$(".twitter-share").attr("href", "https://twitter.com/intent/tweet?text="+ title +"&hashtags=" + hashtag + "&url=" + window.location.href + "?type="+type + id + "&size=small" )[0].click();
		
		return false;

    });
    var selectedDay = new Date().getTime();
    var dates = $('#calendar').datepicker({
        dateFormat: "dd/mm/yy",
        inline: true,
        firstDay: 1,
        minDate: 0,
        showOtherMonths: false,
        dayNamesMin: ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'],
        onSelect: function(selectedDate) {
        	$('.radio-button').prop('checked', false);
        	// selectedDay = $(this).datepicker('getDate').getTime();       
            if ($("#search-date").val() == "" || $("#end-date").val() == "" ) {
		        if ($("#search-date").val() == ""){
		        	$("#search-date").val(selectedDate);
		        	$(this).datepicker('option', 'minDate', selectedDate);
		        }else{
		        	// $(this).datepicker('option', 'minDate', selectedDate);
		        	setTimeout(function(){
						$("#end-date").val(selectedDate);

			        	// $(".ui-datepicker").addClass("disable-click");
			        	$(".ui-state-default").each(function() {
						  
						  // console.log($(this).parent("td"));
						  if ($(this).hasClass("ui-state-active")){

						  	return false;
						  }
						  
						  if (!$(this).parent("td").hasClass("ui-state-disabled")){
						  	$(this).addClass("ui-range");
						  	// $(this).parent("td").addClass("ui-range");
						  }
						});
					},50)
		        	
		        }
		    }else {
		    	$("#end-date").val("");
		    	$("#search-date").val(selectedDate);
	        	$(this).datepicker('option', 'minDate', selectedDate);
		    }
		    // console.log(selectedDay);
      	}
     //  	beforeShowDay: function (date) {
	    //     var d = date.getTime();
	    //     if (d > selectedDay && d < selectedDay + 1 + 86400000 * 7) {
	    //         return [true, 'ui-state-highlight', ''];
	    //     } else {
	    //         return [true, ''];
	    //     }
	    // }
    });
    $(".select-day .buttons button.prev").bind("click", function(){
    	var start = $("#search-date").val() == "" ? "" : $("#search-date").val().substring(3, 5);
    	var end = $("#end-date").val() == "" ? "" : $("#end-date").val().substring(3, 5);
		var month = $(".ui-datepicker-month").text();
    	if (end !== "") {
    		console.log(start + " - " + end);
    		if (end == "01" && month !== "January" ){
	    		$(".ui-datepicker-prev").click();
	    	}
	    	if (end == "02" && month !== "February" ){
	    		$(".ui-datepicker-prev").click();
	    	}
	    	if (end == "03" && month !== "March" ){
	    		$(".ui-datepicker-prev").click();
	    	}
	    	if (end == "04" && month !== "April" ){
	    		$(".ui-datepicker-prev").click();
	    	}
	    	if (end == "05" && month !== "May" ){
	    		$(".ui-datepicker-prev").click();
	    	}
	    	if (end == "06" && month !== "June" ){
	    		$(".ui-datepicker-prev").click();
	    	}
	    	if (end == "07" && month !== "July" ){
	    		$(".ui-datepicker-prev").click();
	    	}
	    	if (end == "08" && month !== "August" ){
	    		$(".ui-datepicker-prev").click();
	    	}
	    	if (end == "09" && month !== "September" ){
	    		$(".ui-datepicker-prev").click();
	    	}
	    	if (end == "10" && month !== "October" ){
	    		$(".ui-datepicker-prev").click();
	    	}
	    	if (end == "11" && month !== "November" ){
	    		$(".ui-datepicker-prev").click();
	    	}
	    	if (end == "12" && month !== "December" ){
	    		$(".ui-datepicker-prev").click();
	    	}
	    	if ($(".ui-state-default").hasClass("ui-state-active")) {
		    	setTimeout(function(){
		        	$(".ui-state-default").each(function() {
					  if ($(this).hasClass("ui-state-active")){
					  	return false;
					  }
					  
					  if (!$(this).parent("td").hasClass("ui-state-disabled")){
					  	$(this).addClass("ui-range");
					  }
					});
				},50)
		    }
	    }else {
	    	$(".ui-datepicker-prev").click();
	    	if (start == "" && end == "") {
	    		$(".ui-state-default").removeClass("ui-state-active");
	    	}
	    }	    
	});
	
	$(".select-day .buttons button.next").bind("click", function(){
		$(".ui-datepicker-next").click();
	});

    $(".reset").on('click',function(){
    	$("#search-date").val("");
    	$("#end-date").val("");
    	var today = new Date();
    	$('#calendar').datepicker('option', 'minDate', today);
    	$(".ui-state-default").removeClass("ui-state-active");
    	$(".ui-datepicker").removeClass("disable-click");
    	$('.radio-button').prop('checked', false);
    });

    $('.radio-button').on("click", function(event){
	    $("#search-date").val("");
    	$("#end-date").val("");
    	var today = new Date();
    	$('#calendar').datepicker('option', 'minDate', today);
    	$(".ui-state-default").removeClass("ui-state-active");
    	$(".ui-datepicker").removeClass("disable-click");
    	// console.log($("input[name='time']:checked").val());
	});

	$(document).on('change', '#search-date', function(e) {
		$('.radio-button').prop('checked', false);
	});

	$(".apply").click(function(){
        search();
    });

    $(".button-find").click(function(){
        search();
    });

    function search() {
    	if ($("#search-date").val() !== "") {
	    	var data = {start_date: $("#search-date").val(), end_date: $("#end-date").val()}
    	}else {
    		var data = {time: $("input[name='time']:checked").val()}
    	}
	    $.ajax({
	        url: "/pages/search",
	        type: "GET",
	        data: data,
	        error: function(result){
	            // $(".error_msg").empty();
	            // $("#error_message").append("<div class='error_msg'>"+JSON.parse(result.responseText).message+"</div>");
	            // $("#error_message").slideDown(); 
	            // setTimeout(function(){
	            //   $("#error_message").slideUp();
	            // }, 5000);
	            alert(JSON.parse(result.responseText).message);
	        },
	        success: function(result){ 
	            if (result.results.length > 0) {
		            $.each(result.results, function(idx, obj) {
	                  console.log(obj);
	                })
		        }else {
		        	console.log("No Results Found.");
		        }
	        }
	      });      
	  }

});
function fbShare(url, title, descr, image, winWidth, winHeight) {

	var url = window.location
	var image = window.location + $(".selected > .image > img").attr("src");
	var title = $(".selected > .content > .overlay > .setting > .title").html();
	var descr = $(".selected > .content > .overlay > .setting > .description").html();
    var winTop = (screen.height / 2) - (winHeight / 2);
    var winLeft = (screen.width / 2) - (winWidth / 2);
    window.open('http://www.facebook.com/sharer.php?s=100&p[title]=' + title + '&p[summary]=' + descr + '&p[url]=' + url + '&p[images][0]=' + image, 'sharer', 'top=' + winTop + ',left=' + winLeft + ',toolbar=0,status=0,width=' + winWidth + ',height=' + winHeight);
}