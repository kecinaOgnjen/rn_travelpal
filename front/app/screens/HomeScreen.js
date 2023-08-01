import React, {useState, useEffect, useRef, useContext} from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image, FlatList, Dimensions, Modal } from 'react-native';
import { useRoute } from '@react-navigation/native';
import Icon from 'react-native-vector-icons/FontAwesome';
import useCustomWindowDimensions from "../utils/main";
import { useNavigation } from '@react-navigation/native';
import {AuthContext} from "../authContext/authContext"; // Importujemo hook za navigaciju

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

    const { logout } = useContext(AuthContext);

    const handleLogout = () => {
        setIsLogoutModalVisible(true);
    };

    const closeModal = () => {
        setIsLogoutModalVisible(false);
    };

    // Funkcija za potvrdu odjavljivanja
    const confirmLogout = () => {
        logout();
        closeModal();
        navigation.navigate('LoginScreen');
    };


    const handleSettings = () => {
        navigation.navigate('UserSettings');
    };

    const handleDiary = () => {
        navigation.navigate('TravelDiaryScreen');
    };

    const images = [require('../assets/1.jpeg'), require('../assets/2.jpeg'),  require('../assets/3.jpeg')];
    const flatListRef = useRef(null);
    const imageSliderIntervalRef = useRef(null);

    useEffect(() => {
        startImageSlider();

        return () => {
            clearInterval(imageSliderIntervalRef.current);
        };
    }, []);

    // Dobijanje pravilne širine ekrana
    const imageWidth = windowWidth - 40; // Širina slike će biti širina ekrana sa oduzetih 40px zbog margina
    const imageHeight = imageWidth * (9 / 16); // Visina će biti odnos širine i visine 16:9

    const startImageSlider = () => {
        let currentIndex = 0;
        imageSliderIntervalRef.current = setInterval(() => {
            const nextIndex = currentIndex === images.length - 1 ? 0 : currentIndex + 1;
            flatListRef.current?.scrollToIndex({ index: nextIndex, animated: true });
            currentIndex = nextIndex;
        }, 3000);
    };

    // Funkcija za prikazivanje pojedinačne slike u slideru
    const renderSliderItem = ({ item }) => (
        <View style={styles.slide}>
            <Image source={item} style={[styles.image, { width: imageWidth, height: imageHeight }]} resizeMode="contain" />
        </View>
    );

    // Funkcija za prikazivanje modala za odjavljivanje
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
                {/* Podesavanja, Logo i Prijavljivanje/Odjavljivanje */}
                <View style={styles.headerContainer}>
                    <View style={styles.settingsButtonContainer}>
                        <TouchableOpacity style={styles.settingsButtonContainer} onPress={handleSettings}>
                        <Icon name="user" size={24} color="#fff" />
                        </TouchableOpacity>
                    </View>
                    <View style={styles.logoContainer}>
                        <Image source={require('../assets/logo.png')} style={styles.logo} />
                    </View>
                    <View style={styles.logoutButtonContainer}>
                        <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
                            <Icon name="sign-out" size={24} color="#fff" />
                        </TouchableOpacity>
                    </View>
                </View>

            {/* Slider sa slikama */}
            <View style={styles.sliderContainer}>
                <FlatList
                    ref={flatListRef}
                    data={images}
                    renderItem={renderSliderItem}
                    keyExtractor={(item, index) => index.toString()}
                    horizontal
                    pagingEnabled
                    showsHorizontalScrollIndicator={false}
                    contentContainerStyle={{ alignItems: 'center' }}
                />
            </View>

            {/* Navigacija sa 5 stranica */}
            <View style={styles.navigationContainer}>
                <View style={styles.navIconContainer}>
                    {/* Dummy ikonice */}
                    <TouchableOpacity style={styles.navIcon}>
                        <Icon name="home" size={24} color="#fff" />
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.navIcon}>
                        <Icon name="search" size={24} color="#fff" />
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.navIcon}>
                        <Icon name="heart" size={24} color="#fff" onPress={handleDiary} />
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.navIcon}>
                        <Icon name="user" size={24} color="#fff" />
                    </TouchableOpacity>
                    {/*//TODO Ovde dodati stranicu Sve destinacije*/}
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
        flex: 1, // Slika logotipa će zauzeti preostali prostor između ikonica za podešavanje i prijavljivanje
        alignItems: 'center',
        justifyContent: 'center',
    },
    logo: {
        width: 50, // Prilagodite veličinu logotipa prema potrebi
        height: 50,
    },
    sliderContainer: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
    },
    slide: {
        marginHorizontal: 20,
    },
    image: {
        width: '100%',
        aspectRatio: 16 / 9, // Postavljamo odnos širine i visine na 16:9
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
    // Stilovi za modal
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
});

export default HomeScreen;
