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
import {connect, useDispatch} from 'react-redux';
import {
  allAddressesRequest,
  createAddressRequest,
  selectDefaultAddressRequest,
} from '../../actions/UserActions';
import {
  AddressComponent,
  CountryNamePicker,
  CustomNavbar,
  KeyboardAwareScrollViewComponent,
  Loader,
  TextInput,
} from '../../components';
import {strings} from '../../constants';
import {mixpanel} from '../../helpers/mixpanelHelper';
import {AppStyles, Images} from '../../theme';
import util from '../../util';
import styles from './Styles';

function Address(props) {
  const dispatch = useDispatch();
  const [selectedAddressId, setSelectedAddressId] = useState(() => '');
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

  useEffect(() => {
    setLoading(true);
    dispatch(
      allAddressesRequest({}, res => {
        setLoading(false);
      }),
    );
  }, []);

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
    } else if (!util.isValidName(state)) {
      setStateError(strings.INVALID_STATE);
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
      };

      dispatch(
        createAddressRequest(payload, res => {
          setLoading(false);
          if (!!res?.status ?? false) {
            setAddNewAddress(!isAddNewAddress);
          }
        }),
      );
    }
  };

  function defaultSelect(id) {
    const payload = {
      id,
    };
    dispatch(
      selectDefaultAddressRequest(payload, res => {
        setLoading(false);
        if (res) {
          setSelectedAddressId(id);
        }
      }),
    );
  }

  function renderAddress() {
    const {address_list} = props;

    return (
      <View>
        <Text style={styles.address}>Address</Text>
        <FlatList
          data={address_list}
          renderItem={({item}) => {
            return (
              <AddressComponent
                item={item}
                isDefault={true}
                selectedAddressId={selectedAddressId}
                defaultSelect={defaultSelect}
              />
            );
          }}
          keyExtractor={(_, index) => index}
        />
      </View>
    );
  }

  function renderAddAddress() {
    return (
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
  }

  function renderAddressForm() {
    return (
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
  }

  const nav = useMemo(
    () => (
      <CustomNavbar
        title={strings.ADDRESS}
        hasBack
        titleStyle={AppStyles.titleStyleForLeft}
        leftRightButtonWrapperStyle={{justifyContent: 'center'}}
      />
    ),
    [],
  );

  return (
    <View style={styles.mainCont}>
      {nav}
      {isLoading && (
        <View style={styles.loader}>
          <Loader loading={isLoading} />
        </View>
      )}

      <KeyboardAwareScrollViewComponent style={styles.container}>
        <ScrollView
          keyboardShouldPersistTaps="always"
          showsVerticalScrollIndicator={false}>
          {renderAddress()}
          {renderAddAddress()}
          {!!isAddNewAddress && renderAddressForm()}
        </ScrollView>
      </KeyboardAwareScrollViewComponent>
    </View>
  );
}
Address.propTypes = {};
Address.defaultProps = {};

const mapStateToProps = ({user}) => ({
  address_list: user.address_list,
});

export default connect(mapStateToProps, null)(Address);
