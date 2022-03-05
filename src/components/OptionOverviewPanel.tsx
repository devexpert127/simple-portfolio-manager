import React, {useState, useEffect} from "react";
import {useDispatch, useSelector} from "react-redux";
import { Link } from 'react-router-dom';
import { updatedGrantNumber } from "../slices/projectSlice"

import { Account, Project } from "../types";
import OptionOverview from "./OptionOverview";
import styles from "../styles/PortfolioOverview.module.scss";
import { TStore } from "../store";


const OptionOverviewPanel: React.FC<{
  project: Project;
}> = ({
  project,
}) => {
  const dispatch = useDispatch();
  const { projectOption, account, grantNumber, projectKey} = useSelector((state: TStore) => state.projectReducer)

  const totalOptions = Object.keys(projectOption[projectKey].options).length;
  const numberGranted :number = projectKey=='psyoptions'?5680:39572;

  const [optionsGranted, setOptionsGranted] = useState(0);
  const [optionsVested, setOptionsVested] = useState(0);
  const [optionsExercised, setOptionsExerceised] = useState(0);
  const [optionsExercisable, setOptionsExerceisable] = useState(0);

  useEffect(()=>{
    dispatch(updatedGrantNumber({grantNumber : numberGranted}))
    setOptionsGranted(Number((numberGranted*1).toFixed(0)));
    setOptionsVested(Number((numberGranted*0.85).toFixed(0)));
    setOptionsExerceised(Number((numberGranted*0.65).toFixed(0)))
    setOptionsExerceisable(Number((numberGranted*0.25).toFixed(0)))
  },[])

  return (
    <div className={styles['overviewBody']}>
      <h2>Options Overview</h2>
      <div className={styles['logoDiv']}>
        &nbsp;
      </div>
      <div className={styles['content-div']}>
        <div className={styles['contentStatements']} style={{marginTop: '60px'}}>
          <p>Total Options</p>
          <span>{totalOptions}</span>  
        </div>
        <div className={styles['contentStatements2']}>
          <p>Options Granted</p>
          <span>{optionsGranted} </span>  
        </div>
        <div className={styles['contentStatements']}>
          <p>Options Vested</p>
          <span>{optionsVested} </span>  
        </div>
        <div className={styles['contentStatements']}>
          <p>Options EXercised</p>
          <span>{optionsExercised} </span>  
        </div>
        <div className={styles['contentStatements']}>
          <p>Options EXercisable today</p>
          <span>{optionsExercisable}</span>  
        </div>
      </div>
    </div>
  );
};

export default OptionOverviewPanel;
