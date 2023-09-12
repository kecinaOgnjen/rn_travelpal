import React, {useState} from 'react';
import {View, Text, Image, StyleSheet, TextInput, TouchableOpacity, ScrollView, Alert} from 'react-native';
import {destinationsAxios} from "../../api/api";
import * as navigation from "../../utils/RootNavigator";
import DestinationsScreen from "./DestinationsScreen";

const DestinationDetailScreen = ({route}) => {
    const {destination} = route.params;

    const [formData, setFormData] = useState({
        ime: '',
        email: '',
        telefon: '',
        detalji: '',
    });

    const sendEmail = async () => {
        const {ime, email, telefon, detalji} = formData;

        try {
            const response = await destinationsAxios.post('/sendEmail', {
                ime,
                email,
                telefon,
                detalji
            }).then(response => {
                if(response.data === 'Email sent successfully'){
                    Alert.alert("Uspjeh", "Uspješno poslat e-mail!", [{ text: "OK", onPress: () => navigation.navigate(DestinationsScreen) }]);

                }
                console.log(response.data);
            })
                .catch(error => {
                    console.error('Error sending email:', error);
                });

        } catch (e) {
            console.log(e)
        }
    };

    return (
        <ScrollView contentContainerStyle={styles.container}>
            <Image source={{uri: destination.image}} style={styles.image}/>
            <Text style={styles.title}>{destination.title}</Text>
            <Text style={styles.description}>{destination.long_description}</Text>
            <Text style={styles.location}>{destination.price}</Text>
            <View style={styles.blueSection}>
                <Text style={styles.blueSectionText}>Rezervacija mjesta</Text>
                <Text style={styles.blueSectionTextContact}>Kontaktirajte nas</Text>
            </View>
            <View style={styles.nonBlueSection}>
                <TextInput
                    style={styles.input}
                    placeholder="Vaše ime (obavezno)"
                    onChangeText={(text) => setFormData({...formData, ime: text})}
                />
                <TextInput
                    style={styles.input}
                    placeholder="Vaš Email (obavezno)"
                    keyboardType="email-address"
                    onChangeText={(text) => setFormData({...formData, email: text})}
                />
                <TextInput
                    style={styles.input}
                    placeholder="Broj telefona"
                    keyboardType="phone-pad"
                    onChangeText={(text) => setFormData({...formData, telefon: text})}
                />
                <TextInput
                    style={[styles.input, {height: 100}]}
                    placeholder="Detalji o vašem putovanju (broj polaznika, specijalni zahtjevi)"
                    multiline
                    onChangeText={(text) => setFormData({...formData, detalji: text})}
                />
            </View>
            <TouchableOpacity style={styles.button} onPress={sendEmail}>
                <Text style={styles.buttonText}>Pošalji</Text>
            </TouchableOpacity>
        </ScrollView>
    );
};


const styles = StyleSheet.create({
    container: {
        padding: 16,
    },
    image: {
        width: '100%',
        height: 200,
        borderRadius: 4,
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        marginTop: 16,
    },
    description: {
        marginTop: 8,
        fontSize: 16,
        color: '#666',
    },
    location: {
        marginTop: 8,
        fontSize: 20,
        color: '#999',
    },
    blueSection: {
        backgroundColor: '#2c65be',
        padding: 16,
        marginTop: 16,
        borderRadius: 4,
        alignItems: 'center'
    },
    blueSectionText: {
        color: 'white',
        fontSize: 18,
        marginBottom: 8,
    },
    blueSectionTextContact: {
        color: '#FF9',
        fontSize: 15,
        marginBottom: 5,
    },
    nonBlueSection: {
        marginTop: 16,
    },
    input: {
        backgroundColor: 'white',
        padding: 10,
        marginBottom: 8,
        borderRadius: 4,
    },
    button: {
        backgroundColor: '#2c65be',
        padding: 16,
        borderRadius: 4,
        alignItems: 'center',
        marginTop: 16,
    },
    buttonText: {
        color: 'white',
        fontSize: 18,
        fontWeight: 'bold',
    },
});

export default DestinationDetailScreen;
