/* eslint-disable react-native/no-inline-styles */
import moment from 'moment';
import React, {useEffect, useMemo, useState} from 'react';
import {
  ActivityIndicator,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
  RefreshControl,
} from 'react-native';
import {LineChart} from 'react-native-chart-kit';
import {Actions} from 'react-native-router-flux';
import {connect, useDispatch} from 'react-redux';
import {salesHistoryRequest} from '../../actions/SalesActions';
import {CustomNavbar} from '../../components';
import {strings} from '../../constants';
import {mixpanel} from '../../helpers/mixpanelHelper';
import {AppStyles, Colors, Fonts, Metrics} from '../../theme';
import styles from './styles';

let graphLabel = ['All History'];
let salesTitle = 'All Sales';
let filterBy = 'all';
function Sales(props) {
  const {salesHistoryData} = props;
  const {cancelled, dispatched, processing, inQueue, total, completed} =
    salesHistoryData;
  const [allBtnSelected, setAllBtnSelected] = useState(() => true);
  const [dailyButtonSelected, setDailyButtonSelected] = useState(() => false);
  const [weeklyButtonSelected, setWeeklyButtonSelected] = useState(() => false);
  const [monthlyButtonSelected, setMonthlyButtonSelected] = useState(
    () => false,
  );
  const [isLoading, setIsLoading] = useState(() => false);
  const [isLoadingFirstTime, setIsLoadingFirstTime] = useState(() => true);
  const [salesTitle, setSalesTitle] = useState(() => 'All Sales');
  const [isRefreshing, setIsRefreshing] = useState(() => false);

  const dispatch = useDispatch();

  useEffect(() => {
    mixpanel.track('Visit', {PageName: 'Sales'});
    apiCall('all');
  }, []);

  const apiCall = filterBy => {
    setIsLoading(true);
    const params = `?filter=${filterBy}`;
    dispatch(
      salesHistoryRequest(params, res => {
        setIsLoading(false);
        if (res) {
          setIsLoadingFirstTime(false);
        }
        setIsRefreshing(false);
      }),
    );
  };

  const onRefresh = () => {
    setIsRefreshing(true);
    apiCall(filterBy);
  };

  const onButtonPress = value => {
    if (value === 'daily') {
      const date = new Date();
      var dt = moment(date, 'YYYY-MM-DD HH:mm:ss');
      let day = dt.format('dddd');
      setDailyButtonSelected(true);
      setWeeklyButtonSelected(false);
      setMonthlyButtonSelected(false);
      setAllBtnSelected(false);
      setSalesTitle('Daily Sales');
      apiCall('daily');
      filterBy = 'daily';
      graphLabel = [day];
    } else if (value === 'weekly') {
      setDailyButtonSelected(false);
      setWeeklyButtonSelected(true);
      setMonthlyButtonSelected(false);
      setAllBtnSelected(false);
      apiCall('weekly');
      setSalesTitle('This Week Sales');
      graphLabel = ['S', 'M', 'T', 'W', 'T', 'F', 'S'];
      filterBy = 'weekly';
    } else if (value === 'monthly') {
      setDailyButtonSelected(false);
      setWeeklyButtonSelected(false);
      setMonthlyButtonSelected(true);
      setAllBtnSelected(false);
      apiCall('monthly');
      setSalesTitle('This Month Sales');
      graphLabel = ['W1', 'W2', 'W3', 'W4'];
      filterBy = 'monthly';
    } else if (value === 'all') {
      setDailyButtonSelected(false);
      setWeeklyButtonSelected(false);
      setMonthlyButtonSelected(false);
      setAllBtnSelected(true);
      apiCall('all');
      setSalesTitle('All Sales');
      graphLabel = ['All History'];
      filterBy = 'all';
    }
  };

  const navBar = useMemo(
    () => (
      <CustomNavbar
        title={strings.SALES_HISTORY}
        titleStyle={AppStyles.titleStyleForCenter}
        leftRightButtonWrapperStyle={{justifyContent: 'center'}}
        hasBack
      />
    ),
    [],
  );

  const categorySelect = () => (
    <View style={styles.daysMainView}>
      <TouchableOpacity
        style={[styles.daysView, allBtnSelected && styles.daysViewSelected]}
        activeOpacity={0.5}
        onPress={() => onButtonPress('all')}>
        <Text style={[styles.days, allBtnSelected && styles.daysSelected]}>
          {strings.ALL}
        </Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={[
          styles.daysView,
          dailyButtonSelected && styles.daysViewSelected,
        ]}
        activeOpacity={0.5}
        onPress={() => onButtonPress('daily')}>
        <Text style={[styles.days, dailyButtonSelected && styles.daysSelected]}>
          {strings.DAILY}
        </Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={[
          styles.daysView,
          weeklyButtonSelected && styles.daysViewSelected,
        ]}
        activeOpacity={0.5}
        onPress={() => onButtonPress('weekly')}>
        <Text
          style={[styles.days, weeklyButtonSelected && styles.daysSelected]}>
          {strings.WEEKLY}
        </Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={[
          styles.daysView,
          monthlyButtonSelected && styles.daysViewSelected,
        ]}
        activeOpacity={0.5}
        onPress={() => onButtonPress('monthly')}>
        <Text
          style={[styles.days, monthlyButtonSelected && styles.daysSelected]}>
          {strings.MONTHLY}
        </Text>
      </TouchableOpacity>
    </View>
  );

  const taskCurrentTabCategory = useMemo(
    () => (
      <View style={[AppStyles.alignItemsCenter, AppStyles.mTop30]}>
        <Text style={styles.thisMonthText}>{salesTitle}</Text>
        <Text style={styles.thismonthSale}>${total}</Text>
      </View>
    ),
    [salesTitle, total],
  );

  const renderLinerChart = () => (
    <View style={[AppStyles.alignItemsCenter, AppStyles.mTop30]}>
      <LineChart
        data={{
          labels: graphLabel,

          datasets: [
            {
              data: !isLoadingFirstTime ? salesHistoryData?.data : [0],
            },
          ],
        }}
        width={Metrics.screenWidth - 22}
        // formatXLabel={value => value}
        height={220}
        chartConfig={{
          backgroundColor: '#0B1319',
          backgroundGradientFrom: '#0B1319',
          backgroundGradientTo: '#0B1319',
          decimalPlaces: 2, // optional, defaults to 2dp
          color: (opacity = 0.5) => `rgba(134, 65, 244, ${opacity})`,
          labelColor: (opacity = 0.5) => `rgba(255, 255, 255, ${opacity})`,
          propsForHorizontalLabels: {
            fontWeight: 'normal',
            fontSize: 10,
            textLength: 5,
            inlineSize: 1,
            font: Fonts.type.regular,
          },
          decimalPlaces: 0,
        }}
        style={{
          marginVertical: 8,
        }}
        segments={salesHistoryData?.data ? 0 : 5}
      />
      <View style={{position: 'absolute', bottom: 50, top: 50}}>
        {isLoading && <ActivityIndicator size={'small'} color={Colors.white} />}
      </View>
    </View>
  );

  const renderStatusSalesHistory = () => {
    return (
      <>
        <TouchableOpacity
          onPress={() => {
            inQueue != 0 &&
              Actions.artistOrderStatus({
                status: 'inqueue',
                filterBy,
                title: 'In Queue',
              });
          }}
          style={[styles.view]}
          activeOpacity={0.5}>
          <Text style={styles.title}>In Queue</Text>
          <Text style={styles.quantity}>{inQueue}</Text>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() =>
            dispatched != 0 &&
            Actions.artistOrderStatus({
              status: 'dispatched',
              title: 'Dispatched',
              filterBy,
            })
          }
          style={[styles.view, {marginLeft: '4%'}]}
          activeOpacity={0.5}>
          <Text style={styles.title}>Dispatched</Text>
          <Text style={styles.quantity}>{dispatched}</Text>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() =>
            processing != 0 &&
            Actions.artistOrderStatus({
              status: 'processing',
              title: 'Processing',
              filterBy,
            })
          }
          style={[styles.view]}
          activeOpacity={0.5}>
          <Text style={styles.title}>Processing</Text>
          <Text style={styles.quantity}>{processing}</Text>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() =>
            cancelled != 0 &&
            Actions.artistOrderStatus({
              status: 'cancelled',
              title: 'Cancelled',
              filterBy,
            })
          }
          style={[styles.view, {marginLeft: '4%'}]}
          activeOpacity={0.5}>
          <Text style={styles.title}>Cancelled</Text>
          <Text style={styles.quantity}>{cancelled}</Text>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() =>
            completed != 0 &&
            Actions.artistOrderStatus({
              status: 'completed',
              filterBy,
              title: 'Completed',
            })
          }
          style={[styles.view]}
          activeOpacity={0.5}>
          <Text style={styles.title}>Completed</Text>
          <Text style={styles.quantity}>{completed}</Text>
        </TouchableOpacity>
      </>
    );
  };

  const renderTopLoader = () => (
    <ActivityIndicator
      size={'small'}
      color={Colors.white}
      style={styles.refreshingLoader}
    />
  );

  return (
    <>
      {navBar}
      {isRefreshing && renderTopLoader()}
      <ScrollView
        style={styles.container}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl refreshing={isRefreshing} onRefresh={onRefresh} />
        }>
        <View style={styles.mainViewGraph}>
          {categorySelect(props)}
          {taskCurrentTabCategory}
          {renderLinerChart()}
        </View>
        <View style={styles.mainView}>{renderStatusSalesHistory()}</View>
      </ScrollView>
    </>
  );
}

Sales.propTypes = {};
Sales.defaultProps = {};

const mapStateToProps = ({sales}) => ({
  salesHistoryData: sales.salesHistoryData,
});

export default connect(mapStateToProps, {})(Sales);
