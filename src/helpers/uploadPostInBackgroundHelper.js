import BackgroundService from 'react-native-background-actions';
import {editPostAnArtRequest, postAnArtRequest} from '../actions/feedActions';
import {multiMediaUploadToServer} from './ImageUploadHelper';
import {isUploadingPostInBackground} from '../actions/UserActions';
import {afterPostAddPostInDashboardFeed} from '../actions/DashboardActions';
import util from '../util';
import {scrollToTop} from '../containers/Dashboard/Home';

const options = {
  taskName: 'Post',
  taskTitle: 'Post Uploading...',
  taskDesc: 'Your post is uploading please wait for a while.',
  taskIcon: {
    name: 'ic_launcher',
    type: 'mipmap',
    package: 'com.aha_mobileapp',
  },
  color: '#0f0',
  linkingURI: 'yourSchemeHere://chat/jane', // See Deep Linking for more info
  parameters: {
    delay: 1000,
  },
};

export const uploadPostInBackground = async (
  selectedMediaArr,
  formDataForApi,
  dispatch,
) => {
  const checkValidationAndApicall = async mSelectedArr => {
    const {
      productTitle,
      addPrice,
      productDescription,
      addSize,
      quantityRemaining,
      selectedVibesList,
      sellAnArt,
      selectedCollectionList,
      postInCommunity,
    } = formDataForApi;
    const vibesList = selectedVibesList.map(a => a?.id);
    const collectionList = selectedCollectionList.map(a => a?.id);
    const payload = {
      resources: mSelectedArr,
      title: productTitle,
      description: productDescription,
      price: Number(addPrice),
      sizes: addSize,
      max_quantity: quantityRemaining,
      collections: collectionList,
      vibes: vibesList,
      sellable: sellAnArt,
    };
    util.isEmptyValue(productDescription) && delete payload.description;
    util.isUndefinedValue(collectionList) && delete payload.collections;
    util.isArrayEmpty(addSize) && delete payload.sizes;
    !util.isArrayEmpty(addSize) && delete payload.price;
    !sellAnArt && delete payload.price;
    !sellAnArt && delete payload.max_quantity;
    if (!!postInCommunity) {
      payload['type'] = 'drop';
      delete payload.collections;
    }

    dispatch(
      postAnArtRequest(payload, async res => {
        dispatch(isUploadingPostInBackground(false));

        if (util.hasObjectWithKey(res, 'data')) {
          setTimeout(() => {
            dispatch(afterPostAddPostInDashboardFeed(res.data));

            scrollToTop();
          }, 100);
          await BackgroundService.stop();
        }
      }),
    );
  };

  try {
    await BackgroundService.start(async () => {
      await multiMediaUploadToServer(
        selectedMediaArr,
        checkValidationAndApicall,
      );
    }, options);
  } catch (e) {
    dispatch(isUploadingPostInBackground(false));
    console.log({
      uploadPostInBackgroundError: e,
    });
  }
};
