import React, { createContext, useContext, useState, useEffect } from "react";
import axios from "axios";

const AuthContext = createContext(null);

const api = axios.create({
  baseURL: "https://sophia4293.pythonanywhere.com",
  withCredentials: true,
  headers: { "Content-Type": "application/json" },
});

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [auth, setAuth] = useState(null);
  const [loading, setLoading] = useState(true);

  // Restore session
  useEffect(() => {
    const savedUser = localStorage.getItem("user");
    const savedAuth = localStorage.getItem("auth");

    if (savedUser && savedAuth) {
      const parsedUser = JSON.parse(savedUser);
      const parsedAuth = JSON.parse(savedAuth);

      setUser(parsedUser);
      setAuth(parsedAuth);

      // set Authorization header
      api.defaults.headers["Authorization"] = `Bearer ${parsedAuth.access_token}`;
    }

    setLoading(false);
  }, []);

  // Save login session
  const saveSession = (data) => {
    setUser(data.user);
    setAuth(data.auth);

    localStorage.setItem("user", JSON.stringify(data.user));
    localStorage.setItem("auth", JSON.stringify(data.auth));

    api.defaults.headers["Authorization"] = `Bearer ${data.auth.access_token}`;
  };

  // LOGIN
  const login = async (email, password) => {
    try {
      const res = await api.post("/login", { email, password });
      const data = res.data;

      if (data.status === "verify_otp") return data;

      saveSession(data);
      return data;

    } catch (err) {
      throw err.response?.data || { error: "Login failed" };
    }
  };

  // VERIFY OTP
  const verifyOtp = async (email, otp) => {
    try {
      const res = await api.post("/verify-otp", { email, otp });
      const data = res.data;

      saveSession(data);
      return data;

    } catch (err) {
      throw err.response?.data || { error: "OTP verification failed" };
    }
  };

  const logout = () => {
    setUser(null);
    setAuth(null);
    localStorage.removeItem("user");
    localStorage.removeItem("auth");
    delete api.defaults.headers["Authorization"];
  };

  return (
    <AuthContext.Provider value={{
      user,
      auth,
      isLoggedIn: !!user,
      loading,
      login,
      verifyOtp,
      logout,
      api,
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);


// import React, { createContext, useContext, useState, useEffect } from "react";
// import axios from "axios";

// const AuthContext = createContext(null);

// const api = axios.create({
//   baseURL: "https://sophia4293.pythonanywhere.com",
//   withCredentials: true,
//   headers: { "Content-Type": "application/json" },
// });

// export const AuthProvider = ({ children }) => {
//   const [user, setUser] = useState(null);
//   const [auth, setAuth] = useState(null);
//   const [loading, setLoading] = useState(true);

//   // Restore session on refresh
//   useEffect(() => {
//     const savedUser = localStorage.getItem("user");
//     const savedAuth = localStorage.getItem("auth");

//     if (savedUser && savedAuth) {
//       const parsedUser = JSON.parse(savedUser);
//       console.log("Restored user:", parsedUser);
//       const parsedAuth = JSON.parse(savedAuth);
//       console.log("Restored auth:", parsedAuth);

//       setUser(parsedUser);
//       setAuth(parsedAuth);

//       api.defaults.headers["Authorization"] = `Bearer ${parsedAuth.access_token}`;
//     }

//     setLoading(false);
//   }, []);

//   // LOGIN
//   const login = async (email, password) => {
//     try {
//       const res = await api.post("/login", { email, password });
//       const data = res.data;

//       // ---- OTP PHASE ----
//       if (data.status === "verify_otp") {
//         return data;  // send backend response unchanged
//       }

//       // ---- LOGIN SUCCESS ----
//       saveSession(data);
//       return data;

//     } catch (err) {
//       throw err.response?.data || { error: "Login failed" };
//     }
//   };

//   // VERIFY OTP
//   const verifyOtp = async (email, otp) => {
//     try {
//       const res = await api.post("/verify-otp", { email, otp });
//       const data = res.data;

//       saveSession(data);
//       return data;

//     } catch (err) {
//       throw err.response?.data || { error: "OTP verification failed" };
//     }
//   };

//   // Save login session
//   const saveSession = (data) => {
//     setUser(data.user);
//     setAuth(data.auth);

//     localStorage.setItem("user", JSON.stringify(data.user));
//     localStorage.setItem("auth", JSON.stringify(data.auth));

//     api.defaults.headers["Authorization"] = `Bearer ${data.auth.access_token}`;
//   };

//   // LOGOUT
//   const logout = () => {
//     setUser(null);
//     setAuth(null);
//     localStorage.clear();
//     delete api.defaults.headers["Authorization"];
//   };

//   return (
//     <AuthContext.Provider value={{
//       user,
//       auth,
//       isLoggedIn: !!user,
//       loading,
//       login,
//       verifyOtp,
//       logout,
//       api
//     }}>
//       {children}
//     </AuthContext.Provider>
//   );
// };

// export const useAuth = () => useContext(AuthContext);
