import React, { useState } from "react";
import _backgroundStyles from "../styles/_backgroundStyles";
import "./Entrance.scss";
import { useNavigate } from "react-router-dom";

const Entrance = () => {
  const navigate = useNavigate();
  const slideContentArray = [
    {
      slideimage: `./images/img1.jpg`,
      slidetext:
        "高齢者の私に世の中に役立つことができないのか？。。自分にできることを世の中のお役にたてないのか？",
    },
    {
      slideimage: `./images/img2.jpg`,
      slidetext:
        "楽をして大きな金を得るよう方法でなく、。。一生懸命に働く皆が、もっと報われる社会にできないのか？",
    },
    {
      sliedimage: `./images/img3.jpg`,
      slidetext:
        "同じような思いを持つ色々な人と力を合わせて実現できないか？。。。。そんな思いを形にするためこのサイトを立ち上げました。",
    },
  ];

  // const slides = Array.from({ length: 19 }, (_, index) => ({
  //   src: `./images/img${index + 1}.jpg`,
  //   alt: `Slide ${index + 1}`,
  //   text: textArray[index % textArray.length],
  // }));

  const [currentSlide, setCurrentSlide] = useState(0);

  return (
    <div className="Entrance-container">
      <_backgroundStyles
        slideContentArray={slideContentArray}
        setCurrentSlide={setCurrentSlide}
        currentSlide={currentSlide}
      />

      {/* スキップボタン */}
      <button className="skip-button2" onClick={() => navigate(`/home`)}>
        スキップ
      </button>
    </div>
  );
};

export default Entrance;
