import {Image, SafeAreaView, StyleSheet, View} from "react-native";
import React, {useEffect} from "react";
// import {getValue} from "../utils/Async";
import {navigateCloseCurrent} from "../utils/RootNavigator";
import {HOME, LOGIN} from "../utils/consts/consts";

export default function SplashScreen() {

    // useEffect(() => {
    //     const loadData = async () => {
    //         const token = await getValue("token")
    //         setTimeout(() => {
    //             navigateCloseCurrent(token != null ? HOME : LOGIN)
    //         }, 500);
    //     }
    //     loadData();
    // })


    return (
        <SafeAreaView
            style={{
                backgroundColor:"#000",
                flex: 1
            }}
        >
            <View style={styles.container}>
                <Image
                    style={styles.logo}
                    source={require("../assets/splashscreen.png")}
                />
            </View>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#000",
    },
    logo: {
        resizeMode: "cover",
        width: "100%",
        height: "100%",
    },
});
