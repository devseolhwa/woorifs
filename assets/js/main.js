$(function () {

    let isAutoplay = true;
    let progressTimer = null;
    let progressStartTime = 0;
    let progressDuration = 0;

    function getCurrentDelay(swiper) {
        return (
            swiper.slides.eq(swiper.activeIndex).data("swiper-autoplay")
            || swiper.params.autoplay.delay
        );
    }

    function startProgress(swiper) {
        clearInterval(progressTimer);

        const $progress = $(".visualControl .progress");
        progressDuration = getCurrentDelay(swiper);
        progressStartTime = Date.now();

        $progress.css({ width: "0%" });

        progressTimer = setInterval(function () {
            const elapsed = Date.now() - progressStartTime;
            const percent = Math.min((elapsed / progressDuration) * 100, 100);

            $progress.css({ width: percent + "%" });

            if (percent >= 100) {
                clearInterval(progressTimer);
            }
        }, 16);
    }

    function stopProgress() {
        clearInterval(progressTimer);
    }

    // 메인비주얼 슬라이드
    let visualSwiper = new Swiper(".visualSwiper", {
        effect: "fade",
        fadeEffect: {
            crossFade: true
        },
        centeredSlides: true,
        speed: 1000,
        loop: false,
        touchRatio: 0,
        autoplay: {
            delay: 5000,
            disableOnInteraction: false,
        },
        navigation: {
            nextEl: ".visualWrap .swiper-button-next",
            prevEl: ".visualWrap .swiper-button-prev",
        },
        pagination: {
            el: ".visualControl",
            type: "fraction",
            renderFraction: function (currentClass, totalClass) {
                return `
                    <span class="${currentClass}"></span>
                    <div class="progressBar"><span class="progress"></span></div>
                    <span class="${totalClass}"></span>
                    <button class="swiper-button-autoplay">자동재생정지</button>
                `;
            }
        },
        on: {
            init() {
                this.slides.removeClass("swiper-slide-play");
                this.slides.eq(this.activeIndex).addClass("swiper-slide-play");

                if (isAutoplay) {
                    setTimeout(() => {
                        startProgress(this);
                    }, 0);
                }
            },
            slideChangeTransitionStart() {
                this.slides.removeClass("swiper-slide-play");
                stopProgress();
                $(".visualControl .progress").css({ width: "0%" });
            },
            slideChangeTransitionEnd() {
                this.slides.eq(this.activeIndex).addClass("swiper-slide-play");
                if (isAutoplay) {
                    startProgress(this);
                }
            }
        }
    });
    // 자동재생 정지 / 재생
    $(".swiper-button-autoplay").on("click", function () {
        if ($(this).hasClass("on")) {
            isAutoplay = true;
            visualSwiper.autoplay.start();
            startProgress(visualSwiper);
        } else {
            isAutoplay = false;
            visualSwiper.autoplay.stop();
            stopProgress();
        }
        $(this).toggleClass("on");
    });


     const pageText = [
        "집합투자기구",
        "부동산투자회사",
        "가상자산"
    ];

    // 프로필 슬라이드
    const serviceGallerySwiper = new Swiper('.serviceGallerySwiper', {
        loop: true,
        /* autoplay: {
            delay: 5000,
            disableOnInteraction: false,
        }, */
        navigation: {
            nextEl: ".serviceGallery .swiper-button-next",
            prevEl: ".serviceGallery .swiper-button-prev",
        }
    });

    // 컨텐츠 슬라이드
    const serviceInfoSwiper = new Swiper('.serviceInfoSwiper', {
        effect: 'fade',
        fadeEffect: {
            crossFade: true
        },
        touchRatio: 0,
        allowTouchMove: false,
        loop: true,
        pagination: {
            el: '.serviceInfo .pagination',
            clickable: true,
            type: 'custom',
            renderCustom: function (swiper, current, total) {

                let html = '';

                pageText.forEach(function (text, index) {
                    html += `
                        <button
                            type="button"
                            class="${current === index + 1 ? 'active' : ''}"
                            data-index="${index}">
                            ${text}
                        </button>
                    `;
                });

                return html;
            }
        }
    });

    // profile -> content
    serviceGallerySwiper.on('slideChange', function () {
        serviceInfoSwiper.slideToLoop(serviceGallerySwiper.realIndex);
    });

    // pagination 클릭
    $('.serviceInfo').on('click', '.pagination button', function () {

        const index = $(this).data('index');

        serviceGallerySwiper.slideToLoop(index);
        serviceInfoSwiper.slideToLoop(index);

    });

    // fullpage
    /* $("#fullpage").fullpage({
        licenseKey: "OPEN-SOURCE-GPLV3-LICENSE",
        // fullpage 해제할 브라우저 너비와 높이
        responsiveWidth : 1399,
        responsiveHeight : 800,
        anchors : ["HOME", "INTRODUCE", "PRODUCT", "MANAGEMENT", "FOOTER"],
        sectionsColor : ["#000", "#FFF", "#f7f7f7", "#FFF", "#222"],
        css3: true,
        easing: "easeInOutCubic",
        easingcss3: "ease",
        scrollingSpeed: 800,
        //normalScrollElements: "#section2",
        scrollOverflow: true,
        navigation : true,
        navigationPosition : "left",
        navigationTooltips : ["HOME", "INTRODUCE", "PRODUCT", "MANAGEMENT", "FOOTER"],
        showActiveTooltip: true,
		slidesNavigation: false,
        slidesNavPosition: 'bottom',
        //loopBottom : true,
        afterLoad : function (anchorLink, index) {
            if($(".section").hasClass("on")){
                $(".section.active .aos-init").addClass("aos-animate");
            } else {
                $(".section .aos-init").removeClass("aos-animate");
            }
            $(".section.active .aos-init").addClass("aos-animate");
            if (index == 2 || index == 3 || index == 4 || index == 5) {
                $("#header").addClass("show");
                $("#btnTop").addClass("show");
                $("#fp-nav").addClass("black");
            } else {
                $("#header").removeClass("show");
                $("#btnTop").removeClass("show");
                $("#fp-nav").removeClass("black");
            }
            if (index == 4 || index == 5) {
                $("#section4").addClass("ani");
            } else {
                $("#section4").removeClass("ani");
            }
            if (index == 5) {
                $("#fp-nav").hide();
            } else {
                $("#fp-nav").show();
            }
        },
    });

    $("#btnTop").click(function() {
        $.fn.fullpage.moveTo("HOME");
    }); */
});