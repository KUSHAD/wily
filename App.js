import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import { StatusBar } from "expo-status-bar";
import firebase from "firebase";
import React from "react";
import { ActivityIndicator, Image } from "react-native";
import { BookSearchScreen, BookTransactionScreen } from "./Screens";
import Login from "./Screens/Login/Login";
const BottomTab = createBottomTabNavigator();
const Stack = createStackNavigator();
export default class App extends React.Component {
	constructor(props) {
		super(props);

		this.state = {
			loaded: false,
		};
	}

	componentDidMount() {
		firebase.auth().onAuthStateChanged((user) => {
			if (!user) {
				this.setState({
					loaded: true,
					loggedIn: false,
				});
			} else if (user) {
				this.setState({
					loaded: true,
					loggedIn: true,
				});
			}
		});
	}
	render() {
		if (!this.state.loaded) {
			return <ActivityIndicator size="large" color="red" />;
		}
		return (
			<>
				<StatusBar animated style="auto" />
				<NavigationContainer>
					{this.state.loggedIn ? (
						<BottomTab.Navigator>
							<BottomTab.Screen
								name="transaction"
								component={BookTransactionScreen}
								options={{
									tabBarIcon: () => (
										<Image
											source={require("./assets/book.png")}
											style={{
												width: 40,
												height: 40,
											}}
										/>
									),
									tabBarLabel: () => null,
								}}
							/>
							<BottomTab.Screen
								name="search"
								component={BookSearchScreen}
								options={{
									tabBarIcon: () => (
										<Image
											source={require("./assets/searchingbook.png")}
											style={{
												width: 40,
												height: 40,
											}}
										/>
									),
									tabBarLabel: () => null,
								}}
							/>
						</BottomTab.Navigator>
					) : (
						<Stack.Navigator initialRouteName="Auth" mode="modal">
							<Stack.Screen
								options={{
									headerShown: false,
								}}
								name="Auth"
								component={Login}
							/>
						</Stack.Navigator>
					)}
				</NavigationContainer>
			</>
		);
	}
}
