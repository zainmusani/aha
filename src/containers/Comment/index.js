import moment from 'moment';
import React, {useEffect, useMemo, useRef, useState} from 'react';
import {
  ActivityIndicator,
  FlatList,
  Image,
  Text,
  TouchableOpacity,
  View,
  Keyboard,
  RefreshControl,
} from 'react-native';
import FastImage from 'react-native-fast-image';
import KeyboardSpacer from 'react-native-keyboard-spacer';
import {Actions} from 'react-native-router-flux';
import {connect, useDispatch} from 'react-redux';
import {
  deleteCommentRequest,
  emptyCommentsListReducer,
  getCommentsListRequest,
  likeCommentRequest,
  postCommentRequest,
} from '../../actions/CommentActions';
import {
  ActionBottomSheet,
  CustomNavbar,
  Loader,
  NoDataFoundComponent,
  TextInput,
} from '../../components';
import DeleteOrRemoveModal from '../../components/DeleteOrRemoveModal';
import {strings} from '../../constants';
import {AppStyles, Colors, Images} from '../../theme';
import util from '../../util';
import styles from './Styles';
import {mixpanel} from '../../helpers/mixpanelHelper';

const Comment = props => {
  const limit = 10;
  // let offset = 0;

  const {
    _commentsList,
    art_id = '',
    collection_id = '',
    feedItem,
  } = props || {};
  const [isFetchingDataFromServer, setIsFetchingDataFromServer] = useState(
    () => false,
  );
  const [isSendingCommentToServer, setIsSendingCommentToServer] = useState(
    () => false,
  );
  const [isLoadingMoreComments, setIsLoadingMoreComments] = useState(
    () => false,
  );
  const [commentBody, setCommentBody] = useState(() => '');
  const [selectedCommentObj, setSelectedCommentObj] = useState(() => '');
  const [hasMoreComments, setHasMoreComments] = useState(() => true);
  const [actionSheetVisible, setActionSheetVisible] = useState(() => false);
  const [bottomSheetVisibility, setBottomSheetVisibility] = useState(
    () => false,
  );
  const [offset, setOffset] = useState(() => 0);
  const [confirmationModalVisibility, setConfirmationModalVisibility] =
    useState(() => false);
  const commentBodyRef = useRef(() => null);
  const flatListRef = useRef(() => null);
  const actionSheetRef = useRef(() => null);
  const bottomSheetRef = useRef(() => null);
  const dispatch = useDispatch();

  useEffect(() => {
    setIsFetchingDataFromServer(true);
    mixpanel.track('Visit', {
      PageName: 'Comment',
      ArtistName: feedItem?.artist?.profileTagId,
      PostTitle: feedItem?.title,
    });
    getCommentsListFromAPI();

    return () => {
      dispatch(emptyCommentsListReducer());
    };
  }, []);

  function getCommentsListFromAPI() {
    const param = `?offset=${offset}&limit=${limit}&art_id=${art_id}`;
    dispatch(
      getCommentsListRequest(param, response => {
        const {status, data} = response || {};
        const {remaining_comments = 0} = data || {};
        if (status && remaining_comments < 1) {
          setHasMoreComments(false);
        }

        setIsFetchingDataFromServer(false);
        setIsLoadingMoreComments(false);
      }),
    );
  }

  function loadMoreCommentsFromAPI() {
    if (hasMoreComments && !isLoadingMoreComments) {
      setIsLoadingMoreComments(true);
      const param = `?offset=${offset}&limit=${limit}&art_id=${art_id}`;
      dispatch(
        getCommentsListRequest(param, response => {
          const {status, data} = response || {};
          const {remaining_comments = 0} = data || {};
          if (status && remaining_comments < 1) {
            setHasMoreComments(false);
          }
          setOffset(offset + 10);
          setIsLoadingMoreComments(false);
        }),
      );
    }
  }

  function likeUnlikeCommentPressHandler(id, liked) {
    const payload = {id, liked};
    dispatch(likeCommentRequest(payload, () => {}));
  }

  function deleteCommentPressHandler() {
    const {id} = selectedCommentObj;
    const params = `${id}`;
    dispatch(deleteCommentRequest(params, () => {}));
  }

  function onPostComment() {
    setIsSendingCommentToServer(true);
    flatListRef?.current?.scrollToOffset({animated: true, offset: 0});

    let payload = {
      body: commentBody,
    };
    if (!util.isEmptyValue(String(art_id))) {
      payload['art_id'] = art_id;
    }
    if (!util.isEmptyValue(String(collection_id))) {
      payload['collection_id'] = collection_id;
    }

    dispatch(
      postCommentRequest(payload, res => {
        if (!!res) setCommentBody('');
        setIsSendingCommentToServer(false);
      }),
    );
  }

  const renderLoader = () => (
    <View style={styles.loader}>
      <Loader loading={isFetchingDataFromServer} />
    </View>
  );

  const renderMoreCommentsLoader = () => (
    <View style={styles.loadMoreCommentsLoader}>
      <Loader loading={isLoadingMoreComments} />
    </View>
  );

  const renderCustomNavBar = () => (
    <CustomNavbar
      title={strings.COMMENTS}
      hasBack
      titleStyle={AppStyles.titleStyleForCenter}
      leftRightButtonWrapperStyle={{justifyContent: 'center'}}
    />
  );

  const renderComments = useMemo(
    () => (
      <>
        <FlatList
          showsVerticalScrollIndicator={false}
          data={_commentsList}
          ref={flatListRef}
          onEndReachedThreshold={0.1}
          onEndReached={loadMoreCommentsFromAPI}
          refreshing={false}
          onRefresh={getCommentsListFromAPI}
          refreshControl={
            <RefreshControl
              refreshing={false}
              onRefresh={() => getCommentsListFromAPI()}
              tintColor={Colors.pullToRefreshLoader}
            />
          }
          keyExtractor={(_, index) => index}
          renderItem={({item}) => {
            const {
              id,
              user,
              body,
              no_of_likes,
              created_at,
              liked,
              is_my_comment,
            } = item;
            const {username, profile_image} = user;
            return (
              <View style={[styles.profileMainView]}>
                <View style={[styles.profileView]}>
                  <FastImage
                    style={styles.profileIcon}
                    source={{
                      uri: profile_image,
                      priority: FastImage.priority.high,
                    }}
                    resizeMode={FastImage.resizeMode.cover}></FastImage>
                </View>
                <TouchableOpacity
                  disabled={!is_my_comment}
                  onLongPress={() => {
                    setSelectedCommentObj(item);
                    setActionSheetVisible(true);
                  }}>
                  <View style={{flexDirection: 'row'}}>
                    <View style={styles.commentSection}>
                      <Text style={styles.commentProfile}>{username}</Text>
                      <Text style={styles.commentDescription}>{body}</Text>
                      <Text style={styles.commentArrivalDayText}>
                        {moment(created_at)?.fromNow()}
                      </Text>
                    </View>
                  </View>
                </TouchableOpacity>
                <View style={styles.likeCommentView}>
                  <TouchableOpacity
                    activeOpacity={0.5}
                    onPress={() => likeUnlikeCommentPressHandler(id, !liked)}>
                    <Image
                      source={!!liked ? Images.heartIconFill : Images.heartIcon}
                      style={styles.likeCommentImg}
                      resizeMode={'contain'}
                    />
                  </TouchableOpacity>
                  <Text style={styles.likesNumber}>{no_of_likes}</Text>
                </View>
              </View>
            );
          }}
          ListEmptyComponent={() => (
            <NoDataFoundComponent text={strings.NO_COMMENTS_FOUND} />
          )}
          ListFooterComponent={
            !!isLoadingMoreComments ? renderMoreCommentsLoader() : <></>
          }
        />
      </>
    ),
    [_commentsList, isLoadingMoreComments],
  );

  const renderCommentWriteSection = () => (
    <View style={styles.commentsWriteSection}>
      <View style={{flex: 0.95}}>
        <TextInput
          ref={commentBodyRef?.current?.focus?.()}
          style={styles.textInput}
          placeholder={strings.DO_COMMENTS}
          placeholderTextColor={'gray'}
          selectionColor={Colors.appColorDarkBlue1}
          cursorColor={Colors.appColorDarkBlue1}
          onSubmitEditing={() => onPostComment()}
          returnKeyType="done"
          value={commentBody}
          onChangeText={val => {
            setCommentBody(val);
          }}
        />
      </View>
      <TouchableOpacity
        disabled={util.isEmptyValue(commentBody)}
        style={styles.MessageSendView}
        onPress={() => onPostComment()}>
        {!!isSendingCommentToServer ? (
          <ActivityIndicator animating size="small" color={Colors.white} />
        ) : (
          <Image
            source={Images.MessageSendIcon}
            style={styles.messageSendIconStyle}
          />
        )}
      </TouchableOpacity>
    </View>
  );

  const actionSheet = () => {
    const firstBtnAction = () => {
      Keyboard.dismiss();
      setActionSheetVisible(false);
      Actions.editComment({_commentObj: selectedCommentObj});
    };
    const secondBtnAction = () => {
      setActionSheetVisible(false);
      setConfirmationModalVisibility(true);
    };
    const cancelBtnAction = () => {
      setActionSheetVisible(false);
    };

    const valuesCallback = value => {
      if (value === 0) {
        firstBtnAction();
      }
      if (value === 1) {
        secondBtnAction();
      }
      if (value === 2) {
        cancelBtnAction();
      }
    };

    const textOptions = ['Edit', 'Delete', 'Cancel'];

    return (
      <ActionBottomSheet
        valuesCallback={valuesCallback}
        textOptions={textOptions}
        cancelBtnAction={() => {
          setActionSheetVisible(false);
        }}
      />
    );
  };

  const renderDeleteModal = useMemo(
    () => (
      <DeleteOrRemoveModal
        heading={strings.DELETE_COMMENT}
        description={strings.ARE_YOU_SURE_TO_DELETE_THIS_COMMENT}
        positiveBtnText={strings.DELETE}
        negativeBtnText={strings.DONT_DELETE}
        positiveBtnPressHandler={() => {
          setConfirmationModalVisibility(false);
          deleteCommentPressHandler();
        }}
        setModalVisibility={() =>
          setConfirmationModalVisibility(!confirmationModalVisibility)
        }
        isModalVisible={confirmationModalVisibility}
      />
    ),
    [confirmationModalVisibility],
  );

  return (
    <View style={styles.keyboardAwareCont}>
      {renderCustomNavBar()}
      <View style={styles.container}>
        {!!isFetchingDataFromServer ? renderLoader() : renderComments}
      </View>
      {renderCommentWriteSection()}
      {!util.isPlatformAndroid() && <KeyboardSpacer />}
      {!!actionSheetVisible && actionSheet()}
      {confirmationModalVisibility && renderDeleteModal}
    </View>
  );
};

Comment.propTypes = {};
Comment.defaultProps = {};

const mapStateToProps = ({comments}) => ({
  _commentsList: comments.commentsList,
});
const actions = {};

export default connect(mapStateToProps, actions)(Comment);
