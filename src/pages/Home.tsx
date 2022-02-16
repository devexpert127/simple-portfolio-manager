
import {
  useConnectedWallet
} from '@saberhq/use-solana';
import PortfolioOverview from '../components/PortfolioOverview';
// import ProjectOverview from '../components/ProjectOverview';
import IndexIntroGuest from '../components/IndexIntroGuest';
import styles from '../styles/Home.module.scss';

const Home = () => {
  
  const wallet = useConnectedWallet();
  return (
        wallet?.connected ? <PortfolioOverview /> : <PortfolioOverview />   
  )
}

export default Home;
