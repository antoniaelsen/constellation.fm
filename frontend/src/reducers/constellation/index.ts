import _ from 'lodash';
import { AnyAction } from 'redux';
import {
  CREATE_CONSTELLATION,
  DESTROY_CONSTELLATION,
  MOVE_CONSTELLATION,
  UPDATE_CONSTELLATION,
} from 'actions';
import { ConstellationState } from 'store/types/constellation';


export const initialState : ConstellationState = {
  constellations: [],
  constellationIdNext: 0,
};

type ConstellationReducer = (state: ConstellationState, data: any) => ConstellationState;

const reducers: {[key: string]: ConstellationReducer} = {
  [CREATE_CONSTELLATION]: (state, action) => {
    const constellationIdNext = state.constellationIdNext + 1;
    const constellation = {...action.payload, id: constellationIdNext};
    console.log("Adding constellation to store:", constellation);
    const constellations = [...state.constellations, constellation];
    return { ...state, constellations, constellationIdNext};
  },

  [DESTROY_CONSTELLATION]: (state, action) => {
    const id = action.payload;
    const constellations = state.constellations.filter(constellation => constellation.id !== id);
    return { ...state, constellations };
  },

  [MOVE_CONSTELLATION]: (state, action) => {
    const { id, index } = action.payload;
    const src = state.constellations.findIndex(constellation => constellation.id === id);
    const constellation = _.cloneDeep(state.constellations.find(constellation => constellation.id === id));
    if (!constellation) return state;

    let constellations = _.cloneDeep(state.constellations);
    constellations.splice(src, 1);
    constellations.splice(index, 0, constellation);
    return { ...state, constellations };
  },

  [UPDATE_CONSTELLATION]: (state, action) => {
    const { id, constellation: payload } = action.payload;
    const constellations = state.constellations.map(constellation => {
      if (constellation.id !== id) return constellation;

      return _.merge(constellation, payload);
    });
    return { ...state, constellations };
  },
};

export default (state = initialState, action: AnyAction) => {
  const reducer = reducers[action.type];
  return reducer ? reducer(state, action) : state;
};
