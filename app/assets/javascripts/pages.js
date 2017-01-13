$(document).ready(function(){
  /* Dropdown menu */
  var searchFields = [], i=0;
  // $("div.search-fields").children("div.search").each(function(){
  //   searchFields[i] = ($(this).find(".menu").height()+17);
  //   i++;
  // });
  $(".selected-link").mouseover(function(){
    $(this).height(65);
  }).mouseout(function(){
    if($(this).next().css("opacity") == 0)
      $(this).height(70);
  });

  $(".selected-link").click(function(){
    $(this).height(70);
    var menu = $(this).next(),
        search = $(this).parent(),
        currentH = $(this).height();
    if(search.height() == $(this).height()) {
      resetSearchFields();
      $(this).parent("div").addClass("clicked");
      search.height(menu.height() + (search.height() + 5) + "px");
      $(this).height(currentH-5);
      menu.height(menu.height());
    }
    else {
      $(this).parent("div").removeClass("clicked");
      menu.height(menu.height()-5);
      search.height($(this).height() + "px");
    }
  });

  $(".search-box").click(function(){
    resetSearchFields();
  });

  function resetSearchFields(){
    var i=0;
    $("div.search-fields").children("div").each(function(){
      $(this).removeClass("clicked");
      $(this).height($(this).height()-5);
      $(this).children(".menu").height(searchFields[i]);
      $(this).find(".selected-link").height(70);
      $(this).height($(this).find(".selected-link").height());
      i++;
    });
  }
});