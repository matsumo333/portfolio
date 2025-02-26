import React, { useState } from "react";
import _backgroundStyles from "../styles/_backgroundStyles";
import "./Entrance.scss";
import { useNavigate } from "react-router-dom";

const Entrance = () => {
  const navigate = useNavigate();
  const textArray = [
    "高齢者の私に世の中に役立つことができないののか？　　　　　　　　　　　　　　　　　　　　　　　　　　　　自分にできることを世の中のお役にたてないか？",
    "同じような思いを持つ色々な人と力を合わせて実現できないか？",
    "そんな思いを形にするためこのサイトを立ち上げました。",
    "一生懸命に働いている人を応援することはできないか。",
    "悪知恵を使い人を騙すような人を何とかできないか。",
    "みんなでやりましょう",
    "そうだそうだ",
    "十六茶もデーで",
    "あーどな泣いた",
    "テニスは楽しい",
  ];

  const slides = Array.from({ length: 19 }, (_, index) => ({
    src: `./images/img${index + 1}.jpg`,
    alt: `Slide ${index + 1}`,
    text: textArray[index % textArray.length],
  }));

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
