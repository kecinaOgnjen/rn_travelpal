import {View, useColorScheme} from "react-native";
import {NavigationContainer} from "@react-navigation/native";
import {createStackNavigator, TransitionPresets} from "@react-navigation/stack";

import Constants from 'expo-constants';
import {StatusBar} from "expo-status-bar";

import {LOGIN, SPLASHSCREEN} from "../utils/consts/consts";
import {navigationRef} from "../utils/RootNavigator";

import LoginScreen from "../screens/LoginScreen";
import SplashScreen from "../screens/SplashScreen";

const Stack = createStackNavigator();

const statusBarHeight = Constants.statusBarHeight;

export default function homeStack(){
    const colorScheme = useColorScheme();

    return (
        <View style={{ flex: 1,
            paddingTop: statusBarHeight,
            backgroundColor: colorScheme === 'light' ? '#fff' : '#000'}}>
            <StatusBar
                hidden={false}
            />
            <View style={{flex: 1}}>
                <NavigationContainer ref={navigationRef}>
                    <Stack.Navigator
                        screenOptions={{
                            ...TransitionPresets.SlideFromRightIOS,
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
                    </Stack.Navigator>
                </NavigationContainer>
            </View>
        </View>
    );
}