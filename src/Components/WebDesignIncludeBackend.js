import React, { useState } from "react";
import _backgroundStyles from "../styles/_backgroundStyles";
import "./WebDesignIncludeBackend.scss";

const WebDesignIncludeBackend = () => {
  const slides = Array.from({ length: 19 }, (_, index) => ({
    src: `./images/img${index + 1}.jpg`,
    alt: `Slide ${index + 1}`,
    // text: textArray[index % textArray.length],
  }));

  const slide = "Webデザイン（バックエンドを含む）とホームページ公開";

  const [currentSlide, setCurrentSlide] = useState(0);
  return (
    <div className="webdesign-container">
      <_backgroundStyles slides={slides} setCurrentSlide={setCurrentSlide} />
      {/* <video
        autoPlay
        loop
        muted
        className="webdesign-container-background-video"
      >
        <source src="/videos/background.mp4" type="video/mp4" />
        Your browser does not support the video tag.
      </video> */}
      <div className="webdesign-content">
        {" "}
        <div className="webdesign-title">
          {slide &&
            slide.split("").map((char, charIndex) => (
              <span
                className={`webdesign-title-char ${
                  char === " " ? "whitespace" : ""
                }`}
                style={{ "--char-index": charIndex }}
                key={charIndex}
              >
                {char}
              </span>
            ))}
        </div>
        <div className="webdesign-box">
          {/* 画像 */}
          <img
            src="/images/img2.jpg"
            className="webdesign-box-image"
            alt="背景画像"
          />

          {/* テキストを重ねる */}
          <div className="webdesign-overlay">
            <p>ぼかしています</p>
          </div>
        </div>
        <div className="webdesign-box">
          {/* 画像 */}
          <img
            src="/images/img2.jpg"
            className="webdesign-box-image"
            alt="背景画像"
          />

          {/* テキストを重ねる */}
          <div className="webdesign-overlay">
            <p>ぼかしています</p>
          </div>
        </div>
        <div className="webdesign-box">
          {/* 画像 */}
          <img
            src="/images/img2.jpg"
            className="webdesign-box-image"
            alt="背景画像"
          />

          {/* テキストを重ねる */}
          <div className="webdesign-overlay">
            <p>ぼかしています</p>
          </div>
        </div>
        <div className="webdesign-box">
          {/* 画像 */}
          <img
            src="/images/img2.jpg"
            className="webdesign-box-image"
            alt="背景画像"
          />

          {/* テキストを重ねる */}
          <div className="webdesign-overlay">
            <p>ぼかしています</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default WebDesignIncludeBackend;
