import { useContext, useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "./Navbar.scss";
import { MemberContext } from "../Contexts/MemberContext";

const Navbar = () => {
  const [menuActive, setMenuActive] = useState(false);
  const navigate = useNavigate();
  const { currentUserInfo } = useContext(MemberContext);
  const toggleMenu = () => {
    setMenuActive(!menuActive);
  };
  // useEffect(() => {
  //   setIsAdmin(currentUserInfo.administrator);
  // }, [currentUserInfo]);

  const isAdmin = currentUserInfo?.administrator === true;

  const closeMenu = () => {
    setMenuActive(false);
  };

  const handleButtonClick = (id) => {
    // console.log(currentUserInfo.author.id);
    if (
      (currentUserInfo && currentUserInfo.author.id === id) ||
      currentUserInfo?.administrator
    ) {
      navigate(`/membercreate`, { state: { authorId: id } });
    } else {
      alert("詳細は本人と管理者だけが閲覧や編集できます。");
    }
  };

  //トグルメニューを30秒後に閉じる
  useEffect(() => {
    let timer;
    if (menuActive) {
      timer = setTimeout(() => {
        setMenuActive(false);
      }, 5000); // 30秒後に閉じる
    }
    return () => clearTimeout(timer); // クリーンアップして既存のタイマーをクリア
  }, [menuActive]);

  return (
    <nav className="navbar">
      <div className="circleName">Kyoto Solution</div>
      <div
        className="navbar_accunt_name_narrow"
        onClick={() => handleButtonClick(currentUserInfo.author.id)}
      >
        {" "}
        {currentUserInfo ? currentUserInfo.accountname : "ゲスト"}さん
      </div>
      <div className="menu-icon" onClick={toggleMenu}>
        &#9776; {/* ハンバーガーアイコン */}
      </div>
      <ul className={`nav-links ${menuActive ? "active" : ""}`}>
        {isAdmin && (
          <>
            <li onClick={closeMenu}>
              <Link to="/test">テスト</Link>
            </li>
          </>
        )}

        <li onClick={closeMenu}>
          <Link to="/home">ホーム</Link>
        </li>

        {!currentUserInfo ? (
          <li onClick={closeMenu}>
            <Link to="/login">ログイン</Link>
          </li>
        ) : (
          <>
            <li onClick={closeMenu}>
              <Link to="/logout">ログアウト</Link>
            </li>
          </>
        )}
      </ul>
      <div
        className={`account-name ${!currentUserInfo ? "logged-out" : ""}`}
        onClick={closeMenu}
      >
        {!currentUserInfo ? (
          <span>ログインしてください</span>
        ) : (
          <span
            className="navbar-accountname"
            onClick={() => handleButtonClick(currentUserInfo.author.id)}
          >
            {currentUserInfo ? currentUserInfo.accountname : "ゲスト"}さん
          </span>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
