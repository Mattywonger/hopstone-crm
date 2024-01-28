import { initializeApp } from 'firebase/app'
import 'firebase/auth'
import { getAuth } from 'firebase/auth'
import 'firebase/database'
import 'firebase/firestore'
import 'firebase/storage'
import { getFirestore } from 'firebase/firestore'
import 'firebase/functions'
import { getStorage } from 'firebase/storage'

const firebaseConfig = {
    apiKey: "AIzaSyB98Z_aWYJwqO08WrceH77FABz8h3CUClU",
    authDomain: "hopstonecrm.firebaseapp.com",
    projectId: "hopstonecrm",
    storageBucket: "hopstonecrm.appspot.com",
    messagingSenderId: "244429367797",
    appId: "1:244429367797:web:fb785e150d9abd417298bc",
    measurementId: "G-H0YBPXRE31"
};


export const initFirebase = () => {
    let app = initializeApp(firebaseConfig)
    const auth = getAuth(app)
    const firestore = getFirestore(app)
    const storage = getStorage(app)
    return { auth, firestore, storage }
}