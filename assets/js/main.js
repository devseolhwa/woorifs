$(function () {

    let isAutoplay = true;
    let progressTimer = null;
    let progressStartTime = 0;
    let progressDuration = 0;

    function getCurrentDelay(swiper) {
        return (
            swiper.slides[swiper.activeIndex].dataset.swiperAutoplay ||
            swiper.params.autoplay.delay
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
        loop: true,
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
                this.slides.forEach(slide => {
                    slide.classList.remove("swiper-slide-play");
                });

                this.slides[this.activeIndex].classList.add("swiper-slide-play");

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
    // 자동재생 정지/재생
    $(document).on("click", ".swiper-button-autoplay", function () {
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

    // 요소접근 이벤트
    setTimeout(function(){
        showLayer();
    }, 2000);

    function showLayer(){
        $(".showLayer").each(function(){
            let $this = $(this);
            let start_pos = "top bottom";
            let end_pos =  "bottom top";

            ScrollTrigger.create({
                trigger: $this,
                start: start_pos, 
                end: end_pos,
                onEnter: function(){
                    $this.addClass("active");
                },onLeave: function(){
                    $this.removeClass("active");
                },onEnterBack: function(){
                    $this.addClass("active");
                },onLeaveBack: function(){
                    $this.removeClass("active");
                }
            });
        });
    }

    // 우리펀드서비스
    const pageText = [
        "집합투자기구",
        "부동산투자회사",
        "가상자산"
    ];

    // serviceGallery
    const serviceGallerySwiper = new Swiper('.serviceGallerySwiper', {
        loop: false,
        speed: 1000,
        autoplay: {
            delay: 10000,
            disableOnInteraction: false,
        },
        effect: 'creative',
        creativeEffect: {
            prev: {
                translate: ['0%', 0, -1],
            },
            next: {
                translate: ['100%', 0, 0],
            },
        },
        navigation: {
            nextEl: ".serviceGallery .swiper-button-next",
            prevEl: ".serviceGallery .swiper-button-prev",
        }
    });

    // serviceInfo
    const serviceInfoSwiper = new Swiper('.serviceInfoSwiper', {
        effect: 'fade',
        autoHeight: true,
        watchSlidesProgress: true,
        fadeEffect: {
            crossFade: true
        },
        touchRatio: 0,
        allowTouchMove: false,
        loop: false,
        pagination: {
            el: '.serviceInfo .pagination',
            clickable: true,
            type: 'custom',
            renderCustom: function (swiper, current, total) {

                let html = '';

                pageText.forEach(function (text, index) {

                    const first = text.substring(0, 2);
                    const last = text.substring(2);

                    html += `
                        <button
                            type="button"
                            class="${current === index + 1 ? 'active' : ''}"
                            data-index="${index}">
                            <span><em>${first}</em>${last}</span>
                        </button>
                    `;
                });
                return html;
            }
        }
    });

    const serviceCircleSwiper = new Swiper('.serviceCircleSwiper', {
        loop: false,
        speed: 800,
        autoplay: {
            delay: 10000,
            disableOnInteraction: false,
        },
    });
    serviceGallerySwiper.on('slideChange', function () {
        const index = serviceGallerySwiper.realIndex;

        serviceInfoSwiper.slideToLoop(index);
        serviceCircleSwiper.slideToLoop(index);
    });
    $('.serviceInfo').on('click', '.pagination button', function () {
        const index = $(this).data('index');

        serviceGallerySwiper.slideToLoop(index);
        serviceInfoSwiper.slideToLoop(index);
        serviceCircleSwiper.slideToLoop(index);
    });

    // 우리펀드 소식
    const navButtons = document.querySelectorAll(".newsNav li button");
    const newsBoxes = document.querySelectorAll(".newsContents .newsBox");
    const swiperMap = new Map();

    navButtons.forEach((button, index) => {
        button.addEventListener("click", function () {
            document.querySelector(".newsNav li.active")?.classList.remove("active");
            button.parentElement.classList.add("active");
            newsBoxes.forEach((box) => {
                const swiper = swiperMap.get(box);
                if (swiper) {
                    swiper.destroy(true, true);
                    swiperMap.delete(box);
                }
                box.classList.remove("active");
            });

            const activeBox = newsBoxes[index];
            activeBox.classList.add("active");
            initializeSlider(activeBox);
        });
    });

    function initializeSlider(box) {
        const container = $(box);

        let progressRAF;
        let progressStart;

        function stopProgress() {
            cancelAnimationFrame(progressRAF);
        }

        function startProgress() {
            stopProgress();
            const bar = container.find(".progress");
            bar.css("width", "0%");
            progressStart = performance.now();
            function animate(now) {
                const elapsed = now - progressStart;
                const percent = Math.min((elapsed / 5000) * 100, 100);
                bar.css("width", percent + "%");
                if (percent < 100) {
                    progressRAF = requestAnimationFrame(animate);
                }
            }
            progressRAF = requestAnimationFrame(animate);
        }

        const swiper = new Swiper(container.find(".newsSlider")[0], {
            slidesPerView: "auto",
            spaceBetween: 32,
            loop: true,
            speed: 800,
            autoplay: {
                delay: 5000,
                disableOnInteraction: false
            },
            navigation: {
                prevEl: container.find(".prev")[0],
                nextEl: container.find(".next")[0]
            },
            breakpoints: {
                0: {
                    spaceBetween: 16
                },
                1200: {
                    spaceBetween: 32
                }
            },
            on: {
                init() {
                    const total = container
                        .find(".swiper-slide:not(.swiper-slide-duplicate)")
                        .length;
                    container.find(".swiper-pagination-current").text(1);
                    container.find(".swiper-pagination-total").text(total);
                    startProgress();
                },
                slideChange() {
                    container.find(".swiper-pagination-current").text(this.realIndex + 1);
                    startProgress();
                }
            }
        });
        swiperMap.set(box, swiper);
    }
    initializeSlider(document.querySelector(".newsBox.active"));
    
});