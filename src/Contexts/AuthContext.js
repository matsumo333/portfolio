import { createContext, useContext, useState } from "react";

// AuthContextの作成
const AuthContext = createContext();

// Contextを使って認証状態を管理するためのProvider
export const AuthProvider = ({ children }) => {
  const [isAuth, setIsAuth] = useState(false);

  return (
    <AuthContext.Provider value={{ isAuth, setIsAuth }}>
      {children}
    </AuthContext.Provider>
  );
};

// 認証状態を取得するためのカスタムフック
export const useAuth = () => useContext(AuthContext);
