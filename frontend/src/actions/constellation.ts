import { Constellation } from "store/types/constellation";

export const CREATE_CONSTELLATION = 'CREATE_CONSTELLATION';
export const DESTROY_CONSTELLATION = 'DESTROY_CONSTELLATION';
export const MOVE_CONSTELLATION = 'MOVE_CONSTELLATION';
export const UPDATE_CONSTELLATION = 'UPDATE_CONSTELLATION';


// interface CreateConstellationAction {
//   type: typeof CREATE_CONSTELLATION,
//   payload: Constellation
// };

// interface DestroyConstellationAction {
//   type: typeof DESTROY_CONSTELLATION,
//   payload: number
// };

// interface UpdateConstellationAction {
//   type: typeof UPDATE_CONSTELLATION,
//   payload: { id: number, data: Constellation }
// };

// export type ConstellationActionTypes = CreateConstellationAction | DestroyConstellationAction | UpdateConstellationAction;



export const createConstellation = (constellation: Partial<Constellation>) => ({
  type: CREATE_CONSTELLATION,
  payload: constellation,
});

export const destroyConstellation = (id: number) => ({
  type: DESTROY_CONSTELLATION,
  payload: id,
});

export const moveConstellation = (id: number, index: number) => ({
  type: MOVE_CONSTELLATION,
  payload: {id, index}
});

export const updateConstellation = (id: number, constellation: Partial<Constellation>) => ({
  type: UPDATE_CONSTELLATION,
  payload: { id, constellation },
});