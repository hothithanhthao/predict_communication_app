import React from 'react';
import { StyleSheet, Animated, View, Alert, Text } from 'react-native';
import StepsDisplay from '../components/StepsDisplay'

import Image_Picker from '../components/image_picker/ImagePicker';
import LoadingSpinner from '../components/loading/loader';
import HomeButton from '../components/buttons/HomeButton';
import NavButtons from '../components/buttons/NavButtons';

import API from '../api';

class PhotoInputScreen extends React.Component {
  constructor(props) {
    super(props);
    jsonData = require('../data/textData.json');
    this.state = {
      image: null,
      loading: false,
      showImageHelp: false,
      resultEmail: null,
      result: null,
      fadeAnim: new Animated.Value(1),
    };
  }

  setImage = (image_url) => {
    this.setState({ image: image_url });
  }

  validateImage = () => {
    return this.state.image;
  }

  validateInput = () => {
    let testing = false;
    if (!testing) {
    if (this.validateImage()) {
      this.setState({ loading: true }, () => {
      let uri = this.state.image;
      let uriParts = uri.split('.');
      let fileType = 'jpg';
      let formData = new FormData();
      formData.append('photo', {
        uri,
        name: `photo.${fileType}`,
        type: `image/${fileType}`,
      });
      var headers = {
        "Accept": "application/json",
        "Content-Type": "multipart/form-data",
        "Access-Control-Allow-Origin": "*"
      };
      API.post(`face`, formData, {headers: headers})
      .then((res) => {
        this.setState({ result: res.data }, () => {
          console.log(this.state.result);
          if (this.state.result['results']['Afwachtend'] < 10 && this.state.result['results']['Dominant'] < 10 && this.state.result['results']['Formeel'] < 10 && this.state.result['results']['Informeel'] < 10) {
            Alert.alert(
              jsonData.error,
              jsonData.photo_failed,
              [
                {text: jsonData.try_again, onPress: () => {
                  this.setState({loading: false});
                  this.setState({image: null});
                }},
              ],
            );
          } else {
              this.props.navigation.navigate('Recording', {resultEmail: this.state.resultEmail, resultImage: this.state.result});
          }
        });
      }).catch((err) => {
        Alert.alert(
          jsonData.error,
          jsonData.bug_report + err,
          [
            {text: 'Ga Terug', onPress: () => {
              this.setState({loading: false});
              this.setState({image: null});
            }},
          ],
        );
      });
    });
  } else {
      if (!this.validateImage()) {
        Alert.alert(
          jsonData.error,
          jsonData.bug_report
        );
      }
     }
    } else {
      this.props.navigation.navigate('Recording', {resultImage: null});
    }
  }

  fadeOut() {
    this.state.fadeIn.setValue(1)
    Animated.timing(
       this.state.fadeIn,
       {
         toValue: 0,
         duration: 3000,
       }
    ).start();
  }

  componentWillMount() {
    this.setState({resultEmail: this.props.navigation.getParam('resultEmail', null)});
  }

  render() {
    const loading = this.state.loading;
    if (!loading) {
      return (
        <View style={styles.container}>
        <HomeButton navigation={this.props.navigation} />
        <View style={styles.innerContainer}>
            <View style={styles.titleContainer}>
              <Text style={styles.title}>{jsonData.photo}</Text>
            </View>
            <View style={styles.subtitleContainer}>
              <Text style={styles.subtitle}>{jsonData.enter_photo}</Text>
            </View>
            <View style={{width: '100%', minHeight: '60%', justifyContent: 'center', alignItems: 'center'}}>
              <Image_Picker style={{top: '10%'}} getImageUrl={this.setImage}/>
            </View>
            { this.state.image ?
              <NavButtons navigation={this.props.navigation} navNext={false} customOnPress={this.validateInput} />
              :
              <NavButtons navigation={this.props.navigation} nextDisabled={true} navNext={false} customOnPress={() => {}} />
            }

        </View>
        <StepsDisplay stepIndex = {2}/>
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
  },
  subtitle: {
    fontSize: 18,
    color: 'white',
    textAlign: 'center',
  },
});

export default PhotoInputScreen;
