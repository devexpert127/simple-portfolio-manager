import React, { createContext, useMemo, useEffect, useState } from 'react';
import { Program, Provider } from "@project-serum/anchor";
import { PsyAmericanIdl } from "@mithraic-labs/psy-american";
import { useConnectedWallet, useSolana } from "@saberhq/use-solana";
import { PublicKey } from '@solana/web3.js';


export type ProgramContextType = {
  program : Program
};

const ProgramContext = createContext<ProgramContextType>({program : new Program(PsyAmericanIdl, new PublicKey('R2y9ip6mxmWUj4pt54jP2hz2dgvMozy9VTSwMWE7evs'))});

const ProgramProvider: React.FC = ({ children }) => {

  const [programCon, setProgramCon] = useState<ProgramContextType>({program : new Program(PsyAmericanIdl, new PublicKey('R2y9ip6mxmWUj4pt54jP2hz2dgvMozy9VTSwMWE7evs'))})
  const wallet = useConnectedWallet();
  const { provider } = useSolana();
  useEffect(()=>{
    if (wallet && wallet.connected){
      const anchorProvider = new Provider(provider.connection, wallet, {});
      const program = new Program(
        PsyAmericanIdl,
        new PublicKey("R2y9ip6mxmWUj4pt54jP2hz2dgvMozy9VTSwMWE7evs"),
        anchorProvider
      );
      const programObj = {program : program}
      setProgramCon(programObj)
    }
  }, [wallet])
  

  return (
    <ProgramContext.Provider value={programCon}>
      {children}
    </ProgramContext.Provider>
  );
};

export { ProgramContext, ProgramProvider };
