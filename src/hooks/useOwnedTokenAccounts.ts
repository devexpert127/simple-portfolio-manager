import { useContext } from 'react';
import { convertToObject } from 'typescript';
import {
  OwnedTokenAccountsContext,
  OwnedTokenAccountsContextT,
} from '../context/OwnedTokenAccounts';

const useOwnedTokenAccounts = (): OwnedTokenAccountsContextT =>
  useContext(OwnedTokenAccountsContext);
export default useOwnedTokenAccounts;
