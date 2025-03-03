import React, { useContext, useEffect, useRef, useState } from "react";
import "./MemberCreate.scss";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { MemberContext } from "../Contexts/MemberContext";
import { auth, db } from "../firebase";
import {
  addDoc,
  collection,
  doc,
  getDocs,
  updateDoc,
} from "firebase/firestore";
// import { sendRegistrationEmail } from "./EmailComponents/RegistEmailSender";

const MemberCreate = () => {
  const navigate = useNavigate();
  const { setMembersList, membersList, currentUserInfo } =
    useContext(MemberContext);
  const location = useLocation();
  const { emptyCollection, authorId, returnsub, returnmember } =
    location.state || {};
  const [toEmail, setToEmail] = useState("");
  const { id } = useParams();
  const [currentStep, setCurrentStep] = useState(1);
  const [member, setMember] = useState({
    username: "",
    accountname: "",
    email: "",
    address: "",
    tel_num: "",
    administrator: false,
    admin: false,
    author: {
      username: "",
      id: "",
    },
    profile: "",
    tennisExperience: "",
    racquetUsed: "",
    favoriteShot: "",
    strengthsWeaknesses: "",
    playerStyle: "",
    tennisPhilosophy: "",
    hobbiesSkills: "",
    struggles: "",
  });
  const initialMember = useRef(null);
  const [warningMessage, setWarningMessage] = useState("");
  const [emailError, setEmailError] = useState("");
  const [canEdit, setCanEdit] = useState(false);
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [isComposing, setIsComposing] = useState(false);
  const [prevMemberAdmin, setPrevMemberAdmin] = useState(false);

  //最初の登録者を管理者として管理権限等を設定
  useEffect(() => {
    if (emptyCollection) {
      alert(
        "あなたは最初に登録された方として管理者としての管理権限が付与されました。"
      );
      setMember((prevMember) => ({
        ...prevMember,
        administrator: true,
        admin: true,
      }));
    }
  }, [emptyCollection]);

  // メンバー一覧からauthorIdが送られてきたとき、そのデータをmemberデータにセット
  useEffect(() => {
    if (authorId) {
      const memberDoc = membersList.find(
        (member) => member.author.id === authorId
      );
      if (returnsub) {
        setMember(returnmember);
      } else {
        if (memberDoc) {
          setMember({ ...memberDoc });
          initialMember.current = { ...memberDoc };
          setIsEditing(true);
        } else {
          console.log("メンバーが見つかりませんでした");
        }
      }
    } else {
      if (returnsub) {
        setMember(returnmember);
      } else {
        setCanEdit(!canEdit);
      }
    }
  }, [authorId, membersList]);

  useEffect(() => {
    if (initialMember !== null) {
      setPrevMemberAdmin(initialMember.current?.admin ?? false);
    }
  }, [member]);

  // initialMember?.current.admin;
  // 管理者若しくは本人以外であるか否かのチェック
  const canShowEditOption =
    currentUserInfo?.administrator === true ||
    (currentUserInfo?.author?.id === authorId && authorId !== undefined);

  //管理権限がある人か否かのチェック
  const canShowEditOptionAdmin = currentUserInfo?.administrator === true;

  //入力内容をmember情報としてセット
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setMember((prevState) => ({
      ...prevState,
      [name]: value,
      [name]: type === "checkbox" ? checked : value,
    }));

    // 入力が多い時、入力欄を高く変更
    if (e.target.tagName === "TEXTAREA") {
      e.target.style.height = "auto";
      e.target.style.height = `${e.target.scrollHeight}px`;
    }

    if (e.target.value.length > 200) {
      let devidedtext = [];
      for (let i = 0; i < e.target.value.length; i += 200) {
        devidedtext.push(value.slice(i, i + 200));
      }
      return devidedtext;
    }

    if (name === "accountname") {
      if (membersList.find((member) => member.accountname === e.target.value)) {
        alert("そのアカウント名は既にありますので変更をお願いします");
      }
      if (e.target.value.length > 10) {
        alert("アカウント名は５文字まででお願いします");
      }
    }

    // nameがemailである場合、emailであるか否かのチェック
    if (name === "email") {
      validateEmail(value);
    }
  };

  // データが長い場合配列に分割
  const devisionText = () => {
    const currentFields = steps[currentStep - 1].fields;

    return currentFields.map((field) => {
      const value = member[field.id];

      if (value.length > 10) {
        let chunks = [];
        for (let i = 0; i < value.length; i += 100) {
          chunks.push(value.slice(i, i + 100));
        }

        // field に分割したデータを格納
        return { ...field, value: chunks };
      }
      return field; // そのまま返す（10文字以下なら変更なし）
    });
  };

  // emailの形式をチェック
  const validateEmail = (email) => {
    const emailPattern = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    if (!emailPattern.test(email)) {
      // alert("有効なメールアドレスを入力してください。");

      setEmailError(false);
      return;
    } else {
      setEmailError(""); // Reset error message if valid
    }
  };

  //入力された内容を順次チェックする設定
  const nextStep = (e) => {
    e.preventDefault();

    if (emailError === false) {
      alert("メールアドレスが有効なものではありませんので、ご確認ください");
      setCurrentStep(0);
    }

    const updatedFields = devisionText();

    if (!isStepValid()) {
      setWarningMessage(
        "すべての項目に入力していただきますようお願いいたします。"
      );
    } else {
      setWarningMessage(""); // エラーをリセット
      setCurrentStep((prevStep) => prevStep + 1);
    }
  };

  //前ページの場合、stepを前に移動
  const prevStep = () => setCurrentStep((prevStep) => prevStep - 1);

  //データをデータベースに保存
  const handleSubmit = async (e) => {
    e.preventDefault();
    const user = auth.currentUser;
    if (isSubmitting) return;
    setIsSubmitting(true);

    if (!user) {
      alert("ログインしてから入力してください。");
      setError("ログインしてから入力してください。"); // ログインなしの登録を制限
      return;
    }

    //入力のチェック
    if (!isStepValid()) {
      setWarningMessage("すべての必須項目を入力してください。");
    } else if (emailError) {
      setWarningMessage("有効なメールアドレスを入力してください。");
    } else {
      setWarningMessage(""); // エラーをリセット
    }

    //送られてくるstateやparamsに応じたデータ処理の実行
    let updatedMember = {};
    try {
      if (isEditing) {
        updatedMember = {
          ...member,
        };

        if (!updatedMember.id) {
          throw new Error("Member ID is missing");
        }
        await updateDoc(doc(db, "members", updatedMember.id), updatedMember);
        navigate("/memberlist");
      } else if (id === "create") {
        const username = user.displayName;
        const nonMember = ("nonMember" + JSON.stringify(new Date())).substring(
          0,
          28
        );
        updatedMember = {
          ...member,
          author: {
            id: nonMember,
            username: username,
          },
        };
        await addDoc(collection(db, "members"), updatedMember);
      } else {
        const userId = user.uid;
        const username = user.displayName;
        updatedMember = {
          ...member,
          author: {
            id: userId,
            username: username,
          },
        };
        await addDoc(collection(db, "members"), updatedMember);
      }
      // メンバー追加後にリストを再取得して更新
      const updatedMembers = await getDocs(collection(db, "members"));
      const members = updatedMembers.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));

      setMembersList(members);

      // メール送信部分
      const adminmembers = members.filter(
        (member) => member.administrator === true
      );
      const adminEmailString = adminmembers
        .map((member) => member.email)
        .join(", ");

      setToEmail(adminEmailString);

      const emailPayloads = [];

      if (updatedMember.administrator) {
        const subject = "管理者登録";
        const text = `管理者として登録されました。管理ページで各種の設定を行ってください。\n\n名前: ${updatedMember.username}\n\nアカウント名: ${updatedMember.accountname}\n\n新たな登録者の参加許可のメールがあった場合、承認をしてください。\n\nhttp://localhost:3000/memberlist`;
        emailPayloads.push({ to: adminEmailString, subject, text });
      } else {
        const adminEmailPayload = {
          to: adminEmailString,
          subject: "新たなメンバーの登録",
          text: `新たな方からメンバー登録がされました。\n\nお名前: ${updatedMember.username}\nアカウント名: ${updatedMember.accountname}\nメールアドレス: ${updatedMember.email}\n\n参加申し込みができるようメンバー情報で承認処理を行ってください。\n\nhttp://localhost:3000/memberlist`,
        };
        const memberEmailPayload = {
          to: updatedMember.email,
          subject: "新規登録のお知らせ",
          text: `新規登録が完了しました。\n\nお名前: ${updatedMember.username}\nアカウント名: ${updatedMember.accountname}\nメールアドレス: ${updatedMember.email}\n\n管理者が承認手続きを行うまでお待ちください。`,
        };
        emailPayloads.push(adminEmailPayload, memberEmailPayload);
      }

      // if (isEditing || id === "create") {
      //   console.log("更新若しくは会員外の登録ですのでメールをおくりません。");
      // } else {
      //   for (const emailPayload of emailPayloads) {
      //     await sendRegistrationEmail(emailPayload);
      //   }
      // }
      setError("");
      navigate("/memberlist");
    } catch (error) {
      console.error("Error adding document: ", error);
      setError(`データの登録中にエラーが発生しました。詳細: ${error.message}`);
    } finally {
      setIsSubmitting(false); // 処理が終わったらボタンを有効化
    }
  };

  //stepに空白の項目があった場合falseに
  const isStepValid = () => {
    const currentFields = steps[currentStep - 1].fields;
    return currentFields.every((field) => {
      const value = member[field.id];
      // チェックボックスの場合は空かどうかをチェック
      if (field.type === "checkbox") {
        return value !== undefined && value !== null;
      }
      // その他のフィールドは文字列でtrimを使って空白を除去
      return value?.trim() !== "";
    });
  };

  //step毎の項目等の値を設定設定
  const presteps = [
    {
      id: 1,
      title: "基本情報",
      fields: [
        {
          id: "username",
          label: "お名前",
          type: "text",
          required: true,
          placeholder: "お名前を入力してください",
        },
        {
          id: "accountname",
          label: "アカウント名",
          type: "text",
          required: true,
          placeholder: "アカウント名を入力してください",
        },
        {
          id: "email",
          label: "メールアドレス",
          type: "email",
          required: true,
          placeholder: "メールアドレスを入力してください",
        },
        {
          id: "tel_num",
          label: "携帯電話番号",
          type: "text",
          required: true,
          placeholder: "携帯電話番号を入力してください",
        },
        {
          id: "admin",
          label: "参加承認",
          type: "checkbox",
        },
        {
          id: "administrator",
          label: "管理者権限",
          type: "checkbox",
        },
      ],
    },
    {
      id: 2,
      title: "テニスに関する情報 その１",
      fields: [
        {
          id: "tennisExperience",
          label: "テニス歴",
          type: "textarea",
          required: true,
          placeholder: "主なテニス歴をご記入ください",
        },
        {
          id: "racquetUsed",
          label: "使用してきたラケット等",
          type: "textarea",
          required: true,
          placeholder: "使用したラケットや用具について教えてください",
        },
      ],
    },
    {
      id: 3,
      title: "テニスに関する情報 その２その２",
      fields: [
        {
          id: "favoriteShot",
          label: "好きなショットや得意なショット等",
          type: "textarea",
          required: true,
          placeholder: "好きなショットや得意なショットを教えてください",
        },
        {
          id: "strengths",
          label: "テニスの課題",
          type: "textarea",
          required: true,
          placeholder: "自分のテニス課題があれば教えてください",
        },
      ],
    },
    {
      id: 4,
      title: "テニスに関する情報 その３",
      fields: [
        {
          id: "playerStyle",
          label: "好きなテニス選手やプレースタイル",
          type: "textarea",
          required: true,
          placeholder: "好きな選手やプレースタイル等を教えてください",
        },
        {
          id: "mainAchievements",
          label: "主な戦績（適宜管理人が加筆しております）",
          type: "textarea",
          required: true,
          placeholder: "主な戦績をお教えください",
        },
      ],
    },
    {
      id: 5,
      title: "テニス趣味や特技、苦手なこと",
      fields: [
        {
          id: "hobbiesSkills",
          label: "テニス以外の趣味や特技",
          type: "textarea",
          required: true,
          placeholder: "テニス以外の趣味や特技を教えてください",
        },
        {
          id: "struggles",
          label: "テニス以外の拘りについて",
          type: "textarea",
          required: true,
          placeholder: "テニス以外での拘りやについて教えてください",
        },
      ],
    },
  ];

  const nonMember = member.author.id.includes("nonMember");

  const steps = !canShowEditOptionAdmin
    ? [
        presteps[0]
          ? {
              ...presteps[0],
              fields: presteps[0].fields
                ? presteps[0].fields
                    .slice(0, 4)
                    .concat(presteps[0].fields.slice(6))
                : [],
            }
          : null,
        ...presteps.slice(1),
      ].filter(Boolean)
    : [...presteps].filter(Boolean);

  const handleConfirm = (e) => {
    e.preventDefault();
    navigate(`/memberdetailconfirm`, {
      state: {
        member: member,
        prevMemberAdmin: prevMemberAdmin,
        authorId: authorId,
        id: id,
      },
    });
  };

  // 変換前の文字数チェック（ひらがななどの入力前に実行される）
  const handleCheckBefore = (value) => {
    if (value.length >= 6) {
      alert("5文字以上は入力できません（変換前）");
    }
  };

  // 変換後の文字数チェック
  const handleCheckAfter = (value) => {
    if (value.length >= 6) {
      alert("5文字以上は入力できません（変換後）");
    }
  };

  return (
    <div className="member_detial_container">
      <div className="member_detail_content">
        <div className="member_detial_content_border_left"></div>
        <div className="member_detial_conttent_border_right"></div>
        <form onSubmit={handleConfirm}>
          {id === "create" || nonMember === true ? (
            <>
              <h2>{steps[0].title}</h2>
              <label>{steps[0].fields[1].label}</label>
              <input
                type="text"
                id="text"
                name={steps[0].fields[1].id}
                value={steps[0].fields[1].accountname}
                onChange={handleChange}
                required
              />
              <button type="submit">登録内容を確認</button>
            </>
          ) : steps[currentStep - 1] ? (
            <>
              <h2>{steps[currentStep - 1].title}</h2>
              {steps[currentStep - 1].fields.map((field) => (
                <div key={field.id}>
                  <label htmlFor={field.id}>{field.label}</label>
                  {field.type === "textarea" ? (
                    <textarea
                      id={field.id}
                      name={field.id}
                      value={member[field.id] || ""}
                      onChange={handleChange}
                      required={field.required}
                      placeholder={field.placeholder}
                    />
                  ) : field.type === "checkbox" ? (
                    <input
                      type="checkbox"
                      id={field.id}
                      name={field.id}
                      checked={!!member[field.id]}
                      onChange={(e) =>
                        handleChange({
                          target: { name: field.id, value: e.target.checked },
                        })
                      }
                    />
                  ) : (
                    <div className="input-wrapper">
                      <input
                        type={field.type}
                        id={field.id}
                        name={field.id}
                        value={member[field.id] || ""}
                        onChange={handleChange}
                        onInput={(e) => {
                          // 変換前（ひらがなや入力途中）に文字数をチェックしない
                          if (!isComposing) {
                            handleCheckBefore(e.target.value); // 入力途中でのチェック
                          }
                        }}
                        onCompositionStart={(e) => {
                          setIsComposing(true); // 変換開始時にフラグを立てる
                        }}
                        onCompositionEnd={(e) => {
                          setIsComposing(false); // 変換終了時にフラグを下げる
                          handleCheckAfter(e.target.value); // 変換後に文字数をチェック
                        }}
                        required={field.required}
                        placeholder={field.placeholder}
                      />
                    </div>
                  )}
                </div>
              ))}
              {/* メールのバリデーションエラーの表示 */}
              {emailError && <p className="error-message">{emailError}</p>}
              {/* 警告メッセージの表示 */}
              {warningMessage && (
                <p className="member_detail_massage">{warningMessage}</p>
              )}
              <div className="button-container">
                {currentStep > 1 && (
                  <button type="button" onClick={prevStep}>
                    戻る
                  </button>
                )}
                {currentStep < steps.length ? (
                  <button type="button" onClick={nextStep}>
                    次へ
                  </button>
                ) : (
                  <button type="submit">登録内容を確認</button>
                )}
              </div>
            </>
          ) : null}
        </form>
      </div>
    </div>
  );
};

export default MemberCreate;
