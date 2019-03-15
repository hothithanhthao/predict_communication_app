import React, { Component } from 'react';
import 
{
  Animated,
  StyleSheet,
  Text,
  View,
  Dimensions,
  Slider
} from 'react-native';
import QuizNextButton from '../buttons/QuizNextButton';


export default class Quiz extends Component {
  constructor(props){
    super(props);
    this.questionNumber = 0
    this.score = 0
    quizValue = ""
    const jsonData = this.props.quizData;
    NewData = [];
    NewData = Object.keys(jsonData).map( function(k) { return jsonData[k] });

    this.state = {
      //The question
      question : NewData[this.questionNumber].question,

      //The two options the user gets
      options : NewData[this.questionNumber].options,

      //Wether the question determines Dominance/Formality
      determinetype : NewData[this.questionNumber].determinetype,

      //Wether answering this question adds or substracts from the determinetype.
      order : NewData[this.questionNumber].order,

      //Amound of Formality and Dominance questions you answered
      formalityQuestionCount : 0,
      dominanceQuestionCount : 0,

      //The user's score on both formality as dominance
      formality : 0,
      dominance : 0,

      width: Dimensions.get('window'),
      height: Dimensions.get('window'),

      //Value van de slider
      sliderValue : 50,
      //Animated Slider voor de achtergrond veranderen.
      animatedValue : new Animated.Value(50)
    }
  }

  nextQuestion = () => {

    this.Answer(this.state.determinetype, this.state.order, this.state.sliderValue)

    if(this.questionNumber < NewData.length-1){
      this.questionNumber++
      this.setState({order : NewData[this.questionNumber].order, determinetype: NewData[this.questionNumber].determinetype, question: NewData[this.questionNumber].question, options: NewData[this.questionNumber].options})
    }
    else
    {
      let dominanceScore = 0;
      let formalityScore = 0;

      formalityScore = this.state.formality / (this.state.formalityQuestionCount * 100);
      dominanceScore = this.state.dominance / (this.state.dominanceQuestionCount * 100);

      this.props.quizFinish(dominanceScore, formalityScore);
     }

     this.setState({sliderValue : 50})
     this.state.animatedValue.setValue(50);
  }

  //Type is either Dominance or Formality, Order determines wether it should be add (1) or removed (-1) from the score. Value is the amount of points the user gave it.
  Answer = (type, order, sliderValue) => {
    if (type == "Dominance")
    {
      this.state.dominanceQuestionCount += 1;
      this.state.dominance += sliderValue * parseInt(order);
    } else
    if (type == "Formality")
    {
      this.state.formalityQuestionCount += 1;
      this.state.formality += sliderValue * parseInt(order);
    }
    
  }

  render() {
    let _this = this

    const currentOptions = this.state.options
    let i = 0;
    let shownValue = 404;
    let shownColor = 'white'

    const options = Object.keys(currentOptions).map( function(k) {
      if (i == 0)
      {
        shownValue = 100 - _this.state.sliderValue.toFixed(0);
      } else
      {
        shownValue = _this.state.sliderValue.toFixed(0);
      }

      //Als percentage lager is dan 50 dan moet de kleur van de tekst groen zijn voor leesbaarheid
      if (shownValue < 50)
      {shownColor = 'rgb(90, 175, 65)'} 
      else
      //Als percentage hoger is dan 50 dan moet de kleur van de tekst groen zijn voor leesbaarheid
      {shownColor = 'white'}
      i++;

    return (  
    <View key={k} style={{flex: 1, alignItems: 'stretch', justifyContent: 'space-between', flexDirection: 'column', minHeight: '125%' /*borderRadius: 20, marginVertical: 15*/}}>
      <View style={{minHeight: '50%'}}>
        <Text style={{fontFamily: 'segoeUI', fontWeight: 'bold', fontSize: 24, margin: 10, marginTop: 40,color: shownColor,textAlign: 'center'}}>
        {
          currentOptions[k]
        }   
        </Text>
      </View>
      <Text style={{fontSize: 80,flex: 1, flexDirection: 'column', fontFamily: 'segoeUI',fontWeight: 'bold',color: shownColor,textAlign: 'center'}}>
        {shownValue}
        <Text style={{fontFamily: 'segoeUI', fontSize: 30, margin: 10, color: shownColor, textAlign: 'center'}}>%</Text>
      </Text>
    </View>)
    });

    var colorLeft = this.state.animatedValue.interpolate({
      inputRange: [0, 100],
      outputRange: ['rgb(90, 175, 65)', 'rgb(255, 255, 255)']
     });

    var colorRight = this.state.animatedValue.interpolate({
      inputRange: [0, 100],
      outputRange: ['rgb(255, 255, 255)', 'rgb(90, 175, 65)']
     });

    return (
    <View style={styles.container}>
    <Animated.View style={{backgroundColor: colorLeft, flex: 1}}>
    </Animated.View>
    <Animated.View style={{backgroundColor: colorRight, flex: 1}}>
    </Animated.View>
    <View style={styles.buttonContainer}>

      <View style={styles.container}>

        {/*Question*/}
        <View style={{ flex: 1,flexDirection: 'column', justifyContent: "space-between", alignItems: 'center',}}>

          <View style={{width: this.state.width * 90/100, borderRadius: 1,  backgroundColor: 'rgb(90, 175, 65)',}}  >
            <Text style={styles.welcome}>
            {this.state.question}
            </Text>
          </View>

        {/*Options*/}
        <View style={{flex: 1, alignItems: 'stretch', justifyContent: 'space-between', flexDirection: 'row'}} >
          {options}
        </View>

        {/*Slider*/}
        <View style={{flex: 1, alignItems: 'stretch', justifyContent: 'center', width: '70%', marginVertical: 0}}>
            <Slider
            thumbTintColor = {'#7553A8'}
            minimumTrackTintColor = {'#7553A8'}
            maximumTrackTintColor = {'#7553A8'}
            value={this.state.sliderValue}
            maximumValue={100}
            style={{transform: [{ scaleX: 1.5 }, { scaleY: 1.5 }]}}
            onValueChange={(sliderValue) => this.setState({sliderValue}, () => {
            this.state.animatedValue.setValue(this.state.sliderValue);
            })} />
        </View>

        {/*Next Button*/}
          <QuizNextButton nextQuestion={this.nextQuestion} />
      </View>
    </View>
  </View>
</View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'row',
  },
  verticalContainer:{
    flex:1,
        justifyContent: 'center',
    alignItems: 'center'
  },
  welcome: {
    fontFamily: 'segoeUI',
    fontWeight: 'bold',
    fontSize: 20,
    margin: 10,
    color: "white",
    textAlign: 'center'
  },
  percentages: {
    fontSize: 109,
    fontFamily: 'segoeUI',
    fontWeight: 'bold',
    color: "white",
    textAlign: 'center'

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
buttonContainer: {
  position: 'absolute',
  width: '100%',
  height: '100%',
  justifyContent: 'center',
  alignItems: 'center',
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
