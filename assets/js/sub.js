$(function(){
    // 요소접근 이벤트
    setTimeout(function(){
        showLayer();
    }, 1000);

    function showLayer(){
        $(".showLayer").each(function(){
            let $this = $(this);
            let start_pos = "top bottom";
            let end_pos =  "bottom top";

            ScrollTrigger.create({
                trigger: $this,
                start: start_pos, 
                end: end_pos,
                toggleActions: "play reverse play reverse", 
                toggleClass: "active"
            });
        });
    }

    // 주요업무 및 서비스
    var activeTab = $(".tabNav li.on a").attr("href");
    if (activeTab && activeTab.startsWith("#")) {
        $(activeTab).show();
    }

    $(".tabNav a").on("click", function (e) {
        var target = $(this).attr("href");

        if (target && target.startsWith("#") && target.length > 1) {
            e.preventDefault();
            $(this).parent("li").addClass("on").siblings().removeClass("on");
            $(".tabContent").find("[data-aos]").removeClass("aos-animate");
            $(".tabContent").not(target).find(".showLayer").removeClass("active");
            $(target).addClass("active").siblings(".tabContent").removeClass("active");
            setTimeout(function() {
                AOS.refresh();

                if (typeof ScrollTrigger !== "undefined") {
                    ScrollTrigger.refresh();
                }
            }, 100);
        }
    });

    // 펀드회계
    var scrollBar = {
        init: function () {

            if (!$(".fundAccountingWrap").length) return;

            $(window).on("scroll resize", function () {
                scrollBar.bar();
            });

            scrollBar.bar();
        },

        bar: function () {
            const $wrap = $(".fundAccountingWrap");

            const winScroll = $(window).scrollTop();
            const winHeight = $(window).height();

            const wrapTop = $wrap.offset().top;
            const wrapHeight = $wrap.outerHeight();

            const startScroll = wrapTop - winHeight * 0.6;
            const endScroll = wrapTop + wrapHeight - winHeight;
            const totalScroll = endScroll - startScroll;

            let currentScroll = winScroll - startScroll;
            currentScroll = Math.max(0, Math.min(currentScroll, totalScroll));

            let percent = (currentScroll / totalScroll) * 100;
            percent = Math.max(0, Math.min(percent, 100));

            $(".scrollBar > .bar").css({
                height: percent + "%"
            });
        }
    };

    scrollBar.init();

});