$(function(){

    // header
    const header = document.querySelector("#header");
    let previousScroll = 0;

    function handleScroll() {
        if (!header) return;
        if (document.body.classList.contains("gnbOpened")) return;

        const currentScroll = window.scrollY;
        const isTop = currentScroll === 0;
        const isScrollDown = currentScroll > 150 && currentScroll > previousScroll;
        const isScrollUp = currentScroll < previousScroll;

        if (isTop) {
            header.classList.remove("hide", "show");
        } else if (isScrollDown) {
            header.classList.remove("show");
            header.classList.add("hide");
        } else if (isScrollUp) {
            header.classList.remove("hide");
            header.classList.add("show");
        }

        previousScroll = currentScroll;
    }
    window.addEventListener("scroll", handleScroll);
   
    // header mouseover
    $("#header, #gnb").mouseover(function(){
        $("#header").addClass("show");
    });

    // gnb
    $(document).on("mouseenter", "#gnb > ul > li", function () {
        $(this).addClass("active").siblings("li").removeClass("active");
        $("#gnb > ul > li > ul").stop().slideDown();
        $(".gnbBg").stop().slideDown();
        return false;
    }).on("mouseleave", "#header", function () {
        $("#gnb > ul > li").removeClass("active");
        $("#gnb > ul > li > ul").stop().slideUp();
        $(".gnbBg").stop().slideUp();
        return false;
    });
    
    $(document).off("click", ".btnSitemapOpen").on("click", ".btnSitemapOpen", function(e) {
        e.preventDefault();
        $(".sitemapWrap").fadeIn().addClass("active");
        $("body").addClass("scrollLock");
        sitemapInit();
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

    // mobile menu
    $(document).off("click", ".sitemapBody > ul > li > a").on("click", ".sitemapBody > ul > li > a", function (e) {
        if ($(window).width() > 1199) return;
        e.preventDefault();
        $(this).parent("li").addClass("on").siblings().removeClass("on");
    });

    function sitemapInit() {
        const $items = $(".sitemapBody > ul > li");

        if ($(window).width() <= 1199) {
            $items.removeClass("on").first().addClass("on");
        } else {
            $items.removeClass("on");
        }
    }

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

    // 다국어 여닫기
    $(".langGroup button").on("click", function () {
        $(this).parent().toggleClass("active");
    });

    // 패밀리사이트 여닫기
    const btnSiteOpen = document.querySelector(".btnSiteOpen");
    const familySiteGroup = document.querySelector(".familysiteGroup");
    const familySiteList = document.querySelector(".familysiteList");

    btnSiteOpen.addEventListener("click", function () {
        familySiteGroup.classList.toggle("open");
        const isOpen = familySiteList.style.display === "block";
        familySiteList.style.display = isOpen ? "none" : "block";
     
    });

});