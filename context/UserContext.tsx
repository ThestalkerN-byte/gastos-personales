"use client";
import { createContext, use, useContext, useEffect, useState } from "react";
type UserContextType = {
  username: string | null;
  id: string | null;
};
interface UserContextProps {
  user: UserContextType | null;
}
const UserContext = createContext<UserContextProps>({ user: null });
export const UserProvider = ({
  children,
  initialUser,
}: {
  children: React.ReactNode;
  initialUser: UserContextType;
}) => {
  const [user, setUser] = useState<UserContextType | null>(initialUser);
 console.log("User en UserProvider:", user);
  return (
    <UserContext.Provider value={{ user }}>{children}</UserContext.Provider>
  );
};
export const useUser = () => useContext(UserContext);
