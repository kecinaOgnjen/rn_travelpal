import React, { useEffect, useState } from 'react';
import { View, FlatList, ActivityIndicator, Text, StyleSheet, TouchableOpacity, TextInput, Keyboard } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import DestinationCard from '../../components/DestinationCard/DestinationCard';
import { destinationsAxios } from '../../api/api';

const DestinationsScreen = ({ navigation }) => {
    const [destinationsItems, setDestinationsItems] = useState([]);
    const [filteredDestinations, setFilteredDestinations] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchVisible, setSearchVisible] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');

    const handleDestinationPress = (destination) => {
        navigation.navigate('DestinationDetailScreen', { destination });
    };

    useEffect(() => {
        const fetchDestinations = async () => {
            try {
                const response = await destinationsAxios.get('/getDestinations');

                if(response.data.isSuccess) {
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

    if(loading) {
        return (
            <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
                <ActivityIndicator size="large" color="#0000ff"/>
            </View>
        );
    }

    return (
        <View style={styles.container}>

            <View style={styles.header}>
                <Text style={styles.title}>Destinacije</Text>
            </View>
            <FlatList
                data={destinationsItems}
                keyExtractor={(item) => item.title}
                renderItem={({ item }) => (
                    <DestinationCard
                        destination={item}
                        onPress={handleDestinationPress}
                    />
                )}
            />

        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#000'
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingVertical: 10,
        paddingHorizontal: 16
    },
    title: {
        fontSize: 20,
        fontWeight: 'bold',
        color: '#fff'
    }
});

export default DestinationsScreen;
