import './CSS/NotificationMessage.css'
import {NotificationMessageInterface, Plant, RefreshButton} from "./Table";
import React from "react";



type NotificationMessageProps = {
    info: NotificationMessageInterface;
    setInfo: React.Dispatch<React.SetStateAction<Plant[]>>;
    setNotification: React.Dispatch<React.SetStateAction<NotificationMessageInterface>>;
};

export const NotificationMessage: React.FC<NotificationMessageProps> = ({ info, setInfo, setNotification }) => {
    if (!info.hasOwnProperty('msg')) {
        return <></>
    } else {
        let button = <></>
        if (info.hasOwnProperty('reloadButton') && info.reloadButton) {
            button = <RefreshButton setValues={setInfo} setNotification={setNotification}/>
        }
        return <div className={'notification'}>
            <div className={'notification_msg '+info.notificationType}>
                <span className={'notification_text'}>{info.msg}</span>
                {button}
            </div>
        </div>
    }
};
