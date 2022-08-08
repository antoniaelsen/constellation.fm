import type { AnyAction, Dispatch } from "redux"
import { updateTokens } from "actions/auth";

const apiFailureMiddleware = (store: any) => (next: Dispatch<AnyAction>) => (action: AnyAction) => {
  const result = next(action);
  const { meta, payload } = result;

  if (!meta?.service || !payload) return result;
  if (payload.status !== 401) return result;
  
  const { service } = meta;
  next(updateTokens({ [service]: null }));

  return result;
};

export default apiFailureMiddleware;
