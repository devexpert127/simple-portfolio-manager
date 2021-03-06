import React from "react";
import { Link } from 'react-router-dom';


import { Account, Project } from "../types";
import OptionOverview from "./OptionOverview";
import styles from "../styles/PortfolioOverview.module.scss";
import { projectSlice } from "../slices/projectSlice";
import Twitter from '@material-ui/icons/Twitter'
import ExploreRounded from '@material-ui/icons/ExploreRounded';
import DiscordIcon from '@material-ui/icons/DirectionsCarTwoTone';
import Discord from '../images/icons8-discord.svg';

const overviewPanel: React.FC<{
  project: Project;
  account: Account
}> = ({
  project,
  account
}) => {
  return (
    <div className={styles['overviewBody']}>
      <h2>Project Overview</h2>
      <div className={styles['logoDiv']}>
        <img src={project.logo} style={{width:'4.5em', height:'4.5'}}/>
      </div>
      <div className={styles['content-div']}>
        <div className={styles['contentStatements']} style={{marginTop: '60px'}}>
          <p>Description</p>
          <span>{project.description}</span>  
        </div>
        <div className={styles['contentStatements2']}>
          <p>Mint Address</p>
          <span>{project.mintAddress}</span>  
        </div>
        <div className={styles['contentStatements']}>
          <p><ExploreRounded/>&nbsp;&nbsp;&nbsp; Website</p>
          <a href={project.website}>{project.website}</a>  
        </div>
        <div className={styles['contentStatements']}>
          <p><Twitter/> &nbsp;&nbsp;&nbsp;Twitter</p>
          <a href={project.twitter}>{project.twitter}</a>  
        </div>
        <div className={styles['contentStatements']}>
          <p><img src={Discord} style={{width:'25px', height:'25px'}}/> &nbsp;&nbsp;&nbsp; Discord</p>
          <a href={project.discord}>{project.discord}</a>  
        </div>
      </div>
    </div>
  );
};

export default overviewPanel;
