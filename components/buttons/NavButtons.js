import React, { Component } from 'react';
import { StyleSheet, View, TouchableOpacity, Text } from 'react-native';

/**
Accepted Props:
navigation (preferably this.props.navigation from the parent component),
prevDisabled,
nextDisabled,
navNext,
customOnPress (must set navNext to false to work)
**/
export default class NavButtons extends Component {
  constructor(props) {
    super(props);
    jsonData = require('../../data/textData.json');
    this.state = {
      enabledOpacity: 0.2,
      disabledOpacity: 1,
    };
  }

  render() {
    return (
      <View style={styles.container}>
      <View style={styles.buttonContainer}>
        <TouchableOpacity
        style={[styles.button, this.props.prevDisabled ? styles.disabled : styles.enabled]}
        underlayColor='#fff'
        onPress={() => this.props.prevDisabled ? null : this.props.navigation.goBack()}
        activeOpacity={ this.props.prevDisabled ? this.state.disabledOpacity : this.state.enabledOpacity}>
          <Text style={styles.buttonInner}>{jsonData.previous}</Text>
        </TouchableOpacity>
        </View>
        <View style={[styles.buttonContainer, {position: 'absolute', right: 0}]}>
        <TouchableOpacity
        style={[styles.button, this.props.nextDisabled ? styles.disabled : styles.enabled]}
        underlayColor='#fff'
        onPress={() => this.props.navNext ? this.props.navigation.navigate(this.props.navNext) : this.props.customOnPress()}
        activeOpacity={ this.props.nextDisabled ? this.state.disabledOpacity : this.state.enabledOpacity}>
          <Text style={styles.buttonInner}>{jsonData.next}</Text>
        </TouchableOpacity>
        </View>
      </View>
    )
  }

}
const styles = StyleSheet.create({
    container: {
      alignSelf: 'stretch',
      position: 'absolute',
      left: 0,
      right: 0,
      bottom: '10%',
     },
     buttonContainer: {
       width: '45%',
       margin: 10,
     },
     button: {
       height: 40,
       borderRadius:25,
       justifyContent: 'center',
       alignItems: 'center',
     },
     buttonInner: {
       color: 'white',
       fontFamily: 'segoeUI',
       textAlign: 'center',
       fontSize: 22,
       fontWeight: 'bold'
     },
     disabled: {
       backgroundColor:'#568F44',
     },
     enabled: {
       backgroundColor:'#7553A8',
       shadowColor: "#000",
       shadowOffset:
       {
         width: 0,
         height: 1,
       },
       shadowOpacity: 0.15,
       shadowRadius: 3.84,
       elevation: 5,
     }
    });
