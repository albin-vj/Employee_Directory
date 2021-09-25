import {Platform} from 'react-native';
import Queries from './Query';
var SQLite = require('react-native-sqlite-storage');
var sqllit_Data =
  Platform.OS == 'android'
    ? require('../sqllit.json')
    : require('../sqllitios.json');
import Query from './Query';
import employee from './Tables';
SQLite.DEBUG(false);

const DataBaseHelper = {
  /**
   *Create table
   *@param  :Null
   *@return :Success
   *@created by    :Albin
   *@modified by   :Albin
   *@modified date :25/09/21
   */
  CreateTables() {
    var db = SQLite.openDatabase({
      name: sqllit_Data.name,
      createFromLocation: sqllit_Data.createFromLocation,
    });
    return new Promise((resolve, reject) => {
      db.transaction(
        async (tx) => {
          var query =
            'CREATE TABLE IF NOT EXISTS `employee` (' +
            employee.ID +
            ' TEXT, ' +
            employee.name +
            ' TEXT, ' +
            employee.username +
            ' TEXT, ' +
            employee.website +
            ' TEXT, ' +
            employee.email +
            ' TEXT, ' +
            employee.address +
            ' TEXT, ' +
            employee.company +
            ' TEXT, ' +
            employee.phone +
            ' TEXT, ' +
            employee.profile_image +
            ' TEXT ' +
            ');';
          tx.executeSql(query, [], (tx, results) => {
            resolve('success');
          });
        },
        null,
        (err) => {},
      );
    });
    db.close();
  },

  /**
   *Clear  table
   *@param  :Null
   *@return :Success
   *@created by    :Albin
   *@modified by   :Albin
   *@modified date :25/09/21
   */
  async clearTable(tableName) {
    var db = SQLite.openDatabase({
      name: sqllit_Data.name,
      createFromLocation: sqllit_Data.createFromLocation,
    });
    return new Promise(async (resolve, reject) => {
      db.transaction(
        (tx) => {
          var query = 'DELETE FROM  `' + tableName + '`';
          tx.executeSql(query, [], (tx, results) => {
            resolve('success');
          });
        },
        null,
        (err) => {},
      );
    });

    db.close();
  },

  /**
   *get employees  table
   *@param  :Null
   *@return :data
   *@created by    :Albin
   *@modified by   :Albin
   *@modified date :25/09/21
   */
  async getEmployeesData() {
    var db = SQLite.openDatabase({
      name: sqllit_Data.name,
      createFromLocation: sqllit_Data.createFromLocation,
    });
    return new Promise(async (resolve, reject) => {
      db.transaction(
        (tx) => {
          tx.executeSql(Queries.GET_EMPPLOYEES, [], (tx, results) => {
            var dataArray = [];
            var len = results.rows.length;
            for (let i = 0; i < len; i++) {
              let row = results.rows.item(i);

              var dataObj = {};
              dataObj = row;
              dataArray.push(dataObj);
            }
            resolve(dataArray);
          });
        },
        null,
        (err) => {},
      );
    });

    db.close();
  },

  /**
   *get employee  table
   *@param  :Null
   *@return :data
   *@created by    :Albin
   *@modified by   :Albin
   *@modified date :25/09/21
   */
  async getSingleEmployeeData(id) {
    var db = SQLite.openDatabase({
      name: sqllit_Data.name,
      createFromLocation: sqllit_Data.createFromLocation,
    });
    return new Promise(async (resolve, reject) => {
      db.transaction(
        (tx) => {
          tx.executeSql(Queries.GET_EMPLOYEE_DATA, [id], (tx, results) => {
            var len = results.rows.length;
            var dataObj = {};
            if (len > 0) {
              let row = results.rows.item(0);

              dataObj = row;
            }
            resolve(dataObj);
          });
        },
        null,
        (err) => {},
      );
    });

    db.close();
  },

  /**
   *bulk insert employee  table
   *@param  :Null
   *@return :Success
   *@created by    :Albin
   *@modified by   :Albin
   *@modified date :25/09/21
   */
  async bulkEmployeeInsert(employedata) {
    await this.clearTable(employee.TABLE_NAME);
    var db = SQLite.openDatabase({
      name: sqllit_Data.name,
      createFromLocation: sqllit_Data.createFromLocation,
    });
    var query =
      'INSERT INTO ' +
      employee.TABLE_NAME +
      ' (' +
      employee.ID +
      ',' +
      employee.name +
      ',' +
      employee.username +
      ',' +
      employee.email +
      ',' +
      employee.address +
      ',' +
      employee.phone +
      ',' +
      employee.website +
      ',' +
      employee.company +
      ',' +
      employee.profile_image +
      ') values ';
    var values_string = ' (?,?,?,?,?,?,?,?,?)';
    query += values_string;
    return new Promise((resolve, reject) => {
      db.transaction(
        (tx) => {
          for (var i = 0; i < employedata.length; i++) {
            var employedata_obj = employedata[i];
            var parameters = [];
            var employeeid = '';
            var name = '';
            var username = '';
            var email = '';
            var address = '';
            var phone = '';
            var website = '';
            var company = '';
            var profile_image = '';

            if (employedata_obj.hasOwnProperty('id'))
              employeeid = employedata_obj['id'];

            if (employedata_obj.hasOwnProperty('name'))
              name = employedata_obj['name'];
            if (employedata_obj.hasOwnProperty('username'))
              username = employedata_obj['username'];
            if (employedata_obj.hasOwnProperty('email'))
              email = employedata_obj['email'];
            if (
              employedata_obj.hasOwnProperty('address') &&
              employedata_obj.address?.street
            )
              address = employedata_obj['address']['street'];
            if (employedata_obj.hasOwnProperty('phone'))
              phone = employedata_obj['phone'];
            if (employedata_obj.hasOwnProperty('website'))
              website = employedata_obj['website'];
            if (
              employedata_obj.hasOwnProperty('company') &&
              employedata_obj.company?.name
            )
              company = employedata_obj['company']['name'];
            if (employedata_obj.hasOwnProperty('profile_image'))
              profile_image = employedata_obj['profile_image'];

            parameters.push(employeeid + '');
            parameters.push(name + '');
            parameters.push(username + '');
            parameters.push(email + '');
            parameters.push(address + '');
            parameters.push(phone + '');
            parameters.push(website + '');
            parameters.push(company + '');
            parameters.push(profile_image + '');

            if (employedata.length > 0) {
              tx.executeSql(query, parameters, (tx, results) => {
                resolve({status: 'success'});
              });
            }
          }
        },
        null,
        (err) => {},
      );
    });
    db.close();
  },
};

export default DataBaseHelper;
