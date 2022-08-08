export const TOGGLE_TOOLTIPS = 'TOGGLE_TOOLTIPS';

export const toggleTooltips = (state: boolean) => ({
  type: TOGGLE_TOOLTIPS,
  payload: state
});
