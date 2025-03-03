import React, { useContext, useEffect, useState } from "react";
import _backgroundStyles from "../styles/_backgroundStyles";
import "./CommonIntroduction.scss";
import ReactPlayer from "react-player";
import { Navigate, useNavigate } from "react-router-dom";
import { collection, getDocs, Timestamp } from "firebase/firestore";
import { db } from "../firebase";
import BackgroundVideo from "./BackgroundVideo";
import { MemberContext } from "../Contexts/MemberContext";

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
  const { currentUserInfo } = useContext(MemberContext);
  const isAdmin = currentUserInfo?.administrator === true;
  const componentName = "videoproduction";
  console.log(componentName);
  const slide = "動画の作成と発信（youtubeを活用)";
  const navigate = useNavigate();
  const [targetDataList, setTargetDataList] = useState([
    {
      title: "",
      content: "",
      youtubeUrl: "",
      Image: "",
      linkUrl: "",
    },
  ]);

  useEffect(() => {
    const fetchtargetData = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, componentName));
        const DataList = querySnapshot.docs.map((doc) => {
          const data = doc.data();
          return {
            id: doc.id,
            ...data,
            eventdate:
              data.eventdate instanceof Timestamp
                ? data.eventdate.toDate().toLocaleString()
                : data.eventdate, // すでに string ならそのまま

            created_at:
              data.created_at instanceof Timestamp
                ? data.created_at.toDate().toLocaleString()
                : data.created_at, // すでに string ならそのまま

            updated_at:
              data.updated_at instanceof Timestamp
                ? data.updated_at.toDate().toLocaleString()
                : data.updated_at, // すでに string ならそのまま
          };
        });

        // eventdate を基に降順でソート
        const sortedInfoList = DataList.sort((b, a) => {
          // eventdate を Date 型に変換して降順に並べ替え
          return new Date(b.eventdate) - new Date(a.eventdate);
        });

        setTargetDataList(sortedInfoList);
      } catch (error) {
        console.error("データ取得エラー:", error);
      }
    };

    fetchtargetData();
  }, []);

  const [columns, setColumns] = useState(3);
  useEffect(() => {
    // 画面幅に応じた列数を決定
    const updateColumns = () => {
      const width = window.innerWidth;
      let newColumns;
      if (width >= 1650) {
        newColumns = 4;
      } else if (width >= 1570) {
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

  function getYouTubeThumbnail(url) {
    let videoID;

    if (url.includes("youtu.be/")) {
      videoID = url.split("youtu.be/")[1];
    } else if (url.includes("youtube.com/watch?v=")) {
      videoID = new URL(url).searchParams.get("v");
    }

    return videoID
      ? `https://img.youtube.com/vi/${videoID}/maxresdefault.jpg`
      : null;
  }

  // 要素を 3 の倍数に調整（ダミー要素を追加）
  const fillDummyItems = (arr, multiple) => {
    const remainder = arr.length % multiple;
    if (remainder === 0) return arr;
    const dummyCount = multiple - remainder;
    const dummyItems = Array(dummyCount).fill({
      order: "",
      title: "",
      content: "",
      eventday: "",
      linkUrl: "",
      youtubeUrl: "",
      // image: "",
      // other: "",
      isDummy: true, // ダミーフラグ
    });
    return [...arr, ...dummyItems];
  };

  console.log(columns);
  const adjustedArray = fillDummyItems(targetDataList, columns);
  //
  return (
    <div className="commonintroduction-container">
      <video
        autoPlay
        loop
        muted
        className="commonintroduction-container-background-video"
      >
        <source src="/videos/background.mp4" type="video/mp4" />
        Your browser does not support the video tag.
      </video>
      {/* <BackgroundVideo /> */}
      {/* <ReactPlayer
        url="https://www.youtube.com/watch?v=jMi5QUr2AaY"
        width="100%"
        height="100vh"
        controls={true}
        playing={true}
        muted={true}
      /> */}
      <div className="commonintroduction-content">
        {" "}
        <div className="commonintroduction-title">
          <div className="commonintroduction-titletext">
            {slide &&
              slide.split("").map((char, charIndex) => (
                <span
                  className={`commonintroduction-title-char ${
                    char === " " ? "whitespace" : ""
                  }`}
                  style={{ "--char-index": charIndex }}
                  key={charIndex}
                >
                  {char}
                </span>
              ))}
          </div>
          {isAdmin && (
            <div
              className="commonintroduction-post"
              onClick={() => {
                navigate("/firestoreservice", {
                  state: {
                    posttitle: "動画",
                    databasename: componentName,
                    targetitems: [
                      "order",
                      "eventday",
                      "title",
                      "content",
                      // "linkUrl",
                      "youtubeUrl",
                      // "image",
                      // "other",
                    ],
                  },
                });
              }}
            >
              <span className="commonintroduction-post-text">追 加</span>
            </div>
          )}
        </div>{" "}
        <div className="commonintroduction-box-wrap">
          {adjustedArray.map((targetData, index) => (
            <div
              className={`commonintroduction-box ${
                targetData.isDummy ? "dummy" : ""
              }`}
              key={index}
            >
              {" "}
              {!targetData.isDummy && (
                <>
                  <div className="commonintroduction-box-title">
                    <span className="commonintroduction-box-title-text">
                      {targetData.title}
                    </span>
                    <button
                      onClick={() =>
                        navigate(`/firestoreservice/${targetData.id}/edit`, {
                          state: {
                            posttitle: "動画",
                            databasename: componentName,
                            targetitems: [
                              "order",
                              "eventday",
                              "title",
                              "content",
                              // "linkUrl",
                              "youtubeUrl",
                              // "image",
                              // "other",
                            ],
                            targetData: targetData,
                          },
                        })
                      }
                      className="commonintroduction-box-edit-button"
                    >
                      ︙
                    </button>
                  </div>
                  <div className="commonintroduction-box-youtube">
                    <ReactPlayer
                      url={targetData.youtubeUrl}
                      width="100%"
                      height="100%"
                      controls={true}
                    />
                    {/* YouTube動画のタイトルを表示 */}
                  </div>
                  <div className="commonintroduction-box-content">
                    <span className="commonintroduction-box-content-text">
                      {targetData.content}
                    </span>
                  </div>
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
