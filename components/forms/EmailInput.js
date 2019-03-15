import React, { Component } from 'react';
import { StyleSheet, View, Text, TextInput } from 'react-native';


export default class EmailInput extends Component {
  constructor(props) {
    super(props);
    this.state = {
      placeholder: 'example@wortell.nl',
      email: '',
    };
    this.getEmail = this.getEmail.bind(this);
  }

  getEmail = (e) => {
    this.setState({currentFontStyle: 'normal'})
    this.setState({ email: e }, () => {
      this.props.getEmail(this.state.email);
    });
  }

  render() {
    return (
      <View>
          <TextInput
          style={styles.input}
          underlineColorAndroid='rgba(0,0,0,0)'
          value={this.state.email}
          onChangeText={(email) => this.getEmail(email)}
          placeholder={this.state.placeholder} />
      </View>
    )
  }
}

const styles = StyleSheet.create({
  input: {
    textAlign:'center',
    width: 290,
    height: 40,
    borderRadius: 20,
    backgroundColor:'#fff',
    borderColor:'#485D46',
    color: '#7553A8',
    fontSize : 21,
    fontFamily: 'segoeUI',
    fontWeight: 'bold'
  },
});
