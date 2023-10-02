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
import {Actions} from 'react-native-router-flux';
import {connect, useDispatch} from 'react-redux';
import {getCreditCardsListRequest} from '../../actions/CreditCardActions';
import {
  allAddressesRequest,
  createAddressRequest,
} from '../../actions/UserActions';
import {
  AddNewPaymentComponent,
  AddressComponent,
  CartTotalPrice,
  CountryNamePicker,
  CustomNavbar,
  Loader,
  PaymentComponent,
  TextInput,
} from '../../components';
import {strings} from '../../constants';
import {mixpanel} from '../../helpers/mixpanelHelper';
import {AppStyles, Images} from '../../theme';
import util from '../../util';
import styles from './styles';

function CartCheckout(props) {
  const dispatch = useDispatch();

  const {totalPrice, isSinglePostItem, address_list, creditCardsList} = props;
  const [selectedAddressId, setSelectedAddressId] = useState(() =>
    !util.isArrayEmpty(address_list) ? address_list[0]?.id : '',
  );
  const [selectedPaymentId, setSelectedPaymentId] = useState(
    creditCardsList[0]?.id,
  );
  const [isSelectedOrderId, setIsSelectedOrderId] = useState(() =>
    address_list ? address_list[0]?.id : '',
  );
  const titleRef = useRef(() => null);
  const stateRef = useRef(() => null);
  const addressRef = useRef(() => null);
  const [title, setTitle] = useState(() => '');
  const [country, setCountry] = useState(() => '');
  const [state, setState] = useState(() => '');
  const [address, setAddress] = useState(() => '');
  const [isLoading, setLoading] = useState(() => false);
  const [isAddNewAddress, setAddNewAddress] = useState(() => false);
  const [Errortitle, setTitleError] = useState(() => '');
  const [countryError, setCountryError] = useState(() => '');
  const [stateError, setStateError] = useState(() => '');
  const [addressError, setAddressError] = useState(() => '');
  const [selectedAddress, setSelectedAddress] = useState(() => address_list[0]);
  const [isAddnewAddress, setIsAddNewAddress] = useState(() => false);
  const [isNewPayment, setIsNewPayment] = useState(() => false);

  useEffect(() => {
    setLoading(true);
    dispatch(
      allAddressesRequest({}, res => {
        setLoading(false);
      }),
    );
  }, []);

  useEffect(() => {
    dispatch(getCreditCardsListRequest({}, res => {}));
  }, []);

  useEffect(() => {
    setIsSelectedOrderId(address_list[0]?.id);
    setSelectedAddress(address_list[0]);
  }, [address_list]);

  useEffect(() => {
    setSelectedPaymentId(creditCardsList[0]?.id);
  }, [creditCardsList]);

  useEffect(() => {
    if (isNewPayment) {
      let itemLast = creditCardsList.length - 1;
      setSelectedPaymentId(creditCardsList[0]?.id);
    }
  }, [creditCardsList, isNewPayment]);

  useEffect(() => {
    if (isAddnewAddress) {
      let itemLast = address_list.length - 1;
      setIsSelectedOrderId(address_list[0]?.id);
      setSelectedAddress(address_list[0]);
      setIsAddNewAddress(false);
    }
  }, [address_list, isAddnewAddress]);

  const navBar = useMemo(() => {
    return (
      <CustomNavbar
        title={strings.CHECKOUT}
        titleStyle={AppStyles.titleStyleForLeft}
        hasBack
        leftRightButtonWrapperStyle={{justifyContent: 'center'}}
      />
    );
  }, []);

  function validationCartConfirmation() {
    if (util.isArrayEmpty(address_list)) {
      util.topAlertError('Add Address');
      return false;
    } else if (util.isFieldNil(isSelectedOrderId)) {
      util.topAlertError('Select any Address');
      return false;
    }

    if (util.isArrayEmpty(creditCardsList)) {
      util.topAlertError('Add Card');
      return false;
    } else if (util.isFieldNil(selectedPaymentId)) {
      util.topAlertError('Select any Card');
      return false;
    }
    Keyboard.dismiss();
    return true;
  }

  const onSubmit = () => {
    if (validation()) {
      setLoading(true);
      setState('');
      setTitle('');
      setAddress('');
      setCountry('');
      const payload = {
        title: title,
        country,
        state,
        address,
        card_id: selectedPaymentId,
      };
      dispatch(
        createAddressRequest(payload, res => {
          setLoading(false);
          if (!!res?.status ?? false) {
            setIsAddNewAddress(true);
            setAddNewAddress(!isAddNewAddress);
          }
        }),
      );
    }
  };

  const setAddressForOrder = item => {
    setIsSelectedOrderId(item.id);
    setSelectedAddress(item);
  };

  function onSubmitCartConfirmation() {
    if (validationCartConfirmation()) {
      Actions.cartConfirmation({
        totalPrice,
        selectedAddress,
        isSinglePostItem: isSinglePostItem,
        selectedCreditCardObject: util.filterArray(
          creditCardsList,
          item => item.id === selectedPaymentId,
        ),
      });
    }
  }

  const validation = () => {
    let validate = true;
    setAddressError('');
    setTitleError('');
    setStateError('');
    setCountryError('');

    if (util.isEmptyValue(address)) {
      setAddressError(strings.REQUIRED_FIELD);
      addressRef?.current?.focus?.();
      validate = false;
    }

    if (util.isEmptyValue(state)) {
      setStateError(strings.REQUIRED_FIELD);
      stateRef?.current?.focus?.();
      validate = false;
    }

    if (util.isEmptyValue(country)) {
      setCountryError(strings.REQUIRED_FIELD);
      validate = false;
    }

    if (util.isEmptyValue(title)) {
      setTitleError(strings.REQUIRED_FIELD);
      titleRef?.current?.focus?.();
      validate = false;
    }
    Keyboard.dismiss();
    return validate;
  };

  const renderAddressList = () => (
    <View>
      <Text style={styles.address}>{strings.ADDRESS}</Text>
      <FlatList
        data={address_list}
        renderItem={({item}) => {
          return (
            <AddressComponent
              item={item}
              isDefault={false}
              isSelectedOrderId={isSelectedOrderId}
              setAddressForOrder={setAddressForOrder}
              selectedAddressId={selectedAddressId}
              setSelectedAddressId={setSelectedAddressId}
            />
          );
        }}
        keyExtractor={(_, index) => index}
      />
    </View>
  );

  const renderpaymentList = () => (
    <View>
      <Text style={styles.payment}>{strings.PAYMENT}</Text>
      <FlatList
        data={creditCardsList}
        renderItem={({item}) => {
          return (
            <PaymentComponent
              item={item}
              selectedPaymentId={selectedPaymentId}
              setSelectedPaymentId={setSelectedPaymentId}
            />
          );
        }}
        keyExtractor={(_, index) => index}
      />
      <AddNewPaymentComponent
        setIsNewPayment={setIsNewPayment}
        isFromCart={true}
      />
    </View>
  );

  const addToConfirmation = () => (
    <View style={styles.totalPriceView}>
      <CartTotalPrice
        buttonText={strings.CONTINUE}
        totalPrice={totalPrice}
        ButtonPress={() => onSubmitCartConfirmation()}
      />
    </View>
  );

  const renderAddAddress = () => (
    <View style={styles.addNewAddressView}>
      <Text style={styles.addNewAddressText}>Add New Address</Text>

      <TouchableOpacity
        activeOpacity={0.7}
        onPress={() => {
          setAddNewAddress(!isAddNewAddress);
          setAddressError('');
          setTitleError('');
          setStateError('');
          setCountryError('');
        }}>
        <Image
          source={isAddNewAddress ? Images.crossIcon : Images.addIcon}
          style={styles.addAndCrossIconStyle}
        />
      </TouchableOpacity>
    </View>
  );

  const renderAddressForm = () => (
    <>
      <View style={AppStyles.mTop15}>
        <View style={[styles.textInputView, AppStyles.mTop20]}>
          <TextInput
            label={strings.ADD_TITLE}
            placeholder={strings.TITLE}
            labelStyle={styles.textInputLabel}
            ref={titleRef}
            onSubmitEditing={() => stateRef?.current?.focus?.()}
            returnKeyType="next"
            value={title}
            error={Errortitle}
            onChangeText={val => {
              setTitleError('');
              setTitle(val);
            }}
          />
        </View>

        <View style={[AppStyles.mTop20, AppStyles.mLeft5]}>
          <CountryNamePicker
            _value={country}
            setCountry={setCountry}
            _error={countryError}
          />
        </View>

        <View style={[styles.textInputView, AppStyles.mTop20]}>
          <TextInput
            label={strings.STATE}
            placeholder={strings.STATE}
            labelStyle={styles.textInputLabel}
            ref={stateRef}
            onSubmitEditing={() => addressRef?.current?.focus?.()}
            returnKeyType="next"
            value={state}
            error={stateError}
            onChangeText={val => {
              setStateError('');
              setState(val);
            }}
          />
        </View>
        <View style={[styles.textInputView, AppStyles.mTop20]}>
          <TextInput
            label={strings.ADDRESS}
            placeholder={strings.ADDRESS}
            labelStyle={styles.textInputLabel}
            ref={addressRef}
            onSubmitEditing={onSubmit}
            returnKeyType="done"
            value={address}
            error={addressError}
            onChangeText={val => {
              setAddressError('');
              setAddress(val);
            }}
          />
        </View>
      </View>
      <TouchableOpacity
        style={styles.buttonView}
        onPress={onSubmit}
        activeOpacity={0.5}>
        <Text style={styles.button}>{strings.SAVE}</Text>
      </TouchableOpacity>
    </>
  );

  return (
    <>
      {navBar}
      <View style={styles.container}>
        <ScrollView showsVerticalScrollIndicator={false}>
          {renderAddressList()}
          <Loader loading={isLoading} />
          {renderAddAddress()}
          {!!isAddNewAddress && renderAddressForm()}
          {renderpaymentList()}
          {addToConfirmation()}
        </ScrollView>
      </View>
    </>
  );
}

CartCheckout.propTypes = {};
CartCheckout.defaultProps = {};

const mapStateToProps = ({user, creditCard}) => ({
  address_list: user.address_list,
  creditCardsList: creditCard.creditCardsList,
});

export default connect(mapStateToProps, {})(CartCheckout);
