import React from "react";
import { Link } from 'react-router-dom';
import { Card, CardContent, CardHeader } from "@material-ui/core";
import { Account, MintInfoWithKey, OptionAccounts, Project } from "../types";
import OptionOverview from "./OptionOverview";
import styles from "../styles/PortfolioOverview.module.scss";

const Details: React.FC<{
  project: Project;
  optionAccounts: OptionAccounts[];
  mintInfos: Record<string, MintInfoWithKey>;
}> = ({
  project,
  optionAccounts,
  mintInfos
}) => {
  return (
    
      <Card variant="outlined">
        <CardHeader title={project.name} />
        {console.log('5555555', optionAccounts)}
        <CardContent>
          Options Held:
          {optionAccounts.map((x, index) => (
            <OptionOverview
              key={index.toString()}
              project={project}
              optionAccounts={x}
              mintInfos={mintInfos}
            />
          ))}
        </CardContent>
      </Card>
   
  );
};

export default Details;
