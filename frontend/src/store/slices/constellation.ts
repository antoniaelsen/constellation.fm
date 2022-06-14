import { omit } from "lodash";
import { Constellation } from "store/types/constellation";

export const constellation = (set, get) => {
  return {
    constellations: {
      constellations: {},
      createConstellation: (constellation: Partial<Constellation> & { id: string }) => set((prev) => ({
        constellations: {
          [constellation.id]: constellation
        }
      })),
      destroyConstellation: (constellation: Constellation) => set((prev) => ({
        constellations: omit(prev.constellations, constellation.id)
      })),
      updateConstellation: (id, constellation: Constellation) => set((prev) => ({
        constellations: {
          [id]: constellation
        }
      })),
    }
  }
};
