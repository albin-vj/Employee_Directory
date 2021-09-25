import {BackHandler} from 'react-native';

const NavigationHandler = {
  /**
   *(manage back button)
   *@param  :navigation,exit
   *@return :null
   *@created by    :albin
   *@modified by   :albin
   *@modified date :25/09/21
   */
  handleBackPress(navigation, exit) {
    try {
      let index = navigation.dangerouslyGetParent().state.index;
      if (exit) BackHandler.exitApp();
      else if (index > 0) navigation.goBack();
      else BackHandler.exitApp();
    } catch (err) {}
  },

  /**
   *(handle navigation)
   *@param  :navigation,page,params
   *@return :null
   *@created by    :albin
   *@modified by   :albin
   *@modified date :25/09/21
   */
  navigateToPage(navigation, page, param) {
    if (!navigation) return;
    if (param) navigation.navigate(page, param);
    else navigation.navigate(page);
  },
};

export default NavigationHandler;
