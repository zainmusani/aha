import React, {useEffect, useMemo, useRef, useState} from 'react';
import {
  ActivityIndicator,
  Image,
  Keyboard,
  TouchableOpacity,
  View,
} from 'react-native';
import {useDispatch} from 'react-redux';
import {
  deleteAddressRequest,
  updateAddressRequest,
} from '../../actions/UserActions';
import {CountryNamePicker, Text, TextInput} from '../../components';
import {strings} from '../../constants';
import {AppStyles, Colors, Fonts, Images} from '../../theme';
import util from '../../util';
import DeleteOrRemoveModal from '../DeleteOrRemoveModal';
import styles from './styles';

const AddressComponent = props => {
  const {
    item,
    isDefault,
    isSelectedOrderId,
    setAddressForOrder,
    defaultSelect,
  } = props;
  const {id, title, state, is_selected, country, address} = item;
  const titleRef = useRef(() => null);
  const stateRef = useRef(() => null);
  const addressRef = useRef(() => null);
  const [isLoading, setLoading] = useState(() => false);
  const [titleEdit, setTitle] = useState(() => title);
  const [countryEdit, setCountry] = useState(() => country);
  const [stateEdit, setState] = useState(() => state);
  const [addressEdit, setAddress] = useState(() => address);
  const [isEditForm, setEditForm] = useState(() => false);
  const [titleError, setTitleError] = useState(() => '');
  const [countryError, setCountryError] = useState(() => '');
  const [stateError, setStateError] = useState(() => '');
  const [addressError, setAddressError] = useState(() => '');
  const [modalVisible, setModalVisible] = useState(() => false);
  const dispatch = useDispatch();

  useEffect(() => {
    setTitle(title);
    setCountry(country);
    setState(state);
    setAddress(address);
  }, [props]);

  const validation = () => {
    let validate = true;

    if (util.isEmptyValue(addressEdit)) {
      setAddressError(strings.REQUIRED_FIELD);
      addressRef?.current?.focus?.();
      validate = false;
    }

    if (util.isEmptyValue(stateEdit)) {
      setStateError(strings.REQUIRED_FIELD);
      stateRef?.current?.focus?.();
      validate = false;
    }

    if (util.isEmptyValue(countryEdit)) {
      setCountryError(strings.REQUIRED_FIELD);
      validate = false;
    }

    if (util.isEmptyValue(titleEdit)) {
      setTitleError(strings.REQUIRED_FIELD);
      titleRef?.current?.focus?.();
      validate = false;
    }
    Keyboard.dismiss();
    return validate;
  };

  const onSubmit = () => {
    if (validation()) {
      setTitleError('');
      setStateError('');
      setCountryError('');
      setAddressError('');
      setLoading(true);

      const payload = {
        title: titleEdit,
        country: countryEdit,
        state: stateEdit,
        address: addressEdit,
      };
      const params = `${id}`;
      dispatch(
        updateAddressRequest(payload, params, res => {
          setLoading(false);
          setEditForm(!isEditForm);
        }),
      );
    }
  };

  function deleteAddress() {
    setModalVisible(!modalVisible);
    const params = `${id}`;

    dispatch(deleteAddressRequest(params, res => {}));
  }

  function EditForm() {
    return (
      <>
        <Text
          size={Fonts.size.small}
          style={AppStyles.mTop15}
          type={Fonts.type.Asap}>
          Update Address
        </Text>
        <View style={[styles.textInputView, AppStyles.mTop20]}>
          <TextInput
            label={strings.ADD_TITLE}
            placeholder={strings.TITLE}
            labelStyle={styles.textInputLabel}
            ref={titleRef}
            onSubmitEditing={() => stateRef?.current?.focus?.()}
            returnKeyType="next"
            value={titleEdit}
            error={titleError}
            onChangeText={val => {
              setTitleError('');
              setTitle(val);
            }}
          />
        </View>
        <View style={[styles.textInputView, AppStyles.mTop20]}>
          <CountryNamePicker
            _value={countryEdit}
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
            value={stateEdit}
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
            ref={addressRef?.current?.focus?.()}
            onSubmitEditing={onSubmit}
            returnKeyType="done"
            value={addressEdit}
            error={addressError}
            onChangeText={val => {
              setAddressError('');
              setAddress(val);
            }}
          />
        </View>
        <TouchableOpacity onPress={onSubmit} style={styles.updateBtn}>
          {isLoading ? (
            <ActivityIndicator color={Colors.white} />
          ) : (
            <Text style={styles.updateText}>{strings.UPDATE}</Text>
          )}
        </TouchableOpacity>
      </>
    );
  }

  function itemAddress() {
    return (
      <TouchableOpacity
        activeOpacity={0.7}
        style={styles.container}
        onPress={() => {
          isDefault
            ? !!!is_selected && defaultSelect(id)
            : setAddressForOrder(item);
        }}>
        <View style={styles.radioBoxMainView}>
          <View style={styles.radioBoxView}>
            {isDefault
              ? !!is_selected && <View style={styles.radioBox}></View>
              : isSelectedOrderId == item.id && (
                  <View style={styles.radioBox}></View>
                )}
          </View>
        </View>

        <View style={styles.view}>
          <Text style={styles.heading}>{title}</Text>
          <Text style={styles.description}>
            {address}, {state}, {country}
          </Text>
        </View>

        <View
          style={[
            AppStyles.flexRow,
            AppStyles.flex,
            {justifyContent: 'flex-end'},
          ]}>
          <View style={styles.radioBoxMainView}>
            <TouchableOpacity
              style={{marginRight: 10}}
              onPress={() => setEditForm(!isEditForm)}>
              <Image
                style={{width: 20, height: 20}}
                source={isEditForm ? Images.crossIcon : Images.paymentCardEdit}
              />
            </TouchableOpacity>
          </View>

          <View style={styles.radioBoxMainView}>
            <TouchableOpacity onPress={() => setModalVisible(!modalVisible)}>
              <Image
                style={{width: 20, height: 20}}
                source={Images.deleteIcon}
              />
            </TouchableOpacity>
          </View>
        </View>
      </TouchableOpacity>
    );
  }

  const renderDeleteAddressModal = useMemo(
    () => (
      <DeleteOrRemoveModal
        heading={strings.DELETE_ADDRESS}
        description={strings.ARE_YOU_SURE}
        positiveBtnText={strings.DELETE}
        negativeBtnText={strings.DONT_DELETE}
        positiveBtnPressHandler={() => deleteAddress()}
        setModalVisibility={() => setModalVisible(!modalVisible)}
        isModalVisible={modalVisible}
      />
    ),
    [modalVisible],
  );

  return (
    <View style={styles.editForm}>
      {itemAddress()}
      {isEditForm && EditForm()}
      {renderDeleteAddressModal}
    </View>
  );
};

AddressComponent.propTypes = {};
AddressComponent.defaultProps = {};

export default AddressComponent;
