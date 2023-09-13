import React, {useState, useEffect, useRef, useContext} from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image, FlatList, Dimensions, Modal } from 'react-native';
import { useRoute } from '@react-navigation/native';
import Icon from 'react-native-vector-icons/FontAwesome';
import useCustomWindowDimensions from "../utils/main";
import {AuthContext} from "../authContext/authContext";
import {destinationsAxios} from "../api/api"; //

const { width: windowWidth } = Dimensions.get('window');

const ModalContent = ({ onClose, onConfirm }) => (
    <View style={styles.modal}>
        <Text style={styles.modalText}>Da li ste sigurni da želite da se odjavite?</Text>
        <View style={styles.modalButtonsContainer}>
            <TouchableOpacity style={[styles.modalButton, styles.modalButtonConfirm]} onPress={onConfirm}>
                <Text style={styles.modalButtonText}>Da</Text>
            </TouchableOpacity>
            <TouchableOpacity style={[styles.modalButton, styles.modalButtonCancel]} onPress={onClose}>
                <Text style={styles.modalButtonText}>Ne</Text>
            </TouchableOpacity>
        </View>
    </View>
);

const HomeScreen = ({ navigation }) => {
    const route = useRoute();

    const [isLogoutModalVisible, setIsLogoutModalVisible] = useState(false);
    const { width: customWindowWidth } = useCustomWindowDimensions();
    const [destinations, setDestinations] = useState([]);

    const { logout } = useContext(AuthContext);

    const handleLogout = () => {
        setIsLogoutModalVisible(true);
    };

    const closeModal = () => {
        setIsLogoutModalVisible(false);
    };

    const confirmLogout = () => {
        logout();
        closeModal();
        navigation.navigate('LoginScreen');
    };

    const handleSettings = () => {
        navigation.navigate('UserSettings');
    };

    const handleDestination = () => {
        navigation.navigate('DestinationsScreen');
    };

    const handleHome = () => {
        navigation.navigate('HomeScreen');
    };

    const images = [require('../assets/1.jpeg'), require('../assets/2.jpeg'),  require('../assets/3.jpeg')];
    const flatListRef = useRef(null);
    const imageSliderIntervalRef = useRef(null);

    useEffect(() => {
        fetchDestinations();
        startImageSlider();

        return () => {
            clearInterval(imageSliderIntervalRef.current);
        };
    }, []);

    const fetchDestinations = async () => {
        try {
            const response = await destinationsAxios.get('/getDestinations');

            if (response.data.isSuccess) {
                setDestinations(response.data.destinations);
            } else {
                console.log('Došlo je do greške pri dobavljanju destinacija');
            }
        } catch (error) {
            console.error('Greška prilikom dohvaćanja destinacija', error);
        }
    };

    const imageWidth = windowWidth - 40;
    const imageHeight = imageWidth * (9 / 16);

    const startImageSlider = () => {
        let currentIndex = 0;
        imageSliderIntervalRef.current = setInterval(() => {
            const nextIndex = currentIndex === images.length - 1 ? 0 : currentIndex + 1;

            if (nextIndex < destinations.length) {
                flatListRef.current?.scrollToIndex({ index: nextIndex, animated: true });
            }

            currentIndex = nextIndex;
        }, 3000);
    };

    const renderSliderItem = ({ item }) => (
        <TouchableOpacity onPress={() => navigation.navigate('DestinationDetailScreen', { destination: item })}>
            <View style={styles.slide} >
                <Image source={{ uri: item.cover_image }} style={[styles.image, { width: imageWidth, height: imageHeight  }]} resizeMode="cover" />
                <Text style={styles.destinationName}>{item.title}</Text>
            </View>
        </TouchableOpacity>
    );

    const renderLogoutModal = () => (
        <Modal
            animationType="fade"
            transparent
            visible={isLogoutModalVisible}
            onRequestClose={closeModal}
        >
            <TouchableOpacity style={styles.modalBackdrop} onPress={closeModal} activeOpacity={1}>
                <View style={styles.modalContainerWrapper}>
                    <ModalContent onClose={closeModal} onConfirm={confirmLogout} />
                </View>
            </TouchableOpacity>
        </Modal>
    );

    return (
        <View style={styles.container}>
                <View style={styles.headerContainer}>
                    <View style={styles.settingsButtonContainer}>
                        <TouchableOpacity style={styles.settingsButtonContainer} onPress={handleSettings}>
                        {/*<Icon name="user" size={24} color="#fff" />*/}
                            <Image
                                source={require('../assets/user-solid.png')}
                                style={styles.userIconHome}
                            />
                        </TouchableOpacity>
                    </View>
                    <View style={styles.logoContainer}>
                        <Image source={require('../assets/logo.png')} style={styles.logo} />
                    </View>
                    <View style={styles.logoutButtonContainer}>
                        <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
                            {/*<Icon name="sign-out" size={24} color="#fff" />*/}
                            <Image
                                source={require('../assets/sign-out.png')}
                                style={styles.userIconHome}
                            />
                        </TouchableOpacity>
                    </View>
                </View>
            <View style={styles.sliderContainer}>
                <FlatList
                    ref={flatListRef}
                    data={destinations}
                    renderItem={renderSliderItem}
                    keyExtractor={(item, index) => index.toString()}
                    horizontal
                    pagingEnabled
                    showsHorizontalScrollIndicator={false}
                    contentContainerStyle={{ alignItems: 'center' }}
                />
            </View>
            <View style={styles.navigationContainer}>
                <View style={styles.navIconContainer}>
                    <TouchableOpacity style={styles.navIcon}  onPress={handleHome}>
                        {/*<Icon name="home" size={24} color="#fff" onPress={handleHome}/>*/}
                        <Image
                            source={require('../assets/home.png')} // Replace with the correct path to your PNG image
                            style={styles.userIconHome}

                        />
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.navIcon} onPress={handleDestination}>
                        {/*<Icon name="search" size={24} color="#fff" onPress={handleDestination}/>*/}
                        <Image
                            source={require('../assets/search.png')} // Replace with the correct path to your PNG image
                            style={styles.userIconHome}

                        />
                    </TouchableOpacity>
                </View>
            </View>

            {renderLogoutModal()}
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#000',
    },
    headerContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        width: '100%',
        marginVertical: 10,
    },
    settingsButtonContainer: {
        marginHorizontal: 10,
    },
    settingsButton: {
        padding: 10,
        borderRadius: 4,
    },
    logoutButtonContainer: {
        marginHorizontal: 10,
    },
    logoutButton: {
        padding: 10,
        borderRadius: 4,
    },
    logoContainer: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
    },
    destinationName: {
        fontSize: 14,
        fontWeight: 'bold',
        marginTop: 10,
        color: '#fff',
        textAlign: 'center',
        flexWrap: 'wrap',
        lineHeight: 24,
    },
    destinationDescription: {
        fontSize: 16,
        color: '#fff',
    },
    logo: {
        width: 50,
        height: 50,
    },
    sliderContainer: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        height: 350,
    },
    slide: {
        marginHorizontal: 20,
    },
    image: {
        width: '100%',
        aspectRatio: 16 / 9,
    },
    navigationContainer: {
        position: 'absolute',
        bottom: 20,
    },
    navIconContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-evenly',
        width: '100%',
    },
    navIcon: {
        paddingHorizontal: 20,
    },
    modalBackdrop: {
        flex: 1,
        backgroundColor: 'rgba(0, 0, 0, 0.7)',
        justifyContent: 'center',
        alignItems: 'center',
    },
    modalContainerWrapper: {
        padding: 20,
        backgroundColor: '#fff',
        borderRadius: 8,
    },
    modalText: {
        fontSize: 18,
        marginBottom: 20,
        textAlign: 'center',
    },
    modalButtonsContainer: {
        flexDirection: 'row',
        justifyContent: 'center',
    },
    modalButton: {
        paddingVertical: 10,
        paddingHorizontal: 20,
        marginHorizontal: 10,
        borderRadius: 4,
    },
    modalButtonConfirm: {
        backgroundColor: '#2196f3',
    },
    modalButtonCancel: {
        backgroundColor: '#ff3333',
    },
    modalButtonText: {
        color: '#fff',
        fontSize: 16,
    },
    userIconHome: {
        resizeMode: 'contain',
        width: 20,
        height: 20,
    }
});

export default HomeScreen;
