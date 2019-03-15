import React, { Component } from 'react';
import { StyleSheet, View, Button,TouchableOpacity, Text,Image } from 'react-native';
import Icon from '../Icon.js';

const HOME_ICON = new Icon(require('../../assets/images/ic_home.png'), 1,1 );

export default class HomeButton extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <View style={styles.container}>
      <TouchableOpacity style={styles.button} onPress={() => this.props.navigation.navigate('Home', {loading: false })}>
      <Image style={{width: 50,height: 35}} source={HOME_ICON.module}  />
      </TouchableOpacity>
      </View>
    )
  }

}
const styles = StyleSheet.create({
  container: {
    flex: 0,
  },
  button: {
    width: 50,
    height: 60,
    padding: 10,
    paddingBottom: 25
  }
});
