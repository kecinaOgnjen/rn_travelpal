import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, SafeAreaView } from 'react-native';

const RegisterScreen = () => {
    const [fullName, setFullName] = useState('');
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [email, setEmail] = useState('');
    const [phoneNumber, setPhoneNumber] = useState('');

    const [errors, setErrors] = useState({
        fullNameError: '',
        usernameError: '',
        passwordError: '',
        emailError: '',
        phoneNumberError: '',
    });

    const validateFields = () => {
        let isValid = true;

        // Validacija za ime i prezime
        if (fullName.trim() === '') {
            setErrors((prevState) => ({ ...prevState, fullNameError: 'Polje je obavezno' }));
            isValid = false;
        } else {
            setErrors((prevState) => ({ ...prevState, fullNameError: '' }));
        }

        // Validacija za korisničko ime
        if (username.trim() === '') {
            setErrors((prevState) => ({ ...prevState, usernameError: 'Polje je obavezno' }));
            isValid = false;
        } else {
            setErrors((prevState) => ({ ...prevState, usernameError: '' }));
        }

        // Validacija za lozinku
        if (password.trim() === '') {
            setErrors((prevState) => ({ ...prevState, passwordError: 'Polje je obavezno' }));
            isValid = false;
        } else {
            setErrors((prevState) => ({ ...prevState, passwordError: '' }));
        }

        // Validacija za email
        if (email.trim() === '') {
            setErrors((prevState) => ({ ...prevState, emailError: 'Polje je obavezno' }));
            isValid = false;
        } else {
            setErrors((prevState) => ({ ...prevState, emailError: '' }));
        }

        // Validacija za broj telefona
        if (phoneNumber.trim() === '') {
            setErrors((prevState) => ({ ...prevState, phoneNumberError: 'Polje je obavezno' }));
            isValid = false;
        } else {
            setErrors((prevState) => ({ ...prevState, phoneNumberError: '' }));
        }

        return isValid;
    };

    const handleRegister = () => {
        if (validateFields()) {
            // Ovdje pozivamo API za registraciju ili obavljamo dalju logiku za registraciju korisnika
            // Ako su svi podaci ispravno uneseni, nastavite sa procesom registracije
        }
    };

    return (
        <SafeAreaView style={styles.container}>
            <Text style={styles.title}>Registracija</Text>

            <View style={styles.registerForm}>
                {/* Input polja za ime i prezime, korisničko ime, lozinku, email i broj telefona */}
                <TextInput
                    style={[styles.inputField, errors.fullNameError && styles.errorInput, { marginBottom: errors.fullNameError ? 7 : 15 }]}
                    placeholder="Ime i prezime"
                    placeholderTextColor="#fff"
                    value={fullName}
                    onChangeText={setFullName}
                />
                {errors.fullNameError ? <Text style={styles.errorText}>{errors.fullNameError}</Text> : null}

                <TextInput
                    style={[styles.inputField, errors.usernameError && styles.errorInput, { marginBottom: errors.usernameError ? 7 : 15 }]}
                    placeholder="Korisničko ime"
                    placeholderTextColor="#fff"
                    value={username}
                    onChangeText={setUsername}
                />
                {errors.usernameError ? <Text style={styles.errorText}>{errors.usernameError}</Text> : null}

                <TextInput
                    style={[styles.inputField, errors.passwordError && styles.errorInput, { marginBottom: errors.passwordError ? 7 : 15 }]}
                    placeholder="Lozinka"
                    placeholderTextColor="#fff"
                    secureTextEntry
                    value={password}
                    onChangeText={setPassword}
                />
                {errors.passwordError ? <Text style={styles.errorText}>{errors.passwordError}</Text> : null}

                <TextInput
                    style={[styles.inputField, errors.emailError && styles.errorInput, { marginBottom: errors.emailError ? 7 : 15 }]}
                    placeholder="Email"
                    placeholderTextColor="#fff"
                    value={email}
                    onChangeText={setEmail}
                />
                {errors.emailError ? <Text style={styles.errorText}>{errors.emailError}</Text> : null}

                <TextInput
                    style={[styles.inputField, errors.phoneNumberError && styles.errorInput, { marginBottom: errors.phoneNumberError ? 7 : 15 }]}
                    placeholder="Broj telefona"
                    placeholderTextColor="#fff"
                    value={phoneNumber}
                    onChangeText={setPhoneNumber}
                />
                {errors.phoneNumberError ? <Text style={styles.errorText}>{errors.phoneNumberError}</Text> : null}

                {/* Dugme za napravi nalog */}
                <TouchableOpacity style={styles.btnRegister} onPress={handleRegister}>
                    <Text style={styles.textRegister}>Napravi nalog</Text>
                </TouchableOpacity>
            </View>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#000',
    },
    title: {
        color: '#fff',
        fontSize: 24,
        fontWeight: 'bold',
        textAlign: 'center',
        marginVertical: 20,
    },
    registerForm: {
        flex: 1,
        marginHorizontal: 20,
    },
    inputField: {
        backgroundColor: '#000',
        color: '#fff',
        padding: 10,
        borderRadius: 5,
        borderColor: '#fff',
        borderWidth: 2,
    },
    errorInput: {
        borderColor: 'red',
    },
    errorText: {
        color: 'red',
        marginBottom: 5,
    },
    btnRegister: {
        padding: 13,
        borderRadius: 3,
        alignItems: 'center',
        backgroundColor: '#3498db', // Plava nijansa (ili bilo koja druga boja po vašem izboru)
        marginTop: 15,
    },
    textRegister: {
        color: '#fff',
        fontSize: 16,
        fontWeight: 'bold',
    },
});

export default RegisterScreen;
