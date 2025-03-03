import { createContext, useEffect, useState } from "react";
import { auth } from "../firebase";
import { fetchMembersData } from "../utils/fetchMembersData";

const MemberContext = createContext();

const MemberProvider = ({ children }) => {
  const [membersList, setMembersList] = useState([]);
  const [currentUser, setCurrentUser] = useState(null);
  const [currentUserInfo, setCurrentUserInfo] = useState(null);

  useEffect(() => {
    // Start listening to changes in the "members" collection
    const unsubscribeFromMembersData = fetchMembersData((membersData) => {
      setMembersList(membersData);
    });

    // Get the current user
    const unsubscribeFromAuth = auth.onAuthStateChanged((user) => {
      setCurrentUser(user);
    });

    return () => {
      unsubscribeFromMembersData();
      unsubscribeFromAuth();
    };
  }, []);

  useEffect(() => {
    if (currentUser && membersList.length > 0) {
      const userInfo = membersList.find(
        (member) => member.author.id === currentUser.uid
      );

      if (userInfo) {
        localStorage.setItem("isAdmin", userInfo.admin ? "true" : "false");
      }
      setCurrentUserInfo(userInfo);
    }
  }, [currentUser, membersList]);

  return (
    <MemberContext.Provider
      value={{
        membersList,
        setMembersList,
        currentUser,
        currentUserInfo,
        setCurrentUserInfo,
      }}
    >
      {children}
    </MemberContext.Provider>
  );
};

export { MemberContext, MemberProvider };
