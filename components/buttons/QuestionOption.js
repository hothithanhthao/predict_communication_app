import React, { Component } from 'react';
import { StyleSheet, View, Button, Text, TouchableHighlight } from 'react-native';

export default class QuestionOption extends Component {
  constructor(props) {
    super(props);
    this.state = { text: "OPTION 1"};
  }

  _doNothing() {

  }

  onPress = () => {
    this.setState({ text: "Pressed it boyos!" });
  }
  render() {
    return (
        <View style={styles.container}>
        <TouchableHighlight onPress={this.onPress} style ={styles.QuestionButtonStyle}>
          <Text style={styles.QuestionText}>{this.state.text}</Text>
        </TouchableHighlight>
      </View>
    )
  }
}

const styles = StyleSheet.create({
    QuestionButtonStyle:{
        marginTop:10,
        paddingTop:20,
        paddingBottom:20,
        backgroundColor:'#4286f4',
        borderRadius:10,
        borderWidth: 1,
        borderColor: '#fff',
        justifyContent: 'space-around'
    },
    QuestionText: {
      padding: 10,
      fontSize: 18,
    }
  
  });
