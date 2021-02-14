import React, { Component } from "react";
import {
	FlatList,
	StyleSheet,
	Text,
	TextInput,
	TouchableOpacity,
	View,
} from "react-native";
import firebaseFirestore from "../../config";

export default class SearchScreen extends Component {
	constructor(props) {
		super(props);

		this.state = {
			searchTerm: "",
			transactions: [],
			lastVisibleTransaction: null,
		};
	}

	searchTransactions = async () => {
		const searchValue = this.state.searchTerm.split("");
		if (searchValue[0] === "B") {
			await firebaseFirestore
				.collection("Transactions")
				.where("bookId", "==", this.state.searchTerm)
				.get()
				.then((data) => {
					data.docs.map(async (doc) => {
						await this.setState({
							transactions: [...this.state.transactions, doc.data()],
							lastVisibleTransaction: doc,
						});
						console.log(this.state.transactions);
					});
				});
		} else if (searchValue[0] === "S") {
			await firebaseFirestore
				.collection("Transactions")
				.where("studentId", "==", this.state.searchTerm)
				.get()
				.then((data) => {
					data.docs.map(async (doc) => {
						await this.setState({
							transactions: [...this.state.transactions, doc.data()],
							lastVisibleTransaction: doc,
						});
						console.log(this.state.transactions);
					});
				});
		}
	};

	render() {
		return (
			<View style={Styles.container}>
				<TextInput
					style={Styles.textInput}
					placeholder="Search ...."
					value={this.state.searchTerm}
					onChangeText={(text) =>
						this.setState({ searchTerm: text.toUpperCase() })
					}
				/>
				<TouchableOpacity
					disabled={!this.state.searchTerm}
					onPress={this.searchTransactions}
					style={Styles.touchable}
				>
					<Text style={Styles.touchableText}>Search</Text>
				</TouchableOpacity>
				<FlatList
					data={this.state.transactions}
					renderItem={({ item, separators, index }) => {
						return (
							<View
								style={{
									borderWidth: 2,
									marginBottom: 5,
									borderRadius: 8,
								}}
							>
								<Text>Transaction Type:-{item.transactionType}</Text>
								<Text>{`Transaction Date:- ${item.data.toDate()}`}</Text>
							</View>
						);
					}}
				/>
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
	textInput: {
		borderBottomWidth: 2,
	},
	touchable: {
		backgroundColor: "#17abab",
	},
	touchableText: {
		color: "#fff",
		textAlign: "center",
		fontSize: 20,
		margin: 5,
	},
});
