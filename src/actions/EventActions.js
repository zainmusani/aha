import {GET_EVENTS, UPDATE_EVENTS} from './ActionTypes';

export function getEventListRequest(params, responseCallback) {
  return {
    params,
    responseCallback,
    type: GET_EVENTS.REQUEST,
  };
}
export function getEventListSuccess(data) {
  return {
    data,
    type: GET_EVENTS.SUCCESS,
  };
}
export function updateEventsData(data) {
  return {
    data,
    type: UPDATE_EVENTS,
  };
}
