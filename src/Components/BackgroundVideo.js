import React from "react";
import YouTube from "react-youtube";

const BackgroundVideo = () => {
  const opts = {
    playerVars: {
      autoplay: 1, // 自動再生
      controls: 0, // コントロールバー非表示
      showinfo: 0, // 動画タイトル非表示
      loop: 1, // ループ再生
      mute: 1, // ミュート
      modestbranding: 1,
      playlist: "PL-yaoSO0Q87YQpRlirLxJSv5xRCia0QEu", // プレイリストID
    },
  };

  return (
    <div
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        width: "100vw",
        height: "100vh",
        overflow: "hidden",
        zIndex: -1,
      }}
    >
      <YouTube
        videoId="jMi5QUr2AaY" // プレイリスト内の最初の動画ID
        opts={opts}
        className="background-video"
      />
      <style>
        {`
          .background-video iframe {
            position: absolute;
            top: 50%;
            left: 50%;
            width: 120vw;
            height: 120vh;
            transform: translate(-50%, -50%);
            pointer-events: none;
          }
        `}
      </style>
    </div>
  );
};

export default BackgroundVideo;
