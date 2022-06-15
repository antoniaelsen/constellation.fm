import type { AnyAction, Dispatch } from "redux"
import { updateTokens } from "actions/auth";

const apiFailureMiddleware = (store: any) => (next: Dispatch<AnyAction>) => (action: AnyAction) => {
  const result = next(action);
  const { meta, payload } = result;

  if (!meta?.connection || !payload) return result;
  if (payload.status !== 401) return result;
  
  const { connection } = meta;
  next(updateTokens({ [connection]: null }));

  return result;
};

export default apiFailureMiddleware;
