import { Dispatch, AnyAction } from 'redux';
import { connect } from 'react-redux';

import { RootState } from 'store';
import { Space as Component } from './component';

interface ContainerProps {
  playlistId: string;
};

const mapStateToProps = (state: RootState, props: ContainerProps) =>  {
  return {
  };
};

const mapDispatchToProps = (dispatch: Dispatch<AnyAction>, props: ContainerProps) => {
  return {
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
