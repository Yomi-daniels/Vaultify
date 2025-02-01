"use server";

import { Avatars, ID, Query } from "node-appwrite";
import { appwriteConfig } from "../appwrite/config";
import createAdminClient from "../appwrite";
import { parseStringify } from "../utils";

// GET USER BY EMAIL FUNCTION
const getUserByEmail = async (email: string) => {
  const { databases } = await createAdminClient();
  const result = await databases.listDocuments(
    appwriteConfig.databaseId,
    appwriteConfig.userCollectionId,
    [Query.equal("email", [email])]
  );
  return result.total > 0 ? result.documents[0] : null;
};

// HANDLE ERROR FUNCTION
const handleError = (error: unknown, message: string) => {
  console.error(message, error);
  throw new Error(message);
};

// SEND EMAIL OTP FUNCTION
const sendEmailOTP = async (email: string): Promise<string> => {
  const { account } = await createAdminClient();

  try {
    const session = await account.createEmailToken(ID.unique(), email);
    return session.$id;
  } catch (error) {
    handleError(error, "Error sending email OTP");
  }
  return "";
};

// CREATE ACCOUNT FUNCTION
export const createAccount = async ({ fullName, email }: { fullName: string; email: string }) => {
  const existingUser = await getUserByEmail(email);

  // SEND OTP
  const accountId = await sendEmailOTP(email);
  if (!accountId) throw new Error("Failed to send an OTP");

  // CREATE USER DOCUMENT IF NEW USER
  if (!existingUser) {
    const { databases } = await createAdminClient();
    await databases.createDocument(
      appwriteConfig.databaseId,
      appwriteConfig.userCollectionId,
      ID.unique(),
      {
        fullName,
        email,
        avatar: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTdVyxZKZkLxm_9CKUF5YRx8CFErDF18OOF9RF2GeM-mV6fgRovKFH5ihg&s",
        accountId,
      }
    );
  }

  return parseStringify({ accountId });
};
