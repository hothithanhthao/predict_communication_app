import React from 'react';
import { StyleSheet, Text, View, TouchableOpacity, Alert } from 'react-native';
import { StackActions } from 'react-navigation';

import ResultGraph from '../components/graph/ResultGraph';
import ModalMessage from '../components/ModalMessage';
import LoadingSpinner from '../components/loading/loader';

import API from '../api';

class ResultScreen extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      resultGraph: null,
      sortedResults: null,
      calculatedResult: null,
      modalVisible: false,
      results: ['resultEmail', 'resultRecording', 'resultImage', 'resultQuestion'],

      // the importance of every result
      resultEmail: 1,
      resultRecording: 1,
      resultImage: 6,
      resultQuestion: 6,
      resultFormalityEndQuiz: 0,
      resultDominanceEndQuiz: 0,
      description: "Error",
      trainingData: null,
      imageName: '',
      loading: false
    }

    jsonData = require('../data/textData.json');

  }

  componentWillMount() {

    let types = {
      'afwachtend': 0,
      'dominant': 0,
      'informeel': 0,
      'formeel': 0,
    };

    const communicationStyleSubTypes = {
      'Supporter': ['Afwachtend', 'Informeel'],
      'Analyzer': ['Afwachtend', 'Formeel'],
      'Promoter': ['Dominant', 'Informeel'],
      'Controller': ['Dominant', 'Formeel'],
    }

    const resultFormalityEndQuiz = this.props.navigation.getParam('resultFormalityEndQuiz', null);
    const resultDominanceEndQuiz = this.props.navigation.getParam('resultDominanceEndQuiz', null);

    // used to train the AI
    _createTrainingObject = (tags) => {
      let data = null;
      let resultImage = null;
      if (this.props.navigation.getParam('imageName', null) != null ) {
        resultImage = this.props.navigation.getParam('imageName', null);
      } else {
        let temp = this.props.navigation.getParam('resultImage', null);
        resultImage = temp['filename'];
      }
      if (resultImage) {
        this.setState({ imageName: resultImage });
        data = {
          "training_data": {
            filename: resultImage,
            tags: tags
          }
        }
      } else {
        data = null;
      }
      return data;
    }

    // If this screen is loaded without using the Questionnaire
    if (resultFormalityEndQuiz == null && resultDominanceEndQuiz == null)
    {
      let testing = false;
      if (!testing) {
        results = this.state.results;
        results.map((result) => {
          navParam = this.props.navigation.getParam(result, null);
          if (navParam != null) {
            Object.keys(navParam['results']).map(key => {
              types[key.toLowerCase()] += navParam['results'][key] * this.state[result];
            });
          }
        });

        const count = this.state.resultEmail + this.state.resultRecording + this.state.resultImage + this.state.resultQuestion;
        afwachtend = types['afwachtend'] / count;
        dominant = types['dominant']  / count;
        informeel = types['informeel'] / count;
        formeel = types['formeel'] / count;

        total_x = (100 / (afwachtend + dominant));
        total_y = (100 / (informeel + formeel));

        afwachtend *= total_x;
        dominant *= total_x;
        informeel *= total_y;
        formeel *= total_y;

      } else { // if testing the application

        afwachtend = 0;
        dominant = 0;
        informeel = 0;
        formeel = 0;

      }
    } else { // if there are results from the questionnaire

      afwachtend = 100 - resultDominanceEndQuiz;
      dominant = resultDominanceEndQuiz;
      informeel = 100 - resultFormalityEndQuiz;
      formeel = resultFormalityEndQuiz;

    }

    const resultsGraph = {
      'Afwachtend': afwachtend,
      'Dominant': -Math.abs(dominant),
      'Informeel': informeel,
      'Formeel': -Math.abs(formeel),
    }

    // 0: style, 1: result, 2: x, 3: y
    let communication_style_results = [
      [ "Analyzer", afwachtend + formeel, 'Afwachtend', 'Formeel' ],
      [ "Supporter", afwachtend + informeel, 'Afwachtend', 'Informeel' ],
      [ "Promoter", dominant + informeel, 'Dominant', 'Informeel' ],
      [ "Controller", dominant + formeel, 'Dominant', 'Formeel'],
    ]

    communication_style_results.sort(function(current, next) {
      return current[1] - next[1];
    });

    if (afwachtend > dominant && informeel > formeel) { //Supporter
      this.setState({calculatedResult: jsonData.supporter});
      this.setState({trainingData: _createTrainingObject(communicationStyleSubTypes['Supporter'])});
      this.setState({description:  jsonData.desc_supporter})
    } else if (afwachtend > dominant && informeel < formeel) //Analyzer
    {
      this.setState({calculatedResult: jsonData.analyzer});
      this.setState({trainingData: _createTrainingObject(communicationStyleSubTypes['Analyzer'])});
      this.setState({description:  jsonData.desc_analyzer})
    } else if (afwachtend < dominant && informeel > formeel) //Promoter
    {
      this.setState({calculatedResult: jsonData.promoter});
      this.setState({trainingData: _createTrainingObject(communicationStyleSubTypes['Promoter'])});
      this.setState({description:  jsonData.desc_promoter})
    } else if (afwachtend < dominant && informeel < formeel) //Controller
    {
      this.setState({calculatedResult: jsonData.controller});
      this.setState({trainingData: _createTrainingObject(communicationStyleSubTypes['Controller'])});
      this.setState({description: jsonData.desc_controller})
    } else {
      this.setState({calculatedResult:  jsonData.unclear});
      this.setState({description: jsonData.desc_unclear})
    }

    this.setState({sortedResults: communication_style_results });
    this.setState({resultsGraph: resultsGraph});
  }

  trainAI = () => {
    Alert.alert(
      'Vraagje...',
      'Mogen wij jouw foto gebruiken om onze A.I. te trainen?',
      [
        {text: 'Nee', onPress: () => {
          this.props.navigation.dispatch(StackActions.popToTop());
        }, style: 'cancel'},
        {text: 'Ja', onPress: () => {
          var headers = {
            "Content-Type": "application/json",
            "Access-Control-Allow-Origin": "*"
          };
          if (this.state.trainingData != null) {
            this.setState({ loading: true });
            API.post('train/image', JSON.stringify(this.state.trainingData), {headers: headers})
            .then((res) => {
              this.props.navigation.dispatch(StackActions.popToTop());
            }).catch((err) => {
              console.log(err);
            });
          }
        }},
      ],
      { cancelable: false }
    );
  }

  render()
  {
    const {calculatedResult, description} = this.state;

    const loading = this.state.loading;
    if (!loading) {
      return (

        <View style={styles.container}>

        {/*Modal*/}
        <ModalMessage ref={modalMessage => {this.modalMessage=modalMessage}} {...this.props} title={calculatedResult} description={description} buttonText={'Bevestig'} />

        {/*Header with your communication style*/}
        <View style={{marginBottom: 10}}>
        <Text style={styles.ResultFont}>{ calculatedResult }</Text>
        </View>

        {/*Graph*/}
        <ResultGraph results={this.state.resultsGraph} commStyle={this.state.calculatedResult} sortedResults={this.state.sortedResults} />

        {/*Info button Button*/}
        <TouchableOpacity onPress={() => this.modalMessage.setModalVisible(true)} style={{marginTop: 10}}>
        <View style={styles.shadowsStyling}>
        <View style={styles.buttonStyle}>
        <Text style={styles.mainFontStyle}>{jsonData.what_is + calculatedResult + "?"}</Text>
        </View>
        </View>
        </TouchableOpacity>

        {/*Quiz Button*/}
        <TouchableOpacity onPress={() => this.props.navigation.replace('Questionnaire', { imageName: this.state.imageName })} >
        <View style={styles.shadowsStyling}>
        <View style={styles.buttonStyle}>
        <Text style={styles.mainFontStyle}>Dit klopt niet</Text>
        </View>
        </View>
        </TouchableOpacity>

        {/*Confirm Button*/}
        <TouchableOpacity onPress={() => this.trainAI()} >
        <View style={styles.shadowsStyling}>
        <View style={styles.buttonStyle}>
        <Text style={styles.mainFontStyle}>Klopt</Text>
        </View>
        </View>
        </TouchableOpacity>
        </View>
      );
    } else {
      return (
        <View style={styles.container}>
        <LoadingSpinner customMessage={"A.I. trainen..."}/>
        </View>
      );
    }
  }

}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#5AAF41',
    alignItems: 'center',
    justifyContent: 'center',
  },
  shadowsStyling: {
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
  modal: {
    flex: 1,
    backgroundColor: '#7553A8',
    borderRadius: 35,
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    marginVertical: 22,
    marginHorizontal: 22
  },
  mainFontStyle: {
    fontFamily: 'segoeUI',
    fontWeight: 'bold',
    fontSize: 20,
    margin: 10,
    color: "white",
    textAlign: 'center'
  },
  ResultFont: {
    fontFamily: 'segoeUI',
    fontWeight: 'bold',
    fontSize: 30,
    margin: 5,
    color: "white",
    textAlign: 'center'
  },
  buttonStyle: {
    paddingTop: 0,
    paddingBottom: 0,
    paddingRight: 5,
    paddingLeft: 5,
    borderRadius: 100,
    borderColor: "#7553A8",
    backgroundColor:"#7553A8",
    minWidth: '80%',
    maxHeight: '75%',
    marginVertical: 10,
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

export default ResultScreen;
