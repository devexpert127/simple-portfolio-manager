import React, { useEffect, useRef, useState } from 'react';
import ReactDOM from 'react-dom';
import { createChart, CrosshairMode } from 'lightweight-charts';
import { Project, CandleChartData } from "../../types";
import './index.css';
//

const TVChartContainer : React.FC<{
  project : Project;
}> = ({
  project,
}) => {
  const ref = useRef<null | HTMLDivElement>(null);
  const [dataCandle, setCandleData] = useState<CandleChartData[]>([]);
  // const [dataLine, setLineData] = useState([])
  
  let arr : CandleChartData[]=[];
  useEffect(() => {
    let lowerCaseName = project.name.toLowerCase();
    let marketName = lowerCaseName.replace(' ', '-')
    fetch(
      `https://powerful-beach-55472.herokuapp.com/https://api.coingecko.com/api/v3/coins/${marketName}/ohlc?vs_currency=usd&days=30`
    )
      .then((res) => res.json())
      .then((rowData  : CandleChartData[]=[]) => {
        rowData.map((data, ix) =>{ 
          arr.push({
            //@ts-ignore
            time: data[0]/1000,
             //@ts-ignore
            open: parseFloat(data[1]),
             //@ts-ignore
            high: parseFloat(data[2]),
             //@ts-ignore
            low: parseFloat(data[3]),
             //@ts-ignore
            close: parseFloat(data[4]),
          });
        })
        setCandleData(arr);
      })
      .catch((err) => console.info(err));
    if (dataCandle && dataCandle.length > 0 && ref.current) {
      
      const chart = createChart(ref.current, {
        width: ref.current.clientWidth,
        // width: realwidth,
        height: ref.current.clientHeight,
        layout: {
          backgroundColor: '#000000',
          textColor: 'rgba(255, 255, 255, 0.9)',
        },
        crosshair: {
          vertLine: {
            visible: true,
          },
          horzLine: {
            visible: true,
          },
        },
        grid: {
          vertLines: {
            color: "#242424",
            style: 0,
            visible: true,
          },
          horzLines: {
            color: "#242424",
            style: 0,
            visible: true,
          },
        },
      });

      const candleSeries = chart.addCandlestickSeries({
        upColor: '#4bffb5',
        downColor: '#ff4976',
        borderDownColor: '#ff4976',
        borderUpColor: '#4bffb5',
        wickDownColor: '#838ca1',
        wickUpColor: '#838ca1',
      });

      candleSeries.setData(dataCandle);

      return () => {
        chart.remove();
      };
    } else {
      console.log('this eerror', ref.current);
    }
  }, [dataCandle]);

  return <div ref={ref} className="TVChartContainer"/>;
}

export default TVChartContainer;