'use server'

import { Avatars, ID, Query } from "node-appwrite";
import { appwriteConfig } from "../appwrite/config";
import createAdminClient from "../appwrite";
import { parseStringify } from "../utils";

// **Create account flow 
// 1. users enters full name and email 
// 2. check if the users already exist using the email (which we willl use to identify if we still need to create a user docuent or not).
// 3. send OTP to user's email
// 4. This will send a secret key for creating a session. The secret key will be used to create a session.
// 5. create a new user document if the user is a new user.
// 6. Return the user's accounfId that wil be used to complete the login flow.
// 7. Verify OTP and authenticate to login.


// GET USER BY EMAIL FUNCTION

const getUserByEmail = async ( email: string) => {
    const { databases} =  await createAdminClient();

    const result = await databases.listDocuments(
        appwriteConfig.databaseId,
        appwriteConfig.userCollectionId,
       [Query.equal("email", [email])],
    );
    return result.total > 0 ? result.documents[0] : null;
}

 // HANDLE OTP ERROR FUNCTION

 const handleError = (error: unknown, message: string) => {
        console.log(error, message);
        throw error;
 }

// SEND EMAIL OTP FUNCTION
const sendEmailOTP = async ({email}: {email: string}) => {
    const {account} = await createAdminClient();

    try {
   const session = await account.createEmailToken(ID.unique(), email);
   console.log(session);
    } catch (error) {
        handleError(error, "Error sending email OTP");
    }
}

 export const createAccount = async ({fullName, email}: {fullName: string; email: string}) => {
    //CREATE ACCOUNT FOR EXISTING USER FUNCTION 
    const existingUser =  await getUserByEmail(email);

    // IF WE HAVE EXISTING USER, WE WILL RETURN THE USER ID THEN SEND OTP TO THE USER
const accountId = await sendEmailOTP({email});
if (!accountId) throw new Error("Failed to send an OTP");
   
    if (!existingUser) {
        const {databases} = await createAdminClient();

        await databases.createDocument(
            appwriteConfig.databaseId,
            appwriteConfig.userCollectionId,
          ID.unique(),
          {
            fullName,
            email,
            avatar:'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTdVyxZKZkLxm_9CKUF5YRx8CFErDF18OOF9RF2GeM-mV6fgRovKFH5ihg&s',
            accountId,
          },
        );

    }
    return parseStringify({accountId})

 }