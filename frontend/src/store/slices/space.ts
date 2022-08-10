
export const space = (set, get) => {
  return {
    space: {
      orbitcontrols: {
        target: undefined
      },
      setOrbitControlsTarget: (target) => set((prev) => ({
        ...prev,
        space: {
          ...prev.space,
          orbitcontrols: {
            ...prev.space.orbitcontrols,
            target
          }
        }
      })),
    },
  }
};