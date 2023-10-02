// @flow
import Immutable from 'seamless-immutable';
import {
  GET_COMMENTS_LIST,
  POST_COMMENT,
  EMPTY_COMMENTS_LIST,
  LIKE_UNLIKE_COMMENT,
  DELETE_COMMENT,
  EDIT_COMMENT,
  USER_SIGNOUT,
} from '../actions/ActionTypes';
import util from '../util';

const initialState = Immutable({
  commentsList: [],
});

export default (state = initialState, action) => {
  switch (action.type) {
    case EMPTY_COMMENTS_LIST: {
      return Immutable.merge(state, {
        commentsList: [],
      });
    }
    case GET_COMMENTS_LIST.SUCCESS: {
      let mCommentList = util.cloneDeepArray(state.commentsList);
      mCommentList = util.unionById(mCommentList, action.data);
      return Immutable.merge(state, {
        commentsList: mCommentList,
      });
    }
    case POST_COMMENT.SUCCESS: {
      let mCommentList = util.cloneDeepArray(state.commentsList);
      mCommentList.unshift(action.data);

      return Immutable.merge(state, {
        commentsList: mCommentList,
      });
    }
    case LIKE_UNLIKE_COMMENT.SUCCESS: {
      let {id} = action.data;
      let mCommentList = util.cloneDeepArray(state.commentsList);
      let mIndex = util.findIndexById(mCommentList, id);
      if (!!mCommentList[mIndex].liked) {
        mCommentList[mIndex]['no_of_likes'] =
          mCommentList[mIndex].no_of_likes - 1;
      } else {
        mCommentList[mIndex]['no_of_likes'] =
          mCommentList[mIndex].no_of_likes + 1;
      }
      mCommentList[mIndex]['liked'] = !mCommentList[mIndex].liked;
      return Immutable.merge(state, {
        commentsList: mCommentList,
      });
    }
    case DELETE_COMMENT.SUCCESS: {
      const id = action.data;
      let mCommentList = util.cloneDeepArray(state.commentsList);
      mCommentList = util.filterArray(mCommentList, item => item.id != id);

      return Immutable.merge(state, {
        commentsList: mCommentList,
      });
    }
    case EDIT_COMMENT.SUCCESS: {
      const {id, body} = action.data;
      let mCommentList = util.cloneDeepArray(state.commentsList);
      let mIndex = util.findIndexById(mCommentList, id);
      mCommentList[mIndex]['body'] = body;

      return Immutable.merge(state, {
        commentsList: mCommentList,
      });
    }
    case USER_SIGNOUT.SUCCESS: {
      return Immutable.merge(state, initialState);
    }
    default:
      return state;
  }
};
