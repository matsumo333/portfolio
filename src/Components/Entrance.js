import React, { useState } from "react";
import _backgroundStyles from "../styles/_backgroundStyles";
import "./Entrance.scss";
import { useNavigate } from "react-router-dom";

const Entrance = () => {
  const navigate = useNavigate();
  const textArray = [
    "高齢者の私に世の中に役立つことができないのか？　　　　　　　　　　　　　　　　　　　　　　？。。自分にできることを世の中のお役にたてないか？",
    "悪知恵を使い人を騙すような人ではなく、　　　　　　　　　　　　。。一生懸命に働いている人を応援することはできないか？？",
    "同じような思いを持つ色々な人と力を合わせて実現できないか？　　　　　　　　　　　。。そんな思いを形にするためこのサイトを立ち上げました。",
  ];

  const slides = [
    {
      src: `./images/img1.jpg`,
      text: "高齢者の私に世の中の役立てることができないか？",
      text2: "経験やできることを世の中に活かせないのか？",
    },
    {
      src: `./images/img2.jpg`,
      text: "社会の潜在力をもっと引き出すことはできないのか？",
      text2: "理不尽な思いをしている人を減らすことはできないのか？",
    },
    {
      src: `./images/img3.jpg`,
      text: "楽な仕事で大きな金を得ることがもてはやされるのでなく、",
      text2: "一生懸命に働く人が、もっと報われる社会にできないのか？",
    },
    {
      src: `./images/img4.jpg`,
      text: "思いを持つ人と力を合わせ、そんなことが実現できないか？",
      text2: "そんな思いを形にするためこのサイトを立ち上げました。",
    },
  ];
  const [currentSlide, setCurrentSlide] = useState(0);

  return (
    <div className="Entrance-container">
      <_backgroundStyles slides={slides} setCurrentSlide={setCurrentSlide} />

      {/* スキップボタン */}
      <button className="skip-button2" onClick={() => navigate(`/home`)}>
        スキップ
      </button>
    </div>
  );
};

export default Entrance;
