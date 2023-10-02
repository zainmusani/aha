// @flow
import _ from "lodash";
import React from "react";
import { TouchableOpacity, View } from "react-native";
import PropTypes from "prop-types";
import { Text } from "..";
import { Fonts, Colors } from "../../theme";
import styles from "./styles";
import { strings } from "../../constants";

const CartTotalPrice = props => {
  const { buttonText, totalPrice, ButtonPress } = props;
  return (
    <View style={styles.container}>
      <View>
        <Text style={styles.totalText}>
          {strings.TOTAL}
        </Text>
        <Text style={styles.totalValue}>{`$${totalPrice}`}</Text>
      </View>

      <TouchableOpacity style={styles.buttonView} onPress={ButtonPress}>
        <Text style={{ fontSize: 17, fontFamily: Fonts.type.bold }}>
          {buttonText}
        </Text>
      </TouchableOpacity>
    </View>
  );
};

CartTotalPrice.propTypes = {
  buttonText: PropTypes.string.isRequired,
  ButtonPress: PropTypes.func.isRequired
};

CartTotalPrice.defaultProps = {};

export default CartTotalPrice;
