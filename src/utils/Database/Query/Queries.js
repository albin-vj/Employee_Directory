export const Queries = {
  //Get employee details
  GET_EMPPLOYEES: 'select * from employee group by id',
  GET_EMPLOYEE_DATA: 'select * from employee where id= ? group by id',
};
