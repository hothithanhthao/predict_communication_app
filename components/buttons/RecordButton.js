import React, { Component } from 'react';
import { StyleSheet, View, Button, Text, Image, TouchableWithoutFeedback, Animated } from 'react-native';
import Expo, { Asset, Audio, FileSystem, Font, Permissions } from 'expo';

import Icon from '../Icon.js';

const BACKGROUND_COLOR = '#FFF8ED';
const ICON_RECORD_BUTTON = new Icon(require('../../assets/images/ic_microphone.png'), 1, 1);
const ICON_RECORDING = new Icon(require('../../assets/images/ic_stop_button.png'), 1, 1);

export default class RecordButton extends Component {
  constructor(props) {
    super(props);
    jsonData = require('../../data/textData.json');
    this.recording = null;
    this.sound = null;
    this.isSeeking = false;
    this.shouldPlayAtEndOfSeek = false;
    this.state = {
      progressBar: 0,
      analyzing: false, color: false,
      haveRecordingPermissions: false,
      isLoading: false,
      isPlaybackAllowed: false,
      muted: false,
      soundPosition: null,
      soundDuration: null,
      recordingDuration: null,
      shouldPlay: false,
      isPlaying: false,
      isRecording: false,
      finishedRecording: false,
      fontLoaded: false,
      shouldCorrectPitch: true,
      volume: 1.0,
      rate: 1.0,
      result: null,
      recording_options: {
        "android": {
          "audioEncoder": 3,
          "bitRate": 128000,
          "extension": ".m4a",
          "numberOfChannels": 2,
          "outputFormat": 2,
          "sampleRate": 44100,
        },
        "ios": {
          "extension": ".wav",
          "audioQuality": Audio.RECORDING_OPTION_IOS_AUDIO_QUALITY_MEDIUM,
          "sampleRate": 44100,
          "numberOfChannels": 2,
          "bitRate": 128000,
        }
      },
      opacity1: 0,
      opacity2: 0,
      info: null,
    };
    this.recordingSettings = JSON.parse(JSON.stringify(this.state.recording_options));
    this.recordingInterval = null;
    this.border = new Animated.Value(0);
    this.border2 = new Animated.Value(0);
  }


  _updateScreenForRecordingStatus = status => {
    if (status.canRecord) {
      this.setState({
        isRecording: status.isRecording,
        recordingDuration: status.durationMillis,
      });
    } else if (status.isDoneRecording) {
      this.setState({
        isRecording: false,
        recordingDuration: status.durationMillis,
      });
      if (!this.state.isLoading) {
        this._stopRecordingAndEnablePlayback();
      }
    }
  };
  async _stopPlaybackAndBeginRecording() {
    this.setState({
      isLoading: true,
    });
    if (this.sound !== null) {
      await this.sound.unloadAsync();
      this.sound.setOnPlaybackStatusUpdate(null);
      this.sound = null;
    }

    await Audio.setAudioModeAsync({
      allowsRecordingIOS: true,
      interruptionModeIOS: Audio.INTERRUPTION_MODE_IOS_DO_NOT_MIX,
      playsInSilentModeIOS: true,
      shouldDuckAndroid: true,
      interruptionModeAndroid: Audio.INTERRUPTION_MODE_ANDROID_DO_NOT_MIX,
    });
    if (this.recording !== null) {
      this.recording.setOnRecordingStatusUpdate(null);
      this.recording = null;
    }

    const recording = new Audio.Recording();
    await recording.prepareToRecordAsync(this.recordingSettings);
    recording.setOnRecordingStatusUpdate(this._updateScreenForRecordingStatus);

    this.recording = recording;
    await this.recording.startAsync(); // Will call this._updateScreenForRecordingStatus to update the screen.
    this.setState({
      isLoading: false,
    });
  }

  async _stopRecordingAndEnablePlayback() {
    this.setState({
      isLoading: true,
    });
    try {
      await this.recording.stopAndUnloadAsync();
    } catch (error) {
      // Do nothing -- we are already unloaded.
    }
    const info = await FileSystem.getInfoAsync(this.recording.getURI());
    await Audio.setAudioModeAsync({
      allowsRecordingIOS: false,
      interruptionModeIOS: Audio.INTERRUPTION_MODE_IOS_DO_NOT_MIX,
      playsInSilentModeIOS: true,
      playsInSilentLockedModeIOS: true,
      shouldDuckAndroid: true,
      interruptionModeAndroid: Audio.INTERRUPTION_MODE_ANDROID_DO_NOT_MIX,
    });
    const { sound, status } = await this.recording.createNewLoadedSound(
      {
        isLooping: true,
        isMuted: this.state.muted,
        volume: this.state.volume,
        rate: this.state.rate,
        shouldCorrectPitch: this.state.shouldCorrectPitch,
      },
      this._updateScreenForSoundStatus
    );
    this.sound = sound;
    this.setState({
      isLoading: false,
    });
    this.setState({
      finishedRecording: true,
    });
    this.setState({info: info}, () => {
      this._sendRecording();
    });
  }

  _askPermissionRecording = async () => {
    const { AUDIO_RECORDING_status } = await Permissions.askAsync(Permissions.AUDIO_RECORDING);
    if (AUDIO_RECORDING_status !== 'granted') {
      await Permissions.askAsync(Permissions.AUDIO_RECORDING);
    }
  }

  _onRecordPressed = async () => {
    if (this.state.isRecording) {
      this._stopRecordingAndEnablePlayback();
      this.props.finishedRecording();
    } else {
      const { status, expires, permissions } = await Permissions.getAsync(Permissions.AUDIO_RECORDING);
      if (status !== 'granted') {
        this._askPermissionRecording();
      } else {
        this.setState({ opacity1: 0.6});
        this.setState({ opacity2: 0.3});
        this.growAnimation();
        this._stopPlaybackAndBeginRecording();
      }
    }
  }

  _getMMSSFromMillis = (millis) => {
    const totalSeconds = millis / 1000;
    const seconds = Math.floor(totalSeconds % 60);
    const minutes = Math.floor(totalSeconds / 60);

    const padWithZero = number => {
      const string = number.toString();
      if (number < 10) {
        return '0' + string;
      }
      return string;
    };
    return padWithZero(minutes) + ':' + padWithZero(seconds);
  }

  _getRecordingTimestamp = () => {
    if (this.state.recordingDuration != null) {
      return `${this._getMMSSFromMillis(this.state.recordingDuration)}`;
    }
    return `${this._getMMSSFromMillis(0)}`;
  }

  animate = () => {
    let progress = this.state.progressBar;
    this.setState({
      progressBar: (progress + (5 / 3000))
    });
    if (this.state.progressBar >= 1) {
      this.recording.stopAndUnloadAsync();
      clearInterval(this.recordingInterval);
    }
  }

  _sendRecording = () => {
    this.props.getRecording(this.state.info);
  }

  growAnimation = () => {
    Animated.loop(
      Animated.sequence([
        Animated.parallel([
          Animated.timing(
            this.border,
            {
              toValue: 1,
              duration: 500,
            }
          ),
          Animated.timing(
            this.border2,
            {
              toValue: 1,
              duration: 500,
            }
          ),
        ]),
        Animated.parallel([
          Animated.timing(
            this.border,
            {
              toValue: 0,
              duration: 2000,
            }
          ),
          Animated.timing(
            this.border2,
            {
              toValue: 0,
              duration: 2000,
            }
          ),
        ])
      ]),
      {
        iterations: 100
      }
    ).start(() => this.growAnimation());
  }

  render() {
    let opacity1 = this.state.opacity1;
    let opacity2 = this.state.opacity2;
    const border = this.border.interpolate({
      inputRange: [0, 1],
      outputRange: [160, 180]
    });
    const border2 = this.border2.interpolate({
      inputRange: [0, 1],
      outputRange: [120, 140]
    });

    return (
      <View>
      <View style={{alignItems:'center'}}>
      <View style={{marginBottom:0, backgroundColor:'red'}}></View>
      <View>
      {
        this.state.finishedRecording ?
        <Text style={{color:'#fff',fontWeight:'bold',fontSize: 20, alignItems:'center'}}>{jsonData.thanks_voice}</Text>
        :
        <View style={{alignContent: 'center', justifyContent:'center'}}>
        <Animated.View style={[{height: border}, {width: border}, { borderRadius: 100, opacity: opacity2, backgroundColor: 'white', alignSelf: 'center', alignContent: 'center', justifyContent: 'center', position: 'absolute', zIndex: 997 }]} />
        <Animated.View style={[{height: border2}, {width: border2}, { borderRadius: 100, opacity: opacity1, backgroundColor: 'white', alignSelf: 'center', alignContent: 'center', justifyContent: 'center', position: 'absolute', zIndex: 998}]} />
        <View style={styles.recordButtonContainer}>
        <TouchableWithoutFeedback
        underlayColor={BACKGROUND_COLOR}
        onPress={this._onRecordPressed}
        disabled={this.state.isLoading}>
        <View style={this.state.isRecording ? styles.stopRecording : styles.startRecording }>
        <Image style={styles.recordButton} source={this.state.isRecording ? ICON_RECORDING.module : ICON_RECORD_BUTTON.module} />
        </View>
        </TouchableWithoutFeedback>
        </View>
        </View>
      }
      </View>
      </View>
      </View>
    )
  }
}

const styles = StyleSheet.create({
  recordButtonContainer: {
    width: 85,
    height: 85,
    alignSelf: 'center',
    position: 'absolute',
    zIndex: 999
  },
  stopRecording: {
    width: '100%',
    height: '100%',
    backgroundColor: 'white',
    borderRadius: 80,
    borderWidth: 5,
    borderColor: 'white',
  },
  startRecording: {
    width: 85,
    height: 85,
    backgroundColor: '#FF5454',
    borderRadius: 80,
    borderWidth: 5,
    borderColor: 'white',
  },
  recordButton: {
    width: '100%',
    height: '100%',
  },
});
