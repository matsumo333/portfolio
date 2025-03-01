import React, { useEffect, useRef, useState } from "react";
import { db, storage } from "../firebase"; // 🔹 firebase.js からインポート
import {
  collection,
  addDoc,
  serverTimestamp,
  deleteDoc,
  doc,
  updateDoc,
  Timestamp,
} from "firebase/firestore";

import { ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";
import "./FirestoreService.scss";
import { useLocation, useNavigate, useParams } from "react-router-dom";

const FirestoreService = () => {
  const [title, setTitle] = useState("");
  const { Id, eventState } = useParams();
  const [content, setContent] = useState("");
  const textareaRef = useRef(null);
  const location = useLocation();
  const [image, setImage] = useState(null);
  const [youtubeUrl, setYoutubeUrl] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const [isEditing, setIsEditing] = useState(false);
  const isAdmin = localStorage.getItem("isAdmin") === "true";
  const [selectedOptions, setSelectedOptions] = useState([]);
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
  const [selectedMonth, setSelectedMonth] = useState(1);
  const [selectedDay, setSelectedDay] = useState(1);
  const [maxDays, setMaxdays] = useState(null);
  const [daySelectShow, setDaySelectShow] = useState(true);
  const [eventdate, setEventDate] = useState("");

  const [targetData, setTargetData] = useState({
    order: "",
    title: "",
    eventday: "",
    selectedYear: "2025",
    selectedMonth: "1",
    selectedDay: "1",
    content: "",
    linkUrl: "",
    youtubeUrl: "",
    image: "",
    other: "",
    created_at: "",
    updated_at: "",
  });

  const targetDataName = location.state.databasename.toLowerCase();
  const targetDataList = targetDataName + "List";
  const dataObjects = {};
  dataObjects[targetDataList] = [];
  const targetTitle = location.state.posttitle;
  const targetItems = location.state.targetitems;
  const EditTargetData = location.state.targetData;
  console.log(Id);
  console.log(eventState);
  console.log(EditTargetData);

  useEffect(() => {
    if (Id) {
      setTargetData({ ...EditTargetData });
      setIsEditing(true);
    } else {
      console.log("イベントが見つかりませんでした");
    }
  }, [Id, EditTargetData]);

  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = "20px";
      textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`;
    }
  }, [content]);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      resizeImage(file, 800, 800, 0.7).then((resizedFile) => {
        // リサイズ後の画像データを状態に保存
        setImage(resizedFile);
      });
    }
  };

  const resizeImage = (file, maxWidth, maxHeight, quality) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => {
        const img = new Image();
        img.src = reader.result;
        img.onload = () => {
          const canvas = document.createElement("canvas");
          const ctx = canvas.getContext("2d");

          // 画像の縦横比を計算
          const ratio = Math.min(maxWidth / img.width, maxHeight / img.height);
          canvas.width = img.width * ratio;
          canvas.height = img.height * ratio;

          // リサイズした画像をcanvasに描画
          ctx.drawImage(img, 0, 0, canvas.width, canvas.height);

          // リサイズ後の画像をBlobとして取得
          canvas.toBlob(
            (blob) => {
              const resizedFile = new File([blob], file.name, {
                type: file.type,
              });
              resolve(resizedFile); // リサイズされたファイルを返す
            },
            file.type,
            quality
          );
        };
      };
      reader.readAsDataURL(file);
    });
  };

  const NoDaySetting = () => {
    setDaySelectShow(!daySelectShow);
  };

  const years = [];
  const yearSelect = () => {
    for (let year = 1850; year <= 2100; year++) {
      years.push(year);
    }
  };
  yearSelect();

  const months = [];
  const monthSelect = () => {
    for (let month = 1; month <= 12; month++) {
      months.push(month);
    }
  };
  monthSelect();

  useEffect(() => {
    const updateDays = (year, month) => {
      if ([1, 3, 5, 7, 8, 10, 12].includes(month)) {
        setMaxdays(31);
      } else if ([4, 6, 9, 11].includes(month)) {
        setMaxdays(30);
      } else if (month === 2) {
        const isLeapYear =
          year % 400 === 0 || (year % 4 === 0 && year % 100 !== 0);
        setMaxdays(isLeapYear ? 29 : 28);
      }
    };

    updateDays(selectedYear, selectedMonth); // 年と月を渡す
  }, [selectedYear, selectedMonth]);

  const days = [];
  const daysSelect = () => {
    for (let day = 1; day <= maxDays; day++) {
      days.push(day);
    }
  };
  daysSelect();

  const handleChange = (e) => {
    const { name, value } = e.target;

    // 年、月、日の変更処理
    if (name === "eventdate") {
      const dateValue = value;
      const timestamp = Timestamp.fromDate(new Date(dateValue));
      setEventDate(timestamp);
    } else {
      setTargetData({
        ...targetData,
        [name]: value,
      });
    }
  };

  const convertToTimestamp = (dateString) => {
    if (!dateString || typeof dateString !== "string") {
      console.error("無効な eventdate:", dateString);
      return null;
    }

    const dateParts = dateString.split(" ");
    if (dateParts.length !== 2) {
      console.error("無効なフォーマット:", dateString);
      return null;
    }

    const [datePart, timePart] = dateParts;
    const formattedDate = datePart.replace(/\//g, "-");
    const dateSegments = formattedDate.split("-");
    if (dateSegments.length !== 3) {
      console.error("無効な日付フォーマット:", formattedDate);
      return null;
    }

    const year = dateSegments[0];
    const month = dateSegments[1].padStart(2, "0");
    const day = dateSegments[2].padStart(2, "0");

    const timeFormatted = timePart
      .split(":")
      .map((t) => t.padStart(2, "0"))
      .join(":");

    const isoDateString = `${year}-${month}-${day}T${timeFormatted}`;
    const parsedDate = new Date(isoDateString);

    if (isNaN(parsedDate.getTime())) {
      console.error("無効な日付:", dateString);
      return null;
    }

    return Timestamp.fromDate(parsedDate);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (loading) return;
    setLoading(true);

    let imageUrl = targetData.image;

    if (image) {
      const storageRef = ref(storage, `blog-images/${Date.now()}.jpg`);
      const uploadTask = uploadBytesResumable(storageRef, image);

      try {
        await new Promise((resolve, reject) => {
          uploadTask.on(
            "state_changed",
            null,
            (error) => {
              console.error("アップロードエラー:", error);
              reject(error);
            },
            async () => {
              imageUrl = await getDownloadURL(uploadTask.snapshot.ref);
              console.log("画像URL取得成功:", imageUrl); // 確認用ログ
              resolve();
            }
          );
        });
      } catch (error) {
        console.error("画像のアップロードに失敗しました:", error);
        return;
      }
    }

    let eventdate = new Date(
      targetData.selectedYear,
      targetData.selectedMonth - 1,
      targetData.selectedDay
    );
    let eventdatestring = `${targetData.selectedYear}年${targetData.selectedMonth}月${targetData.selectedDay}日`;

    if (eventState === undefined) {
      console.log("新規データ追加:", eventdate);
      await addDoc(collection(db, targetDataName), {
        ...targetData,
        image: imageUrl, // 🔹 ここで imageUrl を保存する
        eventdate,
        eventdatestring,
        created_at: serverTimestamp(),
      });
      navigate(`/${targetDataName}`);
    } else {
      try {
        eventdate = new Date(
          targetData.selectedYear,
          targetData.selectedMonth - 1,
          targetData.selectedDay
        );
        const updatedData = {
          ...targetData,
          image: imageUrl, // 🔹 ここで imageUrl を更新
          eventdate,
          updated_at: new Date().toISOString(),
        };

        await updateDoc(doc(db, targetDataName, Id), updatedData);
        navigate(`/${targetDataName}`);
      } catch (error) {
        console.error("更新エラー:", error);
      } finally {
        setLoading(false); // 投稿完了後に loading を解除
      }
    }
  };

  const handleDelete = async () => {
    const confirmDelete = window.confirm(
      `本当に${targetData.title}を削除しますか？`
    );
    if (!confirmDelete) return;
    await deleteDoc(doc(db, targetDataName, Id));
    navigate(`/${targetDataName}`);
  };

  return (
    <>
      <div className="firestoreservice-container">
        <div className="firestoreservice-content">
          <h2>
            <span className="firestoreservice-content-title">
              {isEditing ? `${targetTitle}を編集` : `${targetTitle}を追加`}
            </span>
            <div
              className="createpost-close-button"
              onClick={() => navigate(`/${targetDataName}`)}
            >
              ｘ
            </div>
          </h2>
          <form onSubmit={handleSubmit}>
            <div className="firestoreservice-field">
              {" "}
              {targetItems.some((item) => item === "order") && (
                <>
                  <h3>表示する順番</h3>
                  <div className="firestoreservice-field-inner2">
                    <input
                      type="number"
                      name="order"
                      value={targetData.order}
                      onChange={handleChange}
                    />
                  </div>{" "}
                </>
              )}{" "}
              {!isEditing && (
                <>
                  {" "}
                  <h3>日付</h3>
                  <span className="firestoreservice-field-comment">
                    この日付は表示する日の元データとなるとともに <br />
                    日付順の並び替えのためのデータとして使用されます。
                    <br />
                    「日にち」の削除、「月頃」や「年~年等」といった変更は一旦、{" "}
                    <br />
                    このまま投稿し、 そのあと編集で変更して保存してください。
                  </span>
                  <div className="firestoreservice-field-inner">
                    <select
                      id="firestoreservice-field-inner-select"
                      value={targetData.selectedYear}
                      name="selectedYear"
                      onChange={handleChange}
                    >
                      {years.map((year) => (
                        <option key={year} value={year}>
                          {year}
                        </option>
                      ))}
                    </select>
                    <p>年</p>
                    <select
                      id="firestoreservice-field-inner-select"
                      value={targetData.selectedMonth}
                      name="selectedMonth"
                      onChange={handleChange}
                    >
                      {months.map((month) => (
                        <option key={month} value={month}>
                          {month}
                        </option>
                      ))}
                    </select>
                    <p>月</p>
                    {daySelectShow ? (
                      <>
                        <select
                          id="firestoreservice-field-inner-select"
                          value={targetData.selectedDay}
                          name="selectedDay"
                          onChange={handleChange}
                        >
                          {days.map((day) => (
                            <option key={day} value={day}>
                              {day}
                            </option>
                          ))}
                        </select>{" "}
                        <p>日</p>
                      </>
                    ) : (
                      ""
                    )}
                  </div>{" "}
                </>
              )}
              {isEditing && (
                <>
                  {" "}
                  <h3>月日</h3>
                  <p>
                    この日付が表示されますが、「月頃」といった変更は並び替えのために使用されます
                  </p>
                  <div className="firestoreservice-field-inner">
                    <input
                      type="text"
                      placeholder="月日"
                      value={targetData.eventdatestring}
                      onChange={handleChange}
                      name="eventdatestring"
                      required
                    />
                  </div>
                </>
              )}
              <h3>タイトル</h3>{" "}
              <div className="firestoreservice-field-inner">
                <input
                  type="text"
                  placeholder="タイトル"
                  value={targetData.title}
                  onChange={handleChange}
                  name="title"
                  required
                />
              </div>
              <h3>内 容</h3>
              <div className="firestoreservice-field-inner2">
                <textarea
                  ref={textareaRef}
                  placeholder="内容"
                  value={targetData.content}
                  onChange={handleChange}
                  name="content"
                  style={{
                    minHeight: "80px",
                    overflow: "hidden",
                    resize: "none",
                  }}
                  required
                />
              </div>
              {targetItems.some((item) => item === "linkUrl") && (
                <>
                  <h3>リンク情報</h3>
                  <div className="firestoreservice-field-inner2">
                    <input
                      placeholder="リンクURL"
                      value={targetData.linkUrl}
                      onChange={handleChange}
                      name="linkUrl"
                    />
                  </div>
                </>
              )}
              {targetItems.some((item) => item === "image") && (
                <>
                  <h3>
                    アップする写真
                    <span style={{ fontSize: "1.2rem" }}>
                      　(真四角になります)　
                    </span>
                  </h3>
                  <div className="firestoreservice-field-inner">
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleImageChange}
                    />{" "}
                  </div>{" "}
                  {targetData.image ? (
                    <>
                      <div className="firestoreservice-field-inner3">
                        <img
                          src={targetData.image}
                          style={{ width: "100px" }}
                          alt="画像の説明"
                          className="firestoreservice-field-inner-preimage"
                        />
                        <p>現在の画像</p>
                      </div>
                    </>
                  ) : (
                    ""
                  )}
                </>
              )}
              {targetItems.some((item) => item === "youtubeUrl") && (
                <>
                  <h3>紹介するyoutube</h3>
                  <div className="firestoreservice-field-inner2">
                    <input
                      type="text"
                      name="youtubeUrl"
                      value={targetData.youtubeUrl}
                      onChange={handleChange}
                    />
                  </div>{" "}
                </>
              )}
              {targetItems.some((item) => item === "other") && (
                <>
                  <h3>
                    <span style={{ fontSize: "1.2rem" }}>備　考</span>
                  </h3>
                  <div className="firestoreservice-field-inner2">
                    <textarea
                      ref={textareaRef}
                      placeholder="その他"
                      value={targetData.other}
                      onChange={handleChange}
                      name="other"
                      style={{
                        minHeight: "80px",
                        overflow: "hidden",
                        resize: "none",
                      }}
                      required
                    />
                  </div>{" "}
                </>
              )}
              <button
                type="submit"
                disabled={loading}
                className="firestoreservice-submit-button"
              >
                {isEditing ? "編集を実行" : loading ? "投稿中..." : "投稿"}
              </button>
              {isEditing && (
                <button
                  type="button"
                  disabled={loading}
                  className="firestoreservice-submit-button"
                  style={{ color: "red" }}
                  onClick={(event) => {
                    event.preventDefault(); // 🚀 フォームの送信を防ぐ
                    handleDelete();
                  }}
                >
                  "削除する"
                </button>
              )}
            </div>
          </form>
        </div>
      </div>
      <div></div>
    </>
  );
};

export default FirestoreService;
