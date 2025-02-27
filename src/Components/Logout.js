import { signOut } from "firebase/auth";
import { useNavigate } from "react-router-dom";
import { auth } from "../firebase";
import "./Logout.scss";
import { useContext, useEffect, useState } from "react";
// import { useAuth } from "../Contexts/AuthContext";

const Logout = () => {
  const navigate = useNavigate();
  // const { setIsAuth, isAuth } = useAuth();
  // const { isAdmin, setIsAdmin } = useState();
  const logout = () => {
    //ログアウト
    signOut(auth).then(() => {
      // orage.clear();
      localStorage.removeItem("accountName");
      localStorage.removeItem("isAuth");
      localStorage.removeItem("isAdmin");
      localStorage.removeItem("administrator");
      localStorage.removeItem("userUid");
      // setIsAuth(false);
      // setIsAdmin(false);
      // console.log(isAuth);
      // setUsername(false);
      navigate("/login");
    });
  };

  // isAuthが変更されたときにアラートを表示
  // useEffect(() => {
  //   if (!isAuth) {
  //     console.log("ログアウトしました");
  //   }
  // }, [isAuth]);
  return (
    <>
      <div className="logout-container">
        <div className="logout-content">
          <p>ログアウト</p>
          <button className="logout-button" onClick={logout}>
            ログアウト
          </button>
        </div>
      </div>
    </>
  );
};

export default Logout;
