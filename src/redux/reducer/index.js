import { combineReducers } from 'redux';
import { player, token } from './login';
/* import game from './game'; */

const rootReducer = combineReducers({ player, token });

export default rootReducer;
