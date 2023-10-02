import moment from 'moment';
import React, {useEffect, useState} from 'react';
import {
  ActivityIndicator,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import FastImage from 'react-native-fast-image';
import {Actions} from 'react-native-router-flux';
import {connect} from 'react-redux';
import {SpinnerLoader} from '../../components';
import {eventDetailDefaultImage} from '../../constants';
import {Images, Colors, Metrics} from '../../theme';
import util from '../../util';
import styles from './styles';

function EventDetails(props) {
  const {item} = props;
  const [isLoadingImage, setIsLoadingImage] = useState(() => true);
  const [isSpinnerLoader, setIsSpinnerLoader] = useState(() => true);

  useEffect(() => {
    setTimeout(() => {
      setIsSpinnerLoader(!isSpinnerLoader);
    }, 400);
  }, []);

  const renderCoverImageAndDetailsSec = () => {
    let Uri = util.isEmptyValue(item?.EventPic)
      ? eventDetailDefaultImage
      : `https:${item?.EventPic}`;
    return (
      <View style={styles.coverImageMain}>
        <FastImage
          style={styles.coverImage}
          source={{
            uri: Uri,
            priority: FastImage.priority.high,
          }}
          resizeMode={FastImage.resizeMode.cover}>
          {isLoadingImage && (
            <ActivityIndicator
              style={{
                position: 'absolute',
                top: 0,
                bottom: 150,
                right: 0,
                left: 0,
              }}
              size={'small'}
              color={Colors.white}
            />
          )}
        </FastImage>
        <TouchableOpacity onPress={() => Actions.pop()} style={styles.backBtn}>
          <FastImage
            style={styles.backBtnImage}
            onLoad={() => setIsLoadingImage(false)}
            source={Images.backButton}
            resizeMode={FastImage.resizeMode.contain}
          />
        </TouchableOpacity>
      </View>
    );
  };
  function renderEventDetailItem(icon, headTxt, discriptionTxt) {
    return (
      <View style={styles.itemMainView}>
        <FastImage
          style={styles.itemIcon}
          source={icon}
          resizeMode={FastImage.resizeMode.contain}
        />
        <View style={styles.itemInnerView}>
          <Text style={styles.headTxt}>{headTxt}</Text>
          <Text numberOfLines={1} style={styles.discriptionTxt}>
            {discriptionTxt}
          </Text>
        </View>
      </View>
    );
  }

  function renderEventDetails() {
    let eventDate = moment(item?.StartDate);
    const day = !util.isEmptyValue(item?.StartDate)
      ? eventDate.format('DD')
      : '';
    const month = !util.isEmptyValue(item?.StartDate)
      ? eventDate.format('MMMM')
      : '';
    const year = !util.isEmptyValue(item?.StartDate)
      ? eventDate.format('yyyy')
      : '';

    return (
      <View style={styles.eventDetailView}>
        <>
          <ScrollView
            style={styles.eventDetailScrollView}
            showsVerticalScrollIndicator={false}>
            <View style={{borderTopLeftRadius: 80}}>
              <View
                style={{
                  marginHorizontal: 10,
                  marginBottom: 0,
                }}>
                <Text numberOfLines={2} style={styles.eventNameTxt}>
                  {item?.EventName}
                </Text>
                {!util.isEmptyValue(item?.Headline) && (
                  <Text style={styles.eventDiscriptionTxt}>
                    {item?.Headline}
                  </Text>
                )}
              </View>
              {!util.areValuesEqual(item?.Attendees, 0) &&
                renderEventDetailItem(
                  Images.attendee,
                  'Attendees',
                  item?.Attendees,
                )}
              {!util.isEmptyValue(item?.Address) &&
                renderEventDetailItem(
                  Images.Location,
                  'Address',
                  item?.Address,
                )}
              {!util.isEmptyValue(day) &&
                renderEventDetailItem(
                  Images.Date,
                  'Event Time',
                  `${day} ${month} ${year}${
                    !util.isEmptyValue(item?.StartTime)
                      ? `, ${item?.StartTime}`
                      : ''
                  }${
                    !util.isEmptyValue(item?.EndTime)
                      ? ` - ${item?.EndTime}`
                      : ''
                  }`,
                )}
              {!util.areValuesEqual(item?.Price, 0) &&
                renderEventDetailItem(
                  Images.charges,
                  'Charges',
                  `$${item?.Price}`,
                )}
              {!util.areValuesEqual(item?.numberOfSeat, 0) &&
                renderEventDetailItem(
                  Images.numberSeat,
                  'Number Of Seats',
                  item?.numberOfSeat,
                )}
              {!util.isEmptyValue(item?.fullName) &&
                renderEventDetailItem(
                  Images.profilepicSold,
                  item?.fullName,
                  'Artist',
                )}
              {!util.isEmptyValue(item?.description) && (
                <View style={{marginHorizontal: 12, marginTop: 20}}>
                  <Text style={styles.eventAboutTxt}>About Event</Text>
                  <Text style={styles.eventAboutDisTxt}>
                    {item?.description}
                  </Text>
                </View>
              )}
            </View>
          </ScrollView>
          <View style={styles.btnMainView}>
            <TouchableOpacity
              onPress={() => Actions.eventsWebView({item})}
              style={styles.btnToachOpacity}>
              <Text style={styles.btnTxt}>Visit Event Page</Text>
            </TouchableOpacity>
          </View>
        </>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {renderCoverImageAndDetailsSec()}
      {renderEventDetails()}
      <SpinnerLoader _loading={isSpinnerLoader} />
    </View>
  );
}

EventDetails.propTypes = {};
EventDetails.defaultProps = {};

const mapStateToProps = ({}) => ({});
export default connect(mapStateToProps, null)(EventDetails);
