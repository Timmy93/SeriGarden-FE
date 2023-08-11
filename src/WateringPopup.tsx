import './CSS/GenericPopup.css';
import React, { useState } from 'react';

export type PopupProps = {
    status: PopupStatus;
    setStatus: React.Dispatch<React.SetStateAction<PopupStatus>>;
    plant_id: number;
}

export type PopupStatus = {
    msg?: string;
    img?: string;
    sub_msg?: string;
    is_chart?: boolean;
    buttons?: ButtonDescription[];
}

export type ButtonDescription = {
    title: string;
    action: any;
}

export const WateringPopup: React.FC<PopupProps> = ({status, setStatus}) => {
    const [waterQuantity, updateWaterQuantity] = useState<number>(150)

    const onChange = (e: React.FormEvent<HTMLInputElement>) => {
        updateWaterQuantity(parseInt(e.currentTarget.value));
    }

    if (status.hasOwnProperty('msg') && !status.is_chart) {
        return <div className={'download_message_div'}
                    onClick={(e) => setStatus({})}
        >
            <div className={'download_group'} onClick={(e) => e.stopPropagation()}>
                    <span className={'close_message'}>
                        <img src={'red_dot.svg'} alt={"Close button"} onClick={(e) => setStatus({})}/>
                    </span>
                <span className={'download_message'}>{status.msg}</span>
                <img src={status.img} alt={status.img}></img>
                <span className={'download_sub_message'}>Versare {waterQuantity} ml di acqua?</span>
                <input id={'water_selector'} type={'range'}
                       min={100} max={1000} step={25}
                       defaultValue={waterQuantity}
                       onChange={onChange}
                />
                <div className={'button_section'}>{generateButtons(status.buttons) ?? ''}</div>
            </div>
        </div>
    }
    return <></>
};

export function generateButtons(buttons?: ButtonDescription[]) {
    if (!buttons) {
        buttons = []
    }
    const b_list = []
    for (const button of buttons) {
        b_list.push(<button
            key={button.title}
            className={'confirm_button'}
            onClick={button.action}
        >
            {button.title}
        </button>);
    }
    return b_list;
}