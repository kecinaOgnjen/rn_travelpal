import React from 'react';
import { View, Text, Image, TouchableOpacity, StyleSheet } from 'react-native';

const DestinationCard = ({ destination, onPress }) => {
    return (
        <TouchableOpacity style={styles.cardContainer} onPress={() => onPress(destination)}>
            <Image source={{ uri: destination.cover_image }} style={styles.image} />
            <View style={styles.content}>
                <Text style={styles.title}>{destination.title}</Text>
            </View>
        </TouchableOpacity>
    );
};

const styles = StyleSheet.create({
    cardContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        padding: 16,
        borderBottomWidth: 1,
        borderBottomColor: '#ccc',
        borderRadius: 8,
        marginBottom: 10,
        backgroundColor: '#fff',
    },
    image: {
        width: 80,
        height: 80,
        borderRadius: 4,
    },
    content: {
        marginLeft: 16,
        flex: 1,
        color: '#000000'
    },
    title: {
        fontSize: 18,
        fontWeight: 'bold',
        textAlign: 'center',
        color: '#000000'
    },
    description: {
        marginTop: 4,
        color: '#666',
        textAlign: 'center',
    },
    location: {
        marginTop: 4,
        color: '#999',
        textAlign: 'center',
    },
});

export default DestinationCard;
