import { Dispatch, AnyAction } from 'redux';
import { connect} from 'react-redux';

import { RootState } from 'store';
import { Playback as Component } from './component';


const connectionsSelector = (state: RootState) => {
  const tokens = state.auth.tokens;
  return tokens;
};

interface ContainerProps {};

const mapStateToProps = (state: RootState) =>  {
  const connections = connectionsSelector(state);
  console.log("Playback Hoc | connections:", connections);

  return {
    connections
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
