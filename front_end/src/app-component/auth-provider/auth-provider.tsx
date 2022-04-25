import Joi from "joi";
import React from "react";
import { LoginResponse } from "../../app/web-api.types";
import { UserWithRelationsIds } from "../../features/users/types";

type UserLogin = Omit<LoginResponse<UserWithRelationsIds>, "message">;
type CurrentUser = Omit<UserLogin, "user_jwt">;

type AuthContextType = {
  user: CurrentUser | null;
  signIn: (user: UserLogin, callback: VoidFunction) => void;
  signOut: (callback: VoidFunction) => void;
  setUserFromJwt: (user: CurrentUser | null) => void;
};

export const schemaTokenValidation = Joi.string()
  .regex(/^[\w\-_]+\.[\w\-_]+\.[\w\-_.+/=]*$/)
  .required();

export const AuthContext = React.createContext<AuthContextType>(null!);
export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = React.useState<CurrentUser | null>(null);

  const signIn = (userLoggedIn: UserLogin, callback: VoidFunction) => {
    //return AuthProvider.signIn
    window.localStorage.setItem("jwt", userLoggedIn.user_jwt);
    const { user_jwt, ...userData } = userLoggedIn;
    setUser(userData);
    callback();
  };

  const signOut = (callback: VoidFunction) => {
    //return AuthProvider.signOut
    setUser(null);
    window.localStorage.removeItem("jwt");

    callback();
  };

  const passedValue = { user, signIn, signOut, setUserFromJwt: setUser };

  return <AuthContext.Provider value={passedValue}>{children}</AuthContext.Provider>;
}
