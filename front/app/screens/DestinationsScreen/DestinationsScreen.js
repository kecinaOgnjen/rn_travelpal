import React, { useEffect, useState } from 'react';
import { View, FlatList, ActivityIndicator, Text, StyleSheet } from 'react-native';
import DestinationCard from '../../components/DestinationCard/DestinationCard';
import {destinations, destinationsAxios} from '../../api/api';

const DestinationsScreen = ({ navigation }) => {
    const [destinationsItems, setDestinationsItems] = useState([]);
    const [loading, setLoading] = useState(true);

    const handleDestinationPress = (destination) => {
        // Navigirajte na detaljni ekran destinacije s odabranim podacima
        navigation.navigate('DestinationDetailScreen', { destination });
    };

    useEffect(() => {
        const fetchDestinations = async () => {
            try {
                const response = await destinationsAxios.get('/getDestinations');

                if (response.data.isSuccess) {
                    setDestinationsItems(response.data.destinations);
                }

                setLoading(false);
            } catch (error) {
                console.log('Error fetching destinations:', error);
                setLoading(false);
            }
        };

        fetchDestinations();
    }, []);

    if (loading) {
        return (
            <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                <ActivityIndicator size="large" color="#0000ff" />
            </View>
        );
    }

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Destinacije</Text>
            <FlatList
                data={destinationsItems}
                keyExtractor={(item) => item.title}
                renderItem={({ item }) => (
                    <DestinationCard destination={item} onPress={handleDestinationPress} />
                )}
            />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#000', // Crni pozadinski background
    },
    title: {
        fontSize: 20,
        fontWeight: 'bold',
        color: '#fff', // Bijele slova za naslov
        textAlign: 'center',
        paddingVertical: 10,
    },
});

export default DestinationsScreen;
