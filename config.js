import firebase from "firebase";
require("@firebase/firestore");

const firebaseConfig = {
	apiKey: "AIzaSyBK3rqtDoZ_laiiT5Kb1q1Djs1ccy5iKyA",
	authDomain: "willy-8f93c.firebaseapp.com",
	projectId: "willy-8f93c",
	storageBucket: "willy-8f93c.appspot.com",
	messagingSenderId: "763249406573",
	appId: "1:763249406573:web:04f09282c6069444de4564",
};
// Initialize Firebase
firebase.initializeApp(firebaseConfig);

export default firebase.firestore();
