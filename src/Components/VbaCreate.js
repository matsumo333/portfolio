import React, { useState } from "react";
import _backgroundStyles from "../styles/_backgroundStyles";
import "./VbaCreate.scss";

const VbaCreate = () => {
  const slides = Array.from({ length: 19 }, (_, index) => ({
    src: `./images/img${index + 1}.jpg`,
    alt: `Slide ${index + 1}`,
    // text: textArray[index % textArray.length],
  }));

  const slide = "動画作成（youtube)への保存や公開";

  const [currentSlide, setCurrentSlide] = useState(0);
  return (
    <div className="vbacreate-container">
      <video
        autoPlay
        loop
        muted
        className="vbacreate-container-background-video"
      >
        <source src="/videos/background.mp4" type="video/mp4" />
        Your browser does not support the video tag.
      </video>
      <div className="vbacreate-content">
        {" "}
        <div className="vbacreate-title">
          {slide &&
            slide.split("").map((char, charIndex) => (
              <span
                className={`vbacreate-title-char ${
                  char === " " ? "whitespace" : ""
                }`}
                style={{ "--char-index": charIndex }}
                key={charIndex}
              >
                {char}
              </span>
            ))}
        </div>
        <div className="vbacreate-box">
          {/* 画像 */}
          <img
            src="/images/img2.jpg"
            className="vbacreate-box-image"
            alt="背景画像"
          />

          {/* テキストを重ねる */}
          <div className="vbacreate-overlay">
            <p>ぼかしています</p>
          </div>
        </div>
        <div className="vbacreate-box">
          {/* 画像 */}
          <img
            src="/images/img2.jpg"
            className="vbacreate-box-image"
            alt="背景画像"
          />

          {/* テキストを重ねる */}
          <div className="vbacreate-overlay">
            <p>ぼかしています</p>
          </div>
        </div>
        <div className="vbacreate-box">
          {/* 画像 */}
          <img
            src="/images/img2.jpg"
            className="vbacreate-box-image"
            alt="背景画像"
          />

          {/* テキストを重ねる */}
          <div className="vbacreate-overlay">
            <p>ぼかしています</p>
          </div>
        </div>
        <div className="vbacreate-box">
          {/* 画像 */}
          <img
            src="/images/img2.jpg"
            className="vbacreate-box-image"
            alt="背景画像"
          />

          {/* テキストを重ねる */}
          <div className="vbacreate-overlay">
            <p>ぼかしています</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default VbaCreate;
