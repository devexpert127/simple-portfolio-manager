import { useEffect, useState, memo } from "react";
import { useDispatch, useSelector } from "react-redux";
import { updatedAccount, updatedProjectOption, updatedMintInfo } from "../slices/projectSlice"
import { TStore } from "../store";
import { useConnectedWallet, useSolana } from "@saberhq/use-solana";
import { PsyAmericanIdl } from "@mithraic-labs/psy-american";
import styles from "../styles/PortfolioOverview.module.scss";
import { Program, Provider } from "@project-serum/anchor";
import { PublicKey } from "@solana/web3.js";
import { getAllWalletOptions, loadMintInfo } from "../lib/utils";
import projectList from "../content/projectList.json";
import { Account, MintInfoWithKey, OptionAccounts, Project } from "../types";
import { CircularProgress } from "@material-ui/core";
import IndividualOption from "./IndividualOption";
import ProjectOverview from "./ProjectOverview";


const OptionArea = () => {
  const dispatch = useDispatch();
  const { projectOption, projectKey, mintInfo } = useSelector((state: TStore) => state.projectReducer);
  const wallet = useConnectedWallet();
  const { provider } = useSolana();
  const [loadingProjects, setLoadingProjects] = useState(false);
  const [loadingMints, setLoadingMints] = useState(true);
  
  return (
    <div className={styles["project-card-area"]}>
    {loadingProjects || Object.keys(mintInfo).length <= 0 ? (
      <CircularProgress />
    ) : (
      projectOption[projectKey].options.map((inOp) => (
        <IndividualOption
          option={inOp}
          mintInfos={mintInfo}
        />
      ))
    )}
  </div>
  );
};

export default OptionArea;
