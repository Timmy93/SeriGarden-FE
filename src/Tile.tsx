import React from 'react';
import { Plant } from './Table';

type TileProps = {
    info: Plant;
};

export const Tile: React.FC<TileProps> = ({ info }) => {
    return <div>Hello, {info.plant_name}!</div>;
};
