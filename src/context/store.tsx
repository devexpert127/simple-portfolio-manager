import React, { cloneElement } from 'react';
import { ThemeProvider } from '@material-ui/core/styles';

import { ConnectionProvider } from './ConnectionContext';
import { OwnedTokenAccountsProvider } from './OwnedTokenAccounts';
import { NotificationsProvider } from './NotificationsContext';
import { AssetListProvider } from './AssetListContext';
import { SerumProvider } from './SerumContext';
import { SerumOrderbooksProvider } from './SerumOrderbookContext';
// import { ProgramProvider } from './ProgramContext';

const _providers: React.ReactElement[] = [
  // eslint-disable-next-line react/no-children-prop
  <ConnectionProvider key="ConnectionProvider" />,
  <NotificationsProvider key="NotificationsProvider" />,
  <SerumProvider key="SerumProvider"/>,
  <SerumOrderbooksProvider key="SerumOrderbooksProvider"/>,
  <OwnedTokenAccountsProvider key="OwnedTokenAccountsProvider" />,
  <AssetListProvider key="AssetListProvider" />,
  // <ProgramProvider key = "ProgramProvider" />
];

// flatten context providers for simpler app component tree
const ProviderComposer: React.FC<{
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  providers: any[];
}> = ({ providers, children }) =>
  providers.reduceRight(
    (kids, parent) => cloneElement(parent, { children: kids }),
    children,
  );

const Store: React.FC = ({ children }) => (
  <ProviderComposer providers={_providers}>{children}</ProviderComposer>
);

export default Store;
