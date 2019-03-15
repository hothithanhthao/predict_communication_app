import React from 'react';
import { Platform, StyleSheet, Text, View, Alert } from 'react-native';
import { Permissions } from 'expo';

import HomeButton from '../components/buttons/HomeButton';
import RecordButton from '../components/buttons/RecordButton';
import NavButtons from '../components/buttons/NavButtons';

import LoadingSpinner from '../components/loading/loader';
import StepsDisplay from '../components/StepsDisplay';

import API from '../api';

class RecordingScreen extends React.Component {
  constructor(props) {
    super(props);

    jsonData = require('../data/textData.json');

    this.state = {
      resultImage: null,
      resultEmail: null,
      resultRecording: null,
      recording: null,
      loading: false,
      finishedRecording: false,
    }
  }

  setRecording = (recording) => {
    this.setState({recording: recording});
  }

  getRecordingResults = (recording) => {
    let testing = false;
    if (!testing) {
      this.setState({ loading: true });
      let formdata = new FormData();
      if (Platform.OS == 'android') {
        let fileType = 'm4a';
        formdata.append('speech', {
          uri: this.state.recording.uri,
          name: `recording.${fileType}`,
          type: `audio/aac`
        });
      } else {
        let fileType = 'wav';
        formdata.append('speech', {
          uri: this.state.recording.uri,
          name: `recording.${fileType}`,
          type: `audio/${fileType}`
        });
      }
      var headers = {
        "Accept": "application/json",
        "Content-Type": "multipart/form-data",
        "Access-Control-Allow-Origin": "*"
      };
      console.log(this.state.recording.uri);
      API.post('recording', formdata, {headers: headers})
      .then((res) => {
        this.setState({resultRecording: res.data}, () => {
          console.log(this.state.resultRecording);
          this.setState({ loading: false });
          this.props.navigation.navigate('DominanceQuestion', { resultImage: this.state.resultImage, resultEmail: this.state.resultEmail, resultRecording: this.state.resultRecording })
        })
      }).catch((err) => {
        this.setState({ loading: false });
        Alert.alert(jsonData.error, jsonData.recording_failed + err)
      });
    } else {
      this.props.navigation.navigate('DominanceQuestion', { resultImage: this.state.resultImage, resultEmail: this.state.resultEmail, resultRecording: this.state.resultRecording })
    }
  }

  componentDidMount = async () => {
    this.setState({resultEmail: this.props.navigation.getParam('resultEmail', null)});
    this.setState({resultImage: this.props.navigation.getParam('resultImage', null)});
  }

  render() {
    const {loading, finishedRecording} = this.state;
    if (!loading) {
      return (
        <View style={styles.container}>
        <HomeButton navigation={this.props.navigation} />
        <View style={styles.innerContainer}>
        <View style={styles.titleContainer}>
        <Text style={styles.title}>{jsonData.voice}</Text>
        </View>
        <View style={styles.subtitleContainer}>
        <Text style={styles.subtitle}>{jsonData.enter_voice}</Text>
        <Text style={styles.question}>{jsonData.question_voice}</Text>
        </View>
        <View style={styles.recordButton}>
        <RecordButton navigation={this.props.navigation} getRecording={this.setRecording} finishedRecording={() => {this.setState({finishedRecording: true});}}/>
        </View>
        </View>
        { finishedRecording ?
          <NavButtons navigation={this.props.navigation} navNext={false} customOnPress={this.getRecordingResults} />
          :
          <NavButtons navigation={this.props.navigation} nextDisabled={true} navNext={false} customOnPress={() => {}}/>
        }
        <StepsDisplay stepIndex={3} />
        </View>
      );
    } else {
      return (
        <View style={styles.container}>
        <LoadingSpinner />
        </View>
      );
    }
  }

}
//<RecordButton navigation={this.props.navigation} getRecording={this.setRecording} />
const styles = StyleSheet.create({
  container: {
    backgroundColor: '#5AAF41',
    position: 'relative',
    flex: 1,
  },
  innerContainer: {
    flex: 1,
    alignItems: 'center',
    position: 'relative',
    justifyContent: 'flex-start',
  },
  titleContainer: {
    alignItems: 'center',
    maxWidth: '100%',
  },
  title: {
    fontSize: 30,
    fontWeight: "bold",
    color: 'white',
    textAlign: 'center',
  },
  subtitleContainer: {
    alignItems: 'center',
    maxWidth: '100%',
    marginBottom: '15%'
  },
  subtitle: {
    fontSize: 18,
    color: 'white',
    textAlign: 'center',
    marginBottom: 20,
  },
  question: {
    fontSize: 18,
    color: 'white',
    textAlign: 'center',
    fontStyle: 'italic',
    fontWeight: 'bold'
  },
  recordButton: {
    width: '100%',
    minHeight: '20%',
    justifyContent: 'center',
    alignItems: 'center'
  }
});

export default RecordingScreen;
