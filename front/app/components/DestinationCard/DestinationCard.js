import React from 'react';
import { View, Text, Image, TouchableOpacity, StyleSheet } from 'react-native';

const DestinationCard = ({ destination, onPress }) => {
    return (
        <TouchableOpacity style={styles.cardContainer} onPress={() => onPress(destination)}>
            {/*<Image source={{ uri: destination.image }} style={styles.image} />*/}
            <View style={styles.content}>
                <Text style={styles.title}>{destination.title}</Text>
                <Text style={styles.description}>{destination.description}</Text>
                <Text style={styles.location}>{destination.location}</Text>
            </View>
        </TouchableOpacity>
    );
};

const styles = StyleSheet.create({
    cardContainer: {
        flexDirection: 'row',
        padding: 16,
        borderBottomWidth: 1,
        borderBottomColor: '#ccc',
    },
    image: {
        width: 80,
        height: 80,
        borderRadius: 4,
    },
    content: {
        marginLeft: 16,
        flex: 1,
    },
    title: {
        fontSize: 18,
        fontWeight: 'bold',
    },
    description: {
        marginTop: 4,
        color: '#666',
    },
    location: {
        marginTop: 4,
        color: '#999',
    },
});

export default DestinationCard;
