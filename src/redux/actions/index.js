import storagePlayers from '../../service/storagePlayers';

export const saveUser = (payload) => ({
  type: 'ADD_USER',
  payload,
});

const fetchApiToken = (token) => ({
  type: 'ADD_TOKEN',
  token,
});

export const addScore = (score) => ({
  type: 'ADD_SCORE',
  score,
});

export const fetchApiTokenThunk = (response) => async (dispatch) => {
  storagePlayers(response);
  dispatch(fetchApiToken(response));
};
