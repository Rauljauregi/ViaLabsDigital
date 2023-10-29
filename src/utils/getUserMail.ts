import { app } from '../firebase/server'
import { getAuth } from 'firebase-admin/auth'
import { getFirestore } from "firebase-admin/firestore";

export default async function getUserFromFirestore(id: string){
   const auth = getAuth(app);
   const db = getFirestore(app);
   const usersRef = db.collection('users');

   return await usersRef.doc(id.toString()).get()
}