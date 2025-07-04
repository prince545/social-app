import { createContext, useReducer, useEffect } from "react";

export const AuthContext = createContext({
  currentUser: null,
  users: [],
  login: () => {},
  signup: () => {},
  logout: () => {},
  updateProfile: () => {},
});

const authReducer = (state, action) => {
  switch (action.type) {
    case "LOGIN":
      return { ...state, currentUser: action.payload };
    case "LOGOUT":
      return { ...state, currentUser: null };
    case "SIGNUP":
      return {
        ...state,
        users: [...state.users, action.payload],
        currentUser: action.payload,
      };
    case "UPDATE_PROFILE":
      return {
        ...state,
        currentUser: action.payload.updatedUser,
        users: action.payload.updatedUsers,
      };
    default:
      return state;
  }
};

const getInitialAuthState = () => {
  const stored = localStorage.getItem("authState");
  if (stored) {
    try {
      return JSON.parse(stored);
    } catch {
      return { currentUser: null, users: [] };
    }
  }
  return { currentUser: null, users: [] };
};

const AuthProvider = ({ children }) => {
  const [state, dispatch] = useReducer(authReducer, getInitialAuthState());

  useEffect(() => {
    try {
      localStorage.setItem("authState", JSON.stringify(state));
    } catch (error) {
      console.warn("Failed to save auth state to localStorage:", error);
      // Optionally clear some data to make room
      try {
        const minimalState = {
          currentUser: state.currentUser ? {
            username: state.currentUser.username,
            password: state.currentUser.password,
            avatar: state.currentUser.avatar,
            birthDate: state.currentUser.birthDate,
            bio: state.currentUser.bio
          } : null,
          users: state.users.map(user => ({
            username: user.username,
            password: user.password,
            avatar: user.avatar,
            birthDate: user.birthDate,
            bio: user.bio
          }))
        };
        localStorage.setItem("authState", JSON.stringify(minimalState));
      } catch (retryError) {
        console.error("Failed to save minimal auth state:", retryError);
      }
    }
  }, [state]);

  const login = (username, password) => {
    const user = state.users.find(
      (u) => u.username === username && u.password === password
    );
    if (user) {
      dispatch({ type: "LOGIN", payload: user });
      return true;
    }
    return false;
  };

  const signup = (username, password) => {
    if (state.users.some((u) => u.username === username)) {
      return false; // Username already exists
    }
    const newUser = { username, password };
    dispatch({ type: "SIGNUP", payload: newUser });
    return true;
  };

  const logout = () => {
    dispatch({ type: "LOGOUT" });
  };

  const updateProfile = (updates) => {
    const updatedUser = { ...state.currentUser, ...updates };
    const updatedUsers = state.users.map((u) =>
      u.username === updatedUser.username ? updatedUser : u
    );
    dispatch({ type: "UPDATE_PROFILE", payload: { updatedUser, updatedUsers } });
    try {
      localStorage.setItem(
        "authState",
        JSON.stringify({ currentUser: updatedUser, users: updatedUsers })
      );
    } catch (error) {
      console.warn("Failed to save profile update to localStorage:", error);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        currentUser: state.currentUser,
        users: state.users,
        login,
        signup,
        logout,
        updateProfile,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export default AuthProvider; 