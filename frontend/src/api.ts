import axios from "axios";

const API_URL = "http://localhost:8000";

export interface SignupData {
  username: string;
  email: string;
  password: string;
  role: string;
}

export interface LoginData {
  email: string;
  password: string;
}

export interface TokenResponse {
  access_token: string;
  token_type: string;
}

export const signupUser = async (data: SignupData) => {
  const response = await axios.post(`${API_URL}/auth/signup`, data);
  return response.data;
};

export const loginUser = async (
  data: LoginData
): Promise<TokenResponse> => {
  // Must send as form-urlencoded
  const formData = new URLSearchParams();
  formData.append("username", data.email.trim()); // OAuth2PasswordRequestForm requires `username`
  formData.append("password", data.password.trim());

  const response = await axios.post(
    `${API_URL}/auth/login`,
    formData,
    {
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
    }
  );

  return response.data;
};
