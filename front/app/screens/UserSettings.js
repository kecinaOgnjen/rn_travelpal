import React, {useContext, useEffect, useState} from 'react';
import {View, Text, StyleSheet, TextInput, TouchableOpacity, Alert} from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import {AuthContext} from "../authContext/authContext";
import axiosInstance, {userSettingsAxios} from "../api/api";
import {HOME, LOGIN} from "../utils/consts/consts";
import * as navigation from "../utils/RootNavigator";

const UserSettings = () => {
    // Stanje za čuvanje trenutnih vrednosti korisničkog imena, imena i prezimena, emaila, broja telefona i lozinke
    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const [phoneNumber, setPhoneNumber] = useState('');
    const [password, setPassword] = useState('');
    const [isPasswordVisible, setIsPasswordVisible] = useState(false); // Dodali smo stanje za praćenje vidljivosti lozinke

    const {token, userId} = useContext(AuthContext);

    const handleSaveChanges = async () => {
        try {
            const response = await userSettingsAxios.post('/changeUserInfo', {
                // id: userId,
                username: username,
                email: email,
                phone: phoneNumber,
                password: password,
            });

            if (response.data.isSuccess) {
                Alert.alert("Uspjeh", "Promjene su uspješno sačuvane!", [{
                    text: "OK",
                    onPress: () => navigation.navigate(HOME)
                }]);
            } else if (response.data.message === "ID nije dostavljen") {
                Alert.alert("Greška", "ID nije dostavljen.", [{text: "OK"}]);
            } else if (response.data.message === "Korisnik sa datim ID-om nije pronađen") {
                Alert.alert("Greška", "Korisnik sa datim ID-om nije pronađen.", [{text: "OK"}]);
            } else {
                Alert.alert("Greška", "Došlo je do greške prilikom čuvanja promjena.", [{
                    text: "OK", onPress: () => {
                    }
                }]);
            }
        } catch (error) {
            console.log(error);
        }
    };

    useEffect(() => {
        const fetchUserInfo = async () => {
            try {
                const response = await userSettingsAxios.post('/getUserInfo', {
                    id: userId,
                });
                if (response.data.isSuccess) {
                    const userInfo = response.data.userInfo;
                    setUsername(userInfo.username);
                    setEmail(userInfo.email);
                    setPhoneNumber(userInfo.phone);
                    setPassword(userInfo.password);
                }
            } catch (error) {
                console.log(error);
            }
        };

        fetchUserInfo();
    }, []);

    return (
        <View style={styles.container}>
            {/* Naslov Podesavanja */}
            <Text style={styles.title}>Podešavanja</Text>

            {/* Input polje za izmenu korisničkog imena */}
            <TextInput
                style={styles.input}
                placeholder="Korisničko ime"
                placeholderTextColor="#fff"
                value={username}
                onChangeText={(text) => setUsername(text)}
            />

            {/* Input polje za izmenu emaila */}
            <TextInput
                style={styles.input}
                placeholder="Email"
                placeholderTextColor="#fff"
                value={email}
                onChangeText={(text) => setEmail(text)}
            />

            {/* Input polje za izmenu broja telefona */}
            <TextInput
                style={styles.input}
                placeholder="Broj telefona"
                placeholderTextColor="#fff"
                value={phoneNumber}
                onChangeText={(text) => setPhoneNumber(text)}
            />

            {/* Input polje za izmenu lozinke */}
            <View style={styles.passwordInputContainer}>
                <TextInput
                    style={styles.passwordInput}
                    placeholder="Lozinka"
                    placeholderTextColor="#fff"
                    secureTextEntry={!isPasswordVisible} // Da sakrije/sačuva unos lozinke u zavisnosti od stanja
                    value={password}
                    onChangeText={(text) => setPassword(text)}
                />
                {/* Dodali smo ikonicu oka koja menja stanje vidljivosti lozinke kada se pritisne */}
                <TouchableOpacity
                    style={styles.eyeIcon}
                    onPress={() => setIsPasswordVisible((prevState) => !prevState)}
                >
                    <Icon
                        name={isPasswordVisible ? 'eye' : 'eye-slash'}
                        size={20}
                        color="#fff"
                    />
                </TouchableOpacity>
            </View>

            {/* Dugme za čuvanje promena */}
            <TouchableOpacity style={styles.saveButton} onPress={handleSaveChanges}>
                <Text style={styles.saveButtonText}>Sačuvaj</Text>
            </TouchableOpacity>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#000',
        justifyContent: 'center',
        padding: 20,
    },
    title: {
        color: '#fff',
        fontSize: 24,
        fontWeight: 'bold',
        textAlign: 'center',
        marginVertical: 20,
    },
    input: {
        borderWidth: 1,
        borderColor: '#fff',
        borderRadius: 5,
        padding: 10,
        marginBottom: 10,
        color: '#fff',
    },
    passwordInputContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        borderWidth: 1,
        borderColor: '#fff',
        borderRadius: 5,
        padding: 10,
        marginBottom: 10,
        color: '#fff',
    },
    passwordInput: {
        flex: 1,
        color: '#fff',
    },
    eyeIcon: {
        padding: 10,
    },
    saveButton: {
        backgroundColor: '#007BFF',
        padding: 15,
        borderRadius: 5,
        alignItems: 'center',
        marginTop: 20,
    },
    saveButtonText: {
        color: '#fff',
        fontSize: 16,
    },
});

export default UserSettings;
