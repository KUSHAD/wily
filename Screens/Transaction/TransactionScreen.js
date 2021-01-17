import { BarCodeScanner } from "expo-barcode-scanner";
import * as Permissions from "expo-permissions";
import React, { Component } from "react";
import { Button, StyleSheet, Text, View } from "react-native";
export default class TransactionScreen extends Component {
	constructor(props) {
		super(props);
		this.state = {
			hasCameraPermission: null,
			scanned: false,
			scannedData: "",
			buttonState: "normal",
		};
	}
	getCameraPermissions = async () => {
		const { status } = await Permissions.askAsync(Permissions.CAMERA);
		this.setState({
			hasCameraPermission: status === "granted",
			buttonState: "clicked",
			scanned: false,
		});
	};
	handleBarCodeScan = async ({ data }) => {
		this.setState({
			scannedData: data,
			scanned: true,
			buttonState: "normal",
		});
	};
	render() {
		const { hasCameraPermission, scanned, buttonState } = this.state;
		if (buttonState === "clicked" && hasCameraPermission) {
			return (
				<BarCodeScanner
					style={StyleSheet.absoluteFillObject}
					onBarCodeScanned={scanned ? undefined : this.handleBarCodeScan}
				/>
			);
		} else if (buttonState === "normal") {
			return (
				<View style={Styles.container}>
					<Text>
						{hasCameraPermission
							? this.state.scannedData
							: "Request Camera Permission"}
					</Text>
					<Button title="Scan qr Code" onPress={this.getCameraPermissions} />
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
});
