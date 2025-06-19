// Define the types for the user and the AuthContext
export type userInfoType = {
  _id: string;
  name: string;
  username: string;
  email: string;
  picture: string;
  role?: {
    _id: string;
    name: string;
    company: string;
    role: string;
    branch?: string;
  };
};

export type AuthContextType = {
  isAuthenticated: boolean;
  user: userInfoType | null;
  signIn: (userInfo: userInfoType) => void;
  signOut: () => void;
  loading: boolean;
};
