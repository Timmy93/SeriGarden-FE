import React from 'react';
import { Plant } from './Table';

type TileProps = {
    info: Plant;
};

enum humidity_status {
    WET,
    MOIST,
    DRY,
    UNKNOWN
}

enum online_status {
    ONLINE,
    TEMPORARY_OFFLINE,
    OFFLINE,
    DISCONNECTED
}

enum status_color {
    RED,
    YELLOW,
    GREEN,
    GREY
}

type status = {
    humidity: number|undefined;
    humidity_status: humidity_status;
    detection_ts: string;
    online_status: online_status;
    status_color: status_color
    recap: string;
}

export const Tile: React.FC<TileProps> = ({ info }) => {
    let status = analyseStatus(info.plant_hum, info.detection_ts)
    return <div className={"tile"}>
        <span className={"title_line"}>
            <span className={"plant_name_txt"}>{info.plant_name}</span>
            <span className={"plant_type_txt"}>({info.plant_type})</span>
        </span>
        <img className={'plant_icon'} src={getIconFromPlant(info.plant_type)} alt={'Plant icon'}></img>
        <span className={"recap_line"}>
            <img className={"context_icon"} src={getIconFromStatus(status)} alt={''}></img>
            <span className={"plant_status_txt"}>{status.recap}</span>
        </span>
        <span className={"table_header"}>Altre informazioni</span>
        <div className={"plant_summary"}>
            <span className={"summary_line"}>
                <img className={"context_icon"} src={"location.svg"} alt={''}></img>
                <span >{info.plant_location}</span>
            </span>
            <span className={"summary_line"}>
                <img className={"context_icon"} src={"watering_can.svg"} alt={''}></img>
                <span>{getTimeElapsed(info.watering_ts)}</span>
            </span>
            <span className={"summary_line"}>
                <img className={"context_icon"} src={"id.svg"} alt={''}></img>
                <span>{"Plant_#" + info.plant_id}</span>
            </span>
            <span className={"summary_line"}>
                <img className={"context_icon"} src={"sensor.svg"} alt={''}></img>
                <span>{"Sensor_#" + info.nodemcu_id}</span>
            </span>
        </div>
        <div className={"plant_button"}></div>
    </div>;
};

const plant_icon_association = [
    {name: "timo", icon: "thyme.svg"},
    {name: "fragola", icon: "strawberry.svg"},
    {name: "lampone", icon: "raspberry.svg"},
]

const status_icon_association = [
    {status: status_color.RED, icon: "red_dot.svg"},
    {status: status_color.YELLOW, icon: "yellow_dot.svg"},
    {status: status_color.GREEN, icon: "green_dot.svg"},
]

function getIconFromPlant(plant_name: string): string {
    for (const associationElement of plant_icon_association) {
        if (plant_name.toLowerCase() === associationElement.name) {
            return associationElement.icon
        }
    }
    console.log("Missing icon for: " + plant_name.toLowerCase())
    return "plant.svg"
}

function analyseStatus(plant_hum: number|undefined, detection_ts: string): status {
    let status: status = {
        humidity: plant_hum,
        humidity_status: humidity_status.UNKNOWN,
        detection_ts: detection_ts,
        online_status: online_status.DISCONNECTED,
        status_color: status_color.GREY,
        recap: "N/A"
    }
    let sensing_time = new Date(detection_ts);
    //Measure last sensing
    if (! isNaN(sensing_time.valueOf())) {
        let now = new Date();
        status.humidity_status = getHumidityMeasure(plant_hum)
        let timediff = now.getTime() - sensing_time.getTime()
        if (timediff > 15 * 60 * 1000) {
            status.online_status = online_status.OFFLINE
        } else {
            if (timediff > 15 * 60 * 1000) {
                status.online_status = online_status.TEMPORARY_OFFLINE
            } else {
                status.online_status = online_status.ONLINE
            }
        }
    } else {
        status.humidity_status = humidity_status.UNKNOWN
        status.online_status = online_status.DISCONNECTED
        console.warn("Cannot parse time: [" + detection_ts +"]")
    }
    status = evaluateStatusColorAndRecap(status)
    return status;
}

/**
 *
 * @param plant_hum The humidity value of the plant
 */
function getHumidityMeasure(plant_hum: number|undefined): humidity_status {
    //let hum = "(" + Math.min(plant_hum, 100) + "%)"
    if (plant_hum) {
        if (plant_hum > 70) {
            return humidity_status.WET
        } else if(plant_hum > 50) {
            return humidity_status.MOIST
        } else {
            return humidity_status.DRY
        }
    } else {
        return humidity_status.UNKNOWN
    }
}

function evaluateStatusColorAndRecap(status: status):status {
    //Normalize humidity value
    let hum_perc = status.humidity
    if (!hum_perc) {
        hum_perc = 0
    } else if (hum_perc > 100) {
        hum_perc = 100
    } else {
        hum_perc = Math.max(0, hum_perc)
    }
    //Elaborate status
    if (status.online_status === online_status.DISCONNECTED) {
        status.status_color = status_color.GREY
        status.recap = "Sensore disconnesso"
    } else if (status.online_status === online_status.OFFLINE) {
        status.status_color = status_color.RED
        status.recap = "Sensore spento"
    } else if (status.online_status === online_status.TEMPORARY_OFFLINE) {
        if (status.humidity_status === humidity_status.DRY) {
            status.status_color = status_color.RED
            status.recap = "Da innaffiare (" + hum_perc + "% " + getTimeElapsed(status.detection_ts) + ")"
        } else {
            status.status_color = status_color.YELLOW
            if (status.humidity_status === humidity_status.MOIST) {
                status.recap = "Terreno umido (" + hum_perc + "% " + getTimeElapsed(status.detection_ts) + ")"
            } else {
                status.recap = "Terreno bagnato (" + hum_perc + "% " + getTimeElapsed(status.detection_ts) + ")"
            }
        }
    } else {
        if (status.humidity_status === humidity_status.DRY) {
            status.status_color = status_color.YELLOW
            status.recap = "Da innaffiare (" + hum_perc + "%)"
        } else {
            status.status_color = status_color.GREEN
            if (status.humidity_status === humidity_status.MOIST) {
                status.recap = "Terreno umido (" + hum_perc + "%)"
            } else {
                status.recap = "Terreno bagnato (" + hum_perc + "%)"
            }
        }
    }
    return status;
}

function getIconFromStatus (status: status) {
    for (const associationElement of status_icon_association) {
        if (status.status_color === associationElement.status) {
            return associationElement.icon
        }
    }
    return "grey_dot.svg"
}

function getTimeElapsed(watering_ts: string) {
    let watering_time = new Date(watering_ts);
    //Measure last sensing
    if (! isNaN(watering_time.valueOf())) {
        let now = new Date();
        let timediff = now.getTime() - watering_time.getTime()
        let minutes = Math.round(timediff / 1000 / 60)
        if (minutes < 2) {
            return "Adesso"
        } else if (minutes < 90) {
            return "" + minutes + " minuti fa"
        } else {
            let hours = Math.round(minutes / 60)
            if (hours < 36) {
                return "" + hours + " ore fa"
            } else {
                return "" + Math.round(hours/24) + " giorni fa"
            }
        }
    } else {
        return "N/A"
    }
}