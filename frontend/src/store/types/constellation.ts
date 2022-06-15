export interface Constellation {
  displayName: string,
  id: number,
}

export interface ConstellationState {
  constellations: Constellation[],
  constellationIdNext: number,
}