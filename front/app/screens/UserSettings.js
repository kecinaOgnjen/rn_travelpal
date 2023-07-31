import React, { useState } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';

const UserSettings = () => {
    // Stanje za čuvanje trenutnih vrednosti korisničkog imena, imena i prezimena, emaila, broja telefona i lozinke
    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const [phoneNumber, setPhoneNumber] = useState('');
    const [password, setPassword] = useState('');
    const [isPasswordVisible, setIsPasswordVisible] = useState(false); // Dodali smo stanje za praćenje vidljivosti lozinke


    // Funkcija za čuvanje promena
    const handleSaveChanges = () => {
        // Ovde možete implementirati logiku za čuvanje promena na serveru ili bazi podataka
        // Na primer, možete poslati PUT zahtev ka API-ju sa novim vrednostima koje su unete u input poljima
        // Nakon što se promene sačuvaju, možete prikazati odgovarajuću poruku korisniku
    };

    return (
        <View style={styles.container}>
            {/* Naslov Podesavanja */}
            <Text style={styles.title}>Podešavanja</Text>

            {/* Input polje za izmenu korisničkog imena */}
            <TextInput
                style={styles.input}
                placeholder="Korisničko ime"
                placeholderTextColor="#000"
                value={username}
                onChangeText={(text) => setUsername(text)}
            />

            {/* Input polje za izmenu emaila */}
            <TextInput
                style={styles.input}
                placeholder="Email"
                placeholderTextColor="#000"
                value={email}
                onChangeText={(text) => setEmail(text)}
            />

            {/* Input polje za izmenu broja telefona */}
            <TextInput
                style={styles.input}
                placeholder="Broj telefona"
                placeholderTextColor="#000"
                value={phoneNumber}
                onChangeText={(text) => setPhoneNumber(text)}
            />

            {/* Input polje za izmenu lozinke */}
            <View style={styles.passwordInputContainer}>
                <TextInput
                    style={styles.passwordInput}
                    placeholder="Lozinka"
                    placeholderTextColor="#000"
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
                        color="#000"
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
        padding: 20,
        backgroundColor: '#fff', // Promenili smo pozadinu stranice u belu boju
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 20,
        color: '#000', // Promenili smo boju naslova u crnu boju
    },
    input: {
        borderWidth: 1,
        borderColor: '#000', // Promenili smo boju okvira input polja u crnu boju
        borderRadius: 5,
        padding: 10,
        marginBottom: 10,
        color: '#000', // Promenili smo boju teksta unutar input polja u crnu boju
        backgroundColor: '#fff', // Dodali smo belu pozadinu input polja
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
    passwordInputContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        borderWidth: 1,
        borderColor: '#000',
        borderRadius: 5,
        padding: 10,
        marginBottom: 10,
        backgroundColor: '#fff',
    },
    passwordInput: {
        flex: 1,
        color: '#000',
    },
    eyeIcon: {
        padding: 10,
    },
});

export default UserSettings;