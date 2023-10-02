// @flow
import {
  GET_ARTIST_COMMUNITIES_LIST,
  GET_COMMUNITIES_LIST_I_AM_PART_OF,
  GET_COMMUNITY_DROPS,
  SAVE_USER_COMMUNITIES_AGAINST_KEY,
  SEARCH_COMMUNITY,
} from './ActionTypes';

export function getArtistCommunitiesListRequest(payload, responseCallback) {
  return {
    payload,
    responseCallback,
    type: GET_ARTIST_COMMUNITIES_LIST.REQUEST,
  };
}
export function getArtistCommunitiesListSuccess(data) {
  return {
    data,
    type: GET_ARTIST_COMMUNITIES_LIST.SUCCESS,
  };
}

export function getCommunitiesListIAmPartOfRequest(
  payload,
  params,
  responseCallback,
) {
  return {
    payload,
    params,
    responseCallback,
    type: GET_COMMUNITIES_LIST_I_AM_PART_OF.REQUEST,
  };
}
export function getCommunitiesListIAmPartOfSuccess(data) {
  return {
    data,
    type: GET_COMMUNITIES_LIST_I_AM_PART_OF.SUCCESS,
  };
}

export function saveUserCommunitiesListAgainstKey(data) {
  return {
    data,
    type: SAVE_USER_COMMUNITIES_AGAINST_KEY,
  };
}

export function getCommunityDropsRequest(payload, params, responseCallback) {
  return {
    payload,
    params,
    responseCallback,
    type: GET_COMMUNITY_DROPS.REQUEST,
  };
}
export function getCommunityDropsSuccess(artistId, data) {
  return {
    artistId,
    data,
    type: GET_COMMUNITY_DROPS.SUCCESS,
  };
}

export function searchCommunityRequest(payload, params, responseCallback) {
  return {
    payload,
    params,
    responseCallback,
    type: SEARCH_COMMUNITY.REQUEST,
  };
}
export function searchCommunitySuccess(data) {
  return {
    data,
    type: SEARCH_COMMUNITY.SUCCESS,
  };
}
