import React from "react";
import { Link } from 'react-router-dom';


import { MintInfoWithKey, OptionAccounts, Project } from "../types";
import TVChartContainer from "./TradingView";
import styles from "../styles/PortfolioOverview.module.scss";

const ChartPanel: React.FC<{
  project : Project;
  optionAccounts: OptionAccounts[];
  mintInfos: Record<string, MintInfoWithKey>;
}> = ({
  project,
  optionAccounts,
  mintInfos
}) => {
  return (
    <div className={styles['chart-body']}>
      <div className={styles['chart-title']}>
        <h2><span>{project.symbol}</span> &nbsp; &nbsp; &nbsp;  Price History</h2>
      </div>
      <TVChartContainer 
        project={project}
      />
    </div>
  );
};

export default ChartPanel;
