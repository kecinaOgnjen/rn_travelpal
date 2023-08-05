import React, { useState, useRef } from 'react';
import {View, Text, StyleSheet, TouchableOpacity, TextInput, ScrollView, Image, Alert} from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import {experiencesAxios} from "../../api/api";

const TravelDiaryScreen = () => {
    const [experiences, setExperiences] = useState([]);
    const [newExperience, setNewExperience] = useState({ image: null, description: '', rating: 0, location: '' });
    const fileInputRef = useRef(null);

    const handleImagePick = async () => {
        const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();

        if (status !== 'granted') {
            alert('Potrebne su dozvole za pristup galeriji slika.');
            return;
        }

        const result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            allowsEditing: true,
            aspect: [4, 3],
            quality: 1,
        });

        if (!result.cancelled) {
            setNewExperience({ ...newExperience, image: result.uri });
        }
    };

    const sendExperienceToBackend = async () => {
        try {
            // Provjeravamo da li su svi podaci ispravno popunjeni prije slanja na backend
            if (!newExperience.description || newExperience.rating <= 0 || newExperience.rating > 10 || !newExperience.location || !newExperience.image) {
                alert('Popunite sva polja i dodajte sliku prije slanja.');
                return;
            }

            const response = await experiencesAxios.post('/addExperience', newExperience);

            if (response.data.isSuccess) {
                // Ukoliko je iskustvo uspješno dodato na backend, osvježavamo listu iskustava
                setExperiences([...experiences, newExperience]);
                setNewExperience({image: null, description: '', rating: 0, location: ''});

                // Prikazujemo Alert sa porukom o uspjehu
                Alert.alert('Uspjeh', 'Iskustvo je uspješno dodato!', [
                    {
                        text: 'OK',
                        onPress: () => {
                            // Možete ovdje dodati daljnje radnje nakon uspješnog dodavanja iskustva
                        },
                    },
                ]);
            } else {
                // Prikazujemo Alert sa porukom o grešci
                Alert.alert('Greška', 'Došlo je do greške prilikom dodavanja iskustva.', [
                    {
                        text: 'OK',
                        onPress: () => {
                            // Možete ovdje dodati daljnje radnje u slučaju greške
                        },
                    },
                ]);
            }
        } catch (error) {
            console.error('Greška prilikom slanja podataka:', error);
            Alert.alert('Greška', 'Došlo je do greške prilikom slanja podataka na server.', [
                {
                    text: 'OK',
                    onPress: () => {
                        // Možete ovdje dodati daljnje radnje u slučaju greške
                    },
                },
            ]);
        }
    };

    return (
        <View style={styles.container}>
            <Text style={styles.header}>Putnički dnevnik</Text>

            <ScrollView style={styles.experiencesContainer}>
                {experiences.map((experience, index) => (
                    <View key={index} style={styles.experienceCard}>
                        {experience.image && <Image source={{ uri: experience.image }} style={styles.experienceImage} />}
                        <Text style={styles.experienceDescription}>{experience.description}</Text>
                        <Text style={styles.experienceRating}>Ocjena: {experience.rating}</Text>
                        <Text style={styles.experienceLocation}>Lokacija: {experience.location}</Text>
                    </View>
                ))}
            </ScrollView>

            <View style={styles.newExperienceContainer}>
                <TextInput
                    placeholder="Opis iskustva"
                    style={styles.input}
                    value={newExperience.description}
                    onChangeText={(text) => setNewExperience({ ...newExperience, description: text })}
                />
                <TextInput
                    placeholder="Ocjena (1-10)"
                    style={styles.input}
                    value={newExperience.rating.toString()}
                    keyboardType="numeric"
                    onChangeText={(text) => {
                        const rating = parseInt(text) || 0;
                        setNewExperience({ ...newExperience, rating });
                    }}
                />
                <TextInput
                    placeholder="Lokacija"
                    style={styles.input}
                    value={newExperience.location}
                    onChangeText={(text) => setNewExperience({ ...newExperience, location: text })}
                />
                <TouchableOpacity onPress={handleImagePick}>
                    <Text>Dodaj fotografiju</Text>
                </TouchableOpacity>

                <TouchableOpacity style={styles.addButton} onPress={sendExperienceToBackend}>
                    <Text style={styles.addButtonLabel} >Dodaj iskustvo</Text>
                </TouchableOpacity>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 20,
        backgroundColor: '#fff',
    },
    header: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 20,
    },
    experiencesContainer: {
        flex: 1,
    },
    experienceCard: {
        marginBottom: 20,
        padding: 10,
        borderRadius: 8,
        borderColor: '#ccc',
        borderWidth: 1,
    },
    experienceImage: {
        width: '100%',
        height: 200,
        borderRadius: 8,
        marginBottom: 10,
    },
    experienceDescription: {
        fontSize: 16,
        marginBottom: 5,
    },
    experienceRating: {
        fontSize: 14,
        marginBottom: 5,
    },
    experienceLocation: {
        fontSize: 14,
    },
    newExperienceContainer: {
        marginTop: 20,
        borderTopWidth: 1,
        borderColor: '#ccc',
        paddingTop: 20,
    },
    input: {
        height: 40,
        borderColor: '#ccc',
        borderWidth: 1,
        borderRadius: 4,
        paddingHorizontal: 10,
        marginBottom: 10,
    },
    addButton: {
        backgroundColor: 'blue',
        padding: 10,
        borderRadius: 4,
        alignItems: 'center',
    },
    addButtonLabel: {
        color: '#fff',
        fontSize: 16,
        fontWeight: 'bold',
    },
});

export default TravelDiaryScreen;
