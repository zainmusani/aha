// @flow
import { StyleSheet } from "react-native";
import { AppStyles, Colors, Fonts } from "../../theme";

export default StyleSheet.create({
  container: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginVertical: 20,
    marginTop: 30,
    paddingHorizontal: 20
  },

  totalText: {
    fontSize: Fonts.size.normal,
    fontFamily: Fonts.type.bold
  },

  totalValue: {
    fontSize: 22,
    fontFamily: Fonts.type.bold
  },

  buttonView: {
    backgroundColor: Colors.background.purple,
    width: "40%",
    paddingVertical: 10,
    borderRadius: 4,
    ...AppStyles.centerInner
  }
});
