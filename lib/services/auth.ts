// import api from "../axios";
// import { AuthTokens } from "../types";

// /**
//  * Login service function
//  */
// export const login = async (
//   username: string,
//   password: string
// ): Promise<AuthTokens> => {
//   const response = await api.post("/login", {
//     username,
//     password,
//   });

//   console.log("Login response:", response, response?.data);

//   return {
//     accessToken: response.data.access,
//     refreshToken: response.data.refresh,
//   };
// };

// /**
//  * Logout service function
//  */
// export const logout = async (): Promise<void> => {
//   try {
//     // Call the logout endpoint if your API has one
//     await api.post("/logout");
//   } catch (error) {
//     console.error("Error during logout:", error);
//   }
// };
