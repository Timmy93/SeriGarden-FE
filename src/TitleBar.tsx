import './CSS/TitleBar.css';

export function TitleBar() {
    return <div className={'title_bar_div'}>
        <img className={'title_icon'} src={"logo.svg"} alt={''}></img>
        <span className={'main_title'}>SeriGarden</span>
    </div>
}

