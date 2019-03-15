import React, { Component } from 'react';
import { StyleSheet, View, Button, Text } from 'react-native';

export default class QuestionsButton extends Component {
  constructor(props) {
    super(props);
    this.state = { text: "To Questions"};
  }

  _doNothing() {

  }

  render() {
    return (
      <View>
        <Button onPress={() => this.props.navigation.navigate('Questionnaire')} color={'#841584'} title={this.state.text}></Button>
      </View>
    )
  }
}
