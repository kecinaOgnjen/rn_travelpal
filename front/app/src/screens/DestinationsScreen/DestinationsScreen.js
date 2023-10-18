import React, {useEffect, useRef, useState} from 'react';
import {
    View,
    FlatList,
    ActivityIndicator,
    Text,
    StyleSheet,
    TouchableOpacity,
    TextInput,
    Keyboard,
    Animated, Dimensions,
    Switch
} from 'react-native';
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

    const [filterVisible, setFilterVisible] = useState(false);
    const filterWidth = 0.5 * Dimensions.get('window').width;
    const filterAnimation = useRef(new Animated.Value(0)).current;

    const [krfSwitch, setKrfSwitch] = useState(false);
    const [bukurestSwitch, setBukurestSwitch] = useState(false);
    const [firencaSwitch, setFirencaSwitch] = useState(false);
    const [sicilijaSwitch, setSicilijaSwitch] = useState(false);
    const [pragSwitch, setPragSwitch] = useState(false);
    const [izmirSwitch, setIzmirSwitch] = useState(false);

    const filterContainerStyle = {
        ...styles.filterContainer,
        transform: [
            {
                translateX: filterAnimation.interpolate({
                    inputRange: [0, 1],
                    outputRange: [-filterWidth, 0],
                }),
            },
        ],
    };

    const filterIconStyle = {
        transform: [{ rotate: filterAnimation.interpolate({
                inputRange: [0, 1],
                outputRange: ['0deg', '360deg'],
            })}],
    };

    const handleDestinationPress = (destination) => {
        navigation.navigate('DestinationDetailScreen', { destination });
    };

    const toggleFilter = () => {
        setFilterVisible(!filterVisible);
        Animated.timing(filterAnimation, {
            toValue: filterVisible ? 0 : 1,
            duration: 300,
            useNativeDriver: true,
        }).start();
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

    const fetchSingleDestination = async (city) => {
        try {
            // console.log('Pokušavam dohvatiti destinaciju za grad:', city);
            const response = await destinationsAxios.get(`/getSingleDestination?city=${city}`);
            // console.log('Odgovor sa servera:', response);

            if (response.data.isSuccess) {
                const singleDestination = response.data.destination;
                // console.log(singleDestination)
                setDestinationsItems(singleDestination)
                // setDestinationsItems(prevDestinations => {
                //     return prevDestinations.map(dest => {
                //         if (dest.city === city) {
                //             return singleDestination;
                //         }
                //         return dest;
                //     });
                // });
            } else {
                console.error('Neuspeli API poziv');
            }
        } catch (error) {
            console.error('Greška pri dohvatanju pojedinačne destinacije:', error);
        }
        console.log(destinationsItems)
    };

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
                    <View style={styles.searchAndFilterContainer}>
                        <TouchableOpacity onPress={toggleFilter} style={styles.filterIcon}>
                            <Animated.View style={filterIconStyle}>
                                <Icon name="filter" size={20} color="#fff" />
                            </Animated.View>
                        </TouchableOpacity>
                        <TouchableOpacity onPress={() => setSearchVisible(true)}>
                            <Icon name="search" size={20} color="#fff" />
                        </TouchableOpacity>
                    </View>
                )}
            </View>

            {noDataMessage}

            <FlatList
                data={searchQuery ? filteredDestinations : destinationsItems}
                keyExtractor={(item) => item.id.toString()} // Postavite odgovarajući ključ ovdje
                renderItem={({ item }) => (
                    <DestinationCard
                        destination={item}
                        onPress={handleDestinationPress}
                    />
                )}
            />
            <Animated.View style={filterContainerStyle}>
                <Text style={styles.filterTitle}>Izaberite filtere</Text>
                <Text style={styles.cityTitle}>Gradovi</Text>
                <View style={styles.switchContainer}>
                    <Text style={styles.switchLabel}>Krf</Text>
                    <Switch
                        value={krfSwitch}
                        onValueChange={(value) => {
                            setKrfSwitch(value);
                            if (value) {
                                fetchSingleDestination('Krf');
                            }
                        }}
                    />
                </View>
                <View style={styles.switchContainer}>
                    <Text style={styles.switchLabel}>Izmir</Text>
                    <Switch
                        value={izmirSwitch}
                        onValueChange={(value) => {
                            setIzmirSwitch(value);
                            if (value) {
                                fetchSingleDestination('Izmir');
                            }
                        }}
                    />
                </View>
                <View style={styles.switchContainer}>
                    <Text style={styles.switchLabel}>Bukurest</Text>
                    <Switch
                        value={bukurestSwitch}
                        onValueChange={(value) => {
                            setBukurestSwitch(value);
                            if (value) {
                                fetchSingleDestination('Bukurest');
                            }
                        }}
                    />
                </View>
                <View style={styles.switchContainer}>
                    <Text style={styles.switchLabel}>Firenca</Text>
                    <Switch
                        value={firencaSwitch}
                        onValueChange={(value) => {
                            setFirencaSwitch(value);
                            if (value) {
                                fetchSingleDestination('Firenca');
                            }
                        }}
                    />
                </View>
                <View style={styles.switchContainer}>
                    <Text style={styles.switchLabel}>Sicilija</Text>
                    <Switch
                        value={sicilijaSwitch}
                        onValueChange={(value) => {
                            setSicilijaSwitch(value);
                            if (value) {
                                fetchSingleDestination('Sicilija');
                            }
                        }}
                    />
                </View>
                <View style={styles.switchContainer}>
                    <Text style={styles.switchLabel}>Prag</Text>
                    <Switch
                        value={pragSwitch}
                        onValueChange={(value) => {
                            setPragSwitch(value);
                            if (value) {
                                fetchSingleDestination('Prag');
                            }
                        }}
                    />
                </View>
            </Animated.View>


        </View>
    );
};

const styles = StyleSheet.create({
    switchContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginVertical: 5,
        paddingHorizontal:'10%'
    },
    switchLabel: {
        flex: 1,
        fontSize: 16,
    },
    filterTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        textAlign: 'center',
        marginBottom: 10,
        paddingTop: '10%'
    },
    cityTitle: {
        fontSize: 16,
        fontWeight: 'bold',
        marginTop: 10,
        paddingHorizontal:'5%'
    },
    container: {
        flex: 1,
        backgroundColor: '#000'
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingVertical: 25,
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
        borderRadius: 4,
        width: '60%'
    },
    searchContainerInput: {
        color: '#000',
        width: '90%'
    },
    searchAndFilterContainer:{
        paddingLeft: '60%',
        display: "flex",
        flexDirection: 'row',
    },
    filterIcon: {
      paddingRight: '20%'
    },
    filterContainer: {
        position: 'absolute',
        top: 0,
        left: 0,
        bottom: 0,
        backgroundColor: '#fff',
        width: '50%',
        borderRightWidth: 1,
        borderColor: '#ccc',
        overflow: 'hidden',
    },
    noDataText: {
        marginVertical: 20,
        textAlign: 'center',
        color: '#fff'
    }
});

export default DestinationsScreen;