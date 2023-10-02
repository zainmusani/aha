// @flow
import PropTypes from 'prop-types';
import React, {useEffect, useState} from 'react';
import {Image, ActivityIndicator, TouchableOpacity, View} from 'react-native';
import {Actions} from 'react-native-router-flux';
import {connect, useDispatch} from 'react-redux';
import {Text} from '..';
import {followUnFollowArtistRequest} from '../../actions/UserActions';
import {strings} from '../../constants';
import FastImage from 'react-native-fast-image';
import {AppStyles, Colors, Images} from '../../theme';
import util from '../../util';
import styles from './styles';

const UserProfileComponent = props => {
  const {
    userOrArtistProfileDetails,
    isArtistProfile,
    isVisitingOnArtistProfile,
    isBackgroundImage,
    userDetails,
  } = props;

  const {name, bio: userBio} = userDetails;
  const {
    id,
    dribble,
    facebook,
    image,
    instagram,
    isArtist,
    is_following,
    noOfFollowers,
    noOfFollowing,
    profileTagId,
    tiktok,
    bio,
  } = userOrArtistProfileDetails;

  const [isFollowingArtist, setIsFollowingArtist] = useState(
    () => is_following,
  );
  const [followersCount, setFollowersCount] = useState(() => noOfFollowers);
  const [followingCount, setFollowingCount] = useState(() => noOfFollowing);
  const [isLoadingImage, setIsLoadingImage] = useState(() => true);
  const [isSendingResponseToServer, setIsSendingResponseToServer] = useState(
    () => false,
  );

  const dispatch = useDispatch();

  useEffect(() => {
    if (!util.isEmptyObject(userOrArtistProfileDetails)) {
      setFollowersCount(noOfFollowers);
      setFollowingCount(noOfFollowing);
    }
  }, [userOrArtistProfileDetails]);

  useEffect(() => {
    setIsFollowingArtist(is_following);
  }, [is_following]);

  const socialMediaLinksArr = [
    {
      id: 0,
      onPress: function () {
        util.openLinkInBrowser(tiktok);
      },
      image: Images.tiktokIcon,
      link: tiktok,
    },
    {
      id: 1,
      onPress: function () {
        util.openLinkInBrowser(instagram);
      },
      image: Images.instagramIcon,
      link: instagram,
    },
    {
      id: 2,
      onPress: function () {
        util.openLinkInBrowser(facebook);
      },
      image: Images.facebookIcon,
      link: facebook,
    },
    {
      id: 3,
      onPress: function () {
        util.openLinkInBrowser(dribble);
      },
      image: Images.dribbleIcon,
      link: dribble,
    },
  ];

  // if user is unfollowed then hide cound of follow & unfollow
  const shouldShowFollowingCount =
    !!!isVisitingOnArtistProfile || (!!isArtist && !!isFollowingArtist);

  function onFollowUnFollowBtnPress() {
    setIsSendingResponseToServer(true);
    setIsFollowingArtist(!isFollowingArtist);
    const payload = {
      item: userOrArtistProfileDetails,
      follow: !isFollowingArtist,
    };
    dispatch(
      followUnFollowArtistRequest(payload, res => {
        if (!!res) {
          const {number_of_following = 0, number_of_followers = 0} = res || {};
          setFollowersCount(number_of_followers);
          setFollowingCount(number_of_following);
        } else {
          setIsFollowingArtist(!isFollowingArtist);
        }
        setIsSendingResponseToServer(false);
      }),
    );
  }

  const renderArtistProfile = () => (
    <>
      <View style={[styles.profilePicView, AppStyles.paddingHorizontalBase]}>
        <>
          <FastImage
            style={styles.profilePic}
            onLoad={() => setIsLoadingImage(false)}
            source={{
              uri: image,
              priority: FastImage.priority.high,
            }}
            resizeMode={FastImage.resizeMode.cover}
          />
          {!!isBackgroundImage && (
            <View style={styles.imageLoadingStyle}>
              <ActivityIndicator animating size="small" color={Colors.white} />
            </View>
          )}
          {!!isLoadingImage && (
            <View style={styles.imageLoadingStyle}>
              <ActivityIndicator animating size="small" color={Colors.white} />
            </View>
          )}
        </>
        <Text style={styles.profileName}>
          {profileTagId ? `@${profileTagId}` : ''}
        </Text>
        <Text style={styles.profileDescription}>{bio ? bio : ''}</Text>
      </View>
      <>
        <View style={styles.followView}>
          <TouchableOpacity
            style={styles.followingView}
            onPress={() =>
              followingCount > 0 || !!!isVisitingOnArtistProfile ? (
                Actions.artistFollowing({
                  activeUserOrArtistObj: isVisitingOnArtistProfile
                    ? userOrArtistProfileDetails
                    : {},
                })
              ) : (
                <></>
              )
            }
            activeOpacity={0.5}>
            <Text style={styles.followText}>{strings.FOLLOWING}</Text>
            <Text style={styles.follow}>{followingCount}</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.followingView}
            onPress={() =>
              followersCount > 0 || !!!isVisitingOnArtistProfile
                ? Actions.artistFollowers({
                    activeUserOrArtistObj: isVisitingOnArtistProfile
                      ? userOrArtistProfileDetails
                      : {},
                  })
                : Function()
            }
            activeOpacity={0.5}>
            <Text style={styles.followText}>{strings.FOLLOWER}</Text>
            <Text style={styles.follow}>{followersCount}</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.editButtonView}>
          {!!isVisitingOnArtistProfile ? (
            <TouchableOpacity
              disabled={isSendingResponseToServer}
              style={
                !!isFollowingArtist ? styles.buttonView : styles.followBtnStyle
              }
              onPress={() => onFollowUnFollowBtnPress()}
              activeOpacity={0.5}>
              {isSendingResponseToServer ? (
                <ActivityIndicator
                  animating
                  size="small"
                  color={Colors.white}
                />
              ) : (
                <Text style={styles.buttonArtistView}>
                  {!!isFollowingArtist ? strings.FOLLOWING : strings.FOLLOW}
                </Text>
              )}
            </TouchableOpacity>
          ) : (
            <TouchableOpacity
              style={styles.buttonView}
              onPress={() =>
                Actions.jump('editProfile', {
                  screen: 'artistProfile',
                })
              }
              activeOpacity={0.5}>
              <Text style={styles.buttonArtistView}>
                {strings.EDIT_PROFILE}
              </Text>
            </TouchableOpacity>
          )}

          <View style={styles.socialMediaMainView}>
            {socialMediaLinksArr.map(item => {
              const {link} = item;
              const isLinkInvalid = util.isValidURL(link);
              if (!!isLinkInvalid) {
                const {image, onPress} = item;
                return (
                  <TouchableOpacity
                    onPress={() => onPress()}
                    style={styles.socialMediaView}
                    activeOpacity={0.4}>
                    <Image source={image} />
                  </TouchableOpacity>
                );
              }
            })}
          </View>
        </View>
      </>
    </>
  );

  // const renderUserProfile = () => {
  //   return (
  //     <>
  //       <View style={[styles.profilePicView]}>
  //         <Text style={styles.profileName}>
  //           {profileTagId ? `@${profileTagId}` : ''}
  //         </Text>
  //         <Text style={styles.profileDescription}>{userBio}</Text>
  //       </View>
  //       <View style={[styles.followView, AppStyles.mTop20]}>
  //         <TouchableOpacity
  //           style={styles.followingView}
  //           onPress={() =>
  //             Actions.artistFollowing({
  //               activeUserOrArtistObj: isVisitingOnArtistProfile
  //                 ? userOrArtistProfileDetails
  //                 : {},
  //             })
  //           }
  //           activeOpacity={0.5}>
  //           <Text style={styles.followText}>{strings.FOLLOWING}</Text>
  //           <Text style={styles.follow}>{followingCount}</Text>
  //         </TouchableOpacity>

  //         <View>
  //           <TouchableOpacity
  //             style={styles.buttonView}
  //             onPress={() => Actions.editProfile({screen: 'userProfile'})}
  //             activeOpacity={0.5}>
  //             <Text style={styles.button}>{strings.EDIT_PROFILE}</Text>
  //           </TouchableOpacity>
  //         </View>
  //       </View>
  //     </>
  //   );
  // };

  const renderUserProfile = () => {
    return (
      <>
        <View style={[styles.profilePicView, AppStyles.paddingHorizontalBase]}>
          <>
            <FastImage
              style={styles.profilePic}
              onLoad={() => setIsLoadingImage(false)}
              source={{
                uri: image,
                priority: FastImage.priority.high,
              }}
              resizeMode={FastImage.resizeMode.cover}
            />

            {!!isLoadingImage && (
              <View style={styles.imageLoadingStyle}>
                <ActivityIndicator
                  animating
                  size="small"
                  color={Colors.white}
                />
              </View>
            )}
          </>
          <Text style={styles.profileName}>
            {profileTagId ? `@${profileTagId}` : ''}
          </Text>
          <Text style={styles.profileDescription}>{bio ? bio : ''}</Text>
        </View>
        <>
          <View style={styles.followView}>
            <TouchableOpacity
              style={styles.followingView}
              onPress={() =>
                followingCount > 0 || !!!isVisitingOnArtistProfile ? (
                  Actions.artistFollowing({
                    activeUserOrArtistObj: isVisitingOnArtistProfile
                      ? userOrArtistProfileDetails
                      : {},
                  })
                ) : (
                  <></>
                )
              }
              activeOpacity={0.5}>
              <Text style={styles.followText}>{strings.FOLLOWING}</Text>
              <Text style={styles.follow}>{followingCount}</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.followingView}
              onPress={() =>
                followersCount > 0 || !!!isVisitingOnArtistProfile
                  ? Actions.artistFollowers({
                      activeUserOrArtistObj: isVisitingOnArtistProfile
                        ? userOrArtistProfileDetails
                        : {},
                    })
                  : Function()
              }
              activeOpacity={0.5}>
              <Text style={styles.followText}>{strings.FOLLOWER}</Text>
              <Text style={styles.follow}>{followersCount}</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.editButtonView}>
            {!!isVisitingOnArtistProfile ? (
              <TouchableOpacity
                disabled={isSendingResponseToServer}
                style={
                  !!isFollowingArtist
                    ? styles.buttonView
                    : styles.followBtnStyle
                }
                onPress={() => onFollowUnFollowBtnPress()}
                activeOpacity={0.5}>
                {isSendingResponseToServer ? (
                  <ActivityIndicator
                    animating
                    size="small"
                    color={Colors.white}
                  />
                ) : (
                  <Text style={styles.buttonArtistView}>
                    {!!isFollowingArtist ? strings.FOLLOWING : strings.FOLLOW}
                  </Text>
                )}
              </TouchableOpacity>
            ) : (
              <TouchableOpacity
                style={styles.buttonView}
                onPress={() =>
                  Actions.jump('editProfile', {
                    screen: 'userProfile',
                  })
                }
                activeOpacity={0.5}>
                <Text style={styles.buttonArtistView}>
                  {strings.EDIT_PROFILE}
                </Text>
              </TouchableOpacity>
            )}

            <View style={styles.socialMediaMainView}>
              {socialMediaLinksArr.map(item => {
                const {link} = item;
                const isLinkInvalid = util.isValidURL(link);
                if (!!isLinkInvalid) {
                  const {image, onPress} = item;
                  return (
                    <TouchableOpacity
                      onPress={() => onPress()}
                      style={styles.socialMediaView}
                      activeOpacity={0.4}>
                      <Image source={image} />
                    </TouchableOpacity>
                  );
                }
              })}
            </View>
          </View>
        </>
      </>
    );
  };

  return (
    <View>
      {!!isArtistProfile ? renderArtistProfile() : renderUserProfile()}
    </View>
  );
};

UserProfileComponent.propTypes = {
  userOrArtistProfileDetails: PropTypes.object,
  isArtistProfile: PropTypes.bool,
  isVisitingOnArtistProfile: PropTypes.bool,
};
UserProfileComponent.defaultProps = {
  userOrArtistProfileDetails: {},
  isArtistProfile: false,
  isVisitingOnArtistProfile: false,
};

const mapStateToProps = ({user}) => ({
  userDetails: user.data,
});
export default connect(mapStateToProps)(UserProfileComponent);
