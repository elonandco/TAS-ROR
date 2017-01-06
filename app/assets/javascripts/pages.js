$(document).ready(function(){
  $("div.search .selected-link").click(function(){
    var menu = $(this).next(),
        search = $(this).parent()
        currentH = $(this).height();
    if(search.height() == $(this).height()) {
      $("div.search-fields").children("div").each(function(){
        resetSearch();
        $(this).height($(this).height()-5);
        $(this).children(".menu").css("opacity", "0");
        $(this).find(".selected-link").height(70);
        $(this).height($(this).find(".selected-link").height());  
      });
      search.height(menu.height() + (search.height() + 5) + "px");
      menu.css("opacity","1");
      $(this).height(currentH-5);
      menu.height(menu.height()+5);
    }
    else {
      $(this).height(currentH+5);
      menu.css("opacity", "0");
      menu.height(menu.height()-5);
      search.height($(this).height() + "px");
    }
  });
  function resetSearch(){
    $(".category .menu").height(134);
    $(".date .menu").height(166);
    $(".type .menu").height(326);
  }
});