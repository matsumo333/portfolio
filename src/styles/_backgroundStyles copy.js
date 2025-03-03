import React, { useRef } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { EffectFade, Autoplay } from "swiper/modules";
import "swiper/css";
import "swiper/css/effect-fade";
import "./_backgroundStyles.scss";

const _backgroundStyles = ({ slides, setCurrentSlide }) => {
  const swiperRef = useRef(null);

  return (
    <Swiper
      modules={[EffectFade, Autoplay]}
      effect="fade"
      autoplay={{ delay: 6000, disableOnInteraction: false }}
      loop={true}
      speed={3000}
      className="_backgroundStyles-swiper"
      initialSlide={0}
      onSlideChange={(swiper) => setCurrentSlide(swiper.activeIndex)}
      ref={swiperRef}
    >
      {slides.map((slide, index) => (
        <SwiperSlide key={index}>
          <div
            className="_backgroundStyles-slide"
            style={{ backgroundImage: `url(${slide.src})` }}
          >
            <div className="_backgroundStyles-text-wrap">
              <div className="_backgroundStyles-text">
                {slide.text &&
                  [...slide.text].map((char, charIndex) => (
                    <span
                      className="_backgroundStyles-text-char"
                      style={{ animationDelay: `${charIndex * 0.1}s` }}
                      key={charIndex}
                    >
                      {char}
                    </span>
                  ))}
              </div>
            </div>
          </div>
        </SwiperSlide>
      ))}
    </Swiper>
  );
};

export default _backgroundStyles;
