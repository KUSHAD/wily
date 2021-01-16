import { FontAwesome5, Ionicons } from "@expo/vector-icons";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { NavigationContainer } from "@react-navigation/native";
import React from "react";
import { BookSearchScreen, BookTransactionScreen } from "./Screens";
const BottomTab = createBottomTabNavigator();
export default function App() {
	return (
		<NavigationContainer>
			<BottomTab.Navigator>
				<BottomTab.Screen
					name="search"
					component={BookSearchScreen}
					options={{
						tabBarIcon: () => <Ionicons name="search" size={24} color="grey" />,
						tabBarLabel: () => null,
					}}
				/>
				<BottomTab.Screen
					name="transaction"
					component={BookTransactionScreen}
					options={{
						tabBarIcon: () => (
							<FontAwesome5 name="hand-holding" size={24} color="grey" />
						),
						tabBarLabel: () => null,
					}}
				/>
			</BottomTab.Navigator>
		</NavigationContainer>
	);
}
