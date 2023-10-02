import {StyleSheet} from 'react-native';
import {Colors, Fonts, Metrics} from '../../theme';
import DeviceInfo from 'react-native-device-info';

export default StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background.primary,
  },
  searchCompCont: {
    marginTop: Metrics.deviceStatusBarHeight + 10,
  },
  itemMainView: {flexDirection: 'row', alignItems: 'center', padding: 10},
  itemInnerView: {flexDirection: 'row', alignItems: 'center', flex: 0.95},
  itemImage: {width: 47, height: 47, borderRadius: 23},
  itemTitle: {color: Colors.white, marginLeft: 15, width: '85%'},
  itemViewBtn: {
    backgroundColor: Colors.background.purple,
    borderRadius: 2,
    width: 124,
    height: 32,
    alignItems: 'center',
    justifyContent: 'center',
  },
  itemViewTxt: {color: Colors.white, marginLeft: 15},
  searchBarView: {
    width: Metrics.screenWidth,
    justifyContent: 'center',
    paddingTop: Platform.OS === 'ios' && DeviceInfo.hasNotch() ? 55 : 35,
    paddingBottom: 10,
    flexDirection: 'row',
    alignItems: 'center',
  },
  searchView: {
    flexDirection: 'row',
    alignItems: 'center',
  },
});
