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
			limit = o.placeholdersToLoad + sections[x].loaded,
			//number of articles
			numofArticles = sections[x].content.children('article').length,
			//max count 
			maxCount = (limit > numofArticles) ? numofArticles : limit;
			//fetch defined number of place holders only
	        for (var y = sections[x].loaded; y < maxCount; y++) {
				if(y !== sections[x].adIndex) {
					template = $(".templates ." + sections[x].name + "-template")
				}else{
					template = $(".templates .ads-template");
					sections[x].adIndex += sections[x].adIndex;
				}
				
				//Append template to homepage
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
		var passTop = ($('.articles').offset().top - el.window.scrollTop()) < 0,
		//has fixed class
		hasFixedClass = el.body.hasClass('fixed');
				
		if(passTop && !hasFixedClass){
			$("body").addClass('fixed');
		}
		else{
			$("body").removeClass('fixed');
		}
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
				$this[section].content.children('article').eq($this[section].loaded).children().each(function(){
					// console.log($(this)[0].nodeName + " " + box.attr("name"))
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
				console.log(section);
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
		}else if (pos == 2) {
			ChangeStyleNext(pos);
		}else if (pos == 3) {
			ChangeStyleNext(pos);
		}else if (pos == 4) {
			ChangeStyleNext(pos);
		}	

		function ChangeStyleNext(pos) {
			$(".slider-date").removeClass("active-slider-date");
		    $(".slider-date"+ pos).addClass("active-slider-date");		
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
		$(this).addClass('selected')
		//define elements
		var el = window.TAS.elem,
		//define section
		section = $(this).parent(el.section);
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
			if(!$(this).find('.is-paused').length){
		el.currentVideo = sectionCopy.find('.selected').find(".player").flowplayer({ swf: "/swf/5.5.0/flowplayer.swf" }).find('.video');
			}
			setTimeout(function(){
				el.currentVideo[0].play();
			},0)
		}
		//show description
		window.TAS.showDescription($(this));
		//show static page
		$("body").addClass('bookmark-open');
	},
	//manage article
	closeArticle: function(event){
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
		$("body").on("click",".articles .content-box:not('.ads-template')",this.openArticle);
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
	var type = $("#type").val();
	setTimeout(function(){
		
		if (type != "") {
			$("#"+type).trigger( "click" );
			// document.getElementById('events12').click();
			console.log(type);
		}		
	},1000)

	if (type != "") {
		$('html, body').animate({
	       	scrollTop: $('#ev').offset().top
	   	}, 'slow');
	}

	console.log(type);
	

	$(".slides-previous").on('click',function(){	
		var l = $(".dot").length;
		var lall =$(".fa-dot-circle-o").nextAll(".dot").length;
		var pos = (l - lall) - 1;
		pos = pos == 0 ? 4 : pos
		$(".dot:nth-of-type("+ pos  +")" ).trigger( "click" );

		if (pos == 1) {
			ChangeStylePrev(pos)
		}else if (pos == 2) {
			ChangeStylePrev(pos)
		}else if (pos == 3) {
			ChangeStylePrev(pos)
		}else if (pos == 4) {
			ChangeStylePrev(pos)
		}
	});

	$(".slides-next").on('click',function(){
		var l = $(".dot").length;
		var lall =$(".fa-dot-circle-o").nextAll(".dot").length;
		var pos = (l - lall) + 1;
		pos = pos == 5 ? 1 : pos
		$(".dot:nth-of-type("+ pos  +")" ).trigger( "click" );

		if (pos == 1) {
			ChangeStyleNext(pos);
		}else if (pos == 2) {
			ChangeStyleNext(pos);
		}else if (pos == 3) {
			ChangeStyleNext(pos);
		}else if (pos == 4) {
			ChangeStyleNext(pos);
		}
		
		console.log(pos-1);
	});

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
				// document.getElementById('events12').click();
				console.log(type);
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
		// console.log(id);
		// console.log(title);
		// console.log(image);
		// console.log(descr);
    });


	// $(function() {
 //      $('#slides').slidesjs({
 //        width: 940,
 //        height: 528,
 //        navigation: {
 //          effect: "fade"
 //        },
 //        pagination: {
 //          effect: "fade"
 //        },
 //        effect: {
 //          fade: {
 //            speed: 400
 //          }
 //        }
 //      });
 //    });
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