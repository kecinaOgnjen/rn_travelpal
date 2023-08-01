import React, {useState, useRef, useContext} from 'react';
import {
    View,
    Text,
    SafeAreaView,
    StyleSheet,
    Image,
    ActivityIndicator,
    TouchableOpacity, Alert,
} from 'react-native';
import { Fumi } from 'react-native-textinput-effects';
import FontAwesomeIcon from 'react-native-vector-icons/FontAwesome';
import { useNavigation } from '@react-navigation/native'; // Importujemo hook za navigaciju
import axiosInstance from '../api/api';
import { navigateCloseCurrent } from '../utils/RootNavigator';
import {HOME, LOGIN} from '../utils/consts/consts';
import {showAlert} from "../utils/main";
import {AuthContext} from "../authContext/authContext";

const LoginScreen = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');

    const [token, setToken] = useState(null);
    const [userId, setUserId] = useState(null);

    const [loginLoading, setLoginLoading] = useState(false);
    const refPassword = useRef();
    const navigation = useNavigation(); // Koristimo hook za navigaciju

    const { handleLogin } = useContext(AuthContext);

    const login = async () => {
        if (username === '' && password === '') {
            showAlert(
                'Morate unijeti korisničko ime i lozinku',
                () => null,
                'warning',
                '#ff0000'
            );
            return;
        }

        if (username === '') {
            showAlert('Morate unijeti korisničko ime', () => null, 'warning', '#ff0000');
            return;
        }

        if (password === '') {
            showAlert('Morate unijeti lozinku', () => null, 'warning', '#ff0000');
            return;
        }

        setLoginLoading(true);

        try {
            const response = await axiosInstance.post('/login', {
                username: username,
                password: password,
            });

            if (response.data.isSuccess === true) {
                const { idToken, userId } = response.data;
                handleLogin(idToken, userId);
                navigateCloseCurrent(HOME, { token, userId });
            } else if (response.data.message === "Username is not valid") {
                Alert.alert("Greška", "Korisničko ime ne postoji.", [{ text: "OK", onPress: () => {
                        setUsername('');
                    }}]);
            }else if (response.data.message === "Password is not valid") {
                Alert.alert("Greška", "Lozinka nije ispravna.", [{ text: "OK", onPress: () => {
                        setPassword('');
                    }}]);
            }
        } catch (error) {
            console.log(error);
        } finally {
            setLoginLoading(false);
        }
    };

    return (
        <SafeAreaView style={{ backgroundColor: '#000', flex: 1 }}>
            <View style={styles.container}>
                <View style={styles.registerForm}>
                    <View style={styles.imageView}>
                        <Image
                            style={styles.logo}
                            source={require('../assets/logo.png')}
                        />
                    </View>
                    <View style={styles.inputFieldsForm}>
                        <Fumi
                            style={[
                                styles.fumiStyle,
                                { borderColor: '#fff' },
                            ]}
                            keyboardType="default"
                            label="Username"
                            value={username}
                            iconClass={FontAwesomeIcon}
                            labelStyle={{ color: '#fff' }}
                            inputStyle={{ color: '#fff' }}
                            iconName={'user'}
                            iconColor={'#fff'}
                            iconSize={20}
                            iconWidth={40}
                            returnKeyType="next"
                            onChangeText={(username) => setUsername(username)}
                            onSubmitEditing={() => {
                                refPassword.current.focus();
                            }}
                        />
                        <Fumi
                            ref={refPassword}
                            style={[
                                styles.fumiStyle,
                                { borderColor: '#fff' },
                            ]}
                            label="Password"
                            value={password}
                            iconClass={FontAwesomeIcon}
                            labelStyle={{ color: '#fff' }}
                            inputStyle={{ color: '#fff' }}
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
                                    backgroundColor: '#2196f3',
                                },
                            ]}
                            disabled={loginLoading}
                            onPress={() => login()}
                        >
                            {loginLoading ? (
                                <ActivityIndicator size="small" color="white" />
                            ) : (
                                <Text style={styles.textNext}>Login</Text>
                            )}
                        </TouchableOpacity>
                    </View>
                    <View
                        style={{
                            flex: 1,
                            alignItems: 'center',
                            justifyContent: 'flex-end',
                        }}
                    >
                        <Text style={{ color: '#fff' }} selectable={true}>
                            {/*{expoToken}*/}
                        </Text>
                    </View>
                    <TouchableOpacity
                        style={[
                            styles.btnRegister, // Ovde koristimo novi stil za dugme
                            { backgroundColor: '#f39c12' },
                        ]}
                        onPress={() => navigation.navigate('RegisterScreen')} // Navigacija ka stranici Register
                    >
                        <Text style={styles.textRegister}>Registracija</Text>
                    </TouchableOpacity>
                </View>
            </View>
        </SafeAreaView>
    );
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
    btnRegister: {
        padding: 13,
        borderRadius: 3,
        alignItems: 'center',
        marginTop: 15,
        backgroundColor: '#3498db', // Plava nijansa (ili bilo koja druga boja po vašem izboru)
    },
    textRegister: {
        color: '#fff', // Bijela boja teksta na dugmetu za registraciju
        fontSize: 16,
        fontWeight: 'bold',
    },
});

export default LoginScreen;
