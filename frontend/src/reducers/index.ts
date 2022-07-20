import { combineReducers } from 'redux';

import auth from './auth';
import constellation from './constellation';
import music from './music';
import settings from './settings';


export default combineReducers({ auth, constellation, music, settings });
