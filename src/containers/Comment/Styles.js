import {StyleSheet} from 'react-native';
import {Colors, Fonts, Metrics} from '../../theme';
import util from '../../util';

export default StyleSheet.create({
  keyboardAwareCont: {
    flexGrow: 1,
    flex: 1,
    backgroundColor: Colors.background.primary,
  },
  container: {
    flexGrow: 1,
    flex: 1,
  },
  profileMainView: {
    paddingLeft: 20,
    paddingRight: 10,
    marginVertical: 15,
    flexDirection: 'row',
  },
  profileView: {
    width: '13%',
    marginRight: '2%',
  },
  profileIcon: {
    width: 35,
    height: 35,
    borderRadius: 50,
    resizeMode: 'cover',
  },
  commentSection: {
    width: '71%',
  },
  commentProfile: {
    color: Colors.text.white,
    fontFamily: Fonts.type.semiBold,
    paddingVertical: 2,
  },
  commentDescription: {
    color: Colors.text.white,
    fontFamily: Fonts.type.regular,
  },
  likeCommentView: {
    width: '12%',
    alignItems: 'center',

    marginLeft: '2%',
  },
  likeCommentImg: {
    height: 20,
    width: 20,
    marginBottom: 7,
  },
  commentsWriteSection: {
    width: Metrics.screenWidth - 8,
    marginRight: 10,
    height: 70,
    marginLeft: 7,
    marginBottom: 20,
    flexDirection: 'row',
    alignItems: 'center',
  },
  textInput: {
    borderWidth: 1,
    paddingHorizontal: 20,
    marginHorizontal: 7,
    borderRadius: 10,
    paddingVertical: 7,
    borderColor: '#ededed',
    backgroundColor: '#ededed',
    height: 35,
  },
  MessageSendView: {
    backgroundColor: Colors.background.purple,
    width: 35,
    height: 35,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: util.isPlatformAndroid() ? 22 : 10,
    borderRadius: 25,
  },
  messageSendIconStyle: {
    width: 18,
    height: 16,
    resizeMode: 'contain',
  },
  likesNumber: {
    color: Colors.text.white,
  },
  loader: {
    justifyContent: 'center',
    position: 'absolute',
    top: '50%',
    right: 0,
    left: 0,
  },
  loadMoreCommentsLoader: {
    justifyContent: 'center',
    paddingVertical: 40,
  },
  commentArrivalDayText: {
    paddingVertical: 5,
    fontSize: Fonts.size.xxSmall,
    fontFamily: Fonts.type.regular,
    color: Colors.text.lightGray1,
  },
});
