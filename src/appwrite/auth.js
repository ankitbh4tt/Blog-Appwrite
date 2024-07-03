import conf from "../conf/conf.js";
import { Client, Account, ID } from "appwrite";

export class AuthService {
  client = new Client();
  account;

  constructor() {
    console.log("Appwrite URL in AuthService:", conf.appwriteUrl);
    console.log("Appwrite Project ID in AuthService:", conf.appwriteProjectId);

    if (conf.appwriteUrl && conf.appwriteProjectId) {
      this.client
        .setEndpoint(conf.appwriteUrl)
        .setProject(conf.appwriteProjectId);
      this.account = new Account(this.client);
    } else {
      console.error("Invalid Appwrite configuration:", conf);
    }
  }

  async createAccount({ email, password, name }) {
    try {
      const userId = ID.unique();
      console.log("Generated User ID:", userId);
      const userAccount = await this.account.create(
        userId,
        email,
        password,
        name
      );
      if (userAccount) {
        console.log("User account created successfully:", userAccount);
        return this.login({ email, password });
      } else {
        console.log("Failed to create user account:", userAccount);
        return userAccount;
      }
    } catch (error) {
      console.error("Error creating account:", error);
      throw error;
    }
  }

  async login({ email, password }) {
    try {
      console.log("Attempting to log in with email:", email);
      const session = await this.account.createEmailPasswordSession(
        email,
        password
      );
      console.log("Session created successfully:", session);
      return session;
    } catch (error) {
      console.error("Error logging in:", error);
      throw error;
    }
  }

  async getCurrentUser() {
    try {
      const user = await this.account.get();
      console.log("Current user:", user);
      return user;
    } catch (error) {
      console.error("Appwrite service :: getCurrentUser :: error", error);
      throw error;
    }
  }

  async logout() {
    try {
      await this.account.deleteSessions();
      console.log("Logged out successfully");
    } catch (error) {
      console.error("Appwrite service :: logout :: error", error);
      throw error;
    }
  }
}

const authService = new AuthService();
export default authService;
