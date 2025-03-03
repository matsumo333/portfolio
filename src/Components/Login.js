import { GoogleAuthProvider, signInWithPopup } from "firebase/auth";
import { useNavigate } from "react-router-dom";
import { auth } from "../firebase"; // Assuming db and auth are correctly initialized
import "./Login.scss";
import { useContext, useEffect, useState } from "react";
import { MemberContext } from "../Contexts/MemberContext";
import { useAuth } from "../Contexts/AuthContext";
const Login = () => {
  const { membersList } = useContext(MemberContext);
  const { setIsAuth } = useAuth();
  const navigate = useNavigate();
  const [isMembersLoaded, setIsMembersLoaded] = useState(false);

  // Watch for changes in membersList
  useEffect(() => {
    if (membersList) {
      setIsMembersLoaded(true);
    }
  }, []);

  const loginWithGoogle = async () => {
    try {
      const result = await signInWithPopup(auth, new GoogleAuthProvider());
      const user = result.user;
      localStorage.setItem("isAuth", "true");
      setIsAuth(true);

      if (!isMembersLoaded) {
        console.log("メンバーリストの読み込みを待機中です...");
        return;
      }

      if (!membersList || membersList.length === 0) {
        console.log("membersコレクションが空です");
        navigate("/membercreate", { state: { emptyCollection: true } });
        return;
      }

      const userExists = membersList.find(
        (member) => member.author.id === user.uid
      );
      // console.log("ユーザーID" + userExists.author.id);
      if (!userExists) {
        alert("メンバー等の情報をまず登録してください。");
        navigate("/memberinfo");
      } else {
        // localStorage.setItem("accountname", userExists.accountname);
        navigate("/");
      }
    } catch (error) {
      console.error("Googleログイン中にエラーが発生しました:", error);
    }
  };

  const handleEmailLogin = () => {
    navigate("/emaillogin");
  };

  const redirectToSignupForm = () => {
    navigate("/signupform");
  };

  return (
    <>
      {" "}
      <div className="container-login">
        <div className="content">
          <p>Googleアカウントでログイン</p>
          <button className="login-button" onClick={loginWithGoogle}>
            Googleでログイン
          </button>
        </div>
        <div className="content">
          <p>メールアドレスでログイン</p>
          <button className="login-button" onClick={handleEmailLogin}>
            メールアドレスでログイン
          </button>
        </div>
        <div className="content">
          <p>新たに登録を実施</p>
          <button className="login-button" onClick={redirectToSignupForm}>
            新規登録
          </button>
        </div>
      </div>
    </>
  );
};
export default Login;
