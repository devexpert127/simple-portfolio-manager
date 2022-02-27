import { getOptionByKey, PsyAmericanIdl } from '@mithraic-labs/psy-american';
import { PublicKey } from '@solana/web3.js';
import { useCallback } from 'react';

import { useUpsertOption } from './atoms';

import { useConnectedWallet, useSolana } from "@saberhq/use-solana";
import { Program, Provider } from "@project-serum/anchor";

export const useFetchAndUpsertOption = (): ((optionKey: PublicKey) => void) | null => {

  const wallet = useConnectedWallet();
  const { provider } = useSolana();
  let program : Program

  if (wallet && wallet.connected) {
    const anchorProvider = new Provider(provider.connection, wallet, {});
    program = new Program(
      PsyAmericanIdl,
      new PublicKey("R2y9ip6mxmWUj4pt54jP2hz2dgvMozy9VTSwMWE7evs"),
      anchorProvider
    );
  }
  const upsertOption = useUpsertOption();

    return useCallback(
      async (optionKey) => {
        if (!program) {
          return;
        }
        const option = await getOptionByKey(program, optionKey);
        if (option) {
          upsertOption(option);
        }
      },
      [upsertOption],
    );
};
