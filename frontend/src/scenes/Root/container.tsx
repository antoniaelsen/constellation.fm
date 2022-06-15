import { Dispatch, AnyAction } from 'redux';
import { connect } from 'react-redux';

import { updateTokens } from 'actions/auth';
import { getUser, getUserPlaylists } from 'actions/rest/spotify';
import { RootState } from 'store';
import { Root as Component } from './component';


const selectConnections = (state: RootState) => state.auth.connections;
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

export const Root = connect<
  StateProps,
  DispatchProps,
  ContainerProps,
  RootState
>(mapStateToProps, mapDispatchToProps)(Component);
