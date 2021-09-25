import types from '../types';
/**
 *(show hide progress)
 *@created by    :albin
 *@modified by   :albin
 *@modified date :25/09/21
 */
const showHideProgress = (payload = false) => {
  return {
    type: types.TOGGLE_PROGRESS,
    payload: payload,
  };
};
/**
 *(SET EMPLOYEE DATA)
 *@created by    :albin
 *@modified by   :albin
 *@modified date :25/09/21
 */
const SetEmployeeData = (payload = []) => {
  return {
    type: types.SET_EMPLOYEEDATA,
    payload: payload,
  };
};
/**
 *(SET EMPLOYEE DATA COPY)
 *@created by    :albin
 *@modified by   :albin
 *@modified date :25/09/21
 */
const SetEmployeeDataCopy = (payload = []) => {
  return {
    type: types.SET_EMPLOYEEDATA_COPY,
    payload: payload,
  };
};

const Actions = {
  showHideProgress,
  SetEmployeeData,
  SetEmployeeDataCopy
};
export default Actions;
