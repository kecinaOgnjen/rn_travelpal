import React from "react";
import { View, useColorScheme, StatusBar } from "react-native";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import { navigationRef } from "../utils/RootNavigator";

import {
    DESTINATIONDETAILSCREEN,
    DESTINATIONSCREEN,
    HOME,
    LOGIN,
    REGISTERSCREEN,
    USERSETTINGS
} from "../utils/consts/consts";

import LoginScreen from "../screens/AuthScreens/LoginScreen";
import HomeScreen from "../screens/HomeScreen";
import UserSettings from "../screens/UserSettings/UserSettings";
import RegisterScreen from "../screens/AuthScreens/RegisterScreen";
import { AuthProvider } from "../authContext/authContext";
import DestinationsScreen from "../screens/DestinationsScreen/DestinationsScreen";
import DestinationDetailScreen from "../screens/DestinationsScreen/DestinationDetailScreen";

const Stack = createStackNavigator();

export default function HomeStack() {
    const colorScheme = useColorScheme();

    return (
        <View style={{ flex: 1 }}>
            <StatusBar hidden={false} />
            <AuthProvider>
            <NavigationContainer ref={navigationRef}>
                <Stack.Navigator
                    screenOptions={{
                        headerShown: false
                    }}
                    initialRouteName={LOGIN}
                >
                    <Stack.Screen name={LOGIN} component={LoginScreen} />
                    <Stack.Screen name={HOME} component={HomeScreen} />
                    <Stack.Screen name={USERSETTINGS} component={UserSettings} />
                    <Stack.Screen name={REGISTERSCREEN} component={RegisterScreen} />
                    <Stack.Screen name={DESTINATIONSCREEN} component={DestinationsScreen}/>
                    <Stack.Screen name={DESTINATIONDETAILSCREEN} component={DestinationDetailScreen}/>
                </Stack.Navigator>
            </NavigationContainer>
            </AuthProvider>
        </View>
    );
}
