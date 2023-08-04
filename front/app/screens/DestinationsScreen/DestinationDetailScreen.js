import React from 'react';
import { View, Text, Image, StyleSheet, TextInput, TouchableOpacity, ScrollView } from 'react-native';

const DestinationDetailScreen = ({ route }) => {
    const { destination } = route.params;

    return (
        <ScrollView contentContainerStyle={styles.container}>
            <Image source={{ uri: destination.image }} style={styles.image} />
            <Text style={styles.title}>{destination.title}</Text>
            <Text style={styles.description}>{destination.long_description}</Text>
            <Text style={styles.location}>{destination.price}</Text>

            {/* Blue section with Reservation and Contact */}
            <View style={styles.blueSection}>
                <Text style={styles.blueSectionText}>Rezervacija mjesta</Text>
                <Text style={styles.blueSectionTextContact}>Kontaktirajte nas</Text>
            </View>

            {/* Non-blue section */}
            <View style={styles.nonBlueSection}>
                {/* Form */}
                <TextInput
                    style={styles.input}
                    placeholder="Vaše ime (obavezno)"
                />
                <TextInput
                    style={styles.input}
                    placeholder="Vaš Email (obavezno)"
                    keyboardType="email-address"
                />
                <TextInput
                    style={styles.input}
                    placeholder="Broj telefona"
                    keyboardType="phone-pad"
                />
                <TextInput
                    style={[styles.input, { height: 100 }]}
                    placeholder="Detalji o vašem putovanju (broj polaznika, specijalni zahtjevi)"
                    multiline
                />
            </View>

            {/* Button section */}
            <TouchableOpacity style={styles.button}>
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
    // Blue section styles
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
    blueSectionTextContact:{
        color: '#FF9',
        fontSize: 15,
        marginBottom: 5,
    },
    // Non-blue section styles
    nonBlueSection: {
        marginTop: 16,
    },
    input: {
        backgroundColor: 'white',
        padding: 10,
        marginBottom: 8,
        borderRadius: 4,
    },
    // Button section styles
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
