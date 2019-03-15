import React from 'react';
import { StyleSheet, View, Image, Text } from 'react-native';
import Quiz  from '../components/quiz/Quiz';
import StepsDisplay from '../components/StepsDisplay'

class DominanceQuestion extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      resultDominance: null,
      dominance: null,
      formality: null,
      quizFinish: false
    }
    jsonData = require('../data/questionaireData.json');
  }

  _quizFinish(dominance, formality) {
    this.setState({ quizFinish: true, dominance : dominance}, () => {
      let testing = false;
      let result = {};
      if (!testing) {
      result = {
        'results': {
          'Dominant': (100 - (dominance * 100)),
          'Afwachtend': (dominance * 100)
        }
      }
    } else {
      result = {
        'results': {
          'Dominant': 0,
          'Afwachtend': 0,
          'Informeel': 0,
          'Formeel': 0,
        }
      }
    }
      this.setState({resultDominance: result}, () => {
        this.props.navigation.navigate('Result', { resultImage: this.props.navigation.getParam('resultImage', null), resultEmail: this.props.navigation.getParam('resultEmail', null), resultRecording: this.props.navigation.getParam('resultRecording', null), resultQuestion: this.state.resultDominance})
      })
    })
  }

  render() {
    const activeOpacity = 0.8;
    return (
      <View style={styles.container}>
      <Quiz quizData = {jsonData.dominancequiz} quizFinish={(dominance, formality) => this._quizFinish(dominance, formality)} />
      <StepsDisplay stepIndex={4}/>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#5AAF41',
    position: 'relative',
    alignItems: 'center',
    justifyContent: 'center',
  },
  button: {
    position: 'absolute',
    backgroundColor: '#7553A8',
    borderRadius: 25,
    width: '100%',
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
    bottom: 5
  },
  buttonText: {
    color: 'white',
    fontFamily: 'segoeUI',
    textAlign: 'center',
    fontSize: 22,
    fontWeight: 'bold'
  }
});

export default DominanceQuestion;
