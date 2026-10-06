import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js";
import { getFirestore } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";
import { getStorage } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-storage.js";
import { getAuth } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js";

const firebaseConfig = {
    apiKey: "AIzaSyAMauW3jPyOt8HjvkXorCp3F71-AfOOgSE",
    authDomain: "libreria-bazar-cristel.firebaseapp.com",
    projectId: "libreria-bazar-cristel",
    storageBucket: "libreria-bazar-cristel.firebasestorage.app",
    messagingSenderId: "745535148318",
    appId: "1:745535148318:web:9370555b20936c66be390f",
    measurementId: "G-Z18Z5Y8L6K"
};

const app = initializeApp(firebaseConfig);

const db = getFirestore(app);
const storage = getStorage(app);
const auth = getAuth(app);

export {
    app,
    db,
    storage,
    auth
};