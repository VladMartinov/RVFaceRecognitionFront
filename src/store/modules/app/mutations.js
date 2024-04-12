export const mutation = {
  SET_LOADING: "SET_LOADING",
};

export default {
  [mutation.SET_LOADING]: (state, isLoading) => (state.loading = isLoading),
};
