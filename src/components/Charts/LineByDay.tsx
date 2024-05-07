'use client'
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend,
  } from 'chart.js';
import { Line } from 'react-chartjs-2';

ChartJS.register(
CategoryScale,
LinearScale,
PointElement,
LineElement,
Title,
Tooltip,
Legend
);

 
  
interface LineByDayProps {
    labelsByDay: string[];
    values: number[];
    ticketsSold: number;
}
  
  export function LineByDay({ labelsByDay, values, ticketsSold }: LineByDayProps) {
    const options = {
        responsive: true,
        plugins: {
            legend: {
            position: 'top' as const,
            },
            title: {
            display: true,
            text: 'Boletos vendidos: '+ticketsSold,
            },
        },
    };
    const data = {
      labels: labelsByDay,      
      datasets: [{
          label: 'Boletos vendidos' ,
          data: values,
          fill: false,
          borderColor: 'rgb(75, 192, 192)',
          tension: 0.1
      }]
    } as any;
    return (
        <Line options={options} data={data} className='w-full h-full' />
    );
}