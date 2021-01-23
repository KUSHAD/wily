import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { NavigationContainer } from "@react-navigation/native";
import React from "react";
import { Image } from "react-native";
import { BookSearchScreen, BookTransactionScreen } from "./Screens";
const BottomTab = createBottomTabNavigator();
export default function App() {
	return (
		<NavigationContainer>
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
		</NavigationContainer>
	);
}
