import { atom } from 'recoil';
import { networks } from '../../utils/networkInfo';

// Default to MAINNET
const MAINNET = networks[0];
// Default to DEVNET
const DEVNET = networks[1];

export const activeNetwork = atom({
  key: 'activeNetwork',
  // default: MAINNET,
  default:DEVNET,
});
