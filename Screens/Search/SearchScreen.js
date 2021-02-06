import React, { Component } from "react";
import { StyleSheet, Text, View } from "react-native";

export default class SearchScreen extends Component {
	render() {
		return (
			<View style={Styles.container}>
				<Text> Search Screen </Text>
			</View>
		);
	}
}

const Styles = StyleSheet.create({
	container: {
		flex: 1,
		justifyContent: "center",
		alignItems: "center",
	},
});
