import { Dispatch, AnyAction } from 'redux';
import { connect } from 'react-redux';
import { clearTokens, updateConnections, updateTokens, setAuthentication } from 'actions';
import { RootState } from 'store';
import { AuthProvider as Component } from './component';
import { Service } from "lib/constants";
export { useAuth } from './component';

interface ContainerProps {
};

const mapStateToProps = (state: RootState, props: ContainerProps) =>  {
  const { isAuthenticated, tokens } = state.auth;
  return {
    isAuthenticated,
    tokens
  }
};

const mapDispatchToProps = (dispatch: Dispatch<AnyAction>, props: ContainerProps) => {
  return {
    setAuthentication: (state: boolean) => dispatch(setAuthentication(state)),
    clearTokens: () => dispatch(clearTokens()),
    updateConnections: (connections: Service[]) => dispatch(updateConnections(connections)),
    updateTokens: (tokens: { [key: string]: string | null }) => dispatch(updateTokens(tokens)),
  }
};

type StateProps = ReturnType<typeof mapStateToProps>;
type DispatchProps = ReturnType<typeof mapDispatchToProps>;

export const AuthProvider = connect<
  StateProps,
  DispatchProps,
  ContainerProps,
  RootState
>(mapStateToProps, mapDispatchToProps)(Component);
