import { getAuth, signInWithEmailAndPassword } from "firebase/auth";
import { collection, getDocs, getFirestore } from "firebase/firestore";
import { useContext, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./EmailLogin.scss";
import { MemberContext } from "../Contexts/MemberContext";
import { useAuth } from "../Contexts/AuthContext";

const EmailLogin = () => {
  const { membersList } = useContext(MemberContext);
  const [email, setEmail] = useState("");
  const { setIsAuth } = useAuth();
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const handleEmailChange = (event) => {
    setEmail(event.target.value);
  };

  const handlePasswordChange = (event) => {
    setPassword(event.target.value);
  };

  const handleMouseDown = () => {
    setShowPassword(true);
  };

  const handleMouseUp = () => {
    setShowPassword(false);
  };

  const handleMouseLeave = () => {
    setShowPassword(false);
  };

  const handleEmailforget = () => {
    navigate("/resetpassword");
  };

  const handleEmailAdressChange = () => {
    navigate("/emailchange");
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      const auth = getAuth();
      await signInWithEmailAndPassword(auth, email, password);
      console.log("ログイン成功:");
      // localStorage.setItem("isAuth", true);
      setIsAuth(true);

      if (!membersList || membersList.length === 0) {
        console.log("membersコレクションが空です");
        navigate("/membercreate", { state: { emptyCollection: true } });
        return;
      }

      const user = auth.currentUser;
      const isRegistered = membersList.find(
        (member) => member.author.id === user.uid
      );
      if (!isRegistered) {
        alert("あなたはメンバー等の情報が未登録ですので、登録をお願いします。");

        navigate("/membercreate");
        return;
      }
      navigate("/eventlist");
    } catch (error) {
      switch (error.code) {
        case "auth/invalid-email":
          setError(
            "無効なメールアドレスです。正しいメールアドレスを入力してください。"
          );
          break;
        case "auth/user-disabled":
          setError("アカウントが無効です。管理者にお問い合わせください。");
          break;
        case "auth/user-not-found":
          setError("メールアドレスまたはパスワードが間違っています。");
          break;
        case "auth/wrong-password":
          setError(
            "パスワードが間違っています。正しいパスワードを入力してください。"
          );
          break;
        default:
          setError("メールアドレスまたはパスワードが間違っています。");
          break;
      }
      console.error("ログイン失敗:", error);
    }
  };

  return (
    <div className="email-login-container">
      <div className="email-login-content">
        <form className="email-login-form" onSubmit={handleSubmit}>
          {" "}
          <div className="email-login-field">
            <p>メールアドレスでログイン</p>
          </div>
          <div className="email-login-field">
            <div
              className="email-login-close-button"
              onClick={() => {
                console.log("Navigating to /login");
                navigate("/login");
              }}
            >
              X
            </div>
            <p>メールアドレス</p>
            <input
              className="email-login-email-input"
              type="email"
              value={email}
              onChange={handleEmailChange}
              required
            />
          </div>
          <div className="email-login-field">
            <p>パスワード</p>
            <input
              className="email-login-password-input"
              type={showPassword ? "text" : "password"}
              value={password}
              onChange={handlePasswordChange}
              required
            />
            <button
              type="button"
              onMouseDown={() => setShowPassword(true)}
              onMouseUp={() => setShowPassword(false)}
              onMouseLeave={() => setShowPassword(false)}
              onTouchStart={() => setShowPassword(true)}
              onTouchEnd={() => setShowPassword(false)}
              className="email-login-toggle-password-button"
              aria-label={
                showPassword
                  ? "パスワードを非表示にする"
                  : "パスワードを表示する"
              }
            >
              {showPassword ? "非表示" : "表　示"}
            </button>
          </div>
          <div className="email-login-field">
            <button className="email-login-button" type="submit">
              ログイン
            </button>
          </div>
          <div className="email-login-error-message">
            {error && (
              <div className="email-login-content">
                <p>{error}</p>
              </div>
            )}
          </div>
        </form>
        <div className="email-login-forget">
          <button
            className="email-login-forget-button"
            type="button"
            onClick={handleEmailforget}
          >
            パスワードを忘れた
          </button>{" "}
          <button
            className="email-login-emailadress-change-button"
            type="button"
            onClick={handleEmailAdressChange}
          >
            メールアドレス変更
          </button>
        </div>
      </div>
    </div>
  );
};

export default EmailLogin;
