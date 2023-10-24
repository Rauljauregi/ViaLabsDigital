import { initializeApp } from "firebase/app";

const firebaseConfig = {
   apiKey: "AIzaSyCAb7faHrNZLKtJ1YDmCbdsTepDckVZtjk",
   authDomain: "newsletter-vialabsdigital.firebaseapp.com",
   projectId: "newsletter-vialabsdigital",
   storageBucket: "newsletter-vialabsdigital.appspot.com",
   messagingSenderId: "965323008845",
   appId: "1:965323008845:web:9707ff0e845255c1e72504",
   measurementId: "G-V3WC9QSH8J"
};

export const app = initializeApp(firebaseConfig);