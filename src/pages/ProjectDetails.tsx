import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {useHistory} from 'react-router-dom'
import { Button } from "@material-ui/core";
import { TStore } from "../store";

import styles from "../styles/PortfolioOverview.module.scss";

import { CircularProgress } from "@material-ui/core";

import OverviewPanel from "../components/OverviewPanel";
import ChartPanel from "../components/ChartPanel";
import TablePanel from "../components/TablePanel";
import Details from "../components/Details";


type DETProps = {
  match: any;
};
const ProjectDetails: React.FC<DETProps> = ({match}) => {
  
  const projectKey = match.params.projectKey;

  const history = useHistory();

  const { projectOption, account, mintInfo } = useSelector((state: TStore) => state.projectReducer)
  
  const handleGoBack = (event:React.MouseEvent<HTMLElement>, text: string) =>{
    history.push('/');
  }
  return (
    // <div className={styles["index-intro-user"]}>
    <div className={styles["project-details-container"]}>
        <div className={styles["portfolio-header"]}>
          <h2>Project Details</h2>
          <p style={{fontSize:'36px'}}><span>Project Name : &nbsp;&nbsp;</span> {projectOption[projectKey]?.project.name} </p>
          <br/>
          <p><span>Project Symbol : &nbsp;&nbsp;</span> {projectOption[projectKey]?.project.symbol} </p>
          <div className={styles["turnBackBttn"]}>
            <Button 
              variant = "contained"
              onClick={(e)=> handleGoBack(e, 'clicked')}
              className={styles['bttn']}
            >
              Portfolio Overview
            </Button>
          </div>
        </div>
        <div className={styles["project-card-area"]}>
          <div className={styles['overviewPanel']}>
            <OverviewPanel 
              project = {projectOption[projectKey]?.project}
              account = {account}
            />
          </div>
          <div className={styles['chartPanel']}>
            <ChartPanel
              optionAccounts={projectOption[projectKey].options}
              mintInfos = {mintInfo}
            />
            {/* <Details
              project = {projectOption[projectKey]?.project}
              optionAccounts={projectOption[projectKey].options}
              mintInfos = {mintInfo}
            /> */}
          </div>
        </div>
        <div className={styles['tablePanel']}>
          <TablePanel
            project = {projectOption[projectKey]?.project}
            optionAccounts={projectOption[projectKey].options}
            mintInfos = {mintInfo}
          />
        </div>
    </div>
  
  );
};

export default ProjectDetails;
