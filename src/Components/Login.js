import { GoogleAuthProvider, signInWithPopup } from "firebase/auth";
import { useNavigate } from "react-router-dom";
import { auth } from "../firebase"; // Assuming db and auth are correctly initialized
import "./Login.scss";
import { useContext, useEffect, useState } from "react";
const Login = () => {
  const navigate = useNavigate();
  const [isMembersLoaded, setIsMembersLoaded] = useState(false);

  const loginWithGoogle = async () => {
    try {
      const result = await signInWithPopup(auth, new GoogleAuthProvider());
      const user = result.user;
      console.log("ログイン成功:", result);
      localStorage.setItem("isAuth", "true");
      navigate("/");
      if (!isMembersLoaded) {
        console.log("メンバーリストの読み込みを待機中です...");
        return;
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
