import React, { useEffect, useRef } from 'react';
import Chart from 'chart.js/auto';
import {
    ChartData,
    CoreChartOptions,
    DatasetChartOptions,
    ElementChartOptions,
    PluginChartOptions,
    ScaleChartOptions,
    LineControllerChartOptions,
} from 'chart.js';
import {_DeepPartialObject} from "chart.js/types/utils";


interface LineChartProps {
    data: ChartData<'line'>;
    options:
        | _DeepPartialObject<
        CoreChartOptions<'line'> &
        ElementChartOptions<'line'> &
        PluginChartOptions<'line'> &
        DatasetChartOptions<'line'> &
        ScaleChartOptions<'line'> &
        LineControllerChartOptions
    >
        | undefined;
}

function LineChart({ data, options }: LineChartProps) {
    /**
     * Canvas Element for the chart to render
     */
    const canvas = useRef<HTMLCanvasElement>(null);

    useEffect(() => {
        if (canvas.current) {
            const chart = new Chart(canvas.current, {
                type: 'line',
                data: data,
                options: options,
            });

            /**
             * Cleanup chart after render
             */
            return () => {
                chart.destroy();
            };
        }
    });

    return <canvas ref={canvas}></canvas>;
}

export default LineChart;
