import moment from 'moment';
import PropTypes from 'prop-types';
import React, {useEffect, useMemo, useState} from 'react';
import {
  ImageBackground,
  View,
  Text,
  Image,
  SafeAreaView,
  FlatList,
  ActivityIndicator,
  TouchableOpacity,
  ScrollView,
} from 'react-native';
import FastImage from 'react-native-fast-image';
import {Actions} from 'react-native-router-flux';
import {connect, useDispatch} from 'react-redux';
import {getCommunityDropsRequest} from '../../actions/communityActions';
import {deleteFeedRequest} from '../../actions/DashboardActions';
import {getEventListRequest} from '../../actions/EventActions';
import {
  ArtItem,
  CustomNavbar,
  EventItem,
  Loader,
  NoDataFoundComponent,
  SpinnerLoader,
} from '../../components';
import {eventDefaultImage, strings} from '../../constants';
import {mixpanel} from '../../helpers/mixpanelHelper';
import {AppStyles, Colors, Fonts, Images} from '../../theme';
import util from '../../util';
import styles from './styles';

function CommunityDetails(props) {
  const {communityDetails, community, communitiesDropsListing, eventsList} =
    props;
  const {
    id,
    profile_name: title,
    profileTagId: subtitle,
    image: uri = undefined,
    artistId,
  } = communityDetails || {};

  const [communityDrops, setCommunityDrops] = useState(() => []);
  const [isFetchingDataFromApi, setIsFetchingDataFromApi] = useState(
    () => false,
  );
  const [isDeletingPost, setIsDeletingPost] = useState(() => false);
  const [isMoreData, setIsMoreData] = useState(() => false);
  const [isNextPage, setIsNextPage] = useState(() => false);
  const [offset, setOffset] = useState(() => 0);
  const dispatch = useDispatch();

  useEffect(() => {
    setIsFetchingDataFromApi(true);
    const params = `drops/${id}/?offset=${0}&limit=${9}`;
    const payload = {
      artistId: artistId,
    };
    dispatch(
      getCommunityDropsRequest(payload, params, res => {
        if (!!res) {
          setCommunityDrops(res);
          setIsNextPage(true);
        } else {
          setIsNextPage(false);
        }
        setIsFetchingDataFromApi(false);
      }),
    );
    mixpanel.track('Visit', {
      PageName: 'Community Details',
      CommunityName: title,
    });

    const paramsEvents = `?offset=${0}&limit=${30}`;
    dispatch(getEventListRequest(paramsEvents, res => {}));
  }, []);

  function loadMoreData() {
    if (isNextPage) {
      setIsMoreData(true);

      const params = `drops/${id}/?offset=${offset}&limit=${9}`;
      const payload = {
        artistId: artistId,
      };
      dispatch(
        getCommunityDropsRequest(payload, params, res => {
          if (!util.isArrayEmpty(res)) {
            setOffset(offset + 9);
            setIsMoreData(false);
          } else {
            setIsNextPage(false);
            setIsMoreData(false);
          }
        }),
      );
    }
  }

  function onDeletePostHandler(postID) {
    setIsDeletingPost(true);
    dispatch(
      deleteFeedRequest(postID, function (res) {
        if (!!res) {
          const mFilteredData = util.excludeIdFromArray(communityDrops, postID);
          setCommunityDrops(mFilteredData);
          Actions.pop();
        }
        setIsDeletingPost(false);
      }),
    );
  }

  const renderSpinnerLoader = useMemo(() => {
    <SpinnerLoader _loading={!!isDeletingPost} />;
  }, [isDeletingPost]);

  const renderCustomNavBar = useMemo(
    () => (
      <CustomNavbar
        titleStyle={AppStyles.titleStyleForCenter}
        backgroundColor="transparent"
        hasBack
      />
    ),
    [],
  );

  const renderCommunityDetails = useMemo(
    () => (
      <View style={[styles.bottomViewCont]}>
        <Text
          style={styles.detailsText}
          numberOfLines={1}
          ellipsizeMode={'tail'}>
          {title}
        </Text>
        <Text
          style={[styles.detailsText, styles.subDetailsText]}
          numberOfLines={1}
          ellipsizeMode={'tail'}>
          {subtitle}
        </Text>
      </View>
    ),
    [],
  );

  const renderArtItem = ({item}) => (
    <ArtItem artItem={item} onDeletePostHandlerCallback={onDeletePostHandler} />
  );
  const renderEventItem = ({item}) => {
    let eventDate = moment(item?.StartDate);
    const day = !util.isEmptyValue(item?.StartDate)
      ? eventDate.format('dddd')
      : '';
    let Uri = util.isEmptyValue(item.EventPic)
      ? eventDefaultImage
      : `https:${item.EventPic}`;

    return (
      <TouchableOpacity
        onPress={() => Actions.eventDetails({item})}
        style={styles.itemEventView}>
        <View style={styles.eventViewDetail}>
          <FastImage
            style={styles.itemEventImage}
            source={{
              uri: Uri,
              priority: FastImage.priority.high,
            }}
            resizeMode={FastImage.resizeMode.cover}>
            <Text style={styles.itemEventDateTxt}>
              {`${day}`}
              {!util.isEmptyValue(item.StartTime) && (
                <Text style={styles.itemEventDateTxt}>
                  {`,  ${item.StartTime}`}
                  {!util.isEmptyValue(item.StartTime)}
                </Text>
              )}
            </Text>
            <View style={styles.itemEventnNameView}>
              <Text style={styles.itemEventNameTxt}>{item?.EventName}</Text>
            </View>
            <Text
              numberOfLines={2}
              ellipsizeMode={'tail'}
              style={styles.itemEventDispcriptionTxt}>
              {item?.Headline}
            </Text>
          </FastImage>
        </View>
      </TouchableOpacity>
    );
  };
  const renderEmptyContainer = text => (
    <Text style={styles.noCollectionFoundText}>{text}</Text>
  );

  const renderArtsList = () => (
    <FlatList
      data={
        util.areValuesEqual(title, `AHA's Community`)
          ? community[artistId]?.communitiesDropsListing.slice(0, 6)
          : community[artistId]?.communitiesDropsListing
      }
      style={AppStyles.flex}
      numColumns={3}
      showsVerticalScrollIndicator={false}
      ListEmptyComponent={() => (
        <NoDataFoundComponent text={strings.NO_DROPS_FOUND} />
      )}
      renderItem={renderArtItem}
      keyExtractor={(_, index) => index}
      onEndReached={loadMoreData}
      onEndReachedThreshold={0.1}
      ListFooterComponent={
        <View style={isMoreData && {marginVertical: 40}}>
          {isMoreData && <ActivityIndicator color={Colors.white} />}
        </View>
      }
    />
  );
  const renderEventList = () => {
    return (
      <View style={[styles.dropsListCont]}>
        <FlatList
          data={eventsList.slice(0, 6)}
          contentContainerStyle={{flex: 1, marginBottom: 20}}
          numColumns={1}
          showsVerticalScrollIndicator={false}
          ListEmptyComponent={() => (
            <NoDataFoundComponent text={strings.NO_EVENTS_FOUND} />
          )}
          renderItem={({item}) => {
            return <EventItem item={item} />;
          }}
          keyExtractor={(_, index) => index}
        />
      </View>
    );
  };

  const renderDropsListing = useMemo(
    () => (
      <SafeAreaView style={styles.dropsListCont}>
        {renderArtsList()}
      </SafeAreaView>
    ),
    [communityDrops, community, communitiesDropsListing, isMoreData],
  );

  const renderLoader = useMemo(
    () => (
      <View style={styles.loaderStyle}>
        <Loader loading={isFetchingDataFromApi} />
      </View>
    ),
    [isFetchingDataFromApi],
  );

  const seeMoreTxt = onPress => (
    <TouchableOpacity
      style={{flexDirection: 'row', alignItems: 'center'}}
      onPress={onPress}>
      <Text
        style={{
          color: Colors.white,
          fontFamily: Fonts.type.bold,
          fontSize: Fonts.size.small,
        }}>
        {strings.MORE}
      </Text>
      <FastImage
        source={Images.RightIcon}
        style={styles.moreButtonImage}
        resizeMode={'contain'}
      />
    </TouchableOpacity>
  );

  const renderNewDropsText = () => (
    <View style={styles.dropsSection}>
      <View style={{flexDirection: 'row', flex: 1}}>
        <Image source={Images.fireIcon} style={styles.fireIcon} />
        <Text style={styles.newDropsText}>{strings.NEW_DROPS}</Text>
      </View>
      {util.areValuesEqual(title, `AHA's Community`) &&
        util.areGreaterThan(
          community[artistId]?.communitiesDropsListing?.length,
          6,
        ) &&
        seeMoreTxt(() => Actions.seeMoreDrops({communityDetails}))}
    </View>
  );

  const renderEventsText = () => (
    <View style={styles.dropsSection}>
      <View style={{flexDirection: 'row', flex: 1, marginLeft: 2}}>
        <Image source={Images.eventHand} style={styles.eventIcon} />
        <Text style={styles.newDropsText}>{strings.EVENTS}</Text>
      </View>
      {seeMoreTxt(() => Actions.seeMoreEventDetails())}
    </View>
  );

  const renderCoverImageAndDetailsSec = useMemo(() => (
    <FastImage
      resizeMode={'cover'}
      imageStyle={styles.imageStyle}
      style={styles.coverImage}
      source={{
        uri: uri,
        priority: FastImage.priority.high,
      }}
      resizeMode={FastImage.resizeMode.cover}>
      {renderCustomNavBar}
      {renderCommunityDetails}
    </FastImage>
  ));

  function renderEvent() {
    return (
      <>
        {!isFetchingDataFromApi && renderEventsText()}
        {!!!isFetchingDataFromApi && renderEventList()}
      </>
    );
  }
  return (
    <View style={styles.container}>
      {renderCoverImageAndDetailsSec}
      {util.areValuesEqual(title, `AHA's Community`) ? (
        <ScrollView showsVerticalScrollIndicator={false}>
          {!isFetchingDataFromApi && renderNewDropsText()}
          {renderLoader}
          {renderSpinnerLoader}
          {!!!isFetchingDataFromApi && renderDropsListing}
          {util.areValuesEqual(title, `AHA's Community`) && renderEvent()}
        </ScrollView>
      ) : (
        <>
          {!isFetchingDataFromApi && renderNewDropsText()}
          {renderLoader}
          {renderSpinnerLoader}
          {!!!isFetchingDataFromApi && renderDropsListing}
        </>
      )}
    </View>
  );
}

CommunityDetails.propTypes = {
  communityDetails: PropTypes.object.isRequired,
};
CommunityDetails.defaultProps = {};

const mapStateToProps = ({community, events}) => ({
  communitiesDropsListing: community.communitiesDropsListing,
  community: community.community,
  eventsList: events.eventsList,
});
export default connect(mapStateToProps, null)(CommunityDetails);
