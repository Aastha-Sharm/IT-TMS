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

// Signup API
export const signupUser = async (data: SignupData) => {
  const response = await axios.post(`${API_URL}/auth/signup`, data);
  return response.data;
};

// Login API
export const loginUser = async (data: LoginData): Promise<TokenResponse> => {
  const formData = new URLSearchParams();
  formData.append("username", data.email.trim()); // OAuth2PasswordRequestForm requires `username`
  formData.append("password", data.password.trim());

  const response = await axios.post(`${API_URL}/auth/login`, formData, {
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
    },
  });

  return response.data;
};

// Ticket creation API (fixed for file upload + error logging)
// Ticket creation API (JSON version, no files)
export const createTicket = async (
  token: string,
  data: {
    type: string;
    category: string;
    priority: string;
    title: string;
    description: string;
  }
) => {
  try {
    const response = await axios.post(
      `${API_URL}/tickets/`,
      {
        type: data.type,
        category: data.category,
        priority: data.priority,
        title: data.title,
        description: data.description,
      },
      {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      }
    );

    return response.data;
  } catch (error: any) {
    console.error("Error creating ticket:", error.response?.data || error.message);
    throw new Error(error.response?.data?.detail || "Error creating ticket");
  }
};

export interface Ticket {
  id: number;
  type: string;
  title: string;
  description: string;
  status:
    | "Open"
    | "Assigned"
    | "Reopened"
    | "In Progress"
    | "Resolved"
    | "Closed"
    | "Not Resolved";
  priority: "Low" | "Medium" | "High";
  agentResponse: string | null;
}

export const getTickets = async (token: string): Promise<Ticket[]> => {
  const response = await axios.get(`${API_URL}/tickets/`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return response.data;
};
