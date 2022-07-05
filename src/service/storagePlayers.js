/* import fetchToken from './fetchToken'; */

const saveToken = async (returnApi) => {
  localStorage.setItem('token', returnApi);
};

export default saveToken;
