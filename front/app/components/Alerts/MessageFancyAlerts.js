import React from 'react';
import {FancyAlert} from "react-native-expo-fancy-alerts";
import {StyleSheet, Text, TouchableOpacity, View} from "react-native";
import * as Animatable from "react-native-animatable";
import FontAwesome from "react-native-vector-icons/FontAwesome";

export const showRefMessage = React.createRef();

export function showAlert(text,
                          okFunction = () => null,
                          icon = null,
                          iconColor,
                          iconBackgroundColor = null,
                          alertBackgroundColor = null,
                          textColor = null,
                          buttonText = null,
                          buttonColor = null,
                          buttonTextColor = null) {
    let ref = showRefMessage.current
    if (ref) {
        ref.showAlert(text,
            okFunction,
            icon,
            iconColor,
            iconBackgroundColor,
            alertBackgroundColor,
            textColor,
            buttonText,
            buttonColor,
            buttonTextColor)
    }
}

export function hideAlert() {
    let ref = showRefMessage.current
    if (ref) {
        ref.hideAlert()
    }
}

class MessageFancyAlerts extends React.Component {
    constructor(props) {
        super(props)
        this.state = {show: false}
    }

    showAlert(text, okFunction = () => null, icon, iconColor, iconBackgroundColor, alertBackgroundColor, textColor, buttonText, buttonColor, buttonTextColor) {
        this.setState({
            show: true,
            text: text,
            okFunction: okFunction,
            icon: icon,
            iconColor: iconColor,
            iconBackgroundColor: iconBackgroundColor,
            alertBackgroundColor: alertBackgroundColor,
            textColor: textColor,
            buttonText: buttonText,
            buttonColor: buttonColor,
            buttonTextColor: buttonTextColor,
        })
    }

    hideAlert() {
        this.setState({
            show: false,
            loading: false,
            text: null,
            icon: null,
            iconColor: null,
            iconBackgroundColor: null,
            alertBackgroundColor: null,
            textColor: null,
            buttonText: null,
            buttonColor: null,
            buttonTextColor: null,
        })
    }

    render() {
        const messageAlert = () => {
            return (
                <FancyAlert
                    visible={this.state.show}
                    style={{
                        zIndex: 10,
                        backgroundColor: this.state.alertBackgroundColor ?? '#262626'
                    }}
                    icon={
                        <View
                            style={[
                                styles.iconStyle,
                                {backgroundColor: this.state.iconBackgroundColor ?? '#fff'}
                            ]}>
                            <Animatable.View
                                animation="zoomIn"
                            >
                                <FontAwesome
                                    name={this.state.icon ?? 'envelope'}
                                    size={28}
                                    color={this.state.iconColor ?? '#000'}/>
                            </Animatable.View>
                        </View>}
                >
                    <View>
                        <Text style={[
                            styles.textStyle,
                            {color: this.state.textColor ?? "#fff"}
                        ]}>
                            {this.state.text}
                        </Text>
                        <TouchableOpacity
                            onPress={() => {
                                this.state.okFunction();
                                hideAlert();
                            }}>
                            <Text style={[
                                styles.loginBtn,
                                {backgroundColor: this.state.buttonColor ?? "#2196f3"},
                                {color: this.state.buttonTextColor ?? "#fff"}
                            ]}>{this.state.buttonText ?? "OK"}</Text>
                        </TouchableOpacity>
                    </View>
                </FancyAlert>
            );
        }

        return (messageAlert());
    }
}

const styles = StyleSheet.create({
        loginBtn: {
            color: "#000000",
            fontWeight: "bold",
            borderRadius: 10,
            paddingLeft: 50,
            paddingRight: 50,
            paddingTop: 10,
            paddingBottom: 10,
            alignItems: "center",
            textAlign: "center",
            marginTop: 0,
            marginBottom: 20,
            backgroundColor: "#fdb813",
        },
        iconStyle: {
            flex: 1,
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            backgroundColor: '#fdb813',
            borderRadius: 50,
            width: '100%',
        },
        textStyle: {
            marginTop: -16,
            marginBottom: 32,
            textAlign: "center",
            color: "white",
            fontSize: 15
        }
    }
);


export default MessageFancyAlerts;