import firebase from "firebase";
import React from "react";
import { Button, Image, StyleSheet, Text, TextInput, View } from "react-native";
class Login extends React.Component {
	constructor(props) {
		super(props);

		this.state = {
			email: "",
			password: "",
		};
	}
	render() {
		return (
			<View style={Styles.container}>
				<Image
					source={require("../../assets/booklogo.jpg")}
					style={{
						width: 250,
						height: 250,
						borderRadius: 100,
					}}
				/>
				<Text style={Styles.title}>Login</Text>
				<TextInput
					style={Styles.textInput}
					value={this.state.email}
					onChangeText={(text) => this.setState({ email: text })}
					placeholder="Email"
				/>
				<TextInput
					style={Styles.textInput}
					value={this.state.password}
					placeholder="Password"
					onChangeText={(text) => this.setState({ password: text })}
					secureTextEntry={true}
				/>
				<Button
					title="Login"
					disabled={!this.state.email || !this.state.password}
					onPress={() => {
						firebase
							.auth()
							.signInWithEmailAndPassword(this.state.email, this.state.password)
							.then(() => {
								console.log("succes");
							})
							.catch((err) => {
								console.log(err, `Error`);
							});
					}}
				/>
			</View>
		);
	}
}

export default Login;

const Styles = StyleSheet.create({
	container: {
		flex: 1,
		justifyContent: "center",
		alignItems: "center",
	},
	textInput: {
		borderBottomWidth: 2,
		marginBottom: 5,
	},
	title: {
		textDecorationLine: "underline",
		fontSize: 20,
		marginBottom: 10,
	},
});
