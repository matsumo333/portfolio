import React, { useEffect, useState } from "react";
import _backgroundStyles from "../styles/_backgroundStyles";
import "./Home.scss";
import { useNavigate } from "react-router-dom";

const Home = () => {
  const navigate = useNavigate();

  const textArray = [
    {
      title: "建築関係",
      content:
        "市役所の建築技術職員として４４年間、①公共施設の設計や工事、修繕、行政建築技術者として働いてきた経験や、、、、、、、、、現在、作成中です。",
      content2: "中身は仮に入れております。",
      image: `./images/img1.jpg`,
      link: `/municipalarchitect`,
    },
    {
      title: "webデザイン",
      content:
        "ホームページによる情報の効率的な共有や、サークル活動の支援、お店などの紹介などを支援します。",
      image: `./images/img2.jpg`,
      link: `/webdesignincludebackend`,
    },
    {
      title: "動画作成",
      content:
        "世界でも稀有な地質や気候が生み出した美しい自然景観や、歴史がちりばめられたまちまち、そして社寺、遺跡等の人間の営みの足跡、それらと紅葉をはじめとする四季が織りなす景観を残したくてyoutubeでの動画作成を行ってきました。",
      image: `./images/img2.jpg`,
      link: `/videoproduction`,
    },
    {
      title: "VBA作成",
      content:
        "ちょっとしたexcelを使用した業務の効率化のためのvbaの作成を支援します。",
      image: `./images/img2.jpg`,
      link: `/vbacreate`,
    },
    {
      title: "テニス等のサークル活動支援",
      content:
        "サークル活動のイベント情報の発信、参加申し込みの効率化、情報の共有、交流を支援する仕組みづくりを支援します。",
      image: `./images/img2.jpg`,
      link: `/tennisrelated`,
    },
    {
      title: "社会問題解決",
      content:
        "社会の持つ潜在力の発揮、社会運営の効率化、理不尽の解消、頑張っている人やお店、会社等の支援をします。",
      image: `./images/img2.jpg`,
      link: `/socialefficiency`,
    },
  ];
  const slides = Array.from({ length: 19 }, (_, index) => ({
    src: `./images/img${index + 1}.jpg`,
    alt: `Slide ${index + 1}`,
  }));

  const [currentSlide, setCurrentSlide] = useState(0);

  useEffect(() => {
    const timer = setTimeout(() => {
      navigate(`/`);
    }, 21000);

    return () => clearTimeout(timer); // ページ移動時にタイマーを解除
  }, []); // isAdminが変更されるたびに実行

  return (
    <div className="home-container">
      {/* <_backgroundStyles slides={slides} setCurrentSlide={setCurrentSlide} /> */}
      <div className="home-content">
        <div className="home-explanation">
          <div className="home-explanation-title">
            <h1>考えている分野</h1>
            <p>（以下の分野での取り組みを考えております）</p>
          </div>
        </div>
        <div className="home-content-item-wrap">
          {textArray.map((text, index) => (
            <div
              className="home-content-item"
              key={index}
              onClick={() => navigate(text.link)}
            >
              <h3>{text.title}</h3>
              <div className="home-content-item-wrapper">
                {text.image && (
                  <img
                    src={text.image}
                    alt={text.title}
                    className="home-content-item-image"
                  />
                )}
                <div className="home-content-item-text">
                  <p>{text.content}</p>
                  <p>{text.content2}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Home;
