$(function(){

    AOS.init({
        once : true,
        throttleDelay : 99,
        duration: 1000
    });
    
    // header 스크롤 고정
    $(window).on("scroll", function(){
        const wh = $(window).scrollTop();
        if(wh <= 0){
            $("#header").removeClass("fix");
        } else {
            $("#header").addClass("fix");
        }
    });
   
    // header mouseover
    $("#header, #gnb").mouseover(function(){
        $("#header").addClass("on");
    }).mouseleave(function(){
        $("#header").removeClass("on");
    });

    // gnb
    $(document).on("mouseenter", "#gnb > ul > li", function () {
        $(this).addClass("active").siblings("li").removeClass("active");
        $("#gnb > ul > li > ul").slideDown();
        $(".gnbBg").slideDown();
        return false;
    }).on("mouseleave", "#header", function () {
        $("#gnb > ul > li").removeClass("active");
        //$("#gnb > ul > li > ul").slideUp();
        //$(".gnbBg").slideUp();
        $("#gnb > ul > li > ul").hide();
        $(".gnbBg").hide();
        return false;
    });

    // mobile menu
    $(document).off("click", ".btnSitemapOpen").on("click", ".btnSitemapOpen", function(e) {
        e.preventDefault();
        $(".sitemapWrap").fadeIn().addClass("active");
        $("body").addClass("scrollLock");
        $("body").on("scroll touchmove mousewheel", function(e) {
            e.preventDefault();
            e.stopPropagation();
            return false;
        });
    });
    $(document).off("click", ".btnSitemapClose").on("click", ".btnSitemapClose", function(e) {
        e.preventDefault();
        $(".sitemapWrap").fadeOut().removeClass("active");
        $("body").removeClass("scrollLock");
        $("body").off("scroll touchmove mousewheel");
    });

    $(document).off("click", ".sitemapBody > ul > li > a").on("click", ".sitemapBody > ul > li > a", function(e) {
        e.preventDefault();
        $(this).parent("li").toggleClass("on").siblings("li").removeClass("on");
        $(".sitemapBody > ul > li").each(function () {
            let onCheck = $(this).is(".on");
            if (onCheck) {
                $(this).children("ul").slideDown();
            } else {
                $(this).children("ul").slideUp();
            }
        });
    });

    // 상단으로
    let btnTop = document.querySelector("#btnTop"),
        headerH = 70;

    window.addEventListener("scroll", () => {
        if (window.scrollY > headerH) {
            btnTop.classList.add("show");
        } else {
            btnTop.classList.remove("show");
        }
    });
    $("#btnTop").on("click", function(){
		$("html, body").stop().animate({ scrollTop: 0 });
	});

    // 스토어 바로가기
    $(".langGroup button").on("click", function () {
        $(this).parent().toggleClass("active");
    });

});