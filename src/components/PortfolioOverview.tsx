import { useEffect, useState } from "react";
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
import { CircularProgress } from "@material-ui/core";
import ProjectOverview from "./ProjectOverview";

const PortfolioOverview = () => {
  const dispatch = useDispatch();
  const { projectOption, account, mintInfo } = useSelector((state: TStore) => state.projectReducer)
  const wallet = useConnectedWallet();
  const { provider } = useSolana();
  const [loadingProjects, setLoadingProjects] = useState(false);
  const [loadingMints, setLoadingMints] = useState(true);
  
  useEffect(() => {
      
    if (wallet && wallet.connected) {
      // TODO put the Program into a higher order component
      if(Object.keys(projectOption).length <= 0){
        setLoadingProjects(true);
        const accountName = "Lyappunov"
        dispatch(updatedAccount({account : {pubKey:wallet.publicKey.toString(),accountName:accountName}}))
        const anchorProvider = new Provider(provider.connection, wallet, {});
        const program = new Program(
          PsyAmericanIdl,
          new PublicKey("R2y9ip6mxmWUj4pt54jP2hz2dgvMozy9VTSwMWE7evs"),
          anchorProvider
        );
        
        (async () => {
          // on wallet connect get all the options the user holds https://github.com/mithraiclabs/psyoptions-management/issues/3
          
          const temp = await getAllWalletOptions(program, projectList);
          dispatch(updatedProjectOption({ projectOption : temp }))
          setLoadingProjects(false);
        })();
      }
      
    }
  }, [provider.connection, wallet]);

  // Load the MintInfo for all non-option SPL Tokens. This is necessary to display strike prices
  useEffect(() => {
    if(Object.keys(mintInfo).length <=0){
      (async () => {
        const mints = await loadMintInfo(
          provider.connection,
          Object.values(projectOption)
        );
        
        dispatch(updatedMintInfo({ mintInfo : mints }))
        setLoadingMints(false);
      })();
    }
    
  }, [provider.connection, projectOption]);

  return (
    // <div className={styles["index-intro-user"]}>
    <div className={styles["portfolio-container"]}>
      <div className={styles["portfolio-header"]}>
          <h2>Portfolio Overview</h2>
          <p><span>Owner Name : &nbsp;&nbsp;</span> {account.accountName} </p>
          <br/>
          <p><span>Owner Address : &nbsp;&nbsp;</span> {account.pubKey} </p>
      </div>
      <div className={styles['project-area']}>
        <div className={styles["project-area-title"]}>
          <h2>My Projects</h2>
          <p>Total : &nbsp;&nbsp;{Object.keys(projectOption).length} &nbsp; projects</p>
        </div>
        {console.log('LoadingProject value is ', loadingProjects, 'MintInfo length is ', Object.keys(mintInfo).length)}
          <div className={styles["project-card-area"]}>
            {loadingProjects || Object.keys(mintInfo).length <= 0 ? (
              <CircularProgress />
            ) : (
              Object.keys(projectOption).map((key) => (
                <ProjectOverview
                  key={key}
                  project={projectOption[key].project}
                  optionAccounts={projectOption[key].options}
                  mintInfos={mintInfo}
                />
              ))
            )}
          </div>
        </div>
    </div>
  );
};

export default PortfolioOverview;
