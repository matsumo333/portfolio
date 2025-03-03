import React, { useContext, useEffect, useState } from "react";
import "./MemberDetailConfirm.scss";
import { useLocation, useNavigate } from "react-router-dom";
import { auth, db } from "../firebase";
import {
  addDoc,
  collection,
  doc,
  getDocs,
  updateDoc,
} from "firebase/firestore";
// import { sendRegistrationEmail } from "./EmailComponents/RegistEmailSender";
import { MemberContext } from "../Contexts/MemberContext";

const MemberDetailConfirm = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { setMembersList, membersList, currentUserInfo } =
    useContext(MemberContext);
  const { member, authorId, id, prevMemberAdmin } = location.state || {};
  const [toEmail, setToEmail] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [isEditing, setIsEditing] = useState(false);
  const [canEdit, setCanEdit] = useState(false);
  // const [memberAdminConfirm, setMemberAdminConfirm] = useState(false);

  let memberAdminConfirm = false;
  // メンバー一覧からauthorIdが送られてきたとき、そのデータをmemberデータにセット
  useEffect(() => {
    if (authorId) {
      const memberDoc = membersList.find(
        (member) => member.author.id === authorId
      );
      if (memberDoc) {
        //   setMember({ ...memberDoc });

        setIsEditing(true);
      } else {
        console.log("メンバーが見つかりませんでした");
      }
    } else {
      setCanEdit(!canEdit);
    }
  }, [authorId, membersList]);

  //データを保存
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

    let updatedMember = {};
    try {
      if (isEditing) {
        updatedMember = {
          ...member,
        };
        if (!prevMemberAdmin && member.admin) {
          memberAdminConfirm = true;
        }

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
      } else if (!memberAdminConfirm) {
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
      //会員承認された時にメールを送付
      if (!prevMemberAdmin && member.admin) {
        const subject = "管理者による会員承認";
        const text = `管理者から${updatedMember.accountname}さんの会員承認がされましたので、参加申し込みのほど、よろしくお願いします。\n今後はサークル会員として末永くご一緒させてただけることを祈念いたしております。 \n\n　 管理者`;
        emailPayloads.push({ to: updatedMember.email, subject, text });
      }

      // if ((isEditing && !memberAdminConfirm) || id === "create") {
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
  const returnsub = true;
  const handleReturn = () => {
    navigate(`/membercreate`, {
      state: {
        returnmember: member,
        authorId: authorId,
        id: id,
        returnsub: returnsub,
      },
    });
  };

  return (
    <>
      <div className="memberdetailconfirm_container">
        <div className="memberdetailconfirm_content">
          {" "}
          <h1>
            {" "}
            <span className="memberdetailconfirm_title">登録する会員情報</span>
          </h1>
          <div className="memberdetailconfirm_field">
            {/* テーブルを使って表示 */}
            <table border="1">
              <thead>
                <tr>
                  <th>
                    <span className="memberdetailconfirm_field_id">項　目</span>
                  </th>
                  <th>
                    <span className="memberdetailconfirm_field_id">内　容</span>
                  </th>
                  {/* <th>フィールド</th> */}
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>
                    <span className="memberdetailconfirm_table_label">
                      お名前{" "}
                    </span>
                  </td>
                  <td>
                    {" "}
                    <span className="memberdetailconfirm_table_label">
                      {member.username}
                    </span>
                  </td>
                </tr>
                <tr>
                  <td>
                    <span className="memberdetailconfirm_table_label">
                      アカウント名
                    </span>
                  </td>
                  <td>
                    <span className="memberdetailconfirm_table_label">
                      {member.accountname}
                    </span>
                  </td>
                </tr>
                <tr>
                  <td>
                    <span className="memberdetailconfirm_table_label">
                      メールアドレス
                    </span>
                  </td>
                  <td>
                    <span className="memberdetailconfirm_table_label">
                      {member.email}
                    </span>
                  </td>
                </tr>
                <tr>
                  <td>
                    <span className="memberdetailconfirm_table_label">
                      携帯電話番号
                    </span>
                  </td>
                  <td>
                    <span className="memberdetailconfirm_table_label">
                      {member.tel_num}
                    </span>
                  </td>
                </tr>
                <tr>
                  <td>
                    <span className="memberdetailconfirm_table_label">
                      参加承認
                    </span>
                  </td>
                  <td>
                    <span className="memberdetailconfirm_table_label_small">
                      {member.admin
                        ? "管理人承認済"
                        : "管理人による承認後、参加申込や会員名簿が閲覧できます"}
                    </span>
                  </td>
                </tr>
                {member.administrator ? (
                  <tr>
                    <td>
                      <span className="memberdetailconfirm_table_label">
                        管理者権限
                      </span>
                    </td>
                    <td>
                      <span className="memberdetailconfirm_table_label">
                        {member.administrator ? "権限あり" : "権限なし"}
                      </span>
                    </td>
                  </tr>
                ) : (
                  ""
                )}

                <tr>
                  <td>
                    <span className="memberdetailconfirm_table_label">
                      テニス歴
                    </span>
                  </td>
                  <td>
                    <span className="memberdetailconfirm_table_label">
                      {member.tennisExperience}
                    </span>
                  </td>
                </tr>
                <tr>
                  <td>
                    <span className="memberdetailconfirm_table_label">
                      使用してきたラケット等
                    </span>
                  </td>
                  <td>
                    <span className="memberdetailconfirm_table_label">
                      {member.racquetUsed}
                    </span>
                  </td>
                </tr>
                <tr>
                  <td>
                    <span className="memberdetailconfirm_table_label">
                      好きなショットや得意なショット等
                    </span>
                  </td>
                  <td>
                    <span className="memberdetailconfirm_table_label">
                      {member.favoriteShot}
                    </span>
                  </td>
                </tr>
                <tr>
                  <td>
                    <span className="memberdetailconfirm_table_label">
                      テニスの課題
                    </span>
                  </td>
                  <td>
                    <span className="memberdetailconfirm_table_label">
                      {member.strengths}
                    </span>
                  </td>
                </tr>
                <tr>
                  <td>
                    <span className="memberdetailconfirm_table_label">
                      好きなテニス選手やプレースタイル
                    </span>
                  </td>
                  <td>
                    <span className="memberdetailconfirm_table_label">
                      {member.playerStyle}
                    </span>
                  </td>
                </tr>
                <tr>
                  <td>
                    <span className="memberdetailconfirm_table_label">
                      主な戦績
                    </span>
                  </td>
                  <td>
                    <span className="memberdetailconfirm_table_label">
                      {member.mainAchievements}
                    </span>
                  </td>
                </tr>
                <tr>
                  <td>
                    <span className="memberdetailconfirm_table_label">
                      テニス以外の趣味や特技
                    </span>
                  </td>
                  <td>
                    <span className="memberdetailconfirm_table_label">
                      {member.hobbiesSkills}
                    </span>
                  </td>
                </tr>
                <tr>
                  <td>
                    <span className="memberdetailconfirm_table_label">
                      テニス以外の拘りについて
                    </span>
                  </td>
                  <td>
                    <span className="memberdetailconfirm_table_label">
                      {member.struggles}
                    </span>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
          <div className="memberdetailconfirm_button_field">
            <button
              className="memberdetailconfirm_button"
              onClick={handleReturn}
            >
              入力に戻る
            </button>
            <button
              className="memberdetailconfirm_button"
              onClick={handleSubmit}
            >
              上記の内容で登録する
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default MemberDetailConfirm;
