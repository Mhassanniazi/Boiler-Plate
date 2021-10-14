import { initializeApp, } from "firebase/app";

const firebaseConfig = {
    
  };
  
  const app = initializeApp(firebaseConfig);
  const auth = getAuth(app);

  export {
      auth
  }
  