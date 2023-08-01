import React, {useContext, useEffect, useState} from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import {AuthContext} from "../authContext/authContext";
import axiosInstance, {userSettingsAxios} from "../api/api";

const UserSettings = () => {
    // Stanje za čuvanje trenutnih vrednosti korisničkog imena, imena i prezimena, emaila, broja telefona i lozinke
    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const [phoneNumber, setPhoneNumber] = useState('');
    const [password, setPassword] = useState('');
    const [isPasswordVisible, setIsPasswordVisible] = useState(false); // Dodali smo stanje za praćenje vidljivosti lozinke

    const { token, userId } = useContext(AuthContext);

    // Funkcija za čuvanje promena
    const handleSaveChanges = () => {
        // Ovde možete implementirati logiku za čuvanje promena na serveru ili bazi podataka
        // Na primer, možete poslati PUT zahtev ka API-ju sa novim vrednostima koje su unete u input poljima
        // Nakon što se promene sačuvaju, možete prikazati odgovarajuću poruku korisniku
    };

    useEffect(() => {
        console.log(token, userId)
        // Definišemo async funkciju unutar useEffect-a kako bismo mogli da koristimo "await"
        const fetchUserInfo = async () => {
            try {
                // Pravimo zahtjev ka /getUserInfo endpointu sa userId kao parametrom
                const response = await userSettingsAxios.post('/getUserInfo', {
                    id: userId,
                });

                // Ako zahtjev bude uspješan, postavljamo odgovarajuće stanje sa podacima koje smo dobili
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
    },
    passwordInput: {
        flex: 1,
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
