import {Dispatch, AnyAction} from 'redux';
import {connect} from 'react-redux';
import {createConstellation as createConstellationAction} from 'actions';
import {RootState} from 'store';
import {Constellation} from 'types/constellation';
import {Nav as Component} from './component';

const playlistSelector = (state: RootState) => state.music.playlists;
interface ContainerProps {
};

const mapStateToProps = (state: RootState, props: ContainerProps) =>  {
  const playlists = playlistSelector(state);
  return {
    playlists
  };
};

const mapDispatchToProps = (dispatch: Dispatch<AnyAction>, props: ContainerProps) => {
  return {
    createConstellation: (data: Partial<Constellation>) => (dispatch(createConstellationAction(data)))
  }
};

type StateProps = ReturnType<typeof mapStateToProps>;
type DispatchProps = ReturnType<typeof mapDispatchToProps>;

export const Nav = connect<
  StateProps,
  DispatchProps,
  ContainerProps,
  RootState
>(mapStateToProps, mapDispatchToProps)(Component);
