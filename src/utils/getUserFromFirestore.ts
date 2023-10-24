import { app } from '../firebase/server'
import { getAuth } from 'firebase-admin/auth'
import { getFirestore } from "firebase-admin/firestore";

export async function getUserFromFirestore(email: string){
	const auth = getAuth(app);
   const db = getFirestore(app);
   const usersRef = db.collection('users');

   return await usersRef.where('email', '==',email).get()
}