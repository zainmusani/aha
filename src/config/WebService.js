import _ from 'lodash';
import Util from '../util';

const PRODUCTION_URL = 'https://prod.allhailart.com';
const STAGING_URL = 'https://staging.allhailart.com';
const DEV_URL = 'http://52.207.115.17:1337';
const NGROK_URL = 'https://6af6-110-39-172-42.in.ngrok.io';
/// ALEAT sprite key bhi live krni hn
export const BASE_URL = PRODUCTION_URL;
const apiV1 = '/api/v1/';
export const authV1 = '/authentication/v1/';

export const API_TIMEOUT = 30000;

// API USER ROUTES
export const API_LOG = true;

export const ERROR_SOMETHING_WENT_WRONG = {
  message: 'Something went wrong, Please try again later',
  error: 'Something went wrong, Please try again later',
};
export const ERROR_NETWORK_NOT_AVAILABLE = {
  message: 'Please connect to the working Internet',
  error: 'Please connect to the working Internet',
};

export const ERROR_TOKEN_EXPIRE = {
  message: 'Session Expired, Please login again!',
  error: 'Session Expired, Please login again!',
};

export const REQUEST_TYPE = {
  GET: 'get',
  POST: 'post',
  DELETE: 'delete',
  PUT: 'put',
};

// API USER ROUTES

export const USER_SIGNIN = {
  route: `${authV1}login`,
  access_token_required: false,
  type: REQUEST_TYPE.POST,
};

export const USER_SIGNUP = {
  route: `${authV1}register`,
  access_token_required: false,
  type: REQUEST_TYPE.POST,
};

export const USER_SIGNOUT = {
  route: `${authV1}logout`,
  access_token_required: true,
  type: REQUEST_TYPE.POST,
};
export const USER_FORGOT_PASSWORD = {
  route: `${authV1}forget-password`,
  access_token_required: false,
  type: REQUEST_TYPE.POST,
};
export const USER_CONFIRM_OTP_FGPASS = {
  route: `${authV1}forget-password/confirm-otp`,
  access_token_required: false,
  type: REQUEST_TYPE.POST,
};
export const USER_CONFIRM_OTP_SIGNUP = {
  route: `${authV1}confirm-otp`,
  access_token_required: false,
  type: REQUEST_TYPE.POST,
};
export const USER_UPDATE_PASSWORD = {
  route: `${authV1}forget-password/change-password`,
  access_token_required: false,
  type: REQUEST_TYPE.POST,
};

export const SIGNUP_RESEND_OTP = {
  route: `${authV1}register/resend-otp`,
  access_token_required: false,
  type: REQUEST_TYPE.POST,
};

export const PERSONAL_INFO = {
  route: `${authV1}user/edit/personal-info`,
  access_token_required: false,
  type: REQUEST_TYPE.POST,
};
export const CHOOSE_YOUR_INTERESTS = {
  route: 'login',
  access_token_required: false,
  type: REQUEST_TYPE.POST,
};
export const CHOOSE_YOUR_VIBE = {
  route: 'login',
  access_token_required: false,
  type: REQUEST_TYPE.POST,
};

export const CREATE_ADDRESS = {
  route: `${apiV1}user/addresses`,
  access_token_required: true,
  type: REQUEST_TYPE.POST,
};

export const ADDRESSES_LIST = {
  route: `${apiV1}user/addresses`,
  access_token_required: true,
  type: REQUEST_TYPE.GET,
};

export const ADDRESS_DELETE = {
  route: '/api/v1/user/addresses',
  access_token_required: true,
  type: REQUEST_TYPE.DELETE,
};

export const UPDATE_ADDRESS = {
  route: `${apiV1}user/addresses`,
  access_token_required: true,
  type: REQUEST_TYPE.PUT,
};

export const SELECT_DEFAULT = {
  route: `${apiV1}user/addresses/select-default`,
  access_token_required: true,
  type: REQUEST_TYPE.POST,
};

export const GET_ARTISTS_LIST = {
  route: `${apiV1}artists`,
  access_token_required: true,
  type: REQUEST_TYPE.GET,
};

export const GET_ARTIST_COMMUNITIES_LIST = {
  route: `${apiV1}communities`,
  access_token_required: true,
  type: REQUEST_TYPE.GET,
};

export const GET_INTERESTS_LIST = {
  route: `${apiV1}interests`,
  access_token_required: true,
  type: REQUEST_TYPE.GET,
};

export const SUBMIT_VIBES = {
  route: `${apiV1}user/vibes/update`,
  access_token_required: true,
  type: REQUEST_TYPE.POST,
};

export const SUBMIT_INTERESTS = {
  route: `${apiV1}user/interests/update`,
  access_token_required: true,
  type: REQUEST_TYPE.POST,
};

export const FOLLOW_UNFOLLOW_ARTIST = {
  route: `${apiV1}user/follow-artist`,
  access_token_required: true,
  type: REQUEST_TYPE.POST,
};

export const FOLLOW_UNFOLLOW_COMMUNITY = {
  route: `${apiV1}user/follow-community`,
  access_token_required: true,
  type: REQUEST_TYPE.POST,
};

export const DASHBOARD_FEEDS = {
  route: `${apiV1}user/dashboard-feeds`,
  access_token_required: true,
  type: REQUEST_TYPE.GET,
  // type: REQUEST_TYPE.POST,
};

export const GET_VIBES_LIST = {
  route: `${apiV1}vibes`,
  access_token_required: true,
  type: REQUEST_TYPE.GET,
};

export const PRIVACY_POLICY = {
  route: `${apiV1}screen-contents/privacy_policy`,
  access_token_required: true,
  type: REQUEST_TYPE.GET,
};

export const TERM_AND_CONDITION = {
  route: `${apiV1}screen-contents/terms_and_conditions`,
  access_token_required: true,
  type: REQUEST_TYPE.GET,
};

export const EDIT_PROFILE = {
  route: `${apiV1}user/edit/profile`,
  access_token_required: true,
  type: REQUEST_TYPE.PUT,
};

export const CHANGE_PASSWORD = {
  route: `${authV1}user/edit/password`,
  access_token_required: true,
  type: REQUEST_TYPE.POST,
};

export const CHANGE_EMAIL = {
  route: `${authV1}user/edit/email`,
  access_token_required: true,
  type: REQUEST_TYPE.POST,
};

export const CHANGE_PHONE = {
  route: `${authV1}user/edit/contact/`,
  access_token_required: true,
  type: REQUEST_TYPE.POST,
};

export const CHANGE_PHONE_OPT = {
  route: `${authV1}user/edit/contact/confirm-otp`,
  access_token_required: true,
  type: REQUEST_TYPE.POST,
};

export const BECOME_AN_ARTIST = {
  route: `${apiV1}user/edit/become-artist`,
  access_token_required: true,
  type: REQUEST_TYPE.POST,
};

export const GET_SELECTED_VIBES = {
  route: `${apiV1}user/vibes`,
  access_token_required: true,
  type: REQUEST_TYPE.GET,
};

export const GET_SELECTED_INTERESTS = {
  route: `${apiV1}user/interests`,
  access_token_required: true,
  type: REQUEST_TYPE.GET,
};

export const GET_SELECTED_COMMUNITIES = {
  route: `${apiV1}user/communities`,
  access_token_required: true,
  type: REQUEST_TYPE.GET,
};

export const CREATE_COLLECTION = {
  route: `${apiV1}user/art-collections`,
  access_token_required: true,
  type: REQUEST_TYPE.POST,
};

export const UPDATE_COLLECTION = {
  route: `${apiV1}user/art-collections`,
  access_token_required: true,
  type: REQUEST_TYPE.PUT,
};

export const DELETE_COLLECTION = {
  route: `${apiV1}user/art-collections`,
  access_token_required: true,
  type: REQUEST_TYPE.DELETE,
};

export const DELETE_POSTS_COLLECTION = {
  route: `${apiV1}user/art-collections`,
  access_token_required: true,
  type: REQUEST_TYPE.DELETE,
};

export const GET_COLLECTION_LISTING = {
  route: `${apiV1}user/art-collections`,
  access_token_required: true,
  type: REQUEST_TYPE.GET,
};

export const GET_COLLECTION_DETAILS_BY_ID = {
  route: `${apiV1}user/art-collections`,
  access_token_required: true,
  type: REQUEST_TYPE.GET,
};

export const GET_SINGLE_POST_BY_ID = {
  route: `${apiV1}user/arts`,
  access_token_required: true,
  type: REQUEST_TYPE.GET,
};

export const GET_POSTS_LISTING = {
  route: `${apiV1}user/arts`,
  access_token_required: true,
  type: REQUEST_TYPE.GET,
};

export const DELETE_FEED = {
  route: `${apiV1}user/arts`,
  access_token_required: true,
  type: REQUEST_TYPE.DELETE,
};

export const POST_AN_ART = {
  route: `${apiV1}user/arts`,
  access_token_required: true,
  type: REQUEST_TYPE.POST,
};

export const POST_ORDER = {
  route: `${apiV1}user/orders`,
  access_token_required: true,
  type: REQUEST_TYPE.POST,
};

export const GET_ARTS_RELATED = {
  route: `${apiV1}user/arts/related`,
  access_token_required: true,
  type: REQUEST_TYPE.GET,
};

export const APP_SETTTINGS = {
  route: `${apiV1}settings`,
  access_token_required: false,
  type: REQUEST_TYPE.GET,
};

export const GET_FOLLOWERS_LIST = {
  route: `${apiV1}user/followers`,
  access_token_required: true,
  type: REQUEST_TYPE.GET,
};

export const GET_FOLLOWING_LIST = {
  route: `${apiV1}user/following`,
  access_token_required: true,
  type: REQUEST_TYPE.GET,
};

export const REMOVE_FOLLOWER = {
  route: `${apiV1}user/followers`,
  access_token_required: true,
  type: REQUEST_TYPE.DELETE,
};

export const GET_LOGGED_IN_USER_DETAILS = {
  route: `${apiV1}artists`,
  access_token_required: true,
  type: REQUEST_TYPE.GET,
};

export const GET_USER_DETAILS_BY_ID = {
  route: `${apiV1}artists`,
  access_token_required: true,
  type: REQUEST_TYPE.GET,
};

export const DELETE_POST_FROM_COLLECTION = {
  route: `${apiV1}user/art-collections/art`,
  access_token_required: true,
  type: REQUEST_TYPE.DELETE,
};

export const GET_ORDER_HISTORY = {
  route: `${apiV1}user/orders`,
  access_token_required: true,
  type: REQUEST_TYPE.GET,
};
export const GET_ORDER_ARTS_HISTORY = {
  route: `${apiV1}user/order-arts`,
  access_token_required: true,
  type: REQUEST_TYPE.GET,
};

export const GET_ORDER_HISTORY_DETAIL = {
  route: `${apiV1}user/orders`,
  access_token_required: true,
  type: REQUEST_TYPE.GET,
};

export const GET_COMMUNITIES = {
  route: `${apiV1}user/communities`,
  access_token_required: true,
  type: REQUEST_TYPE.GET,
};

export const GET_COMMUNITY_DROPS = {
  route: `${apiV1}user/communities`,
  access_token_required: true,
  type: REQUEST_TYPE.GET,
};

export const SET_DEFAULT_CARD = {
  route: `${apiV1}user/cards/select-default`,
  access_token_required: true,
  type: REQUEST_TYPE.POST,
};

export const GET_CREDIT_CARD_LISTING = {
  route: `${apiV1}user/cards`,
  access_token_required: true,
  type: REQUEST_TYPE.GET,
};

export const ADD_CREDIT_CARD = {
  route: `${apiV1}user/cards`,
  access_token_required: true,
  type: REQUEST_TYPE.POST,
};

export const DELETE_CREDIT_CARD = {
  route: `${apiV1}user/cards`,
  access_token_required: true,
  type: REQUEST_TYPE.DELETE,
};

export const GET_TRANSACTIONS_LIST = {
  route: `${apiV1}user/transactions`,
  access_token_required: true,
  type: REQUEST_TYPE.GET,
};

export const PIN_UNPIN = {
  route: `${apiV1}user/arts/pin-unpin`,
  access_token_required: true,
  type: REQUEST_TYPE.POST,
};

export const GET_PIN_TO_COLLECTION_LIST = {
  route: `${apiV1}user/collections`,
  access_token_required: true,
  type: REQUEST_TYPE.GET,
};

export const GET_PIN_LIST = {
  route: `${apiV1}user/arts/pinned`,
  access_token_required: true,
  type: REQUEST_TYPE.GET,
};

export const PIN_TO_COLLECTION_CREATE = {
  route: `${apiV1}user/collections`,
  access_token_required: true,
  type: REQUEST_TYPE.POST,
};

export const GET_COMMENTS_LIST = {
  route: `${apiV1}user/comments`,
  access_token_required: true,
  type: REQUEST_TYPE.GET,
};

export const POST_COMMENT = {
  route: `${apiV1}user/comments`,
  access_token_required: true,
  type: REQUEST_TYPE.POST,
};

export const EDIT_COMMENT = {
  route: `${apiV1}user/comments`,
  access_token_required: true,
  type: REQUEST_TYPE.PUT,
};

export const LIKE_UNLIKE_COMMENT = {
  route: `${apiV1}user/comments/like-unlike`,
  access_token_required: true,
  type: REQUEST_TYPE.POST,
};

export const DELETE_COMMENT = {
  route: '/api/v1/user/comments',
  access_token_required: true,
  type: REQUEST_TYPE.DELETE,
};

export const REPLY_ON_COMMENT = {
  route: `${apiV1}user/comments`,
  access_token_required: true,
  type: REQUEST_TYPE.POST,
};

export const GET_POSTS_AND_COLLECTIONS_OF_PINNED_COLLECTION = {
  route: `${apiV1}user/arts/pinned`,
  access_token_required: true,
  type: REQUEST_TYPE.GET,
};

export const CHANGE_PIN_PRIVACY = {
  route: `${apiV1}user/arts/pinned/change-privacy`,
  access_token_required: true,
  type: REQUEST_TYPE.POST,
};

export const EDIT_PIN_TO_COLLECTION = {
  route: `${apiV1}user/collections`,
  access_token_required: true,
  type: REQUEST_TYPE.PUT,
};

export const DELETE_PIN_TO_COLLECTION = {
  route: `${apiV1}user/collections`,
  access_token_required: true,
  type: REQUEST_TYPE.DELETE,
};

export const POST_COLLECTION_PIN_UNPIN = {
  route: `${apiV1}user/art-collections/pin-unpin`,
  access_token_required: true,
  type: REQUEST_TYPE.POST,
};

export const EDIT_POST = {
  route: `${apiV1}user/arts`,
  access_token_required: true,
  type: REQUEST_TYPE.PUT,
};

export const GET_COLLECTION_DETAILS = {
  route: `${apiV1}user/art-collections/detail`,
  access_token_required: true,
  type: REQUEST_TYPE.GET,
};
export const SEARCH_COMMUNITY = {
  route: `${apiV1}user/communities`,
  access_token_required: true,
  type: REQUEST_TYPE.GET,
};
export const SALES_HISTORY = {
  route: `${apiV1}user/sales`,
  access_token_required: true,
  type: REQUEST_TYPE.GET,
};
export const SALES_HISTORY_STATUS = {
  route: `${apiV1}user/sales/orders`,
  access_token_required: true,
  type: REQUEST_TYPE.GET,
};
export const SALES_ORDER_CHANGE = {
  route: `${apiV1}user/sales/orders/change-status`,
  access_token_required: true,
  type: REQUEST_TYPE.PUT,
};
export const SALES_ORDER_HISTORY_DETAILS = {
  route: `${apiV1}user/sales/orders`,
  access_token_required: true,
  type: REQUEST_TYPE.GET,
};

export const GET_SEARCH_LIST_DATA_BY_CATEGORY = {
  route: `${apiV1}user/search/items`,
  access_token_required: true,
  type: REQUEST_TYPE.GET,
};

export const GET_POSTS_LIST_AS_PER_VIBES = {
  route: `${apiV1}user/vibes`,
  access_token_required: true,
  type: REQUEST_TYPE.GET,
};
export const GET_NOTIFICATIONS = {
  route: `${apiV1}user/notifications`,
  access_token_required: true,
  type: REQUEST_TYPE.GET,
};
export const DEVICE_TOKEN_NOTIFICATION = {
  route: `${apiV1}user/device-tokens`,
  access_token_required: true,
  type: REQUEST_TYPE.POST,
};
export const NOTIFICATIONS_COUNT = {
  route: `${apiV1}user/notifications/unread-count`,
  access_token_required: true,
  type: REQUEST_TYPE.GET,
};

export const CHANGE_ORDER_PRIVACY = {
  route: `${apiV1}user/orders/change-privacy`,
  access_token_required: true,
  type: REQUEST_TYPE.POST,
};

export const GET_URL_TO_ADD_NEW_BANK_ACCOUNT = {
  route: `${apiV1}user/stripe/accounts`,
  access_token_required: true,
  type: REQUEST_TYPE.POST,
};

export const GET_BANK_ACCOUNT_DETAILS = {
  route: `${apiV1}user/stripe/accounts`,
  access_token_required: true,
  type: REQUEST_TYPE.GET,
};

export const DELETE_BANK_ACCOUNT = {
  route: `${apiV1}user/stripe/accounts`,
  access_token_required: true,
  type: REQUEST_TYPE.DELETE,
};

export const REQUEST_WITHDRAWL = {
  route: `${apiV1}user/withdrawals/request`,
  access_token_required: true,
  type: REQUEST_TYPE.POST,
};

export const GET_SELLABLE_ARTS_LIST = {
  route: `${apiV1}user/arts`,
  access_token_required: true,
  type: REQUEST_TYPE.GET,
};
export const SOCAIL_LOGIN = {
  route: `${authV1}social-login`,
  access_token_required: false,
  type: REQUEST_TYPE.POST,
};
export const GET_EVENTS = {
  route: `${apiV1}user/events`,
  access_token_required: true,
  type: REQUEST_TYPE.GET,
};

export const callRequest = function (
  url,
  data,
  parameter,
  header = {},
  ApiSauce,
  baseUrl = BASE_URL,
) {
  // note, import of "ApiSause" has some problem, thats why I am passing it through parameters
  let _header = header;
  if (url.access_token_required) {
    const _access_token = Util.getCurrentUserAccessToken();
    if (_access_token) {
      _header = {
        ..._header,
        ...{
          Authorization: `Bearer ${_access_token}`,
        },
      };
    }
  }

  let _url = '';

  _url =
    parameter && !_.isEmpty(String(parameter))
      ? `${url.route}/${parameter}`
      : url.route;

  if (url.type === REQUEST_TYPE.POST) {
    return ApiSauce.post(_url, data, _header, baseUrl);
  } else if (url.type === REQUEST_TYPE.GET) {
    return ApiSauce.get(_url, data, _header, baseUrl);
  } else if (url.type === REQUEST_TYPE.PUT) {
    return ApiSauce.put(_url, data, _header, baseUrl);
  } else if (url.type === REQUEST_TYPE.DELETE) {
    return ApiSauce.delete(_url, data, _header, baseUrl);
  }
};
