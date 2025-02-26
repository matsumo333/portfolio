import { useContext, useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "./Navbar.scss";

const Navbar = () => {
  const [menuActive, setMenuActive] = useState(false);
  const navigate = useNavigate();

  const toggleMenu = () => {
    setMenuActive(!menuActive);
  };
  // useEffect(() => {
  //   setIsAdmin(currentUserInfo.administrator);
  // }, [currentUserInfo]);

  const closeMenu = () => {
    setMenuActive(false);
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
      <div className="circleName">Kyoto-Solution</div>

      <div className="menu-icon" onClick={toggleMenu}>
        &#9776; {/* ハンバーガーアイコン */}
      </div>
      <ul className={`nav-links ${menuActive ? "active" : ""}`}>
        <li onClick={closeMenu}>
          <Link to="/memberlist">メンバー</Link>
        </li>

        <li onClick={closeMenu}>
          <Link to="/postlist">ブログ等</Link>
        </li>
        <li onClick={closeMenu}>
          <Link to="/aboutus">会の紹介</Link>
        </li>
        <li onClick={closeMenu}>
          <Link to="/calendar">カレンダー</Link>
        </li>
        <li onClick={closeMenu}>
          <Link to="/calendar">カレンダー</Link>
        </li>
        <li onClick={closeMenu}>
          <Link to="/eventlist">イベント</Link>
        </li>
        <li onClick={closeMenu}>
          <Link to="/home">ホーム</Link>
        </li>

        <li onClick={closeMenu}>
          <Link to="/links">リンク</Link>
        </li>
      </ul>
    </nav>
  );
};

export default Navbar;
