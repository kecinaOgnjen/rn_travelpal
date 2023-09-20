import React, { useEffect, useState } from 'react';
import { View, FlatList, ActivityIndicator, Text, StyleSheet, TouchableOpacity, TextInput, Keyboard } from 'react-native';
import FontAwesomeIcon from 'react-native-vector-icons/FontAwesome'
import DestinationCard from '../../components/DestinationCard/DestinationCard';
import { destinationsAxios } from '../../api/api';
import Icon from "react-native-vector-icons/FontAwesome";

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

    const handleSearch = (query) => {
        setSearchQuery(query);
        const filtered = destinationsItems.filter(dest => dest.title.toLowerCase().includes(query.toLowerCase()));
        setFilteredDestinations(filtered);
    }

    const clearSearch = () => {
        setSearchVisible(false);
        setSearchQuery('');
        setFilteredDestinations([]);
        Keyboard.dismiss();
    }

    const noDataMessage =
        searchQuery && filteredDestinations.length === 0
            ? <Text style={styles.noDataText}>Nema podataka za "{searchQuery}"</Text>
            : null;

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
                {searchVisible ? (
                    <View style={styles.searchContainer}>
                        <TextInput
                            style={styles.searchContainerInput}
                            value={searchQuery}
                            onChangeText={(text) => handleSearch(text)}
                            autoFocus
                            placeholder="Pretraga..."
                        />
                        <TouchableOpacity onPress={clearSearch}>
                            <Icon name="close" size={20} color="#666" />
                        </TouchableOpacity>
                    </View>
                ) : (
                    <TouchableOpacity onPress={() => setSearchVisible(true)}>
                        <Icon name="search" size={20} color="#fff" />
                    </TouchableOpacity>
                )}
            </View>

            {noDataMessage}

            <FlatList
                data={searchQuery ? filteredDestinations : destinationsItems}
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
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#fff',
        padding: 8,
        borderRadius: 4
    },
    searchContainerInput: {
        color: '#000'
    },
    noDataText: {
        marginVertical: 20,
        textAlign: 'center'
    }
});

export default DestinationsScreen;