import {default as React, useEffect, useMemo, useState} from 'react';
import {ActivityIndicator, FlatList, View} from 'react-native';
import {Actions} from 'react-native-router-flux';
import {connect, useDispatch} from 'react-redux';
import {getOrderHistoryDetailRequest} from '../../actions/orderHistoryActions';
import {
  salesHistoryStatusRequest,
  salesOrderHistoryDetailsRequest,
} from '../../actions/SalesActions';
import {
  CustomNavbar,
  NoDataFoundComponent,
  OrderHistoryComponent,
} from '../../components';
import {strings} from '../../constants';
import {mixpanel} from '../../helpers/mixpanelHelper';
import {AppStyles, Colors} from '../../theme';
import util from '../../util';
import styles from './styles';

let limit = 15;
function ArtistOrderStatus(props) {
  const {status, title, filterBy, salesHistoryStatusData} = props;
  const [isLoading, setIsLoading] = useState(() => false);
  const [isMoreData, setIsMoreData] = useState(() => false);
  const [isNextPage, setIsNextPage] = useState(() => false);
  const [orderIds, setOrderIds] = useState(() => []);
  const [offset, setOffset] = useState(() => 0);
  const dispatch = useDispatch();
  const orderButtonPressHandler = (id, orderID, artId) => {
    const details = {
      orderID: orderID,
      artId,
      id,
    };
    Actions.orderDetail({details, isFromSales: true});
  };

  useEffect(() => {
    mixpanel.track('Visit', {
      PageName: `${status} List`,
    });
    setIsLoading(true);
    const params = `?filter=${filterBy}&status=${status}&offset=${0}&limit=${limit}`;
    dispatch(
      salesHistoryStatusRequest(params, res => {
        if (!util.isArrayEmpty(res)) {
          setIsNextPage(true);
          setOrderIds(util.getIdsFromArray(res));
          setIsLoading(false);
        } else {
          setIsNextPage(false);
          setIsLoading(false);
        }
      }),
    );
  }, []);
  function loadMoreData() {
    if (isNextPage) {
      setIsMoreData(true);
      const params = `?filter=${filterBy}&status=${status}&offset=${offset}&limit=${limit}`;
      dispatch(
        salesHistoryStatusRequest(params, res => {
          if (!util.isArrayEmpty(res)) {
            setOffset(offset + 15);
            setIsMoreData(false);
            const stateIds = util.cloneDeepArray(orderIds);
            const comingIds = util.cloneDeepArray(util.getIdsFromArray(res));
            const mergeIds = [...stateIds, ...comingIds];
            setOrderIds(mergeIds);
          } else {
            setIsNextPage(false);
            setIsMoreData(false);
          }
        }),
      );
    }
  }

  const navBar = useMemo(() => {
    return (
      <CustomNavbar
        title={title}
        titleStyle={AppStyles.titleStyleForLeft}
        hasBack
      />
    );
  }, []);

  const renderStatusListing = useMemo(() => {
    const data = !util.isArrayEmpty(orderIds)
      ? util.filterArray(salesHistoryStatusData, item =>
          orderIds.includes(item.id),
        )
      : [];
    return (
      <FlatList
        data={data.sort(function (a, b) {
          return a.order_id - b.order_id;
        })}
        keyExtractor={(_, index) => index}
        showsVerticalScrollIndicator={false}
        renderItem={({item}) => {
          return (
            <OrderHistoryComponent
              item={item}
              isOrderHistory={false}
              orderButtonPressHandler={orderButtonPressHandler}
            />
          );
        }}
        ListEmptyComponent={() =>
          !isLoading && <NoDataFoundComponent text={strings.NO_ORDER_FOUND} />
        }
        onEndReached={loadMoreData}
        onEndReachedThreshold={0.1}
        ListFooterComponent={
          <View style={isMoreData && {marginVertical: 40}}>
            {isMoreData && <ActivityIndicator color={Colors.white} />}
          </View>
        }
      />
    );
  }, [salesHistoryStatusData, isMoreData, orderIds]);

  return (
    <>
      {navBar}
      <View style={styles.container}>
        {!isLoading && renderStatusListing}
        {isLoading && (
          <ActivityIndicator style={AppStyles.mTop30} color={Colors.white} />
        )}
      </View>
    </>
  );
}
ArtistOrderStatus.propTypes = {};
ArtistOrderStatus.defaultProps = {};
const mapStateToProps = ({sales}) => ({
  salesHistoryStatusData: sales.salesHistoryStatusData,
});

export default connect(mapStateToProps, {})(ArtistOrderStatus);
