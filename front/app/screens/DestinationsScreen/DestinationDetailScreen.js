import React from 'react';
import { View, Text, Image, StyleSheet } from 'react-native';

const DestinationDetailScreen = ({ route }) => {
    const { destination } = route.params;

    return (
        <View style={styles.container}>
            <Image source={{ uri: destination.image }} style={styles.image} />
            <Text style={styles.title}>{destination.title}</Text>
            <Text style={styles.description}>{destination.long_description}</Text>
            <Text style={styles.location}>{destination.price}</Text>
        </View>
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
        fontSize: 14,
        color: '#999',
    },
});

export default DestinationDetailScreen;
