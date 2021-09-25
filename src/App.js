import React from 'react';
import {createAppContainer} from 'react-navigation';
import {createStackNavigator} from 'react-navigation-stack';
import EmployeeList from './screens/EmployeeList';
import EmployeeDetails from './screens/EmployeeDetails';
import {MyRoot} from './components/MyRoot';
import {Provider} from 'react-redux';
import store from './redux/store';

const MainNavigator = createStackNavigator(
  {
    EmployeeList: {screen: EmployeeList},
    EmployeeDetails: {screen: EmployeeDetails},
  },
  {
    initialRouteName: 'EmployeeList',
  },
);

const App = createAppContainer(MainNavigator);

export default () => {
  return (
    <Provider store={store}>
      <MyRoot>
        <App />
      </MyRoot>
    </Provider>
  );
};
