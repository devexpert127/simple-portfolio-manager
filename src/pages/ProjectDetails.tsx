import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { TStore } from "../store";

import styles from "../styles/PortfolioOverview.module.scss";

import { CircularProgress } from "@material-ui/core";

import Details from "../components/Details";
type DETProps = {
  match: any;
};
const ProjectDetails: React.FC<DETProps> = ({match}) => {
  
  const projectKey = match.params.projectKey;
  console.log('22222222222222', projectKey)

  const { projectOption, account, mintInfo } = useSelector((state: TStore) => state.projectReducer)
  

  return (
    // <div className={styles["index-intro-user"]}>
    <div className={styles["portfolio-container"]}>

          <div className={styles["project-card-area"]}>
            {Object.keys(mintInfo).length <= 0 ? (
              <CircularProgress />
            ) : (
              
                <Details
                  project={projectOption[projectKey]?.project}
                  optionAccounts={projectOption[projectKey]?.options}
                  mintInfos={mintInfo}
                />
              
            )}
          </div>
    </div>
  
  );
};

export default ProjectDetails;
