import React, { Component } from 'react';
import Quiz  from '../components/quiz/Quiz';
import { StyleSheet, Text, View} from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import StepsDisplay from '../components/StepsDisplay'
import API from '../api';


class QuestionnaireScreen extends React.Component {

    constructor(props){
        super(props);
        jsonData = require('../data/questionaireData.json');
        this.state = {
          quizFinish : false,
          dominance: 0,
          formality: 0,
        }
    }

    static navigationOptions = {
      title: 'Enquête'
    }

  _getCommunicationStyle = (dominance, formality) =>
  {
    if (dominance < 0.5 && formality < 0.5)
    {
      return "Supporter";
    } else if (dominance < 0.5 && formality > 0.5)
    {
      return "Analyzer";
    } else if (dominance > 0.5 && formality < 0.5)
    {
      return "Promoter";
    } else if (dominance > 0.5 && formality > 0.5)
    {
      return "Controller";
    } else {
      return "We kunnen je stijl niet berekenen. Vul het a.u.b. zo eerlijk mogelijk in!"
    }
  }

  _onPressBack = () => {
    const {goBack} = this.props.navigation;
      goBack();
  }
  _quizFinish = (dominance, formality) => {
    let curDominance = 100 * dominance;
    let curFormality = 100 * formality;
    this.setState({dominance : curDominance, formality : curFormality})
    this.props.navigation.navigate('Result', { resultFormalityEndQuiz: curFormality, resultDominanceEndQuiz: curDominance, imageName: this.props.navigation.getParam('imageName', null) })
  }


  _scoreMessage = (dominance, formality) => {
      return (<View style={styles.innerContainer} >
                <View style={{ flexDirection: "row"}} >
                  <Icon name="trophy" size={30} color="white" />
                </View>
                <Text style={styles.score}>Je hebt de enquête afgemaakt!</Text>
                <Text style={styles.score}>Jouw communicatiestijl is: {this._getCommunicationStyle(dominance, formality)}</Text>
              </View>)
  }
  render() {
    return (
      <View style={{flex:1}}>
       <Quiz quizData = {jsonData.quiz1} quizFinish={(dominance, formality) => this._quizFinish(dominance, formality)} />
       <StepsDisplay stepIndex = {4}/>
      </View>
    );
  }
}

const scoreCircleSize = 300;
const styles = StyleSheet.create({
  score: {
    color: "white",
    fontSize: 20,
    fontStyle: 'italic'
  },
  circle: {
    justifyContent: 'center',
    alignItems: 'center',
    width: scoreCircleSize,
    height: scoreCircleSize,
    borderRadius: scoreCircleSize/2,
    backgroundColor: "green"
  },
  innerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center'
  },
  buttonContainer:{
    flex: 2,
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
});

export default QuestionnaireScreen;
