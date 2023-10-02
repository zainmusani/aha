import {call, fork, put, take} from 'redux-saga/effects';
import {GET_EVENTS} from '../actions/ActionTypes';
import {getEventListSuccess, updateEventsData} from '../actions/EventActions';
import {callRequest, GET_EVENTS as GET_EVENTS_URL} from '../config/WebService';
import {manipulateEventsData} from '../helpers/eventsHelper';
import ApiSauce from '../services/ApiSauce';

function* getEventList() {
  while (true) {
    const {params, responseCallback} = yield take(GET_EVENTS.REQUEST);
    try {
      const response = yield call(
        callRequest,
        GET_EVENTS_URL,
        {},
        params,
        {},
        ApiSauce,
      );
      if (response.status) {
        yield put(getEventListSuccess(manipulateEventsData(response.data)));
        if (responseCallback)
          responseCallback(manipulateEventsData(response.data));
      } else {
        if (responseCallback) responseCallback(response.status);
      }
    } catch (err) {
      if (responseCallback) responseCallback(false);
    }
  }
}

export default function* root() {
  yield fork(getEventList);
}
