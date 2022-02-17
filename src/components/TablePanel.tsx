import React from "react";
import { Link } from 'react-router-dom';


import { Account, MintInfoWithKey, OptionAccounts, Project } from "../types";
import OptionOverview from "./OptionOverview";
import styles from "../styles/PortfolioOverview.module.scss";

const TablePanle: React.FC<{
  optionAccounts: OptionAccounts[];
  mintInfos: Record<string, MintInfoWithKey>;
}> = ({
  optionAccounts,
  mintInfos
}) => {
  console.log('222222222222', optionAccounts)
  return (
    <div >
      
    </div>
  );
};

export default TablePanle;
