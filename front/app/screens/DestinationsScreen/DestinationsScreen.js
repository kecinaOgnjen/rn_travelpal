import React, { useEffect, useState } from 'react';
import { View, FlatList, ActivityIndicator, Text, StyleSheet, TouchableOpacity, TextInput, Keyboard } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
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

    const handleSearchIconPress = () => {
        setSearchQuery('');
        setFilteredDestinations([]);
        setSearchVisible(!searchVisible);
    };

    const handleSearch = () => {
        Keyboard.dismiss();

        const filteredDestinations = destinationsItems.filter(
            (destination) =>
                destination.title.toLowerCase().includes(searchQuery.toLowerCase())
        );
        setFilteredDestinations(filteredDestinations);
        console.log({filteredDestinations})
    };

    const handleSearchSubmit = () => {
        if(searchQuery.trim() !== '') {
            handleSearch();
        }
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
                <TouchableOpacity onPress={handleSearchIconPress}>
                    <Ionicons
                        name={searchVisible ? 'close' : 'search'}
                        size={24}
                        color="white"
                    />
                </TouchableOpacity>
            </View>

            {searchVisible && (
                <View style={styles.searchContainer}>
                    <TextInput
                        style={styles.searchInput}
                        placeholder="Pretraži destinacije..."
                        value={searchQuery}
                        onChangeText={(text) => setSearchQuery(text)}
                        onSubmitEditing={handleSearchSubmit}
                    />
                </View>
            )}

            {filteredDestinations.length === 0 &&
                searchQuery.trim() !== '' &&
                !searchVisible &&
                (
                    <View style={styles.noResultsContainer}>
                        <Text style={styles.noResultsText}>
                            Nema rezultata pretrage.
                        </Text>
                    </View>
                )
            }

            <FlatList
                data={filteredDestinations.length > 0 ? filteredDestinations : destinationsItems}
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
    },
    searchContainer: {
        backgroundColor: 'rgba(255, 255, 255, 0.1)',
        paddingHorizontal: 16,
        marginBottom: 10
    },
    searchInput: {
        color: 'white',
        paddingVertical: 10
    },
    noResultsContainer: {
        justifyContent: 'center',
        alignItems: 'center',
        paddingVertical: 10
    },
    noResultsText: {
        fontSize: 18,
        color: 'white'
    }
});

export default DestinationsScreen;