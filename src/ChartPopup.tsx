import React, {useEffect, useState} from "react";
import {be_url} from "./index";
import LineChart from "./LineChart";
import {generateButtons, PopupProps} from "./WateringPopup";

type ChartInfoProp = {
    labels: string[];
    data: number[];
}

const options = {
    scales: {
        y: {
            min:0,
            max: 100
        }
    }
};

export const ChartPopup: React.FC<PopupProps> = ({plant_id, status, setStatus}) => {

    const [chartInfo, updatechartInfo] = useState<ChartInfoProp>({
        labels: [], data: []
    })
    const state = {
        labels: chartInfo.labels,
        datasets: [
            {
                label: 'Umidità terra',
                fill: false,
                lineTension: 0.5,
                backgroundColor: '#5185ff',
                borderColor: 'rgba(0,0,0,1)',
                borderWidth: 2,
                data: chartInfo.data
            }
        ]
    }

    useEffect(() => {
        function getCharData() {
            fetch(be_url + '/statistic/weekly/' + plant_id)
                .then((response) => {
                    return response.json()
                })
                .then((result) => {
                    console.log(result)
                    let parsed = parseStatisticsData(result)
                    updatechartInfo(parsed)
                });
        }

        function parseStatisticsData(receivedData: []) {
            let result = {data: [], labels: []} as ChartInfoProp;
            for (const receivedDatum of receivedData) {
                let val = receivedDatum['Value']
                let dt = new Date(receivedDatum['Date']);
                let label = "Ore " + receivedDatum['Hour']
                if (dt.toDateString()  !== (new Date()).toDateString() ) {
                    label = label + " (" + dt.getDate().toString().padStart(2, '0') + "/"+(dt.getMonth()+1).toString().padStart(2, '0')+")"
                }
                result.labels.push(label)
                result.data.push(val)
            }
            return result
        }

        getCharData();
    }, [plant_id]);



    if (status.hasOwnProperty('msg') && status.is_chart) {
        //getCharData()
        return <div className={'download_message_div'}
                    onClick={(e) => setStatus({})}
        >
            <div className={'download_group chart'} onClick={(e) => e.stopPropagation()}>
                    <span className={'close_message'}>
                        <img src={'red_dot.svg'} alt={"Close button"} onClick={(e) => setStatus({})}/>
                    </span>
                <LineChart data={state} options={options} />
                <div className={'button_section'}>{generateButtons(status.buttons) ?? ''}</div>
            </div>
        </div>
    }
    return <></>

}