import React, {useState, useEffect} from 'react';
import {
  View,
  StyleSheet,
  Image,
  Dimensions,
  TouchableOpacity,
  TextInput,
  Text,
  FlatList,
  RefreshControl,
} from 'react-native';
import {
  handleAndroidBackButton,
  removeAndroidBackButtonHandler,
} from '../utils/AndroidBackButton';
import {Actions} from '../redux/actions';
import {useSelector, useDispatch} from 'react-redux';
import NavigationHandler from '../utils/NavigationHandler';
import {NBIcon as Icon, NBToast as Toast} from '../components/nativeBase';
import Colors from '../config/Colors';
import Strings from '../config/Strings';
import DataBaseHelper from '../utils/Database/DatabaseHelper';
import NetworkCall from '../api/NetworkCall';
import {EMPLOYEE_DATA} from '../api/Api';

const EmployeeList = ({navigation}) => {
  const state = useSelector((state) => state);
  const dispatch = useDispatch();
  const [refreshing, setRefreshing] = useState(false);
  /**
   *(check employees data)
   *@param  :null
   *@return :null
   *@created by    :albin
   *@modified by   :albin
   *@modified date :25/09/21
   */
  const bindData = async () => {
    dispatch(Actions.showHideProgress());
    try {
      await DataBaseHelper.CreateTables();
      if (state.employeeData.length == 0) {
        var data = await DataBaseHelper.getEmployeesData();
        if (!data || data.length == 0) await fetchData();
        else setData(data);
      }
    } catch (err) {}
    dispatch(Actions.showHideProgress());
  };
  useEffect(() => {
    bindData();

    handleAndroidBackButton(() =>
      NavigationHandler.handleBackPress(navigation, true),
    );
    return () => {
      removeAndroidBackButtonHandler();
    };
  }, []);
  /**
   *(refresh list)
   *@param  :null
   *@return :null
   *@created by    :albin
   *@modified by   :albin
   *@modified date :25/09/21
   */
  const onRefresh = React.useCallback(() => {
    setRefreshing(true);
    bindData();
    setRefreshing(false);
  }, [refreshing]);
  /**
   *(set data in redux)
   *@param  :null
   *@return :null
   *@created by    :albin
   *@modified by   :albin
   *@modified date :25/09/21
   */
  const setData = (data) => {
    dispatch(Actions.SetEmployeeDataCopy(data));
    dispatch(Actions.SetEmployeeData(data));
  };
  /**
   *(fetch data from server)
   *@param  :null
   *@return :null
   *@created by    :albin
   *@modified by   :albin
   *@modified date :25/09/21
   */
  const fetchData = async () => {
    var data = await NetworkCall.post(EMPLOYEE_DATA);
    if (!data) {
      Toast({text: Strings.Something_Wrong, type: 'danger'});
      return;
    }
    if (data.error) {
      Toast({text: Strings.No_Network, type: 'danger'});
      return;
    }
    if (data.length > 0) {
      await DataBaseHelper.bulkEmployeeInsert(data);

      var inserteddata = await DataBaseHelper.getEmployeesData();
      setData(inserteddata);
    }
  };
  /**
   *(search)
   *@param  :null
   *@return :null
   *@created by    :albin
   *@modified by   :albin
   *@modified date :25/09/21
   */
  const search = (text) => {
    try {
      if (!text) {
        dispatch(Actions.SetEmployeeData(state.employeeDataCopy));
        return;
      }
      var rslts = state.employeeDataCopy.filter(function (item) {
        if (
          (item.name && item.name.toLowerCase().includes(text.toLowerCase())) ||
          (item.email && item.email.toLowerCase().includes(text.toLowerCase()))
        )
          return item;
      });
      dispatch(Actions.SetEmployeeData(rslts));
    } catch (err) {}
  };

  /**
   *(empty list view)
   *@param  :null
   *@return :view
   *@created by    :albin
   *@modified by   :albin
   *@modified date :25/09/21
   */
  const EmptyListItem = () => {
    return !state.progress ? (
      <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
        {/* <Image style={[{ height:Dimensions.get("screen").width*0.4,width:Dimensions.get("screen").width*0.4,borderRadius:Dimensions.get("screen").width*0.2,opacity:0.25}]} 
            source={} /> */}

        <Text
          style={{
            color: Colors.darkGray,
            fontSize: Dimensions.get('screen').width * 0.04,
          }}>
          {'No data available!'}
        </Text>
      </View>
    ) : null;
  };
  /**
   *(employee item view)
   *@param  :Item
   *@return :view
   *@created by    :albin
   *@modified by   :albin
   *@modified date :25/09/21
   */
  const EmployeeItemList = ({Item}) => {
    return (
      <TouchableOpacity
        style={{
          backgroundColor: Colors.white,
          justifyContent: 'center',
          borderRadius: 10,
          marginHorizontal: 15,
          marginVertical: 10,
          elevation: 1,
          padding: 10,
        }}
        onPress={() => {
          NavigationHandler.navigateToPage(navigation, 'EmployeeDetails', {
            id: Item.id,
          });
        }}>
        <View style={{flexDirection: 'row'}}>
          <View>
            {Item.image ? (
              <Image
                style={[
                  {
                    height: Dimensions.get('screen').width * 0.2,
                    width: Dimensions.get('screen').width * 0.2,
                    borderRadius: Dimensions.get('screen').width * 0.1,
                  },
                ]}
                source={{uri: Item.image}}
              />
            ) : null}
          </View>
          <View style={{padding: 5}}>
            <Text style={{padding: 2, fontSize: 12}}>{Item.name ?? ''}</Text>
            <Text style={{padding: 2, fontSize: 12, color: Colors.grey}}>
              {Item.company ?? ''}
            </Text>
          </View>
        </View>
      </TouchableOpacity>
    );
  };
  return (
    <View style={style.container}>
      <View style={style.SectionStyle}>
        <TextInput
          style={{flex: 1, marginLeft: 5}}
          placeholder={'Search user'}
          underlineColorAndroid="transparent"
          onChangeText={(text) => {
            search(text);
          }}
          onSubmitEditing={(text) => {}}
        />
      </View>
      <View style={{justifyContent: 'center', flex: 1}}>
        <FlatList
          refreshControl={
            <RefreshControl
              colors={[Colors.black, Colors.black]}
              refreshing={refreshing}
              onRefresh={onRefresh}
            />
          }
          data={state.employeeData}
          renderItem={({item, index}) => <EmployeeItemList Item={item} />}
          keyExtractor={(item) => item.id}
          ListEmptyComponent={EmptyListItem}
        />
      </View>
    </View>
  );
};

EmployeeList.navigationOptions = {
  header: null,
};

const style = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.lightGrey,
  },
  SectionStyle: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: Colors.white,
    borderWidth: 0.5,
    borderColor: Colors.lightGrey,
    borderRadius: 5,
    marginVertical: 20,
    marginHorizontal: 15,
  },
});

export default EmployeeList;
