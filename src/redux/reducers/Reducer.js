import types from '../types';
import {initialState} from '../InitialState';

const Reducer = (state = initialState, action) => {
  switch (action.type) {
    case types.TOGGLE_PROGRESS:
      return {
        ...state,
        progress: !state.progress,
      };
    case types.SET_EMPLOYEEDATA:
      return {
        ...state,
        employeeData: action.payload,
      };
    case types.SET_EMPLOYEEDATA_COPY:
      return {
        ...state,
        employeeDataCopy: action.payload,
      };
    default:
      return state;
  }
};

export default Reducer;
