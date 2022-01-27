import { Dispatch, AnyAction } from 'redux';
import { connect} from 'react-redux';

import { RootState } from 'store';
import { Playback as Component } from './component';


const connectionTokensSelector = (state: RootState) => {
  const { connections, tokens } = state.auth;
  console.log("Playback HOC | Connections", connections, "tokens", tokens);
  const playbackConnectionTokens = connections.reduce((acc, connection) => {
    const tokenKeys = Object.keys(tokens);
    const playbackKey = `${connection}-playback`;
    if (!tokenKeys.includes[playbackKey]) return acc;
    return {
      ...acc,
      [connection]: tokens[playbackKey]
    };
  }, {});
  return playbackConnectionTokens;
};

interface ContainerProps {};

const mapStateToProps = (state: RootState) =>  {
  const connectionTokens = connectionTokensSelector(state);
  console.log("Playback Hoc | connectionTokens:", connectionTokens);

  return {
    connectionTokens
  };
};

const mapDispatchToProps = (dispatch: Dispatch<AnyAction>, props: ContainerProps) => {
  return {
  }
};

type StateProps = ReturnType<typeof mapStateToProps>;
type DispatchProps = ReturnType<typeof mapDispatchToProps>;

export const Playback = connect<
  StateProps,
  DispatchProps,
  ContainerProps,
  RootState
>(mapStateToProps)(Component);
