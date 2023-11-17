import { ReactNode, createContext, useContext, useState } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";

type AuthContextProps = { children: React.ReactNode };

type AuthContextType = {
  userToken: string | null;
  setUserToken: (token: string | null) => void;
  setToken: (token: string | null) => Promise<void>;
};

export const AuthContext = createContext<AuthContextType | null>(null);

export default function AuthContextProvider({ children }: AuthContextProps) {
  const [userToken, setUserToken] = useState<string | null>(null);

  const setToken = async (token: string | null) => {
    if (token) {
      await AsyncStorage.setItem("userToken", token);
    } else {
      await AsyncStorage.removeItem("userToken");
    }

    setUserToken(token);
  };

  return (
    <AuthContext.Provider value={{ userToken, setUserToken, setToken }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuthContext = () => {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error("useAuthContext must be used within a AuthContextProvider");
  }
  return context;
};
