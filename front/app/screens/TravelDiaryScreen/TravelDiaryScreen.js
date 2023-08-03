import React, { useState, useRef  } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, TextInput, ScrollView, Image } from 'react-native';

const TravelDiaryScreen = () => {
    const fileInputRef = useRef(null);
    const [experiences, setExperiences] = useState([]);
    const [newExperience, setNewExperience] = useState({ image: null, description: '', rating: 0, location: '' });

    const addExperience = () => {
        setExperiences([...experiences, newExperience]);
        setNewExperience({ image: null, description: '', rating: 0, location: '' });
    };

    const handleImagePick = (file) => {
        const toBase64 = file => new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.readAsDataURL(file);
            reader.onload = () => resolve(reader.result);
            reader.onerror = error => reject(error);
        });

        toBase64(file).then(base64String => {
            setNewExperience({...newExperience, image: base64String})
        });
    }

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
                <TouchableOpacity
                    onPress={() => fileInputRef.current.click()}
                >
                    <Text>Dodaj fotografiju</Text>
                </TouchableOpacity>

                <TextInput
                    ref={fileInputRef}
                    style={{ display: 'none' }}
                    type="file"
                    onChange={(event) => handleImagePick(event.target.files[0])}
                />
                <TouchableOpacity style={styles.addButton} onPress={addExperience}>
                    <Text style={styles.addButtonLabel}>Dodaj iskustvo</Text>
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