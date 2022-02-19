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
import { green } from "@material-ui/core/colors";


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

  const [currentPrice, setCurrentPrice] = useState(0);

  useEffect(()=>{
    let symbol = projectOption[projectKey]?.project.symbol
    const url = "https://powerful-beach-55472.herokuapp.com/https://pro-api.coinmarketcap.com/v1/cryptocurrency/quotes/latest?convert=USD&symbol=" + symbol
    fetch(
      url,{
        headers: {
          'Content-Type': 'application/json',
          'X-CMC_PRO_API_KEY' : 'c0849e79-5cfb-4066-9a27-607715b2db06'
        }
      }
    )
    .then((res) => res.json())
    .then((rowData) => {
      setCurrentPrice(rowData.data[symbol].quote.USD.price);
    })
  },[])
  return (
    // <div className={styles["index-intro-user"]}>
    <div className={styles["project-details-container"]}>
        <div className={styles["portfolio-header"]}>
          <h2>Project Details</h2>
          <p><span>Project Name : &nbsp;&nbsp;</span> {projectOption[projectKey]?.project.name} </p>
          <br/>
          <p><span>Project Symbol : &nbsp;&nbsp;</span> {projectOption[projectKey]?.project.symbol} </p>
          <p className={styles['price']}><span>Current Price : &nbsp;&nbsp;</span> $ {currentPrice.toFixed(4)} </p>
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
              project={projectOption[projectKey]?.project}
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
