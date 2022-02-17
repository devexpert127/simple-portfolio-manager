import React from "react";
import { Link } from 'react-router-dom';


import { Account, MintInfoWithKey, OptionAccounts, Project } from "../types";
import OptionOverview from "./OptionOverview";
import styles from "../styles/PortfolioOverview.module.scss";

const ChartPanel: React.FC<{
  optionAccounts: OptionAccounts[];
  mintInfos: Record<string, MintInfoWithKey>;
}> = ({
  optionAccounts,
  mintInfos
}) => {
  
  return (
    <div >
      <h2>Trading History</h2>
    </div>
  );
};

export default ChartPanel;
