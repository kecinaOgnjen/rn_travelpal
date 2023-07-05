import {SafeAreaView, Text, View} from "react-native";

export default function LoginScreen({}) {
    return (
        <SafeAreaView  style={{
            backgroundColor:"#000",
            flex: 1
        }}>
            <View style={styles.container}>
                <View style={styles.registerForm}>
                    <Text>hello</Text>
                </View>
            </View>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#000",
    },
    registerForm: {
        flex: 1,
        margin: 20,
        marginTop: 30,
    },
});