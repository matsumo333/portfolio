// src/utils/fetchMembersData.js

import { collection, onSnapshot } from "firebase/firestore";
import { db } from "../firebase";

export const fetchMembersData = (callback) => {
  try {
    const membersCollection = collection(db, "members");
    const unsubscribe = onSnapshot(membersCollection, (snapshot) => {
      const membersList = snapshot.docs.map((doc) => {
        const { birthday, realname, ...filteredData } = doc.data();
        return { id: doc.id, ...filteredData };
      });
      callback(membersList);
    });

    return unsubscribe;
  } catch (error) {
    console.error("Error fetching members data:", error);
    return () => {};
  }
};
