import React, {useState, useEffect} from 'react';
import {
  View,
  StyleSheet,
  Image,
  Dimensions,
  TouchableOpacity,
  TextInput,
  Text,
  ScrollView,
} from 'react-native';
import {
  handleAndroidBackButton,
  removeAndroidBackButtonHandler,
} from '../utils/AndroidBackButton';
import {NBIcon as Icon, NBToast as Toast} from '../components/nativeBase';
import Colors from '../config/Colors';
import Strings from '../config/Strings';
import NavigationHandler from '../utils/NavigationHandler';
import DataBaseHelper from '../utils/Database/DatabaseHelper';

const EmployeeDetails = ({navigation}) => {
  const employeeId = navigation.getParam('id');
  const [employeeData, setEmployeeData] = useState({});
  /**
   *(get employee data)
   *@param  :null
   *@return :null
   *@created by    :albin
   *@modified by   :albin
   *@modified date :25/09/21
   */
  const bindEmployeeData = async () => {
    try {
      var getData = await DataBaseHelper.getSingleEmployeeData(employeeId);
      setEmployeeData(getData);
    } catch (err) {}
  };

  useEffect(() => {
    bindEmployeeData();

    handleAndroidBackButton(() => backButtonPress());
    return () => {
      removeAndroidBackButtonHandler();
    };
  }, []);

   backButtonPress = () => {
    NavigationHandler.handleBackPress(navigation);
  };

  /**
   *( list view)
   *@param  :null
   *@return :view
   *@created by    :albin
   *@modified by   :albin
   *@modified date :25/09/21
   */
  const ListItem = ({Item}) => {
    return (
      <>
        {Item == 'image' ? (
          <View
            style={{
              alignItems: 'center',
              justifyContent: 'center',
              backgroundColor: Colors.white,
              padding: 10,
              borderRadius: 10,
            }}>
            {employeeData.image ? (
              <Image
                style={[
                  {
                    height: Dimensions.get('screen').width * 0.4,
                    width: Dimensions.get('screen').width * 0.4,
                    borderRadius: Dimensions.get('screen').width * 0.2,
                  },
                ]}
                source={{uri: employeeData.image}}
              />
            ) : null}
          </View>
        ) : (
          <View
            style={{
              flex: 1,
              justifyContent: 'flex-start',
              alignItems: 'flex-start',
              margin: 10,
              marginTop: 15,
              backgroundColor: Colors.white,
              padding: 10,
              borderRadius: 10,
            }}>
            <Text
              style={{
                color: Colors.grey,
                fontSize: Dimensions.get('screen').width * 0.03,
              }}>
              {Item.toUpperCase()}
            </Text>
            <Text
              style={{
                color: Colors.black,
                fontSize: Dimensions.get('screen').width * 0.04,
              }}>
              {employeeData[Item] != undefined && employeeData[Item] != null
                ? employeeData[Item]
                : ''}
            </Text>
          </View>
        )}
      </>
    );
  };

  return (
    <View style={style.container}>
      <ScrollView style={{padding: 5}}>
        <View style={{marginVertical: 10}}>
          <ListItem Item={'image'} />
          <ListItem Item={'name'} />
          <ListItem Item={'username'} />
          <ListItem Item={'email'} />
          <ListItem Item={'company'} />
          <ListItem Item={'website'} />
          <ListItem Item={'address'} />
          <ListItem Item={'phone'} />
        </View>
      </ScrollView>
    </View>
  );
};

EmployeeDetails.navigationOptions = {
  //   header: null,
  headerLeft: (
    <TouchableOpacity
      style={{
        alignItems: 'center',
        justifyContent: 'center',
        marginLeft: 5,
        flexDirection: 'row',
      }}
      onPress={() => {
        backButtonPress();
      }}>
      <Icon
        style={{
          color: Colors.black,
          fontSize: Dimensions.get('screen').width * 0.065,
        }}
        name={'arrow-back-ios'}
        type={'MaterialIcons'}
      />
    </TouchableOpacity>
  ),
};

const style = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.lightGrey,
  },
});

export default EmployeeDetails;
