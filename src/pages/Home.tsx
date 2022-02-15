
import {
  useConnectedWallet
} from '@saberhq/use-solana';
import PortfolioOverview from '../components/PortfolioOverview';
import IndexIntroGuest from '../components/IndexIntroGuest';
import styles from '../styles/Home.module.scss';

const Home = () => {
  debugger;
  const wallet = useConnectedWallet();
  return (
    <section className={styles.home}>
      {
        wallet?.connected ? <PortfolioOverview /> : <PortfolioOverview /> 
      }
    </section>
  )
}

export default Home;
