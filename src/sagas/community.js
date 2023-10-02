import {call, fork, put, take, takeLatest} from 'redux-saga/effects';
import {
  GET_ARTIST_COMMUNITIES_LIST,
  GET_COMMUNITIES_LIST_I_AM_PART_OF,
  GET_COMMUNITY_DROPS,
  SEARCH_COMMUNITY,
} from '../actions/ActionTypes';
import {
  getArtistCommunitiesListSuccess,
  getCommunitiesListIAmPartOfSuccess,
  getCommunityDropsSuccess,
  saveUserCommunitiesListAgainstKey,
  searchCommunitySuccess,
} from '../actions/communityActions';
import {
  callRequest,
  GET_COMMUNITIES as GET_COMMUNITIES_URL,
  SEARCH_COMMUNITY as SEARCH_COMMUNITY_URL,
} from '../config/WebService';
import {SAGA_ALERT_TIMEOUT, strings} from '../constants';
import {manipulateCommunitiesListData} from '../helpers/communityHelper';
import ApiSauce from '../services/ApiSauce';
import {manipulatePostsListingData} from '../helpers/postsHelper';
import Util from '../util';

function alert(message, type = 'error') {
  setTimeout(() => {
    Util.topAlertError(message, type);
  }, SAGA_ALERT_TIMEOUT);
}

function* getArtistCommunitiesList() {
  while (true) {
    const {payload, responseCallback} = yield take(
      GET_ARTIST_COMMUNITIES_LIST.REQUEST,
    );

    try {
      const response = yield call(
        callRequest,
        GET_COMMUNITIES_URL,
        {},
        payload,
        {},
        ApiSauce,
      );
      if (response.status) {
        yield put(
          getArtistCommunitiesListSuccess(
            manipulateCommunitiesListData(response.data),
          ),
        );
        if (responseCallback) responseCallback(true);
      } else {
        if (responseCallback) responseCallback(false);
        alert(response?.message ?? strings.SOMETHING_WENT_WRONG);
      }
    } catch (err) {
      if (responseCallback) responseCallback(false);
      alert(err?.message ?? strings.SOMETHING_WENT_WRONG);
    }
  }
}

function* getCommunitiesListIAmPartOf() {
  while (true) {
    const {payload, params, responseCallback} = yield take(
      GET_COMMUNITIES_LIST_I_AM_PART_OF.REQUEST,
    );
    const {artistID, saveDataAgainstVisitingUserKey = false} = payload;

    try {
      const response = yield call(
        callRequest,
        GET_COMMUNITIES_URL,
        {},
        params,
        {},
        ApiSauce,
      );
      if (response.status) {
        if (!!saveDataAgainstVisitingUserKey) {
          let data = {
            id: artistID,
            userCommunitiesList: manipulateCommunitiesListData(response.data),
          };
          yield put(saveUserCommunitiesListAgainstKey(data));
        } else {
          yield put(
            getCommunitiesListIAmPartOfSuccess(
              manipulateCommunitiesListData(response.data),
            ),
          );
        }
        if (responseCallback) responseCallback(true);
      } else {
        if (responseCallback) responseCallback(false);
        alert(response?.message ?? strings.SOMETHING_WENT_WRONG);
      }
    } catch (err) {
      if (responseCallback) responseCallback(false);
      alert(err?.message ?? strings.SOMETHING_WENT_WRONG);
    }
  }
}

function* getCommunityDrops() {
  while (true) {
    const {payload, params, responseCallback} = yield take(
      GET_COMMUNITY_DROPS.REQUEST,
    );
    const {artistId} = payload;
    try {
      const response = yield call(
        callRequest,
        GET_COMMUNITIES_URL,
        {},
        params,
        {},
        ApiSauce,
      );
      if (response.status) {
        yield put(
          getCommunityDropsSuccess(
            artistId,
            manipulatePostsListingData(response.data),
          ),
        );
        if (responseCallback)
          responseCallback(manipulatePostsListingData(response.data));
      } else {
        if (responseCallback) responseCallback(false);
      }
    } catch (err) {
      if (responseCallback) responseCallback(false);
      alert(err?.message ?? strings.SOMETHING_WENT_WRONG);
    }
  }
}

function* searchCommunity(action) {
  const {payload, params, responseCallback} = action;

  try {
    const response = yield call(
      callRequest,
      SEARCH_COMMUNITY_URL,
      payload,
      params,
      {},
      ApiSauce,
    );

    if (response) {
      yield put(
        searchCommunitySuccess(
          manipulateCommunitiesListData(response?.data ?? []),
        ),
      );
      if (responseCallback) responseCallback(response?.data);
    } else {
      if (responseCallback) responseCallback(null, null);
    }
  } catch (err) {
    if (responseCallback) responseCallback(null, err);

    console.log({err});
  }
}

export default function* root() {
  yield fork(getArtistCommunitiesList);
  yield fork(getCommunitiesListIAmPartOf);
  yield fork(getCommunityDrops);
  yield takeLatest(SEARCH_COMMUNITY.REQUEST, searchCommunity);
}
