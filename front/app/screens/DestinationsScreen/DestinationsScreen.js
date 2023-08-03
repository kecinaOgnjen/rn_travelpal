import React, {useEffect, useState} from 'react';
import {View, FlatList, ActivityIndicator} from 'react-native';
import DestinationCard from "../../components/DestinationCard/DestinationCard";
import {destinations} from "../../api/api";


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
                const response = await destinations.get('/getDestinations');

               if(response.data.isSuccess){
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
        <View>
            <FlatList
                data={destinationsItems}
                keyExtractor={(item) => item.title}
                renderItem={({ item }) => <DestinationCard destination={item} onPress={handleDestinationPress} />}
            />
        </View>
    );
};

export default DestinationsScreen;
