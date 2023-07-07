import {View, Text, SafeAreaView, StyleSheet, Image, ActivityIndicator, TouchableOpacity} from "react-native";
import {Fumi} from "react-native-textinput-effects";
import FontAwesomeIcon from 'react-native-vector-icons/FontAwesome';
import {useRef, useState} from "react";

export default function LoginScreen() {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");

    const [loginLoading, setLoginLoading] = useState(false);
    const refPassword = useRef();

    return (
        <SafeAreaView
            style={{
                backgroundColor: "#000",
                flex: 1
            }}
        >
            <View style={styles.container}>
               <View style={styles.registerForm}>
                   <View style={styles.imageView}>
                       <Image
                           style={styles.logo}
                           source={require("../assets/logo.png")}
                       />
                   </View>
                   <View style={styles.inputFieldsForm}>
                       <Fumi
                           style={[
                               styles.fumiStyle,
                               {borderColor: "#fff"}
                           ]}
                           keyboardType='numeric'
                           label="Username"
                           iconClass={FontAwesomeIcon}
                           labelStyle={{color: '#fff'}}
                           inputStyle={{color: '#fff'}}
                           iconName={'user'}
                           iconColor={'#fff'}
                           iconSize={20}
                           iconWidth={40}
                           returnKeyType="next"
                           onChangeText={(username) => setUsername(username)}
                           onSubmitEditing={() => {
                               refPassword.current.focus()
                           }}
                       />
                       <Fumi
                           ref={refPassword}
                           style={[
                               styles.fumiStyle,
                               {borderColor: "#fff"}
                           ]}
                           label={"Password"}
                           iconClass={FontAwesomeIcon}
                           labelStyle={{color: '#fff'}}
                           inputStyle={{color: '#fff'}}
                           iconName={'lock'}
                           iconColor={'#fff'}
                           iconSize={20}
                           iconWidth={40}
                           secureTextEntry={true}
                           onChangeText={(password) => setPassword(password)}
                           passiveIconColor={'#adadad'}
                       />
                       <TouchableOpacity
                           style={[
                               styles.btnNext,
                               {
                                   backgroundColor: "#2196f3",
                               },
                           ]}
                           disabled={loginLoading}
                           // onPress={async () => await login()}
                       >
                           {
                               loginLoading ?
                                   <ActivityIndicator size="small" color="white"/>
                                   :
                                   <Text style={styles.textNext}>{"Login"}</Text>
                           }
                       </TouchableOpacity>
                   </View>
                   <View style={{
                       flex: 1,
                       alignItems: "center",
                       justifyContent: "flex-end"
                   }}>
                       <Text
                           style={{color: "#fff"}}
                           selectable={true}
                       >
                           {/*{expoToken}*/}
                       </Text>
                   </View>
               </View>
            </View>
        </SafeAreaView>
    )
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#000",
    },
    logo: {
        resizeMode: "contain",
        width: "100%",
        height: "100%"
    },
    fumiStyle: {
        backgroundColor: "#000",
        borderRadius: 5,
        borderColor: "#fff",
        borderWidth: 1,
        padding: 0,
        marginBottom: 15,
    },
    signInText: {
        textAlign: "center",
        fontSize: 23,
    },
    registerForm: {
        flex: 1,
        margin: 20,
        marginTop: 30,
    },
    imageView: {
        alignItems: "center",
        height: '10%',
        marginTop: "5%",
        marginBottom: "10%"
    },
    switchView: {
        flexDirection: "row",
        alignItems: "center",
    },
    isCloudText: {
        marginRight: 20,
        fontSize: 15,
        fontWeight: "bold",
    },
    inputFieldsForm: {},
    inputField: {
        backgroundColor: "#000",
        color: "#fff",
        padding: 10,
        borderRadius: 5,
        borderColor: "#fff",
        borderWidth: 2,
        marginBottom: 15,
    },
    btnNext: {
        padding: 13,
        borderRadius: 3,
        alignItems: "center",
        backgroundColor: "#2196f3",
        marginTop: 15,
    },
    textNext: {
        color: "white",
    },
});