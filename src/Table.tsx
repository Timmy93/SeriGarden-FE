import './CSS/Table.css'

import React, {useEffect, useState} from "react";
import {be_url} from "./index";
import {NotificationMessage} from "./NotificationMessage";
import {Tile} from "./Tile";

export interface Plant {
    plant_id: number;
    plant_name: string;
    plant_type: string;
    nodemcu_id: number;
    detection_ts: string;
    plant_hum: number;
    watering_ts: string;
    water_quantity: number;
    plant_location: string;
    owner: string;
}

export interface NotificationMessageInterface {
    msg?: string;
    reloadButton?: boolean;
    notificationType?: string;
    persistent?: boolean;
}

type RefreshButtonProps = {
    setValues: React.Dispatch<React.SetStateAction<Plant[]>>;
    setNotification: React.Dispatch<React.SetStateAction<NotificationMessageInterface>>;
};


export const RefreshButton: React.FC<RefreshButtonProps> = ({setValues, setNotification}) => {
    return <button onClick={(e) => {
        getPlants()
            .then((fetchedReports) => updateReportInfo(fetchedReports, setValues, setNotification))
            .catch((e) => reportDownloadFailed(e, setNotification));
        setNotification({'notificationType': 'info_notif', 'msg': 'Aggiornamento...'})
    }
    }>SYNC</button>
}

function updateReportInfo(plants: Array<Plant>, setReports: React.Dispatch<React.SetStateAction<Array<Plant>>>, setNotificationMessageInfo: React.Dispatch<React.SetStateAction<NotificationMessageInterface>>) {
    console.log("Plants fetched");
    console.debug(plants);
    setReports(plants);
    window.localStorage.setItem('plants', JSON.stringify(plants));
    setNotificationMessageInfo({});
}

function reportDownloadFailed(error: any, setNotification: React.Dispatch<NotificationMessageInterface>) {
    console.log(error)
    setNotification({'notificationType': 'error_notif', 'msg': 'Sei disconnesso - Funzionalità limitate', 'reloadButton': true, 'persistent': true});
}

export function Table() {
    // The list of all plants
    const [plants, setPlants] = useState<Plant[]>([]);
    // The notification message content
    const [notificationMessageInfo, setNotificationMessageInfo] = useState<NotificationMessageInterface>({})

    useEffect(() => {
        const r_promise = getPlants();
        let tempPlant = window.localStorage.getItem('plants');
        if (tempPlant) {
            //Showing temporarily stored reports - if present
            setPlants(JSON.parse(tempPlant));
        } else {
            console.log("No local storage");
        }
        setNotificationMessageInfo({'notificationType': 'info_notif', 'msg': 'Caricamento...'});
        r_promise
            .then((fetchedReports) => updateReportInfo(fetchedReports, setPlants, setNotificationMessageInfo))
            .catch((e) => reportDownloadFailed(e, setNotificationMessageInfo));

    }, []);

    //console.log(info)
    const lines = [];
    const bleachers = [];
    //Apply update
    let tempList = plants;
    console.log("Showing "+tempList.length+ " elements")
    //Create lines
    for (const infoElement of tempList) {
        if (infoElement.nodemcu_id == null) {
            bleachers.push(
                <Tile key={infoElement['plant_id']} info={infoElement}/>
            )
        } else {
            lines.push(
                <Tile key={infoElement['plant_id']} info={infoElement}/>
            )
        }
    }
    if (lines.length + bleachers.length === 0) {
        lines.push(
            <div className={'nothing_found'} key={'None'}>
                <img src={'red_dot.svg'} alt={'Nessun risultato'}/>
                <span>Non riesco a connettermi</span>
                <span className={'nothing_suggest'}>Necessaria WiFi o VPN</span>
            </div>)
    } else {
        //console.log("ci sono " + lines.length + " linee")
    }
    //<p>Ciao questa è la mia lista. Clicca per aggiornare <RefreshButton setValues={setReports}/></p>
    return (
        <div>
            <NotificationMessage
                info={notificationMessageInfo}
                setInfo={setPlants}
                setNotification={setNotificationMessageInfo}
            />
            <h1 className={"title"}>Le mie piante</h1>
            <div className={"tile_container"}>
                {lines}
            </div>
            <h1 className={"title"}>Vecchie piante</h1>
            <div className={"bleachers_container"}>
                {bleachers}
            </div>
        </div>
    );
}

function getPlants(orderedBy = 'data'): Promise<Array<Plant>> {
    return fetch(be_url+'/status')
        .then((response) => {
            return response.json()
        });
}
