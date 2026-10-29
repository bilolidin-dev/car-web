import { initializeApp } from 'https://www.gstatic.com/firebasejs/11.10.0/firebase-app.js';
import { getAuth } from 'https://www.gstatic.com/firebasejs/11.10.0/firebase-auth.js';
import { getFirestore } from 'https://www.gstatic.com/firebasejs/11.10.0/firebase-firestore.js';

const firebaseConfig = {
    apiKey: 'AIzaSyCzdj9rNjpRj25o98xT1TZCEl3HKi97ANE',
    authDomain: 'car-web-27ef1.firebaseapp.com',
    projectId: 'car-web-27ef1',
    storageBucket: 'car-web-27ef1.firebasestorage.app',
    messagingSenderId: '604216484188',
    appId: '1:604216484188:web:37fcf52da7402d6fa72199',
    measurementId: 'G-LPR3NTGRZP'
};

export const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);

export const cloudinaryConfig = {
    cloudName: 'nbsbw96p',
    uploadPreset: 'car-photos'
};