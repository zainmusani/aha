// @flow
import _ from 'lodash';
import React, {useEffect, useState} from 'react';
import PropTypes from 'prop-types';
import {Text} from '..';
import {Fonts, Colors, Images} from '../../theme';
import {Image, View} from 'react-native';
import styles from './styles';
import {orderDetail} from '../../constants';
import util from '../../util';

const OrderDetailComponent = props => {
  const {item, isFromSales, itemStatus} = props;
  const {
    description,
    order,
    title,
    price,
    size,
    thumbnail,
    quantity,
    image,
    status,
  } = item;

  const itemImage = util.isValidURL(thumbnail)
    ? thumbnail
    : 'https://source.unsplash.com/1024x768/?girl';
  return (
    <View style={styles.container}>
      <View>
        <Image
          source={{uri: itemImage}}
          style={{width: 69, height: 81, borderRadius: 10}}
        />
      </View>
      <View style={styles.textView}>
        <Text style={styles.description}>{title}</Text>
        <Text style={styles.amount}>${price}</Text>
        <View style={{flexDirection: 'row'}}>
          <Text style={styles.sizeAndQuantity}>x {quantity}</Text>
          {!util.isEmptyValue(size) && (
            <Text style={[styles.sizeAndQuantity, {marginLeft: 10}]}>
              | size {size}
            </Text>
          )}
        </View>
      </View>
      <View style={{justifyContent: 'flex-end'}}>
        <Text>Status | {isFromSales ? itemStatus : status}</Text>
      </View>
    </View>
  );
};

OrderDetailComponent.propTypes = {};

OrderDetailComponent.defaultProps = {};

export default OrderDetailComponent;
