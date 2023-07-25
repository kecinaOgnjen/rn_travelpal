import { useWindowDimensions } from 'react-native';
import {StyleSheet} from 'react-native';

export default function useCustomWindowDimensions() {
    return useWindowDimensions();
}
export const mainStyles = StyleSheet.create({
    container: {
        flex: 1,
        flexDirection: "column",
        backgroundColor: "rgba(0,0,0,0.85)",
        alignItems: "center",
        justifyContent: "center",
    },
    insideContainer: {
        width: "95%",
        height: "95%",
        justifyContent: 'center',
    },
    flatList: {
        borderRadius: 10,
        backgroundColor: "rgba(0,0,0,0.3)",
    },
    rowContainer: {
        flexDirection: "row",
        borderRadius: 8,
        backgroundColor: "#fff",
        minHeight: 100,
        marginBottom: 10
    },
    cashAmountText: {
        textAlign: "center",
        color: "#fff",
        fontSize: 16,
        fontWeight: "bold"
    },
    cashText: {
        textAlign: "center",
        color: "#fff",
        fontSize: 13,
    },
    rowContainerPackages: {
        borderRadius: 10,
        backgroundColor: "#000",
        height: 70,
        flexDirection: 'row',
        alignItems: "center",
        justifyContent: "flex-start",
        marginBottom: 10
    },
    cellImage: {
        flex: 1,
        resizeMode: "contain",
    },
    cellVerticalDivider: {
        width: "2.5%",
    },
    cellTextContent: {
        width: "68%",
        paddingRight: 5,
        paddingVertical: 5,
        color: '#fff',
        lineHeight: 22,
        fontSize: 17
    },
    cellTrackingNumber: {
        minWidth: "64%",
        paddingHorizontal: 10,
        color: '#fff',
        fontSize: 20
    },
    cellChecked: {
        borderRadius: 10,
        height: "90%",
        minWidth: "15%",
        justifyContent: "center",
        backgroundColor: "#fdb813",
    },
    cellEmpty: {
        backgroundColor: "#00a934",
        color: "#fff",
        height: "90%",
        minWidth: "15%",
        textAlign: "center",
        textAlignVertical: "center",
        fontSize: 20,
    },
    textChecked: {
        color: "#000",
        fontSize: 20,
        textAlign: "center",
        textAlignVertical: "center"
    },
    inputView: {
        flexDirection: "row",
        backgroundColor: "#fff",
        borderRadius: 10,
        height: 40,
        alignItems: "center",
        justifyContent: "center"
    },
    searchTextInput: {
        height: 40,
        color: "#fff",
        backgroundColor: "#000",
        marginTop: 5,
        padding: 10,
        borderRadius: 8,
        borderWidth: 2,
        borderColor: "#fff"
    },
    noteInputView: {
        flexDirection: 'row',
        marginBottom: 10,
        backgroundColor: "#ff0000",
        borderRadius: 5,
        alignItems: "center",
        justifyContent: "center",
        minHeight: 50,
    },
    noteTextInput: {
        // backgroundColor: "#0047ff",
        color: '#fff',
        flex: 1,
        padding: 10,
    },
    cellCounter: {
        color: "#fff",
        fontSize: 15,
        paddingLeft: 5,
        width: "16%",
    },
    cellVerticalDividerLine: {
        marginHorizontal: 5,
        width: 1,
        height: "90%",
        backgroundColor: "#fdb813",
    },
    button: {
        width: "100%",
        minHeight: 40,
        borderRadius: 10,
        padding: 5,
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: "#fdb813",
    },
    buttonText: {
        color: "#000000",
        fontWeight: "bold",
        textAlign: "center",
    },
    touchableOpacityRow: {
        height: "100%",
        flexDirection: 'row',
        alignItems: "center",
        justifyContent: "flex-start",
    },
    btnSuggestions: {
        padding: 13,
        borderRadius: 5,
        alignItems: "center",
        backgroundColor: "#2196f3",
        marginTop: 15,
    },
    btnSuggestionsText: {
        color: "white",
    },
    headerRightSideSearchComponent: {
        width: '20%',
        alignItems: "flex-end",
        justifyContent: "center",
    },
    errorLabelStyle: {
        width: "100%",
        // backgroundColor: "#ff0000",
        color: '#ffffff',
        padding: 10,
        fontSize: 15,
        textAlign: "center",
    },
});

export const navigationTouchableOpacity = (text, icon, link, linkType = 'nav', params = [], type = 'fa', size = 25, color = '#fff', width = '20%', alignItems = 'center', justifyContent = 'center') => {
    return (
        <View style={{
            width: width,
        }}>
            <TouchableOpacity
                style={{
                    alignItems: alignItems,
                    justifyContent: justifyContent,
                }}
                onPress={() => navigationTouchableOpacityOnPress(link, linkType, params)}
            >
                {iconImage(icon, type, size, color)}
                {
                    text !== null ?
                        <Text
                            style={{
                                textAlign: "center",
                                marginTop: 5,
                                color: '#fff',
                                fontSize: 12,
                            }}
                        >
                            {text}
                        </Text>
                        :
                        null
                }

            </TouchableOpacity>
        </View>
    );
}
