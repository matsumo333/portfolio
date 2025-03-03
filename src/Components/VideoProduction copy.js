import React, { useEffect, useState } from "react";
import _backgroundStyles from "../styles/_backgroundStyles";
import "./VideoProduction.scss";
import ReactPlayer from "react-player";

const getYouTubeThumbnail = (url) => {
  let videoID;

  if (url.includes("youtu.be/")) {
    videoID = url.split("youtu.be/")[1]; // 短縮URLからIDを取得
  } else if (url.includes("youtube.com/watch?v=")) {
    videoID = new URL(url).searchParams.get("v"); // 通常URLからIDを取得
  }

  return videoID
    ? `https://img.youtube.com/vi/${videoID}/maxresdefault.jpg`
    : null;
};

const VideoProduction = () => {
  const slide = "動画作成（youtube)への保存や公開";
  const [youtubeArray, setYoutubeArray] = useState([
    {
      title: "常寂光寺　20211126",
      youtubeUrl: "https://youtu.be/cXOtESRkDMM",
      content:
        "階段紅葉や池紅葉、上から下から斜めから、様々な紅葉の見方ができる名刹です。階段紅葉や池紅葉、上から下から斜めから、様々な紅葉の見方ができる名刹です。そんな",
    },

    {
      title: "燕岳　残雪　20210612-13",
      youtubeUrl: "https://www.youtube.com/watch?v=vDDl_8fLzwA",
      content: "大好きな北アルプスの燕岳に登った時の記録です",
    },

    {
      title: "建築関係",
      youtubeUrl:
        "市役所の建築技術職員として４４年間、①公共施設の設計や工事、修繕、行政建築技術者者として行政建築技術者者として４４年間行政建築技術者者として行政建築技術者者として４４年間行政建築技術者者として行政建築技術者者として４４年間行政建築技術者者として４４年間行政建築技術者者として４４年間行政建築技術者者として４４年間行政建築技術者者として４４年間",
      content: "大好きな紅葉の動画です",
    },

    {
      title: "建築関係",
      youtubeUrl:
        "市役所の建築技術職員として４４年間、①公共施設の設計や工事、修繕、行政建築技術者者として行政建築技術者者として４４年間行政建築技術者者として行政建築技術者者として４４年間行政建築技術者者として行政建築技術者者として４４年間行政建築技術者者として４４年間行政建築技術者者として４４年間行政建築技術者者として４４年間行政建築技術者者として４４年間",
      content: "大好きな紅葉の動画です",
    },
    {
      title: "衝撃映像建築関係",
      youtubeUrl:
        "市役所の建築技術職員として４４年間、①公共施設の設計や工事、修繕、行政建築技術者者として行政建築技術者者として４４年間行政建築技術者者として行政建築技術者者として４４年間行政建築技術者者として行政建築技術者者として４４年間行政建築技術者者として４４年間行政建築技術者者として４４年間行政建築技術者者として４４年間行政建築技術者者として４４年間",
      content: "大好きな紅葉の動画です",
    },
    {
      title: "衝撃映像建築関係",
      youtubeUrl:
        "市役所の建築技術職員として４４年間、①公共施設の設計や工事、修繕、行政建築技術者者として行政建築技術者者として４４年間行政建築技術者者として行政建築技術者者として４４年間行政建築技術者者として行政建築技術者者として４４年間行政建築技術者者として４４年間行政建築技術者者として４４年間行政建築技術者者として４４年間行政建築技術者者として４４年間",
      content: "大好きな紅葉の動画です",
    },
    {
      title: "衝撃映像建築関係",
      youtubeUrl:
        "市役所の建築技術職員として４４年間、①公共施設の設計や工事、修繕、行政建築技術者者として行政建築技術者者として４４年間行政建築技術者者として行政建築技術者者として４４年間行政建築技術者者として行政建築技術者者として４４年間行政建築技術者者として４４年間行政建築技術者者として４４年間行政建築技術者者として４４年間行政建築技術者者として４４年間",
      content: "大好きな紅葉の動画です",
    },
  ]);

  const [columns, setColumns] = useState(3);
  useEffect(() => {
    // 画面幅に応じた列数を決定
    const updateColumns = () => {
      const width = window.innerWidth;
      let newColumns;
      if (width >= 1200) {
        newColumns = 3;
      } else if (width >= 650) {
        newColumns = 2;
      } else {
        newColumns = 1;
      }

      console.log("Window width:", width, "New columns:", newColumns);

      // 状態が変わる時のみ更新
      setColumns((prevColumns) => {
        if (prevColumns !== newColumns) {
          console.log("Columns updated to:", newColumns);
          return newColumns;
        }
        return prevColumns;
      });
    };

    updateColumns();
    window.addEventListener("resize", updateColumns);

    return () => {
      window.removeEventListener("resize", updateColumns);
    };
  }, []);

  useEffect(() => {
    const upDateYoutubeArray = youtubeArray.map((video) => ({
      ...video,
      thumbnailUrl: getYouTubeThumbnail(video.youtubeUrl),
    }));
    setYoutubeArray(upDateYoutubeArray);
  }, []);

  // const [currentSlide, setCurrentSlide] = useState(0);

  // const youtubeUrlRaw = "https://youtu.be/cXOtESRkDMM";

  function getYouTubeThumbnail(url) {
    let videoID;

    if (url.includes("youtu.be/")) {
      videoID = url.split("youtu.be/")[1]; // 短縮URLからIDを取得
    } else if (url.includes("youtube.com/watch?v=")) {
      videoID = new URL(url).searchParams.get("v"); // 通常URLからIDを取得
    }

    return videoID
      ? `https://img.youtube.com/vi/${videoID}/maxresdefault.jpg`
      : null;
  }
  // const thumbnailUrl = getYouTubeThumbnail(youtubeUrlRaw);
  // console.log(thumbnailUrl);

  // 要素を 3 の倍数に調整（ダミー要素を追加）
  const fillDummyItems = (arr, multiple) => {
    const remainder = arr.length % multiple;
    if (remainder === 0) return arr;
    const dummyCount = multiple - remainder;
    const dummyItems = Array(dummyCount).fill({
      title: "",
      youtubeUrl: "",
      content: "",
      isDummy: true, // ダミーフラグ
    });
    return [...arr, ...dummyItems];
  };

  console.log(columns);
  const adjustedArray = fillDummyItems(youtubeArray, columns);

  return (
    <div className="videoproduct-container">
      <video
        autoPlay
        loop
        muted
        className="videoproduct-container-background-video"
      >
        <source src="/videos/background.mp4" type="video/mp4" />
        Your browser does not support the video tag.
      </video>
      <div className="videoproduct-content">
        {" "}
        <div className="videoproduct-title">
          {slide &&
            slide.split("").map((char, charIndex) => (
              <span
                className={`videoproduct-title-char ${
                  char === " " ? "whitespace" : ""
                }`}
                style={{ "--char-index": charIndex }}
                key={charIndex}
              >
                {char}
              </span>
            ))}
          <div className="videoproduct-info-in">投稿する</div>
        </div>
        <div className="videoproduct-box-wrap">
          {adjustedArray.map((youtube, index) => (
            <div
              className={`videoproduct-box ${youtube.isDummy ? "dummy" : ""}`}
              key={index}
            >
              {" "}
              {!youtube.isDummy && (
                <>
                  <div className="videoproduct-box-title">
                    <p>{youtube.title}</p>
                  </div>
                  <div className="videoproduct-box-youtube">
                    <ReactPlayer
                      url={youtube.youtubeUrl}
                      width="100%"
                      height="auto"
                      controls={true}
                    />
                    {/* YouTube動画のタイトルを表示 */}
                  </div>
                  <div className="videoproduct-box-content">
                    {youtube.content}
                  </div>
                  {/* <div className="videoproduct-box-content">
                <img
                  class="videoproduct-box-image"
                  src={youtube.thumbnailUrl}
                  alt={youtube.title}
                />
              </div> */}{" "}
                </>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default VideoProduction;
