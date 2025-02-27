import React, { useState } from "react";
import _backgroundStyles from "../styles/_backgroundStyles";
import "./MunicipalArchitect.scss";

const MunicipalArchitect = () => {
  const slides = Array.from({ length: 19 }, (_, index) => ({
    src: `./images/img${index + 1}.jpg`,
    alt: `Slide ${index + 1}`,
    // text: textArray[index % textArray.length],
  }));

  const slide = "行政建築職（京都市役所職員）としての経験";

  const [currentSlide, setCurrentSlide] = useState(0);
  return (
    <div className="municipalarchitect-container">
      <video
        autoPlay
        loop
        muted
        className="municipalarchitect-container-background-video"
      >
        <source src="/videos/background.mp4" type="video/mp4" />
        Your browser does not support the video tag.
      </video>
      <div className="municipalarchitect-content">
        {" "}
        <div className="municipalarchitect-title">
          {slide &&
            slide.split("").map((char, charIndex) => (
              <span
                className={`municipalarchitect-title-char ${
                  char === " " ? "whitespace" : ""
                }`}
                style={{ "--char-index": charIndex }}
                key={charIndex}
              >
                {char}
              </span>
            ))}
        </div>
        <div className="municipalarchitect-box">
          {/* 画像 */}
          <img
            src="/images/img2.jpg"
            className="municipalarchitect-box-image"
            alt="背景画像"
          />

          {/* テキストを重ねる */}
          <div className="municipalarchitect-overlay">
            <p>ぼかしています</p>
          </div>
        </div>
        <div className="municipalarchitect-box">
          {/* 画像 */}
          <img
            src="/images/img2.jpg"
            className="municipalarchitect-box-image"
            alt="背景画像"
          />

          {/* テキストを重ねる */}
          <div className="municipalarchitect-overlay">
            <p>ぼかしています</p>
          </div>
        </div>
        <div className="municipalarchitect-box">
          {/* 画像 */}
          <img
            src="/images/img2.jpg"
            className="municipalarchitect-box-image"
            alt="背景画像"
          />

          {/* テキストを重ねる */}
          <div className="municipalarchitect-overlay">
            <p>ぼかしています</p>
          </div>
        </div>
        <div className="municipalarchitect-box">
          {/* 画像 */}
          <img
            src="/images/img2.jpg"
            className="municipalarchitect-box-image"
            alt="背景画像"
          />

          {/* テキストを重ねる */}
          <div className="municipalarchitect-overlay">
            <p>ぼかしています</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MunicipalArchitect;
