import _ from 'lodash';
import PropTypes from 'prop-types';
import React, {useEffect, useMemo, useRef, useState} from 'react';
import {
  FlatList,
  Image,
  Keyboard,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';
import {Actions} from 'react-native-router-flux';
import {connect, useDispatch} from 'react-redux';
import {
  editPostAnArtRequest,
  emptyCreatePostData,
  storeCreatePostData,
} from '../../actions/feedActions';
import {setSelectedTab} from '../../actions/GeneralActions';
import {isUploadingPostInBackground} from '../../actions/UserActions';
import {
  Button,
  CustomNavbar,
  QuantityInput,
  TextInput,
  ToggleSwitchComponent,
} from '../../components';
import SelectedVibeAndInterestItem from '../../components/SelectedVibeAndInterestItem';
import {MAIN_TABS_DATA, strings} from '../../constants';
import {mixpanel} from '../../helpers/mixpanelHelper';
import {uploadPostInBackground} from '../../helpers/uploadPostInBackgroundHelper';
import {AppStyles, Colors, Images} from '../../theme';
import util from '../../util';
import styles from './Styles';

function PostAnArt(props) {
  const {_createPostData, feedItem, setSelectedMediaArr} = props;
  const {
    description,
    collection,
    id,
    isForSale,
    max_quantity,
    price,
    size,
    title,
    vibes,
    type,
  } = feedItem || {};
  const editCollection = !util.isUndefinedValue(collection) ? [collection] : [];
  const {
    productTitle: _productTitle = '',
    addPrice: _addPrice = '',
    productDescription: _productDescription = '',
    addSize: _addSize = [],
    addSizeQuantity: _addSizeQuantity = 1,
    addSizeQuantityIndex: _addSizeQuantityIndex = '',
    addSizeQuantityItem: _addSizeQuantityItem = '',
    quantityRemaining: _quantityRemaining = 1,
    selectedVibesList: _selectedVibesList = [],
    sellAnArt: _sellAnArt = false,
    selectedCollectionList: _selectedCollectionList = [],
    disableAddPrice: _disableAddPrice = true,
  } = _createPostData;

  const addSizeObject = {
    size: '',
    price: 0,
    quantity: 1,
  };

  const {selectedMediaArr} = props;
  const productRef = useRef(() => null);
  const addPriceRef = useRef(() => null);
  const productDetailRef = useRef(() => null);
  const sizeRef = useRef(() => null);
  const priceRef = useRef(() => null);
  const scrollViewRef = useRef(null);
  const [productTitle, setProductTitle] = useState(() =>
    title ? title : _productTitle,
  );
  const [addPrice, setAddPrice] = useState(() => (price ? price : _addPrice));
  const [priceError, setPriceError] = useState(() => '');
  const [productDescription, setProductDescription] = useState(() =>
    description ? description : _productDescription,
  );
  const [addSize, setAddSize] = useState(() =>
    !util.isArrayEmpty(size) ? size : _addSize,
  );
  const [addSizeQuantity, setAddSizeQuantity] = useState(
    () => _addSizeQuantity,
  );
  const [addSizeQuantityIndex, setAddSizeQuantityIndex] = useState(
    () => _addSizeQuantityIndex,
  );
  const [addSizeQuantityItem, setAddSizeQuantityItem] = useState(
    () => _addSizeQuantityItem,
  );
  const [quantityRemaining, setQuantityRemaining] = useState(() =>
    max_quantity ? max_quantity : _quantityRemaining,
  );
  const [productTitleError, setProductTitleError] = useState('');
  const [productDescError, setProductDescError] = useState('');
  const [selectedVibesList, setSelectedVibesList] = useState(() =>
    vibes ? vibes : _selectedVibesList,
  );
  const [vibesListError, setVibesListError] = useState(() => '');
  const [collectionListError, setCollectionListError] = useState(() => '');
  const [addSizeListError, setAddSizeListError] = useState(() => '');
  const [sellAnArt, setSellAnArt] = useState(() =>
    isForSale ? isForSale : _sellAnArt,
  );
  const [isLoading, setIsLoading] = useState(() => false);
  const [isbackhandler, setIsBackhandler] = useState(() => false);
  const [selectedCollectionList, setSelectedCollectionList] = useState(() =>
    editCollection ? editCollection : _selectedCollectionList,
  );
  const [disableAddPrice, setDisableAddPrice] = useState(() => true);
  const [postInCommunity, setPostInCommunity] = useState(() =>
    type == 'drop' ? true : false,
  );
  const [uploadedMediaUri, setUploadedMediaUri] = useState(() => []);

  const dispatch = useDispatch();

  useEffect(() => {
    mixpanel.track('Visit', {PageName: 'Add Post'});
  }, []);

  useEffect(() => {
    !util.isArrayEmpty(addSize) && setDisableAddPrice(false);
    util.isArrayEmpty(addSize) && setDisableAddPrice(true);
  }, [addSize]);

  useEffect(() => {
    setAddSizeListError('');
    let newState = util.cloneDeepArray(addSize);
    let quantity = 0;

    const newObject = {
      size: addSizeQuantityItem?.size,
      quantity: addSizeQuantity,
      price: Number(addSizeQuantityItem.price),
    };
    newState[addSizeQuantityIndex] = newObject;

    newState.forEach(element => {
      if (element.quantity > 0) {
        quantity += element.quantity;
      }
    });

    const sumOfQuantity = !util.isArrayEmpty(addSize) ? quantity : 1;
    const QuantityRemainingSum =
      addSize.length > 0 ? sumOfQuantity : sumOfQuantity.quantity;

    if (addSize.length > 0) {
      setQuantityRemaining(QuantityRemainingSum ? QuantityRemainingSum : 1);
    }

    setAddSize(newState);
  }, [addSizeQuantity]);

  useEffect(() => {
    util.isUndefinedValue(id) && saveDataIntoReducer();
  }, [
    productTitle,
    addPrice,
    productDescription,
    addSize,
    addSizeQuantity,
    addSizeQuantityIndex,
    addSizeQuantityItem,
    quantityRemaining,
    selectedVibesList,
    sellAnArt,
    selectedCollectionList,
    disableAddPrice,
  ]);

  const validation = () => {
    let validate = true;
    const validationAddSize = addSize.every(
      item => item.size && item.price && item.quantity,
    );
    const isInvalidSize = addSize.some(item =>
      util.isOnlyWhiteSpace(item.size),
    );

    if (util.isEmptyValue(productTitle)) {
      setProductTitleError(strings.REQUIRED_FIELD);
      productRef?.current?.focus?.();
      validate = false;
    }

    if (
      !util.isEmptyValueWithoutTrim(productDescription) &&
      util.onlySpaces(productDescription)
    ) {
      setProductDescError(strings.INVALID_DESCRIPTION);
      productDetailRef?.current?.focus?.();
      validate = false;
    }

    if (util.isArrayEmpty(selectedVibesList)) {
      setVibesListError(strings.REQUIRED_FIELD);
      validate = false;
    }
    if (sellAnArt && disableAddPrice) {
      if (util.isArrayEmpty(addPrice)) {
        setPriceError(strings.REQUIRED_FIELD);
        priceRef?.current?.focus?.();
        validate = false;
      } else if (addPrice < 0.5) {
        setPriceError(strings.REQUIRED_MORE_THEN_ZERO_POINT_FIVE);
        priceRef?.current?.focus?.();
        validate = false;
      } else if (addPrice >= 999999) {
        setPriceError(strings.REQUIRED_LESS_THEN_NINITY);
        priceRef?.current?.focus?.();
        validate = false;
      }
    }

    if (!util.isArrayEmpty(addSize)) {
      if (!validationAddSize) {
        setAddSizeListError(strings.REQUIRED_FIELD);
        validate = false;
      } else if (!!isInvalidSize) {
        setAddSizeListError(strings.INVALID_SIZE);
        validate = false;
      }
    }

    Keyboard.dismiss();
    return validate;
  };

  function removeFromAddSize(array, index) {
    setAddSizeListError('');

    let data = [];
    array.map((item, _index) => {
      if (_index !== index) data.push(item);
    });

    setAddSize(data);
  }

  function addSizeArray() {
    setQuantityRemaining(1);
    setTimeout(() => {
      scrollViewRef?.current?.scrollToEnd();
    }, 50);
    const validation = addSize.every(
      item => item.size && item.price && item.quantity,
    );

    if (validation) {
      const array = addSize.concat(addSizeObject);
      setAddSize(array);
    } else {
      setAddSizeListError(strings.REQUIRED_FIELD);
    }
  }

  function setSizebyindexSize(index, item, value) {
    setAddSizeListError('');
    const newState = [...addSize];
    const newObject = {
      size: value,
      quantity: item?.quantity,
      price: item?.price,
    };
    newState[index] = newObject;
    setAddSize(newState);
  }
  function setSizebyindexPrice(index, item, value) {
    if (isNaN(value)) {
      setAddSizeListError(isNaN(value) ? 'Invalid Price' : '');
      return;
    }
    setAddSizeListError('');

    const newState = [...addSize];
    const newObject = {
      size: item?.size,
      quantity: item?.quantity,
      price: parseInt(value),
    };
    newState[index] = newObject;

    setAddSize(newState);
  }

  function selectedVibesListCallBack(_list = []) {
    setSelectedVibesList(_list);
  }

  function selectedCollectionListCallBack(_list = []) {
    setSelectedCollectionList(_list);
  }

  function deleteItemPressHandler(mId, mArr, mFuncToSetDataIntoState) {
    const mDataArr = util.cloneDeepArray(mArr);
    const mFilteredData = util.filterArray(mDataArr, item => item?.id != mId);
    mFuncToSetDataIntoState(mFilteredData);
  }

  const saveDataIntoReducer = () => {
    const payload = {
      productTitle,
      addPrice,
      productDescription,
      addSize,
      addSizeQuantity,
      addSizeQuantityIndex,
      addSizeQuantityItem,
      quantityRemaining,
      selectedVibesList,
      sellAnArt,
      selectedCollectionList,
      disableAddPrice,
    };
    dispatch(storeCreatePostData(payload));
  };

  const renderCustomNavBar = (
    <CustomNavbar
      title={'Post An Art'}
      titleStyle={AppStyles.titleStyleForCenter}
      leftRightButtonWrapperStyle={{justifyContent: 'center'}}
      hasBack
      leftBtnPress={() => {
        if (!!isLoading) {
          setIsBackhandler(true);
        } else {
          Actions.pop();
        }
      }}
    />
  );

  const renderAddproductAndPriceAndDescription = () => (
    <>
      <TextInput
        label={strings.ADD_PRODUCT_TITLE}
        placeholder={strings.TITLE}
        labelStyle={styles.labelStyle}
        ref={productRef}
        onSubmitEditing={() => productDetailRef?.current?.focus?.()}
        returnKeyType="next"
        value={productTitle}
        maxLength={50}
        onChangeText={val => {
          setProductTitle(val);
          setProductTitleError('');
        }}
        error={productTitleError}
      />

      <TextInput
        label={strings.PRODUCT_DESCRIPTION}
        placeholder={strings.DESCRIPTION}
        labelStyle={styles.labelStyle}
        ref={productDetailRef}
        maxLength={100}
        containerStyle={styles.containerStyleInput}
        onSubmitEditing={() => sizeRef?.current?.focus?.()}
        returnKeyType="next"
        value={productDescription}
        onChangeText={val => {
          setProductDescription(val);
          setProductDescError('');
        }}
        error={productDescError}
      />
    </>
  );

  const renderAddPriceAndQuantity = () => (
    <>
      <View>
        <TextInput
          label={strings.ADD_PRICE}
          placeholder={strings.PRICE}
          labelStyle={[
            styles.labelStyle,
            !disableAddPrice && {color: 'rgba(162, 165, 184,0.3)'},
          ]}
          placeholderTextColor={
            !disableAddPrice ? 'rgba(162, 165, 184,0.3)' : Colors.text.secondary
          }
          ref={addPriceRef}
          editable={disableAddPrice}
          styleInput={
            !disableAddPrice
              ? {color: 'rgba(162, 165, 184,0.3)'}
              : {color: Colors.white}
          }
          containerStyle={[styles.containerStyleInput]}
          onSubmitEditing={() => productDetailRef?.current?.focus?.()}
          returnKeyType="next"
          keyboardType="numeric"
          maxLength={6}
          value={addPrice}
          onChangeText={val => {
            if (util.includesValue(val, '.')) {
              const splittedArrByDecimal = val.split('.');
              const valueAfterDecimal = splittedArrByDecimal[1];
              if (valueAfterDecimal.length < 3) {
                setAddPrice(val);
              }
            } else {
              setAddPrice(val);
            }
            setPriceError(isNaN(val) ? 'Invalid Price' : '');
          }}
          error={priceError}
        />
        <Image
          style={[styles.dollarImage, priceError && {bottom: 45}]}
          source={Images.dollarIcon}
        />
      </View>
      <View style={AppStyles.mTop30}>
        <Text style={styles.labelStyle}>Quantity Remaining</Text>

        {disableAddPrice ? (
          <QuantityInput
            maxQuantity={100}
            sellAnArt={!disableAddPrice}
            postAnArt={true}
            incomingQuantity={quantityRemaining}
            handleChangeQuantity={setQuantityRemaining}
          />
        ) : (
          <View style={styles.remainingQuantityView}>
            <Text style={styles.remainingQuantityTxt}>
              {quantityRemaining ? quantityRemaining : 1}
            </Text>
          </View>
        )}
      </View>
    </>
  );

  const renderAddSize = () => (
    <>
      <View style={styles.addSizeView}>
        <Text style={styles.labelStyle}>Add Size</Text>
        <TouchableOpacity
          onPress={() => {
            addSizeArray();
            setPriceError('');
          }}
          activeOpacity={0.5}>
          <Image source={Images.plusIcon} resizeMode={'contain'} />
        </TouchableOpacity>
      </View>
      {!_.isEmpty(addSize) && (
        <View style={styles.sizeheadingMainView}>
          <View style={styles.sizeheadingView}>
            <Text style={styles.sizeheading}>Size</Text>
          </View>
          <View style={styles.sizeheadingView}>
            <Text style={styles.sizeheading}>Quantity</Text>
          </View>
          <View style={styles.sizeheadingView}>
            <Text style={styles.sizeheading}>Price</Text>
          </View>
        </View>
      )}
      <FlatList
        data={addSize}
        keyExtractor={(_, index) => index}
        renderItem={({item, index}) => {
          return (
            <View style={styles.textInputMainView}>
              <View style={styles.textInputView}>
                <TextInput
                  selectionColor={Colors.white}
                  placeholder={strings.SIZE}
                  ref={sizeRef}
                  maxLength={30}
                  onSubmitEditing={() => priceRef?.current?.focus?.()}
                  returnKeyType="next"
                  value={item?.size}
                  onChangeText={value => {
                    setSizebyindexSize(index, item, value);
                  }}
                />
              </View>
              <View style={[styles.textInputView, {marginTop: 25}]}>
                <QuantityInput
                  maxQuantity={100}
                  postAnArt={true}
                  incomingQuantity={item?.quantity}
                  addSizeQuantityIndex={index}
                  setAddSizeQuantityIndex={setAddSizeQuantityIndex}
                  addSizeQuantityItem={item}
                  setAddSizeQuantityItem={setAddSizeQuantityItem}
                  handleChangeQuantity={setAddSizeQuantity}
                />
              </View>

              <View style={styles.textInputView}>
                <TextInput
                  selectionColor={Colors.white}
                  placeholder={strings.price}
                  ref={priceRef}
                  returnKeyType="done"
                  keyboardType="number-pad"
                  value={item?.price}
                  maxLength={6}
                  onChangeText={value => {
                    setSizebyindexPrice(index, item, value);
                  }}
                />
              </View>
              <TouchableOpacity
                onPress={() => removeFromAddSize(addSize, index)}
                style={styles.crossIconView}>
                <Image
                  style={styles.crossIconImage}
                  source={Images.crossIconRed}
                  resizeMode={'center'}
                />
              </TouchableOpacity>
            </View>
          );
        }}
      />

      <Text style={{color: 'red', marginTop: 10}}>{addSizeListError}</Text>
    </>
  );

  const renderOnsubmit = () => (
    <View style={styles.buttonView}>
      <Button
        style={styles.button}
        isLoading={isLoading}
        textStyle={styles.buttonStyle}
        onPress={util.isUndefinedValue(id) ? onSubmitPress : onSubmitPressEdit}>
        {strings.POST}
      </Button>
    </View>
  );

  const onSubmitPress = async () => {
    if (validation()) {
      dispatch(emptyCreatePostData({}));
      setIsLoading(true);
      const payload = {
        productTitle,
        addPrice,
        productDescription,
        addSize,
        addSizeQuantity,
        addSizeQuantityIndex,
        addSizeQuantityItem,
        quantityRemaining,
        selectedVibesList,
        sellAnArt,
        selectedCollectionList,
        disableAddPrice,
        postInCommunity,
      };
      dispatch(isUploadingPostInBackground(true));
      uploadPostInBackground(selectedMediaArr, payload, dispatch);
      setSelectedMediaArr([]);

      if (util.isFieldNil(feedItem)) Actions.pop();

      setTimeout(() => {
        Actions.pop();
      }, 100);

      setTimeout(() => {
        Actions.jump('_dashboard_tab', {isPost: false});
        dispatch(setSelectedTab(MAIN_TABS_DATA.DASHBOARD_TAB.id));
      }, 200);
    }
  };

  const onSubmitPressEdit = () => {
    if (validation()) {
      dispatch(emptyCreatePostData({}));
      setIsLoading(true);
      const vibesList = util.getIdsFromArray(selectedVibesList);

      const collectionList = selectedCollectionList.map(a => a?.id);
      const payload = {
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
      util.isArrayEmpty(collectionList) && delete payload.collections;
      util.isArrayEmpty(addSize) && delete payload.sizes;
      !util.isArrayEmpty(addSize) && delete payload.price;
      !sellAnArt && delete payload.price;
      !sellAnArt && delete payload.max_quantity;
      if (!!postInCommunity) {
        payload['type'] = 'drop';
        delete payload.collections;
      }
      const params = `${id}`;
      dispatch(
        editPostAnArtRequest(params, payload, res => {
          setIsLoading(false);
          if (!util.isArrayEmpty(res)) {
            Actions.pop();
            util.topAlert('Post Update Successfully');
          }
        }),
      );
    }
  };

  function onSellAnArtTogglePress() {
    setTimeout(() => {
      scrollViewRef?.current?.scrollToEnd();
    }, 50);
    setAddSize([]);
    setSellAnArt(!sellAnArt);
    setAddSizeListError('');
  }

  const renderTitleAndSearchSec = (_title, onPress) => (
    <>
      <Text style={styles.title}>{_title}</Text>
      <TouchableOpacity style={styles.searchView} onPress={onPress}>
        <Text style={styles.searchText}>{strings.SEARCH_HERE}</Text>
        <View style={styles.borderLine} />
      </TouchableOpacity>
    </>
  );

  const renderSellAnArt = () => (
    <>
      <View style={styles.sellAnArtAndCommunityView}>
        <Text style={[styles.labelStyle, styles.toggleLabelText]}>
          For Sale
        </Text>
        <ToggleSwitchComponent
          isOn={sellAnArt}
          onTogglePressHandler={onSellAnArtTogglePress}
        />
      </View>
    </>
  );

  const renderPostInCommunitySection = () => (
    <>
      <View style={styles.sellAnArtAndCommunityView}>
        <Text style={[styles.labelStyle, styles.toggleLabelText]}>
          {strings.POST_IN_COMMUNITY}
        </Text>
        <ToggleSwitchComponent
          isOn={postInCommunity}
          onTogglePressHandler={() => setPostInCommunity(!postInCommunity)}
        />
      </View>
    </>
  );

  const renderAddYourVibeSec = useMemo(
    () => (
      <View style={AppStyles.mTop30}>
        {renderTitleAndSearchSec(strings.ADD_ART_POST_VIBE, () => {
          setVibesListError('');
          Actions.searchVibe({
            _selectedVibes: selectedVibesList,
            callBack: selectedVibesListCallBack,
          });
        })}
        <FlatList
          numColumns={2}
          showsHorizontalScrollIndicator={false}
          data={selectedVibesList}
          keyExtractor={(_, index) => index}
          contentContainerStyle={AppStyles.mTop5}
          renderItem={item => {
            return (
              <SelectedVibeAndInterestItem
                _item={item.item}
                onCrossIconPress={id =>
                  deleteItemPressHandler(
                    id,
                    selectedVibesList,
                    setSelectedVibesList,
                  )
                }
              />
            );
          }}
        />
        {!util.isEmptyValue(vibesListError) && (
          <Text style={{color: 'red', marginTop: 5, marginBottom: 5}}>
            {vibesListError}
          </Text>
        )}
      </View>
    ),
    [selectedVibesList, vibesListError],
  );

  const renderAddYourCollectionSec = useMemo(
    () => (
      <View style={AppStyles.mTop15}>
        {renderTitleAndSearchSec(strings.ADD_ART_POST_COLLECTION, () => {
          setCollectionListError('');
          Actions.searchCollection({
            _selectedVibes: selectedCollectionList,
            callBack: selectedCollectionListCallBack,
          });
        })}
        <FlatList
          numColumns={2}
          showsHorizontalScrollIndicator={false}
          data={selectedCollectionList}
          keyExtractor={(_, index) => index}
          contentContainerStyle={AppStyles.mTop5}
          renderItem={item => {
            return (
              <SelectedVibeAndInterestItem
                _item={item.item}
                onCrossIconPress={id =>
                  deleteItemPressHandler(
                    id,
                    selectedCollectionList,
                    setSelectedCollectionList,
                  )
                }
              />
            );
          }}
        />
      </View>
    ),
    [selectedCollectionList, collectionListError],
  );

  return (
    <>
      {renderCustomNavBar}
      <ScrollView
        style={styles.container}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="always"
        contentContainerStyle={{
          paddingBottom: 20,
          flex: 1,
        }}>
        <KeyboardAwareScrollView
          ref={scrollViewRef}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{flexGrow: 1}}>
          {renderAddproductAndPriceAndDescription()}
          {renderAddYourVibeSec}
          {!postInCommunity && renderAddYourCollectionSec}
          {renderSellAnArt()}
          {sellAnArt && (
            <>
              {renderAddPriceAndQuantity()}
              {renderAddSize()}
            </>
          )}
          {renderPostInCommunitySection()}
          {renderOnsubmit()}
        </KeyboardAwareScrollView>
      </ScrollView>
    </>
  );
}

PostAnArt.propTypes = {
  setSelectedMediaArr: PropTypes.func,
};
PostAnArt.defaultProps = {
  setSelectedMediaArr: Function(),
};

const mapStateToProps = ({post}) => ({
  _createPostData: post.temperoryDataOfCreatePost,
});

export default connect(mapStateToProps, null)(PostAnArt);
