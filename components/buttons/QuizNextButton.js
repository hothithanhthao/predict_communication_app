import React, { Component } from 'react';
import { StyleSheet, View, TouchableOpacity} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';

export default class QuizNextButton extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <View style={styles.container}>
        <TouchableOpacity onPress={() => this.props.nextQuestion()} >
          <View style = {styles.shadowsStyling}>
            <View style = {styles.buttonStyle}>
              <Icon style={{paddingHorizontal: 20}} name="md-arrow-round-forward" size={30} color="white" />
            </View>
          </View>
        </TouchableOpacity >
      </View>
    )
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'row',
  },
  shadowsStyling: {
    width: 100,
    height: 100,
    shadowColor: "#000000",
    shadowOpacity: 0.8,
    shadowRadius: 2,
    shadowOffset: {
      height: 3,
      width: 0
    }
  },
  buttonStyle: {
    paddingTop: 5,
    paddingBottom: 5, 
    paddingRight: 20, 
    paddingLeft: 20, 
    borderRadius: 100, 
    borderColor: "#7553A8", 
    backgroundColor:"#7553A8", 
    width: 100, 
    marginBottom: 20,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.15,
    shadowRadius: 3.84,
    elevation: 5,
  }
});
