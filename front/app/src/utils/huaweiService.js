import {HmsLocalNotification, HmsPushMessaging, RNRemoteMessage} from "@hmscore/react-native-hms-push";
const {HmsPushInstanceId, HmsPushEvent} = require("@hmscore/react-native-hms-push");

export const getToken = () => {
    HmsPushInstanceId.getToken('')
        .then((result) => {
            console.log(result);
        })
        .catch((err) => {
            console.log(err)
        });
}

export const onRemoteMessageReceivedListener = () => {
    HmsPushEvent.onRemoteMessageReceived(
        (result) => {
            console.log(result)
            const obj = JSON.parse(result.msg.data);
            HmsLocalNotification.localNotification({
                [HmsLocalNotification.Attr.title]: obj.title,
                [HmsLocalNotification.Attr.message]: obj.message,
            });
        }
    );
}

export const setBackgroundMessageListener = () => {
    HmsPushMessaging.setBackgroundMessageHandler((dataMessage) => {
        const obj = JSON.parse(dataMessage.data);
        console.log(dataMessage)
        HmsLocalNotification.localNotification({
            [HmsLocalNotification.Attr.title]: obj.title,
            [HmsLocalNotification.Attr.message]: obj.message
        })
            .then((result) => {
                console.log(result);
            })
            .catch((err) => {
                console.log(err);
            });

        return Promise.resolve();
    });
}

