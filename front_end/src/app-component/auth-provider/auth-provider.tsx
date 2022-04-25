import React from "react";
import { LoginResponse } from "../../app/web-api.types";
import { UserWithRelationsIds } from "../../features/users/types";

type UserLogin = Omit<LoginResponse<UserWithRelationsIds>, "message">;
type AuthContextType = {
  user: UserLogin | null;
  signIn: (user: UserLogin, callback: VoidFunction) => void;
  signOut: (callback: VoidFunction) => void;
};

const AuthContext = React.createContext<AuthContextType>(null!);
export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = React.useState<UserLogin | null>(null!);

  const signIn = (userLoggedIn: UserLogin, callback: VoidFunction) => {
    //return AuthProvider.signIn
    setUser(userLoggedIn);
    window.localStorage.setItem("jwt", userLoggedIn.user_jwt);
    callback();
  };

  const signOut = (callback: VoidFunction) => {
    //return AuthProvider.signOut
    setUser(null);
    window.localStorage.removeItem("jwt");

    callback();
  };

  const passedValue = { user, signIn, signOut };

  return <AuthContext.Provider value={passedValue}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  return React.useContext(AuthContext);
}
