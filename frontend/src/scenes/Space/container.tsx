import { Dispatch, AnyAction } from 'redux';
import { connect } from 'react-redux';
import { createSelector } from '@reduxjs/toolkit'

import { updateTokens } from 'actions/auth';
import { getUser, getUserPlaylists } from 'actions/rest/spotify';
import { RootState } from 'store';
import { Space as Component } from './component';
import { Connection } from 'rest/constants';


const selectTokens = (state: RootState) => state.auth.tokens;
const selectConnections = createSelector(selectTokens, (tokens) => Object.entries(tokens)
  .filter(([key, value]) => !!value && Object.values((Connection as any)).includes(key))
  .map(([key, _]) => (key as Connection))
);


interface ContainerProps {
};

const mapStateToProps = (state: RootState, props: ContainerProps) =>  {
  const connections = selectConnections(state);
  return {
    connections
  };
};

const mapDispatchToProps = (dispatch: Dispatch<AnyAction>, props: ContainerProps) => {
  return {
    getUser: () => dispatch((getUser as any)()),
    getUserPlaylists: () => dispatch((getUserPlaylists as any)()),
    updateTokens: (tokens: { [key: string]: string | null }) => dispatch(updateTokens(tokens)),
  }
};

type StateProps = ReturnType<typeof mapStateToProps>;
type DispatchProps = ReturnType<typeof mapDispatchToProps>;

export const Space = connect<
  StateProps,
  DispatchProps,
  ContainerProps,
  RootState
>(mapStateToProps, mapDispatchToProps)(Component);
