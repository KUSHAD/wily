import { BarCodeScanner } from "expo-barcode-scanner";
import * as Permissions from "expo-permissions";
import React, { Component } from "react";
import {
	Image,
	StyleSheet,
	Text,
	TextInput,
	TouchableOpacity,
	View,
} from "react-native";
export default class TransactionScreen extends Component {
	constructor(props) {
		super(props);
		this.state = {
			hasCameraPermission: null,
			scanned: false,
			scannedData: "",
			buttonState: "normal",
			scannedBookId: "",
			scannedStudentId: "",
		};
	}
	getCameraPermissions = async (id) => {
		const { status } = await Permissions.askAsync(Permissions.CAMERA);
		this.setState({
			hasCameraPermission: status === "granted",
			scanned: false,
			buttonState: id,
		});
	};
	handleBarCodeScan = async ({ data }) => {
		const buttonState = this.state.buttonState;
		if (buttonState === "bookId") {
			this.setState({
				scannedBookId: data,
				scanned: true,
				buttonState: "normal",
			});
		} else if (buttonState === "studentId") {
			this.setState({
				scannedStudentId: data,
				scanned: true,
				buttonState: "normal",
			});
		}
	};
	render() {
		const {
			hasCameraPermission,
			scanned,
			buttonState,
			scannedBookId,
			scannedStudentId,
		} = this.state;
		if (buttonState !== "normal" && hasCameraPermission) {
			return (
				<BarCodeScanner
					style={StyleSheet.absoluteFillObject}
					onBarCodeScanned={scanned ? undefined : this.handleBarCodeScan}
				/>
			);
		} else if (buttonState === "normal") {
			return (
				<View style={Styles.container}>
					<Text style={Styles.title}>Wily</Text>
					<Image source={require("../../assets/booklogo.jpg")} />
					<View style={Styles.inputView}>
						<TextInput
							value={scannedBookId}
							placeholder="Book Id"
							s
							style={Styles.inputBox}
						/>
						<TouchableOpacity
							onPress={() => this.getCameraPermissions("bookId")}
							style={Styles.scanButton}
						>
							<Text style={Styles.scanButtonText}>Scan Book Id</Text>
						</TouchableOpacity>
					</View>
					<View style={Styles.inputView}>
						<TextInput
							value={scannedStudentId}
							placeholder="Student Id"
							style={Styles.inputBox}
						/>
						<TouchableOpacity
							onPress={() => this.getCameraPermissions("studentId")}
							style={Styles.scanButton}
						>
							<Text style={Styles.scanButtonText}>Scan Student Id</Text>
						</TouchableOpacity>
					</View>
				</View>
			);
		}
	}
}
const Styles = StyleSheet.create({
	container: {
		flex: 1,
		justifyContent: "center",
		alignItems: "center",
	},
	inputView: { flexDirection: "row", margin: 20 },
	inputBox: {
		width: 200,
		height: 40,
		borderWidth: 1.5,
		borderRightWidth: 0,
		fontSize: 20,
	},
	scanButton: {
		backgroundColor: "#66BB6A",
		borderWidth: 1.5,
		borderLeftWidth: 0,
	},
	scanButtonText: {
		color: "#fff",
		alignSelf: "center",
		margin: 5,
	},
	title: {
		fontSize: 30,
		fontWeight: "bold",
		textDecorationLine: "underline",
	},
});
