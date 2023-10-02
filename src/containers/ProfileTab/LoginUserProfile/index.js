import React, {useEffect, useMemo, useState} from 'react';
import {
  ActivityIndicator,
  FlatList,
  Image,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import {Actions} from 'react-native-router-flux';
import {connect, useDispatch} from 'react-redux';
import {getCommunitiesListIAmPartOfRequest} from '../../../actions/communityActions';
import {notificationsCountRequest} from '../../../actions/NotificationsActions';
import {getOrderArtsHistoryRequest} from '../../../actions/orderHistoryActions';
import {
  pinListRequest,
  pinToCollectionListRequest,
} from '../../../actions/PinActions';
import {getLoggedInUserDetailsRequest} from '../../../actions/UserActions';
import {
  ArtItem,
  CollectionItem,
  CommunityItem,
  CustomNavbar,
  NoDataFoundComponent,
  OrderArtItem,
  UserProfileComponent,
} from '../../../components';
import {strings} from '../../../constants';
import {mixpanel} from '../../../helpers/mixpanelHelper';
import {AppStyles, Colors, Images} from '../../../theme';
import util from '../../../util';
import styles from './styles';

const tabs = {
  PIN_COLLECTION_TAB: 'pinCollectionTab',
  COMMUNITY_TAB: 'communityTab',
  ORDER_TAB: 'orderDetailsTab',
};

const limit = 15;
const LoginUserProfile = props => {
  const {
    userDetails,
    currentActiveActionName,
    loggedInUserDetails,
    isPined,
    pinToCollectionList,
    pinPostList,
    notificationsCount,
    communityListing,
    orderArtsHistory,
  } = props;
  const {
    isArtist = false,
    cover_image = undefined,
    profileImage = undefined,
    userId = -1,
  } = userDetails;
  const isArtistProfile = isArtist;
  const [pinTabbarPinSelected, setPinTabbarPinSelected] = useState(() => true);
  const [pinTabbarPinCollectionSelected, setPinTabbarPinCollectionSelected] =
    useState(() => false);
  const [selectedTab, setSelectedTab] = useState(() => tabs.PIN_COLLECTION_TAB);
  const [isBackgroundImage, setIsBackgroundImage] = useState(() => true);
  const [isLoading, setLoading] = useState(() => false);

  const [
    isGettingCollectionListFromServer,
    setIsGettingCollectionListFromServer,
  ] = useState(() => false);
  const [isGettingPostsListFromServer, setIsGettingPostsListFromServer] =
    useState(() => true);
  const [isMoreDataCommunity, setIsMoreDataCommunity] = useState(() => false);
  const [isNextPageCommunity, setIsNextPageCommunity] = useState(() => false);
  const [offsetCommunity, setOffsetCommunity] = useState(() => 0);
  const [isMoreDataOrder, setIsMoreDataOrder] = useState(() => false);
  const [isNextPageOrder, setIsNextPageOrder] = useState(() => false);
  const [offsetOrder, setOffsetOrder] = useState(() => 0);
  const [isMoreDataPin, setIsMoreDataPin] = useState(() => false);
  const [isNextPagePin, setIsNextPagePin] = useState(() => false);
  const [offsetPin, setOffsetPin] = useState(() => 0);
  const [isMoreDataPinToCollection, setIsMoreDataPinToCollection] = useState(
    () => false,
  );
  const [hasNextPagePinToCollection, setIsNextPagePinToCollection] = useState(
    () => true,
  );
  const [offsetPinToCollection, setOffsetPinToCollection] = useState(() => 0);
  const dispatch = useDispatch();

  useEffect(() => {
    // hit api whenever user enters user profile screen. it will only call if logged in user is artist
    const isActiveScreen =
      currentActiveActionName === 'profile_tab' ||
      currentActiveActionName === 'userProfile';
    if (!!isActiveScreen) {
      const params = `${userId}`;
      dispatch(getLoggedInUserDetailsRequest(params));
    }
  }, [currentActiveActionName]);

  useEffect(() => {
    if (util.areValuesEqual(selectedTab, tabs.ORDER_TAB)) {
      const params = `?offset=${0}&limit=${limit}`;
      setLoading(true);
      dispatch(
        getOrderArtsHistoryRequest({}, params, res => {
          if (!util.isArrayEmpty(res)) {
            setIsNextPageOrder(true);
            setLoading(false);
          } else {
            setIsNextPageOrder(false);
            setLoading(false);
          }
        }),
      );
    }

    if (util.areValuesEqual(selectedTab, tabs.COMMUNITY_TAB)) {
      setLoading(true);
      const params = `?filter_by=following&offset=${0}&limit=${limit}`;

      dispatch(
        getCommunitiesListIAmPartOfRequest({}, params, res => {
          if (!util.isArrayEmpty(res)) {
            setLoading(false);
            setIsNextPageCommunity(true);
          } else {
            setLoading(false);
            setIsNextPageCommunity(false);
          }
        }),
      );
    }
    if (util.areValuesEqual(selectedTab, tabs.PIN_COLLECTION_TAB)) {
      setLoading(true);

      const params = `?offset=${0}&limit=${limit}`;
      dispatch(
        pinListRequest({}, params, res => {
          if (!util.isArrayEmpty(res)) {
            setLoading(false);
            setIsNextPagePin(true);
            setIsMoreDataPin(false);
          } else {
            setLoading(false);
            setIsNextPagePin(false);
            setIsMoreDataPin(false);
          }
        }),
      );
    }
  }, [selectedTab]);

  useEffect(() => {
    mixpanel.track('Visit', {
      PageName: 'Profile',
    });
    dispatch(notificationsCountRequest({}, res => {}));
  }, []);

  const renderProfileTabBar = () => (
    <View style={styles.tabbarMainView}>
      <View
        style={{
          flex: 1,
          flexDirection: 'row',
          justifyContent: 'space-around',
        }}>
        <TouchableOpacity
          style={[
            styles.tabbarView,
            util.areValuesEqual(selectedTab, tabs.PIN_COLLECTION_TAB) &&
              styles.tabbarViewSelected,
          ]}
          onPress={() => setSelectedTab(tabs.PIN_COLLECTION_TAB)}>
          <Image
            source={
              util.areValuesEqual(selectedTab, tabs.PIN_COLLECTION_TAB)
                ? Images.pinIconLight
                : Images.PinToCollectioUnselected
            }
            style={[
              {
                width: 12,
                height: 16,
              },
            ]}
          />
        </TouchableOpacity>
        <TouchableOpacity
          style={[
            styles.tabbarView,
            util.areValuesEqual(selectedTab, tabs.COMMUNITY_TAB) &&
              styles.tabbarViewSelected,
          ]}
          onPress={() => setSelectedTab(tabs.COMMUNITY_TAB)}>
          <Image
            style={{width: 22, height: 16.6}}
            source={
              util.areValuesEqual(selectedTab, tabs.COMMUNITY_TAB)
                ? Images.communityTabSelected
                : Images.communityTabIcon
            }
          />
        </TouchableOpacity>

        <TouchableOpacity
          style={[
            styles.tabbarView,
            util.areValuesEqual(selectedTab, tabs.ORDER_TAB) &&
              styles.tabbarViewSelected,
          ]}
          onPress={() => setSelectedTab(tabs.ORDER_TAB)}>
          <Image
            style={[{width: 22, height: 22}]}
            source={
              !util.areValuesEqual(selectedTab, tabs.ORDER_TAB)
                ? Images.saleTabIcon
                : Images.orderHistorySelected
            }
          />
        </TouchableOpacity>
      </View>
    </View>
  );

  const renderCustomNavBar = useMemo(
    () => (
      <CustomNavbar
        titleStyle={AppStyles.titleStyleForCenter}
        backgroundColor="transparent"
        rightBtnImage={Images.settingIcon}
        rightBtnStyle={{alignSelf: 'center', top: 2}}
        leftBtnImage={Images.notificationIcon}
        leftRightButtonWrapperStyle={styles.iconShad}
        rightBtnPress={() => Actions.setting()}
        leftBtnPress={() => Actions.notification()}
        notificationCount={notificationsCount}
      />
    ),
    [notificationsCount],
  );

  const renderEmptyContainer = text => (
    <Text style={styles.noCollectionFoundText}>{text}</Text>
  );
  const renderProfileComponent = useMemo(
    () => (
      <UserProfileComponent
        userOrArtistProfileDetails={loggedInUserDetails}
        isArtistProfile={isArtist}
        isBackgroundImage={isBackgroundImage}
      />
    ),
    [loggedInUserDetails, isBackgroundImage],
  );
  const renderLoader = () => {
    return (
      <ActivityIndicator
        style={{marginTop: 50}}
        size="small"
        color={Colors.white}
      />
    );
  };

  /*  Pin And Pin To Collection Start */

  const renderPinAndPinTOCollection = () => {
    return (
      <View style={{flex: 1}}>
        {artistPinAndPintoCollectionTabbar()}
        {pinTabbarPinSelected
          ? renderPinList(pinPostList)
          : renderPinToCollection}
      </View>
    );
  };

  const artistPinAndPintoCollectionTabbar = () => (
    <View style={styles.picTabbarMainView}>
      <TouchableOpacity
        style={
          pinTabbarPinSelected ? styles.picTabbarSelected : styles.picTabbarView
        }
        activeOpacity={0.5}
        onPress={() => handleArtistPinTabbar('pin')}>
        <Text
          style={
            pinTabbarPinSelected
              ? styles.picTabbarTextSelected
              : styles.picTabbarText
          }>
          Pin
        </Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={
          pinTabbarPinCollectionSelected
            ? styles.picTabbarSelected
            : styles.picTabbarView
        }
        activeOpacity={0.5}
        onPress={() => handleArtistPinTabbar('pinCollection')}>
        <Text
          style={
            pinTabbarPinCollectionSelected
              ? styles.picTabbarTextSelected
              : styles.picTabbarText
          }>
          Pin Collection
        </Text>
      </TouchableOpacity>
    </View>
  );
  function handleArtistPinTabbar(pinTab) {
    if (pinTab === 'pin') {
      clickOnPinTab();
    }
    if (pinTab === 'pinCollection') {
      clickOnPinTOCollectionTab();
    }
  }

  const clickOnPinTab = () => {
    setPinTabbarPinSelected(true);
    setPinTabbarPinCollectionSelected(false);
    setLoading(true);
    const params = `?offset=${0}&limit=${15}`;
    dispatch(
      pinListRequest({}, params, res => {
        if (!util.isArrayEmpty(res)) {
          setLoading(false);
          setIsMoreDataPin(false);
          setIsNextPagePin(true);
        } else {
          setLoading(false);
          setIsNextPagePin(false);
          setIsMoreDataPin(false);
        }
      }),
    );
  };

  const clickOnPinTOCollectionTab = () => {
    setPinTabbarPinSelected(false);
    setPinTabbarPinCollectionSelected(true);
    setLoading(true);
    const params = `?offset=${offsetPinToCollection}&limit=${15}`;
    dispatch(
      pinToCollectionListRequest({}, params, res => {
        if (!util.isArrayEmpty(res)) {
          setIsNextPagePinToCollection(true);
          setLoading(false);
          setIsMoreDataPinToCollection(false);
        } else {
          setLoading(false);
          setIsNextPagePinToCollection(false);
          setIsMoreDataPinToCollection(false);
        }
      }),
    );
  };

  const renderPinToCollection = useMemo(() => {
    return (
      <FlatList
        numColumns={3}
        data={pinToCollectionList}
        style={{flex: 1}}
        keyExtractor={(_, index) => index}
        showsVerticalScrollIndicator={false}
        renderItem={({item}) => {
          const {id} = item;
          return (
            <CollectionItem
              item={item}
              isPin={true}
              isArtist={!!isArtistProfile}
              onItemPress={() => {
                Actions.jump('pinCollectionListing', {
                  collectionDetails: item,
                  isPin: true,
                  pinToCollectionId: id,
                });

                mixpanel.track('Visit', {
                  PageName: 'User Pin To Collection',
                  PinToCollectionName: item?.title,
                });
              }}
            />
          );
        }}
        onEndReached={loadMoreDataPinToCollection}
        onEndReachedThreshold={0.1}
        ListEmptyComponent={() =>
          isLoading
            ? renderLoader()
            : util.isArrayEmpty(pinToCollectionList) &&
              renderEmptyContainer(strings.NO_PIN_FOUND)
        }
        ListFooterComponent={
          <View style={isMoreDataPinToCollection && {marginVertical: 40}}>
            {isMoreDataPinToCollection && (
              <ActivityIndicator color={Colors.white} />
            )}
          </View>
        }
      />
    );
  }, [pinToCollectionList, isMoreDataPinToCollection]);

  function loadMoreDataPinToCollection() {
    if (hasNextPagePinToCollection) {
      setIsMoreDataPinToCollection(true);
      const params = `?offset=${offsetPinToCollection}&limit=${15}`;
      dispatch(
        pinToCollectionListRequest({}, params, res => {
          if (!util.isArrayEmpty(res)) {
            setOffsetPinToCollection(offsetPinToCollection + 15);
            setIsMoreDataPinToCollection(false);
          } else {
            setIsNextPagePinToCollection(false);
            setIsMoreDataPinToCollection(false);
          }
        }),
      );
    }
  }

  const renderPinList = mData => (
    <FlatList
      data={mData}
      style={AppStyles.flex}
      numColumns={3}
      showsVerticalScrollIndicator={false}
      renderItem={({item}) => {
        const isCollection = item?.isCollection ?? false;
        const {id, artist} = item || {};
        return isCollection ? (
          <CollectionItem
            item={item}
            isArtist={!!isArtistProfile}
            onItemPress={() => {
              Actions.postsListingOfCollection({
                collectionDetails: item,
                isPin: false,
                pinToCollectionId: id,
                artistID: artist?.id,
              });
            }}
          />
        ) : (
          <ArtItem artItem={item} />
        );
      }}
      keyExtractor={(_, index) => index}
      onEndReached={loadMoreDataSimplePin}
      onEndReachedThreshold={0.1}
      ListEmptyComponent={() =>
        isLoading
          ? renderLoader()
          : util.isArrayEmpty(mData) && (
              <NoDataFoundComponent text={strings.NO_PIN_FOUND} />
            )
      }
      ListFooterComponent={
        <View style={isMoreDataPin && {marginVertical: 40}}>
          {isMoreDataPin && <ActivityIndicator color={Colors.white} />}
        </View>
      }
    />
  );

  function loadMoreDataSimplePin() {
    if (isNextPagePin) {
      setIsMoreDataPin(true);
      const params = `?offset=${offsetPin}&limit=${15}`;
      dispatch(
        pinListRequest({}, params, res => {
          if (!util.isArrayEmpty(res)) {
            setOffsetPin(offsetPin + 15);
            setIsMoreDataPin(false);
          } else {
            setIsNextPagePin(false);
            setIsMoreDataPin(false);
          }
        }),
      );
    }
  }

  /*  Pin And Pin To Collection End */

  /** Community Tab Start */
  const renderCommunityTab = () => {
    return (
      <View style={{flex: 1}}>
        {isLoading ? renderLoader() : renderCommunityListing()}
      </View>
    );
  };

  function moreDataCommunityListing() {
    if (isNextPageCommunity) {
      setIsMoreDataCommunity(true);
      setLoading(true);
      const params = `?offset=${offsetCommunity}&limit=${15}`;
      dispatch(
        getCommunitiesListIAmPartOfRequest({}, params, res => {
          if (!util.isArrayEmpty(res)) {
            setOffsetCommunity(offsetCommunity + 15);
            setIsMoreDataCommunity(false);
            setLoading(false);
          } else {
            setIsNextPageCommunity(false);
            setIsMoreDataCommunity(false);
            setLoading(false);
          }
        }),
      );
    }
  }

  function renderCommunityListing() {
    return (
      <FlatList
        data={communityListing}
        style={AppStyles.flex}
        numColumns={3}
        showsVerticalScrollIndicator={false}
        renderItem={({item}) => {
          return (
            <CommunityItem
              item={item}
              onPress={() =>
                Actions.jump('communityDetails', {
                  communityDetails: item,
                })
              }
            />
          );
        }}
        keyExtractor={(_, index) => index}
        onEndReached={moreDataCommunityListing}
        onEndReachedThreshold={0.1}
        ListEmptyComponent={() =>
          isLoading
            ? renderLoader()
            : util.isArrayEmpty(communityListing) && (
                <NoDataFoundComponent text={strings.NO_COMMUNITIES_FOUND} />
              )
        }
        ListFooterComponent={
          <View style={isMoreDataCommunity && {marginVertical: 40}}>
            {isMoreDataCommunity && <ActivityIndicator color={Colors.white} />}
          </View>
        }
      />
    );
  }
  /** Community Tab End */

  /** Order Tab Start */
  const renderOrderTab = () => {
    return (
      <View style={{flex: 1}}>
        {isLoading ? renderLoader() : renderOrderListing()}
      </View>
    );
  };

  function moreDataOrderListing() {
    if (isNextPageOrder) {
      setIsMoreDataOrder(true);

      const params = `?offset=${offsetOrder}&limit=${15}`;
      dispatch(
        getOrderArtsHistoryRequest({}, params, res => {
          if (!util.isArrayEmpty(res)) {
            setOffsetOrder(offsetOrder + 15);
            setIsMoreDataOrder(false);
          } else {
            setIsNextPageOrder(false);
            setIsMoreDataOrder(false);
          }
        }),
      );
    }
  }

  function renderOrderListing() {
    return (
      <FlatList
        data={orderArtsHistory}
        style={AppStyles.flex}
        numColumns={3}
        showsVerticalScrollIndicator={false}
        renderItem={({item}) => {
          return <OrderArtItem item={item} />;
        }}
        keyExtractor={(_, index) => index}
        onEndReached={moreDataOrderListing}
        onEndReachedThreshold={0.1}
        ListEmptyComponent={() =>
          isLoading
            ? renderLoader()
            : util.isArrayEmpty(orderArtsHistory) && (
                <NoDataFoundComponent text={strings.NO_PURCHASE_FOUND} />
              )
        }
        ListFooterComponent={
          <View style={isMoreDataOrder && {marginVertical: 40}}>
            {isMoreDataOrder && <ActivityIndicator color={Colors.white} />}
          </View>
        }
      />
    );
  }
  /** Order Tab End */

  return (
    <>
      <View style={styles.coverImage}>
        {renderCustomNavBar}
        <View style={{marginTop: -10}}>
          {renderProfileComponent}
          {renderProfileTabBar()}
        </View>
      </View>
      <View style={styles.container}>
        {util.areValuesEqual(selectedTab, tabs.PIN_COLLECTION_TAB) &&
          renderPinAndPinTOCollection()}
        {util.areValuesEqual(selectedTab, tabs.COMMUNITY_TAB) &&
          renderCommunityTab()}
        {util.areValuesEqual(selectedTab, tabs.ORDER_TAB) && renderOrderTab()}
      </View>
    </>
  );
};
LoginUserProfile.propTypes = {};
LoginUserProfile.defaultProps = {};

const mapStateToProps = ({
  user,
  general,
  post,
  pin,
  notifications,
  community,
  orderHistory,
}) => ({
  userDetails: user.data,
  loggedInUserDetails: user.userDetails,
  currentActiveActionName: general.currentActiveActionName,
  postsList: post.loggedInUserOrArtistPostsList,
  pinToCollectionList: pin.pinToCollectionList,
  pinPostList: pin.pinPostList,
  notificationsCount: notifications.notificationsCount,
  communityListing: community.communitiesListIAmPartOf,
  orderArtsHistory: orderHistory.orderArtsHistory,
});

export default connect(mapStateToProps)(LoginUserProfile);
