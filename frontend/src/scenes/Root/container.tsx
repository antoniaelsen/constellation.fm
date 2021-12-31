import {Dispatch, AnyAction} from 'redux';
import {connect} from 'react-redux';
import {RootState} from 'store';
import {setAuthentication as setAuthenticationAction} from 'actions';
import {Root as Component} from './component';


interface ContainerProps {
};

const mapStateToProps = (state: RootState, props: ContainerProps) =>  {
  return {
    isAuthenticated: state.auth.isAuthenticated,
  };
};

const mapDispatchToProps = (dispatch: Dispatch<AnyAction>, props: ContainerProps) => {
  return {
    setAuthentication: (state: boolean) => { dispatch(setAuthenticationAction(state)) }
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
