import Navigator from "./src/routes/homeStack";
import {useEffect} from "react";
import {getToken, onRemoteMessageReceivedListener, setBackgroundMessageListener} from "./src/utils/huaweiService";

export default function App() {
    useEffect(() => {
        getToken();
        onRemoteMessageReceivedListener();
        setBackgroundMessageListener();
    }, []);

    return Navigator();
}