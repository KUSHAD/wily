import { BarCodeScanner } from "expo-barcode-scanner";
import * as Permissions from "expo-permissions";
import firebase from "firebase";
import React from "react";
import {
	Alert,
	Image,
	KeyboardAvoidingView,
	Platform,
	StyleSheet,
	Text,
	TextInput,
	ToastAndroid,
	TouchableOpacity,
	View,
} from "react-native";
import db from "../../config";

export default class TransactionScreen extends React.Component {
	constructor() {
		super();
		this.state = {
			hasCameraPermissions: null,
			scanned: false,
			scannedBookId: "",
			scannedStudentId: "",
			buttonState: "normal",
			transactionMessage: "",
		};
	}

	getCameraPermissions = async (id) => {
		const { status } = await Permissions.askAsync(Permissions.CAMERA);

		this.setState({
			/*status === "granted" is true when user has granted permission
        status === "granted" is false when user has not granted the permission
      */
			hasCameraPermissions: status === "granted",
			buttonState: id,
			scanned: false,
		});
	};

	handleBarCodeScanned = async ({ data }) => {
		const { buttonState } = this.state;

		if (buttonState === "BK001") {
			this.setState({
				scanned: true,
				scannedBookId: data,
				buttonState: "normal",
			});
		} else if (buttonState === "ST001") {
			this.setState({
				scanned: true,
				scannedStudentId: data,
				buttonState: "normal",
			});
		}
	};

	initiateBookIssue = async () => {
		//add a transaction
		db.collection("Transactions").add({
			studentId: this.state.scannedStudentId,
			bookId: this.state.scannedBookId,
			data: firebase.firestore.Timestamp.now().toDate(),
			transactionType: "Issue",
		});

		//change book status
		db.collection("Books").doc(this.state.scannedBookId).update({
			bookAvailability: false,
		});
		//change number of issued books for student
		db.collection("Students")
			.doc(this.state.scannedStudentId)
			.update({
				numberOfBooksIssued: firebase.firestore.FieldValue.increment(1),
			});

		this.setState({
			scannedStudentId: "",
			scannedBookId: "",
		});
	};

	initiateBookReturn = async () => {
		//add a transaction
		db.collection("Transactions").add({
			studentId: this.state.scannedStudentId,
			bookId: this.state.scannedBookId,
			date: firebase.firestore.Timestamp.now().toDate(),
			transactionType: "Return",
		});

		//change book status
		db.collection("Books").doc(this.state.scannedBookId).update({
			bookAvailability: true,
		});

		//change book status
		db.collection("Students")
			.doc(this.state.scannedStudentId)
			.update({
				numberOfBooksIssued: firebase.firestore.FieldValue.increment(-1),
			});

		this.setState({
			scannedStudentId: "",
			scannedBookId: "",
		});
	};

	handleTransaction = async () => {
		var transactionMessage = null;
		var checkIfBookIsAvailable = await this.checkIfBookIsAvailable();
		var checkIfStudentIsEligibleForIssue = await this.checkIfStudentIsEligibleForIssue();
		if (checkIfBookIsAvailable) {
			this.initiateBookIssue();
			if (checkIfStudentIsEligibleForIssue) {
				transactionMessage = "Book Issued";
				ToastAndroid.show(transactionMessage, ToastAndroid.SHORT);
			}
		} else {
			this.initiateBookReturn();
			transactionMessage = "Book Returned";
			ToastAndroid.show(transactionMessage, ToastAndroid.SHORT);
		}
	};
	checkIfBookIsAvailable = async () => {
		var ref = await db
			.collection("Books")
			.where("bookId", "==", this.state.scannedBookId)
			.get();
		var transactionType = "";
		if (ref.docs.length === 0) {
			transactionType = false;
			{
				Platform.OS === "web"
					? alert("Book doesn't Exist")
					: Alert.alert("Book doesn't Exist");
				this.setState({
					scannedBookId: "",
					scannedStudentId: "",
				});
			}
		} else {
			ref.docs.map((doc) => {
				var document = doc.data();
				if (document.bookAvailability) {
					transactionType = true;
				} else {
					transactionType = false;
					{
						Platform.OS === "web"
							? alert("Book Is Not Available")
							: Alert.alert("Book Is Not Available");
					}
					this.setState({
						scannedBookId: "",
						scannedStudentId: "",
					});
				}
			});
		}
		return transactionType;
	};
	checkIfStudentIsEligibleForIssue = async () => {
		var ref = await db
			.collection("Students")
			.where("studentId", "==", this.state.scannedStudentId)
			.get();
		var studentEligiblity = "";
		if (ref.docs.length === 0) {
			studentEligiblity = false;
			{
				Platform.OS === "web"
					? alert("Student Is Not Available")
					: Alert.alert("Student Is Not Available");
			}
			this.setState({
				scannedBookId: "",
				scannedStudentId: "",
			});
		} else {
			ref.docs.map((doc) => {
				var document = doc.data();
				if (document.numberOfBooksIssued < 2) {
					studentEligiblity = true;
				} else {
					studentEligiblity = false;
					{
						Platform.OS === "web"
							? alert("Student Has Already Issued 2 Books")
							: Alert.alert("Student Has Already Issued 2 Books");
					}
					this.setState({
						scannedBookId: "",
						scannedStudentId: "",
					});
				}
			});
		}
		return studentEligiblity;
	};
	checkIfStudentIsEligibleForReturn = async () => {
		var ref = await db
			.collection("Transactions")
			.where("bookId", "==", this.state.scannedBookId)
			.limit(1)
			.get();
		var isStudentEligible = "";
		ref.docs.map((doc) => {
			var document = doc.data();
			if (document.studentId === this.state.scannedBookId) {
				isStudentEligible = true;
				this.setState({
					scannedStudentId: "",
					scannedBookId: "",
				});
			} else {
				isStudentEligible = false;
				{
					Platform.OS === "web"
						? alert("The book wasn't issued by this student!")
						: Alert.alert("The book wasn't issued by this student!");
				}
				Alert.alert("The book wasn't issued by this student!");
				this.setState({
					scannedStudentId: "",
					scannedBookId: "",
				});
			}
		});
	};
	render() {
		const hasCameraPermissions = this.state.hasCameraPermissions;
		const scanned = this.state.scanned;
		const buttonState = this.state.buttonState;

		if (buttonState !== "normal" && hasCameraPermissions) {
			return (
				<BarCodeScanner
					onBarCodeScanned={scanned ? undefined : this.handleBarCodeScanned}
					style={StyleSheet.absoluteFillObject}
				/>
			);
		} else if (buttonState === "normal") {
			return (
				<KeyboardAvoidingView style={styles.container} behavior="padding">
					<View>
						<Image
							source={require("../../assets/booklogo.jpg")}
							style={{ width: 200, height: 200 }}
						/>
						<Text style={{ textAlign: "center", fontSize: 30 }}>Wily</Text>
					</View>
					<View style={styles.inputView}>
						<TextInput
							onChangeText={(text) =>
								this.setState({
									scannedBookId: text,
								})
							}
							style={styles.inputBox}
							placeholder="Book Id"
							value={this.state.scannedBookId}
						/>
						<TouchableOpacity
							style={styles.scanButton}
							onPress={() => {
								this.getCameraPermissions("BK001");
							}}
						>
							<Text style={styles.buttonText}>Scan</Text>
						</TouchableOpacity>
					</View>

					<View style={styles.inputView}>
						<TextInput
							onChangeText={(text) =>
								this.setState({
									scannedStudentId: text,
								})
							}
							style={styles.inputBox}
							placeholder="Student Id"
							value={this.state.scannedStudentId}
						/>
						<TouchableOpacity
							style={styles.scanButton}
							onPress={() => {
								this.getCameraPermissions("ST001");
							}}
						>
							<Text style={styles.buttonText}>Scan</Text>
						</TouchableOpacity>
					</View>
					<TouchableOpacity
						style={styles.submitButton}
						disabled={!this.state.scannedBookId || !this.state.scannedStudentId}
						onPress={async () => {
							await this.handleTransaction();
						}}
					>
						<Text style={styles.submitButtonText}>Submit</Text>
					</TouchableOpacity>
				</KeyboardAvoidingView>
			);
		}
	}
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
		justifyContent: "center",
		alignItems: "center",
	},
	displayText: {
		fontSize: 15,
		textDecorationLine: "underline",
	},
	scanButton: {
		backgroundColor: "#2196F3",
		padding: 10,
		margin: 10,
	},
	buttonText: {
		fontSize: 15,
		textAlign: "center",
		marginTop: 10,
	},
	inputView: {
		flexDirection: "row",
		margin: 20,
	},
	inputBox: {
		width: 200,
		height: 40,
		borderWidth: 1.5,
		borderRightWidth: 0,
		fontSize: 20,
	},
	scanButton: {
		backgroundColor: "#66BB6A",
		width: 50,
		borderWidth: 1.5,
		borderLeftWidth: 0,
	},
	submitButton: {
		backgroundColor: "#FBC02D",
		width: 100,
		height: 50,
	},
	submitButtonText: {
		padding: 10,
		textAlign: "center",
		fontSize: 20,
		fontWeight: "bold",
		color: "white",
	},
});
