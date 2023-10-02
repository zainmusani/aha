// @flow
import {BlurView} from '@react-native-community/blur';
import _ from 'lodash';
import PropTypes from 'prop-types';
import React, {useEffect, useMemo, useRef, useState} from 'react';
import {Image, Text, TouchableOpacity, View} from 'react-native';
import {FlatList} from 'react-native-gesture-handler';
import {Actions} from 'react-native-router-flux';
import {connect, useDispatch} from 'react-redux';
import {addToCart, getArtsRelatedRequest} from '../../actions/CartActions';
import {QuantityInput} from '../../components';
import {appDefaultData, strings} from '../../constants';
import {AppStyles, Colors, Images, Metrics} from '../../theme';
import FastImage from 'react-native-fast-image';
import util from '../../util';
import Loader from '../Loader';
import styles from './styles';
import {mixpanel} from '../../helpers/mixpanelHelper';

const BuyPostBottomSheetContent = props => {
  const {
    sheetRef,
    isFullViewVisible,
    setShowBottomSheet,
    feedItem,
    isSinglePostItem,
    artsRelated,
    myCartList,
  } = props;

  const {
    max_quantity,
    price,
    size,
    isForSale,
    title,
    description,
    id,
    thumbnail,
    artist,
  } = feedItem || {};

  let [scrolled] = useState(0);

  const [maxQuantity, setMaxQuantity] = useState(() =>
    !util.isArrayEmpty(size) ? size[0]?.quantity : max_quantity,
  );
  const [feedPrice, setFeedPrice] = useState(() =>
    !util.isEmptyValue(price) ? price : size[0]?.price,
  );

  const [selectSize, setSelectSize] = useState(() => size[0]?.size);
  const [selectedItem, setSelectedItem] = useState(() => {});
  const [selectSizeIndex, setSelectSizeIndex] = useState(() => 0);
  const [quantity, setQuantity] = useState(() => 1);
  const [isLoading, setIsLoading] = useState(() => false);
  const [isMaxQuantity, setIsMaxQuantity] = useState(() => false);
  const [isLoadingImage, setIsLoadingImage] = useState(() => true);

  const flatListRef = useRef<FlatList<any>>();
  const dispatch = useDispatch();
  const scrollOnce = Metrics.screenWidth - 20;

  useEffect(() => {
    //todo need to work on it umer and alishaheer
    if (!!!util.isEmptyObject(selectedItem)) {
      setSelectSize(selectedItem?.size);
      setMaxQuantity(selectedItem?.quantity);
      setQuantity(1);
      setFeedPrice(selectedItem?.price);
    }

    const mIndexCartCheck = util.findIndexById(myCartList, id);
    if (mIndexCartCheck != -1) {
      if (!!!util.isArrayEmpty(size)) {
        let isSameSizePostAlreadyExist = util.some(
          myCartList,
          item =>
            util.areValuesEqual(item.id, id) &&
            util.areValuesEqual(item.size, selectedItem?.size),
        );
        if (isSameSizePostAlreadyExist) {
          const mIndexCart = _.findIndex(
            myCartList,
            item =>
              util.areValuesEqual(item.id, id) &&
              util.areValuesEqual(item.size, selectedItem?.size),
          );
          const mQuantityCart = myCartList[mIndexCart].quantity;
          const mQuantityFeed = util.isEmptyObject(selectedItem)
            ? size[0]?.quantity
            : selectedItem.quantity;
          setMaxQuantity(mQuantityFeed - mQuantityCart);
          setQuantity(1);
          setIsMaxQuantity(false);
        } else {
          const mQuantityFeed = !util.isArrayEmpty(size)
            ? size[0]?.quantity
            : selectedItem.quantity;
          setMaxQuantity(mQuantityFeed);
          setQuantity(1);
          setIsMaxQuantity(false);
        }
      } else {
        const mIndexCart = _.findIndex(myCartList, item =>
          util.areValuesEqual(item.id, id),
        );
        const mQuantityFeed = max_quantity;
        const mQuantityCart = myCartList[mIndexCart].quantity;
        setMaxQuantity(mQuantityFeed - mQuantityCart);

        setQuantity(1);
        setIsMaxQuantity(false);
      }
    } else {
      const mQuantityFeed = !util.isArrayEmpty(size)
        ? selectedItem
          ? selectedItem?.quantity
          : size[0]?.quantity
        : max_quantity;
      setMaxQuantity(mQuantityFeed);
      setQuantity(1);
      setIsMaxQuantity(false);
    }
  }, [selectedItem, myCartList, feedItem]);

  useEffect(() => {
    setIsMaxQuantity(false);
    if (!!!util.isEmptyObject(selectedItem)) {
      setQuantity(1);
    }
  }, [selectedItem, feedItem]);

  useEffect(() => {
    !util.isUndefinedValue(id) &&
      setFeedPrice(!util.isEmptyValue(price) ? price : size[0]?.price);
  }, [feedItem]);

  useEffect(() => {
    getArtsRelated();
  }, [feedItem]);

  function handleSelectedItem(item, index) {
    setSelectedItem(item);
    setSelectSizeIndex(index);
  }

  function getArtsRelated() {
    setIsLoading(true);
    if (!util.isUndefinedValue(id)) {
      const params = `?art_id=${id}&offset=0&limit=9`;
      dispatch(
        getArtsRelatedRequest(params, res => {
          setIsLoading(false);
        }),
      );
    }
  }

  function handlerAddToCart() {
    sheetRef?.current?.snapTo(2);

    if (util.isArrayEmpty(myCartList)) {
      const MyCardItem = {
        price: price ? price : feedPrice,
        title: title,
        description: description,
        size: selectSize,
        id: id,
        quantity: quantity,
        thumbnail: thumbnail,
        maxQuantity: maxQuantity,
      };
      util.isFieldNil(selectSize) && delete MyCardItem.size;
      dispatch(addToCart(MyCardItem));

      setQuantity(1);
      Actions.cart({isSinglePostItem});

      mixpanel.track('Add Cart', {
        ItemName: title,
        ItemPrice: price ? price : feedPrice,
        Size: selectSize,
        ItemQuantity: quantity,
        SaleItem: isForSale,
        ItemDesigner: artist?.profileTagId,
        ItemID: artist?.id,
      });
    } else {
      const MyCardItem = {
        price: price ? price : feedPrice,
        title: title,
        description: description,
        size: selectSize,
        id: id,
        quantity: quantity,
        thumbnail: thumbnail,
        maxQuantity: maxQuantity,
      };
      util.isFieldNil(selectSize) && delete MyCardItem.size;

      dispatch(addToCart(MyCardItem));
      setQuantity(1);

      util.topAlert(strings.ADD_TO_CART_LIST);

      mixpanel.track('Add Cart', {
        ItemName: title,
        ItemPrice: price ? price : feedPrice,
        Size: selectSize,
        itemQuantity: quantity,
        SaleItem: isForSale,
        ItemDesigner: artist?.profileTagId,
        ItemID: artist?.id,
      });
    }
  }

  function leftButton() {
    flatListRef?.current?.scrollToOffset({
      animated: true,
      offset: scrolled - scrollOnce,
    });
  }

  function rightButton() {
    flatListRef?.current?.scrollToOffset({
      animated: true,
      offset: scrolled + scrollOnce,
    });
  }

  const renderViewHeader = () => (
    <View
      style={{
        position: 'relative',
        alignSelf: 'flex-end',
        right: -23,
      }}>
      <TouchableOpacity
        style={styles.ArrowView}
        onPress={() => {
          if (!!isFullViewVisible) {
            sheetRef?.current?.snapTo(2);
          } else {
            sheetRef?.current?.snapTo(0);
          }
        }}>
        <Image
          source={!!isFullViewVisible ? Images.bottomArrow : Images.topArrow}
          resizeMode={'contain'}
        />
      </TouchableOpacity>
    </View>
  );

  const renderCart = () => (
    <View>
      <View style={styles.pricesView}>
        <View style={[AppStyles.flexRow, AppStyles.alignItemsCenter]}>
          <Text style={styles.price}>
            {appDefaultData.currency.symbol}
            {Number(feedPrice).toFixed(2)}
          </Text>
          <Text style={styles.priceText}>{`  /   ${'Price Incl.'}`}</Text>
        </View>
      </View>

      <View style={styles.sizeMainView}>
        <FlatList
          data={size}
          horizontal
          showsHorizontalScrollIndicator={false}
          keyExtractor={(_, index) => index}
          renderItem={({item, index}) => {
            return (
              <TouchableOpacity
                onPress={() => handleSelectedItem(item, index)}
                activeOpacity={0.5}
                style={[
                  styles.sizeView,
                  util.areValuesEqual(selectSizeIndex, index) && {
                    borderWidth: 1,
                    borderColor: Colors.white,
                  },
                ]}>
                <Text style={styles.sizeText}>{item?.size}</Text>
              </TouchableOpacity>
            );
          }}
        />
      </View>

      <View style={styles.addToCartView}>
        <View style={styles.addToCartBtnView}>
          <TouchableOpacity
            disabled={maxQuantity === 0 ? true : false}
            style={[styles.addToCartButton]}
            onPress={handlerAddToCart}>
            <Text style={styles.addToCartButtonText}>
              {strings.ADD_TO_CART}
            </Text>
          </TouchableOpacity>
        </View>

        <View style={styles.quantityMainView}>
          {maxQuantity > 0 ? (
            <View style={styles.quantityView}>
              <QuantityInput
                isBottomSheet={true}
                maxQuantity={maxQuantity}
                incomingQuantity={quantity}
                setIsMaxQuantity={setIsMaxQuantity}
                isMaxQuantity={isMaxQuantity}
                handleChangeQuantity={setQuantity}
              />
            </View>
          ) : (
            <Text style={[{color: Colors.white, fontSize: 14}]}>sold out</Text>
          )}
        </View>
      </View>
    </View>
  );

  const renderDescription = () => (
    <View
      style={util.isArrayEmpty(size) ? {marginTop: '10%'} : {marginTop: '5%'}}>
      <Text numberOfLines={3} ellipsizeMode="tail" style={styles.heading}>
        {title}
      </Text>
      {
        <Text numberOfLines={3} ellipsizeMode="tail" style={styles.description}>
          {description}
        </Text>
      }
    </View>
  );

  const renderNoDataFoundImage = useMemo(
    () => <Image source={Images.NoDataFoundImage} resizeMode={'contain'} />,
    [],
  );

  const renderRelatedArtsList = () => (
    <View style={{height: '100%'}}>
      <View style={styles.sliderView}>
        <Text style={styles.heading1}>{strings.CAN_NOT_GET_THE_ORIGINAL}</Text>
        {!!!util.isArrayEmpty(artsRelated) && (
          <View style={[AppStyles.flexRow, AppStyles.alignItemsCenter]}>
            <TouchableOpacity onPress={leftButton}>
              <Image source={Images.backButton} style={AppStyles.mRight20} />
            </TouchableOpacity>
            <TouchableOpacity onPress={rightButton}>
              <Image source={Images.RightIcon} style={AppStyles.mLeft5} />
            </TouchableOpacity>
          </View>
        )}
      </View>

      {!!isLoading ? (
        <View style={styles.loaderView}>
          <Loader loading={true} />
        </View>
      ) : (
        <View
          style={{
            marginTop: 10,
            height: '40%',
          }}>
          {!util.isArrayEmpty(artsRelated) ? (
            <FlatList
              data={artsRelated}
              horizontal
              showsHorizontalScrollIndicator={false}
              ref={flatListRef}
              onScroll={e => {
                scrolled = e.nativeEvent.contentOffset.x;
              }}
              snapToAlignment={'start'}
              snapToInterval={Metrics.screenWidth - 20}
              decelerationRate={'fast'}
              renderItem={({item, index}) => {
                const isFirstItem = index === 0;
                const {thumbnail} = item || {};
                return (
                  <View
                    style={{
                      width: (Metrics.screenWidth - 25) / 3,
                    }}>
                    <TouchableOpacity
                      onPress={() => {
                        setShowBottomSheet(false);
                        Actions.singlePostContainerWithoutTabs({
                          postID: item.id,
                        });
                      }}
                      style={[
                        styles.relatedPostView,
                        isFirstItem && styles.relatedImgViewFirstItem,
                      ]}
                      activeOpacity={0.5}>
                      {!util.isFieldNil(thumbnail) && (
                        <FastImage
                          style={[
                            {
                              height: 151,
                            },
                            isFirstItem && {
                              borderTopLeftRadius: 10,
                              borderBottomLeftRadius: 10,
                            },
                          ]}
                          onLoad={() => setIsLoadingImage(false)}
                          source={{
                            uri: thumbnail,
                            priority: FastImage.priority.high,
                          }}
                          resizeMode={FastImage.resizeMode.cover}
                        />
                      )}
                      <Text
                        style={styles.suggestionText}
                        numberOfLines={1}
                        ellipsizeMode={'tail'}>
                        {item.title}
                      </Text>
                      <View
                        style={{
                          position: 'absolute',
                          top: '40%',
                          left: '50%',
                        }}>
                        <Loader loading={isLoadingImage} />
                      </View>
                    </TouchableOpacity>
                  </View>
                );
              }}
              keyExtractor={(_, index) => index}
            />
          ) : (
            renderNoDataFoundImage
          )}
        </View>
      )}
    </View>
  );

  return (
    <View style={[styles.roundCorner]}>
      <BlurView blurType="dark">
        <View style={styles.bottomSheetCont}>
          <>
            {renderViewHeader()}
            {renderCart()}
            {renderDescription()}
            <View style={{marginRight: -30}}>{renderRelatedArtsList()}</View>
          </>
        </View>
      </BlurView>
    </View>
  );
};

BuyPostBottomSheetContent.propTypes = {
  isSinglePostItem: PropTypes.bool,
};
BuyPostBottomSheetContent.defaultProps = {
  isSinglePostItem: false,
};

const mapStateToProps = ({cart}) => ({
  artsRelated: cart.artsRelated,
  myCartList: cart.myCartList,
});

export default connect(mapStateToProps, null)(BuyPostBottomSheetContent);
