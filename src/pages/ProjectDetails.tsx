import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {useHistory} from 'react-router-dom'
import PropTypes from "prop-types";
import {useRecoilState} from 'recoil';
import { Button } from "@material-ui/core";
import Tabs from "@material-ui/core/Tabs";
import Tab from "@material-ui/core/Tab";
import Typography from "@material-ui/core/Typography";
import Box from "@material-ui/core/Box"
import { makeStyles, Theme, createStyles } from "@material-ui/core/styles";
import AppBar from "@material-ui/core/AppBar";
import { TStore } from "../store";

import styles from "../styles/PortfolioOverview.module.scss";
import '../styles/extraStyle.css';

import { CircularProgress } from "@material-ui/core";

import OverviewPanel from "../components/OverviewPanel";
import OptionOverviewPanel from "../components/OptionOverviewPanel";
import ChartPanel from "../components/ChartPanel";
import TablePanel from "../components/TablePanel";
import ConvertibleTable from "../components/ConvertibleTable";
import { underlyingAmountPerContract, underlyingMint } from "../recoil";

type DETProps = {
  match: any;
};

interface TabContainerProps {
  id: number;
  children?: React.ReactNode;
}

// function TabContainer(props: TabContainerProps) {
//   return (
//     <Typography component="div" style={{ padding: 8 * 3 }}>
//       {props.children + " " + props.id}
//     </Typography>
//   );
// }

// TabContainer.propTypes = {
//   children: PropTypes.node.isRequired
// };
const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      flexGrow: 1,
      
    }
  })
);

const ProjectDetails: React.FC<DETProps> = ({match}) => {
  
  const projectKey = match.params.projectKey;

  const history = useHistory();
  const [value, setValue] = useState(0);
  // const [quotemint, setQuoteMint] = useRecoilState(quoteMint);
  const [underlyingmint, setUnderlyingMint] = useRecoilState(underlyingMint);
  const [underlyingamountpercontract, setUnderlyingAmountPerContract] = useRecoilState(underlyingAmountPerContract);

  const { projectOption, account, mintInfo } = useSelector((state: TStore) => state.projectReducer)
  
  
  const handleGoBack = (event:React.MouseEvent<HTMLElement>, text: string) =>{
    history.push('/');
  }

  const [currentPrice, setCurrentPrice] = useState(0);

  function handleChange(event: React.ChangeEvent<{}>, newValue: number) {
    setValue(newValue);
  }

  useEffect(()=>{
    let thefirstOption = projectOption[projectKey]?.options[0].optionMarket;
    setUnderlyingMint(thefirstOption.underlyingAssetMint);
    setUnderlyingAmountPerContract(thefirstOption.underlyingAmountPerContract);
  },[projectOption])

  useEffect(()=>{
    let symbol = projectOption[projectKey]?.project.symbol
    const url = "https://fierce-river-36860.herokuapp.com/https://pro-api.coinmarketcap.com/v1/cryptocurrency/quotes/latest?convert=USD&symbol=" + symbol
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
        <AppBar position="static">
          <Tabs value={value} onChange={handleChange}>
            <Tab label="Project Overview" />
            <Tab label="Holdings" />
            {/* <Tab label="Exercise" /> */}
          </Tabs>
        </AppBar>
        {value === 0 && <Typography component="div" style={{ padding: 8 * 3 }}>
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
                              </div>
                            </div>
                        </Typography>
        }
        {value === 1 && <Typography component="div" style={{ padding: 8 * 3 }}>
                            <div className={styles["project-card-area"]} style={{borderBottom:'1px solid #242525', paddingBottom:20}}>
                              <div className={styles['overviewPanel']}>
                                <OptionOverviewPanel 
                                  project = {projectOption[projectKey]?.project}
                                />
                              </div>

                              <div className={styles['chartPanel']}>
                                <Box sx={{ width: '88%', border:"1px solid #242525", borderRadius:10, margin:'auto', padding:'3rem'}}>
                                  <div className={styles['chart-body']}>
                                    <div className={styles['chart-title']}>
                                      <h2> Exercise your Option</h2>
                                    </div>
                                
                                    <div style={{marginBottom:'3rem', fontSize:'1.4rem'}}>
                                      Exercising your options refers to puchasing a number of shares Guestbook Rewards, Inc. is offering you at a specific price during a set period of time.
                                    </div>
                                    <div style={{minHeight:'4rem', display:'flex', alignItems:'flex-end', justifyContent:'end'}}>
                                    <a href="https://trade.psyoptions.io/#/portfolio" target={'_blank'}>
                                        <Button 
                                          variant = "contained"
                                          className={styles['bttn']}
                                        >
                                          Exercise
                                        </Button>
                                      </a>
                                    </div>
                                  </div>
                                </Box>
                              </div>
                            </div>
                          <div className={styles['tablePanel']}>
                            <TablePanel
                              project = {projectOption[projectKey]?.project}
                              optionAccounts={projectOption[projectKey].options}
                              mintInfos = {mintInfo}
                              projectKey={projectKey}
                            />
                          </div>
                          <div style={{marginTop:45, marginBottom:7}}>
                            <h2>Convertibles</h2>
                          </div>
                          <div className={styles['tablePanel']} style={{marginTop:2}}>
                            <ConvertibleTable
                              project = {projectOption[projectKey]?.project}
                              optionAccounts={projectOption[projectKey].options}
                              mintInfos = {mintInfo}
                              projectKey={projectKey}
                            />
                          </div>
                        </Typography>
        }
        {/* {value === 2 && <TabContainer id={3}>
                          Exercise Simulation page (comming soon)
                        </TabContainer>
        } */}
    </div>
  
  );
};

export default ProjectDetails;
