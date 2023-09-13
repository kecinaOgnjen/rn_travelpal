import {Alert, useWindowDimensions} from 'react-native';
import {StyleSheet} from 'react-native';

export default function useCustomWindowDimensions() {
    return useWindowDimensions();
}

export const showAlert = (message) => {
    Alert.alert('Upozorenje', message);
};