import { useContext } from 'react';
import {
  ProgramContext,
  ProgramContextType,
} from '../context/ProgramContext';

const useProgram = (): ProgramContextType =>
  useContext(ProgramContext);

export default useProgram;
