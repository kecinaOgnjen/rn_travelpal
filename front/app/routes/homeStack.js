import {View, useColorScheme} from "react-native";
import {NavigationContainer} from "@react-navigation/native";
import {createStackNavigator, TransitionPresets} from "@react-navigation/stack";

import Constants from 'expo-constants';
import {StatusBar} from "expo-status-bar";

import {
    DESTINATIONDETAILSCREEN,
    DESTINATIONSCREEN,
    HOME,
    LOGIN,
    REGISTERSCREEN,
    SPLASHSCREEN,
    TRAVELDIARYSCREEN,
    USERSETTINGS
} from "../utils/consts/consts";
import {navigationRef} from "../utils/RootNavigator";

import LoginScreen from "../screens/AuthScreens/LoginScreen";
import SplashScreen from "../screens/SplashScreen";
import HomeScreen from "../screens/HomeScreen";
import UserSettings from "../screens/UserSettings/UserSettings";
import TravelDiaryScreen from "../screens/TravelDiaryScreen/TravelDiaryScreen";
import RegisterScreen from "../screens/AuthScreens/RegisterScreen";
import {AuthProvider} from "../authContext/authContext";
import DestinationsScreen from "../screens/DestinationsScreen/DestinationsScreen";
import DestinationDetailScreen from "../screens/DestinationsScreen/DestinationDetailScreen";

const Stack = createStackNavigator();

const statusBarHeight = Constants.statusBarHeight;

export default function homeStack(){
    const colorScheme = useColorScheme();

    return (
        <View style={{ flex: 1,
            paddingTop: statusBarHeight,
            }}>
            <StatusBar
                hidden={false}
            />
            <View style={{flex: 1}}>
            <AuthProvider>
                <NavigationContainer ref={navigationRef}>
                    <Stack.Navigator
                        screenOptions={{
                            headerShown: false
                        }}
                        initalRouteName={LOGIN}>
                        {/*<Stack.Screen*/}
                        {/*    name={SPLASHSCREEN}*/}
                        {/*    component={SplashScreen}*/}
                        {/*/>*/}
                        <Stack.Screen
                            name={LOGIN}
                            component={LoginScreen}
                        />
                        <Stack.Screen
                            name={HOME}
                            component={HomeScreen}
                        />
                        <Stack.Screen
                            name={USERSETTINGS}
                            component={UserSettings}
                        />
                        <Stack.Screen
                            name={TRAVELDIARYSCREEN}
                            component={TravelDiaryScreen}
                        />
                        <Stack.Screen
                            name={REGISTERSCREEN}
                            component={RegisterScreen}
                        />
                        <Stack.Screen
                            name={DESTINATIONSCREEN}
                            component={DestinationsScreen}
                        />
                        <Stack.Screen
                            name={DESTINATIONDETAILSCREEN}
                            component={DestinationDetailScreen}
                        />
                    </Stack.Navigator>
                </NavigationContainer>
            </AuthProvider>
            </View>
        </View>
    );
}