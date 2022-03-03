import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { updatedProjectKey } from "../slices/projectSlice"
import { Link } from 'react-router-dom';
import { Card, CardContent, CardHeader } from "@material-ui/core";
import { Account, MintInfoWithKey, OptionAccounts, Project } from "../types";
import OptionOverview from "./OptionOverview";
import styles from "../styles/PortfolioOverview.module.scss";
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';
import { TStore } from "../store";
import { isConstructorDeclaration } from "typescript";

const ProjectOverview: React.FC<{
  project: Project;
  optionAccounts: OptionAccounts[];
  mintInfos: Record<string, MintInfoWithKey>;
}> = ({
  project,
  optionAccounts,
  mintInfos
}) => {
  const dispatch = useDispatch();
  const { projectKey } = useSelector((state: TStore) => state.projectReducer)

  const clickHandle = () =>{
    dispatch(updatedProjectKey({ projectKey : project.key}))
  }
  return (
    
      <div className={styles["project-card-container"]} onClick={clickHandle}>
        <div className={styles["project-card-title"]}>
          <div className={styles['project-logo']}>
            <img src={project.logo} style={{width:'60px', height:'60px'}}/>
          </div>
          <span className={styles['project-title']}> {project.name} </span>
        </div>
        <div className={styles['project-card-body']}>
          {/* <p className={styles['project-description']}>{project.description}</p> */}
          <p>Symbol : &nbsp; "{project.symbol}"</p>
          <p>Mint Address : &nbsp; "{project.mintAddress}"</p>
        </div>
        <Link to={`/projectdetails/view/${project.key}`}>
          <div className={styles['toForward']}>
              <ArrowForwardIosIcon/>
          </div>
        </Link>
      </div>
    
  );
};

export default ProjectOverview;
