import React, {useEffect} from "react";
import {StackActions, CommonActions} from "@react-navigation/native";
import {BackHandler} from "react-native";

export const navigationRef = React.createRef(null);

export const navigate = (name, params) => {
    if (navigationRef.current) {
        navigationRef.current.navigate(name, params);
    }
};

export const navigateCloseCurrent = (name, params) => {
    if (navigationRef.current) {
        navigationRef.current.dispatch(StackActions.replace(name, params))
    }
};

export const navigateCloseAll = (name, params) => {
    if (navigationRef.current) {
        navigationRef.current.dispatch(
            CommonActions.reset({
                index: 0,
                routes: [
                    {
                        name: name,
                        params: params
                    },
                ],
            })
        )
    }
};

export const goToPreviousScreen = () => {
    if (navigationRef.current) {
        navigationRef.current.dispatch(StackActions.pop())
    }
};

export const canGoBack = () => {
    return navigationRef.current && navigationRef.current.canGoBack();
}
