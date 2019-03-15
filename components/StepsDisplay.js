import React, { Component } from 'react';
import { StyleSheet, View, Button,TouchableOpacity, Text,Image } from 'react-native';
import Icon from './Icon.js';

const ICON_RECORD_BUTTON_WHITE = new Icon(require('../assets/images/ic_microphone.png'), 1, 1);
const ICON_EMAIL_BUTTON_WHITE = new Icon(require('../assets/images/email_icon.png'), 1, 1);
const ICON_QUESTIONAIRE_BUTTON_WHITE = new Icon(require('../assets/images/question_icon.png'), 1, 1);
const ICON_IMAGE_BUTTON_WHITE = new Icon(require('../assets/images/camera-icon.png'), 1, 1);

const ICON_RECORD_BUTTON_BLACK = new Icon(require('../assets/images/ic_microphone_black.png'), 1, 1);
const ICON_EMAIL_BUTTON_BLACK = new Icon(require('../assets/images/email_icon_black.png'), 1, 1);
const ICON_QUESTIONAIRE_BUTTON_BLACK = new Icon(require('../assets/images/question_icon_black.png'), 1, 1);
const ICON_IMAGE_BUTTON_BLACK = new Icon(require('../assets/images/camera_icon_black.png'), 1, 1);

const stepsWhiteIcons = {
 1: ICON_EMAIL_BUTTON_WHITE,
 2: ICON_IMAGE_BUTTON_WHITE,
 3: ICON_RECORD_BUTTON_WHITE,
 4: ICON_QUESTIONAIRE_BUTTON_WHITE
};

const stepsBlackIcons = {
  1:ICON_EMAIL_BUTTON_BLACK,
  2:ICON_IMAGE_BUTTON_BLACK,
  3:ICON_RECORD_BUTTON_BLACK,
  4:ICON_QUESTIONAIRE_BUTTON_BLACK
};

export default class StepsDisplay extends Component {
  
  constructor(props) {
    super(props);

    //Current screen, gotten in the draw event
    stepIndex = this.props.stepIndex;

    //Max amount of steps our screen allows
    stepsNumber = 4;

    if (this.props.stepsNumber != null)
    {
      stepsNumber = this.props.stepsNumber;
    }

    //Distance between steps
    distance = 20;
  }

  createBubbles = () => {
    let bubble = []

    for (let i = 1; i <= stepsNumber; i++)
    {
      if (i == this.props.stepIndex)
      {
        bubble.push(
          <View  key={i}>
          <View style = {[styles.numberBubble, {backgroundColor: '#6641AF'}]}>
          <Image  style={{width: 18, height: 18}} source={stepsWhiteIcons[i].module}/>
          </View>
          </View>
        )
      } else
      if (i != this.props.stepIndex)
      {
        bubble.push(
          <View key={i}>
          <View style = {[styles.numberBubble, {backgroundColor: 'white'}]}>
          <Image style={{width: 18, height: 18}} source={stepsBlackIcons[i].module}/>
          </View>
          </View>
        )
      }

      if (i != 0 && i != stepsNumber)
      {
        //I made the Key multiply i by 100 so it doesn't conflict with the index of the other elements.
        //I chose 100 because we won't ever use 100 steps in our app. So this way it won't conflict with realistic index numbers.
        bubble.push(<View key={i * 100} style = {styles.line}/>)
      }
    }

    return bubble
  }

  
  render() {
    return (
      <View style = {styles.container}>
      {this.createBubbles()}
      </View>
    )
  }

}
const styles = StyleSheet.create({

  line: {
    borderBottomColor: 'white',
    borderBottomWidth: 2,
    width: 14,
  },
  numberBubble: {
    position: 'relative',
    width: 24,
    height: 24,
    borderRadius: 24 / 2,
    alignItems: 'center',
    justifyContent: 'center',
  },
  container: {
    flex: 1,
    width: '100%',
    height:'5%',
    position: 'absolute',
    bottom:5,
    left:0,
    alignContent: 'center',
    flexDirection:'row',
    alignItems:'center',
    justifyContent: 'center'
  },
});
