import { createContext, useState, useContext, useEffect } from "react";
import AxiosInstance from "../Components/AxiosInstance/AxiosInstance";

const UserContext = createContext();

export const useUser = () => useContext(UserContext);

export const UserProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true); // Track initial loading state

  const fetchUserData = async () => {
    const token = localStorage.getItem("access_token");
    if (!token) {
      setIsLoading(false);
      return;
    }

    try {
      const response = await AxiosInstance.get("user/", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setUser(response.data);
    } catch (error) {
      console.error("Failed to fetch user:", error);
      localStorage.removeItem("access_token");
    } finally {
      setIsLoading(false);
    }
  };

  const refreshUser = async () => {
    await fetchUserData();
  };

  const signOut = () => {
    localStorage.removeItem("access_token");
    setUser(null);
  };

  useEffect(() => {
    fetchUserData();
  }, []);

  return (
    <UserContext.Provider
      value={{
        user,
        isLoading,
        refreshUser,
        signOut,
      }}
    >
      {children}
    </UserContext.Provider>
  );
};