import React from 'react'
import {
    View,
    StyleSheet,
    Dimensions,
    ImageBackground,
    Text,
    TouchableOpacity, SafeAreaView
} from "react-native"
import {navigate} from "../../utils/RootNavigator";
import {CAROUSEL_ITEM_VIDEO_WEB_VIEW, CAROUSEL_ITEM_WEB_VIEW} from "../../utils/consts/consts";

export const SLIDER_WIDTH = Dimensions.get('window').width
export const ITEM_WIDTH = Math.round(SLIDER_WIDTH * 0.85)


const CarouselCardItem = ({item, index}) => {

    function openButtonAction(item) {
        if (item.type === "Slika" && item.url != null) {
            openUrl(item.url);
            return;
        }
        if (item.type === 'Obuka') {
            navigate(CAROUSEL_ITEM_VIDEO_WEB_VIEW, {
                id: item.id,
                name: item.name,
                url: item.url
            })
            return;
        }

        navigate(CAROUSEL_ITEM_WEB_VIEW, {
            id: item.id,
            html: item.html,
            name: item.name,
            type: item.type,
            available_dates: item.available_dates,
            dates: item.dates
        })

    }

    const openButtonComponent = () => {
        if (item.type === "Slika" && item.url == null) {
            return null;
        }

        if (item.type === "Slika" && item.url != null) {
        }

        return (
            <View style={styles.btnOpenContainer}>
                <TouchableOpacity
                    style={styles.btnOpen}
                    activeOpacity={0.7}
                    onPress={() => openButtonAction(item)}
                >
                    <Text style={styles.textOpen}>{t("carousel.cardItem.open")}</Text>
                </TouchableOpacity>
            </View>
        );
    }

    return (
        <SafeAreaView
            style={{
                backgroundColor:"#000",
                flex: 1
            }}
        >
            <View style={styles.container} key={index}>
                <View style={styles.imageContainer}>
                    <ImageBackground
                        source={{uri: item.imgUrl}}
                        resizeMode="contain"
                        style={styles.imageSize}
                        imageStyle={styles.image}>
                    </ImageBackground>
                </View>
                {openButtonComponent()}
            </View>
        </SafeAreaView>

    )
}
const styles = StyleSheet.create({
    container: {
        position: 'relative',
        backgroundColor: 'white',
        borderRadius: 8,
        width: ITEM_WIDTH,
        flex: 1,
        // paddingBottom: 40,
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 3,
        },
        shadowOpacity: 0.29,
        shadowRadius: 4.65,
        elevation: 7,
        justifyContent: "center"
    },
    imageContainer: {
        borderRadius: 8,
        overflow: 'hidden',
    },
    imageSize: {
        width: '100%',
        height: '100%'
    },
    image: {
        overflow: 'hidden',
    },
    btnOpenContainer: {
        width: '100%',
        bottom: 0,
        position: 'absolute',
        alignItems: 'center',
        justifyContent: 'flex-end',
        marginBottom: 5
    },
    btnOpen: {
        width: '50%',
        padding: 10,
        borderRadius: 5,
        alignItems: "center",
        backgroundColor: "#2196f3",
    },
    textOpen: {
        color: "#fff",
        fontSize: 13,
        fontWeight: 'bold'
    },
})

export default CarouselCardItem