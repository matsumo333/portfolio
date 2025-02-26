import React, { useState } from "react";
import _backgroundStyles from "../styles/_backgroundStyles";
import "./Home.scss";
import { useNavigate } from "react-router-dom";

const Home = () => {
  const navigate = useNavigate();

  const textArray = [
    {
      title: "建築関係",
      content:
        "行政建築技術者者として４４年間行政建築技術者者として行政建築技術者者として４４年間行政建築技術者者として行政建築技術者者として４４年間行政建築技術者者として行政建築技術者者として４４年間行政建築技術者者として４４年間行政建築技術者者として４４年間行政建築技術者者として４４年間行政建築技術者者として４４年間",
      content2:
        "行政建築技術者者として４４年間行政建築技術者者として４４年間行政建築技術者者として４４年間行政建築技術者者として４４年間行政建築技術者者として４４年間",
      image: `./images/img1.jpg`,
      link: `/municipalarchitect`,
    },
    {
      title: "webデザイン",
      content:
        "行政建築技術者者として４４年間行政建築技術者者として４４年間行政建築技術者者として４４年間行政建築技術者者として４４年間行政建築技術者者として４４年間",
      image: `./images/img2.jpg`,
      link: `/webdesignincludebackend`,
    },
    {
      title: "動画作成",
      content:
        "行政建築技術者者として４４年間行政建築技術者者として４４年間行政建築技術者者として４４年間行政建築技術者者として４４年間行政建築技術者者として４４年間",
      image: `./images/img2.jpg`,
      link: `/videoproduction`,
    },
    {
      title: "VBA作成",
      content:
        "行政建築技術者者として４４年間行政建築技術者者として４４年間行政建築技術者者として４４年間行政建築技術者者として４４年間行政建築技術者者として４４年間",
      image: `./images/img2.jpg`,
      link: `/vbacreate`,
    },
    {
      title: "テニスエルボ治療",
      content:
        "行政建築技術者者として４４年間行政建築技術者者として４４年間行政建築技術者者として４４年間行政建築技術者者として４４年間行政建築技術者者として４４年間",
      image: `./images/img2.jpg`,
      link: `/home`,
    },
    {
      title: "その他",
      content:
        "行政建築技術者者として４４年間行政建築技術者者として４４年間行政建築技術者者として４４年間行政建築技術者者として４４年間行政建築技術者者として４４年間",
      image: `./images/img2.jpg`,
      link: `/home`,
    },
  ];
  const slides = Array.from({ length: 19 }, (_, index) => ({
    src: `./images/img${index + 1}.jpg`,
    alt: `Slide ${index + 1}`,
  }));

  const [currentSlide, setCurrentSlide] = useState(0);
  return (
    <div className="home-container">
      {/* <_backgroundStyles slides={slides} setCurrentSlide={setCurrentSlide} /> */}
      <div className="home-content">
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
  );
};

export default Home;
