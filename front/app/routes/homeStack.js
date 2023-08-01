import {View, useColorScheme} from "react-native";
import {NavigationContainer} from "@react-navigation/native";
import {createStackNavigator, TransitionPresets} from "@react-navigation/stack";

import Constants from 'expo-constants';
import {StatusBar} from "expo-status-bar";

import {HOME, LOGIN, REGISTERSCREEN, SPLASHSCREEN, TRAVELDIARYSCREEN, USERSETTINGS} from "../utils/consts/consts";
import {navigationRef} from "../utils/RootNavigator";

import LoginScreen from "../screens/LoginScreen";
import SplashScreen from "../screens/SplashScreen";
import HomeScreen from "../screens/HomeScreen";
import UserSettings from "../screens/UserSettings";
import TravelDiaryScreen from "../screens/TravelDiaryScreen";
import RegisterScreen from "../screens/RegisterScreen";
import {AuthProvider} from "../authContext/authContext";

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
                    </Stack.Navigator>
                </NavigationContainer>
            </AuthProvider>
            </View>
        </View>
    );
}