import {createStackNavigator} from "@react-navigation/stack";
import {useColorScheme, View} from "react-native";
import {NavigationContainer} from "@react-navigation/native";
import Constants from 'expo-constants';
import {StatusBar} from "expo-status-bar";

import {navigationRef} from "../utils/RootNavigator";
import {LOGIN} from "../utils/consts/consts";
import LoginScreen from "../screens/LoginScreen";

const Stack = createStackNavigator();

const statusBarHeight = Constants.statusBarHeight;
export default function homeStack(){
    const colorScheme = useColorScheme();
    return (
        <View style={{
            flex: 1,
            paddingTop: statusBarHeight,
            backgroundColor: colorScheme === 'light' ? '#fff' : '#000'
        }}>
            <StatusBar hidden={false}/>
            <View style={{flex: 1}}>
                {/*<AppLoader ref={loaderRef} color={"white"}/>*/}
                {/*<DialogFancyAlerts ref={showRefDialog}/>*/}
                {/*<MessageFancyAlerts ref={showRefMessage}/>*/}
                <NavigationContainer ref={navigationRef}>
                    <Stack.Navigator initalRouteName={LOGIN}>
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