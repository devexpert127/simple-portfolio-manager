
import {
  useConnectedWallet
} from '@saberhq/use-solana';
import TreasuryFormEdit from '../components/TreasuryFormEdit';
import styles from '../styles/Treasury.module.scss';
import styles_app from '../styles/app.module.scss';
import { Link } from 'react-router-dom';

type TEProps = {
  match: any;
};

const TreasuryEdit: React.FC<TEProps> = ({
  match
}) => {
  const publicKey = match.params.publicKey;
  const wallet = useConnectedWallet();
  return (
    <section className={styles.treasury}>
      <nav className={styles_app['nav-breadcrumbs']}>
        <Link to="/">
          <span>Home</span>
        </Link>
        <Link to="/treasury">
          <span>Treasury</span>
        </Link>
        <Link to="/treasury/edit">
          <span>Edit</span>
        </Link>
       </nav>
      {
        wallet?.connected ?
          <>
            <TreasuryFormEdit publicKey={publicKey} />
          </>
        : <>Let's connect your wallet</> 
      }
    </section>
  )
}

export default TreasuryEdit;
