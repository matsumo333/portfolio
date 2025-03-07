import React, { useRef, useState } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { EffectFade, Autoplay } from "swiper/modules";
import "swiper/css";
import "swiper/css/effect-fade";
import "./_backgroundStyles.scss";
import { useNavigate } from "react-router-dom";

const _backgroundStyles = ({ slides, setCurrentSlide }) => {
  const swiperRef = useRef(null);
  const navigate = useNavigate();
  const [slideCount, setSlideCount] = useState(0);

  const handleSlideChange = (swiper) => {
    setCurrentSlide(swiper.activeIndex);

    // スライド回数をカウント（スライドが0に戻るたびに増加）
    if (swiper.activeIndex === 3) {
      setSlideCount((prevCount) => prevCount + 1);
    }
    // if (slideCount >= 3) {
    //   navigate("/home");
    // }
    console.log(swiper.activeIndex);
    console.log(slideCount);
  };

  return (
    <Swiper
      modules={[EffectFade, Autoplay]}
      effect="fade"
      autoplay={{ delay: 5000, disableOnInteraction: false }}
      loop={true}
      speed={3000}
      className="_backgroundStyles-swiper"
      initialSlide={0}
      // onSlideChange={(swiper) => setCurrentSlide(swiper.activeIndex)}
      onSlideChange={handleSlideChange}
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

              <div className="_backgroundStyles-text">
                {slide.text2 &&
                  [...slide.text2].map((char, charIndex) => (
                    <span
                      className="_backgroundStyles-text-char"
                      style={{
                        animationDelay: `${
                          (slide.text.length + 7 + charIndex) * 0.1
                        }s`,
                      }}
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
