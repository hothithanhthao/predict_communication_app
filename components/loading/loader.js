import React, { Component } from 'react';
import { StyleSheet, View, Text, TextInput, Animated, Image  } from 'react-native';

export default class LoadingSpinner extends Component {
  constructor(props) {
    super(props);
    this.state = {
      loadingImage: require('../../assets/images/wortelltransparantwhite.png'),
      loadingMessage: 'Resultaten laden...',
    }

    this.spin = new Animated.Value(0);
  }

  spinAnimation = () => {
    Animated.loop(
    Animated.sequence([
      Animated.timing(
        this.spin,
        {
          toValue: -0.1,
          duration: 500,
        }
      ),
      Animated.timing(
        this.spin,
        {
          toValue: 1,
          duration: 800,
        }
      ),
      Animated.timing(
        this.spin,
        {
          toValue: 0,
          duration: 500,
        }
      ),
    ]),
    {
      iterations: 100
    }
  ).start(() => this.spinAnimation);

  }

  componentDidMount() {
    this.spinAnimation();
  }

  componentWillMount() {
    if (this.props.customMessage) {
      this.setState({ loadingMessage: this.props.customMessage});
    }
  }


  render() {
    const spin = this.spin.interpolate({
      inputRange: [-1, 1],
      outputRange: ['-360deg', '380deg']
    });

    return (
      <View style={styles.view}>
      <Text style={styles.text}>{this.state.loadingMessage}</Text>
      <View style={styles.center}>
      <Animated.Image style={[styles.spinner, {transform: [{rotate: spin}]}]} source={this.state.loadingImage} resizeMode="contain" />
      </View>
      </View>
    )
  }
}

const styles = StyleSheet.create({
  text: {
    fontSize: 30,
    marginTop: 50,
    fontWeight: 'bold',
    fontFamily: 'segoeUI',
    color: 'white'
  },
  view: {
    backgroundColor: '#5AAF41',
    height: '100%',
    width: '100%',
    flex: 1,
    alignItems: 'center',
  },
  center: {
    height: '100%',
    width: '100%',
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  spinner: {
    width: 120,
    height: 120
  }
});
