import React from 'react';
import { StyleSheet, View, Image, Text, TouchableOpacity } from 'react-native';

class HomeScreen extends React.Component {
  constructor(props) {
    jsonData = require('../data/textData.json');
    super(props);
  }

  render() {
    const activeOpacity = 0.8;
      return (
        <View style={styles.container}>
         <View style={styles.innerContainer}>
            <View style={styles.logoContainer}>
              <Image style={styles.logo} source={require('../assets/images/logo_wortell.png')} />
            </View>
            <View style={styles.titleContainer}>
              <Text style={styles.title}>{jsonData.title}</Text>
            </View>
            <View style={styles.subtitleContainer}>
              <Text style={styles.subtitle}>{jsonData.description}</Text>
            </View>
            <View style={styles.buttonContainer}>
              <TouchableOpacity activeOpacity={activeOpacity} style={styles.button} title='Start Test' onPress={() => {this.props.navigation.navigate('EmailInput')}}>
                <Text style={styles.buttonText}>{jsonData.start_test}</Text>
              </TouchableOpacity>
            </View>
          </View>
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
  innerContainer: {
    position: 'absolute',
    width: '95%',
    height: '95%',
    backgroundColor: '#ffffff',
    margin: 'auto',
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'flex-start',
  },
  logoContainer: {
    marginTop: 10,
    alignItems: 'center',
    marginBottom: 15,
  },
  logo: {
    maxWidth: '40%',
    resizeMode: 'contain',
  },
  titleContainer: {
    alignItems: 'center',
    maxWidth: '95%',
    marginBottom: 5,
  },
  title: {
    fontFamily: 'segoeUI',
    color: '#5AAF41',
    fontSize: 32,
    fontWeight: 'bold',
    textAlign: 'center'
  },
  subtitleContainer: {
    alignItems: 'center',
    maxWidth: '95%',
  },
  subtitle: {
    fontFamily: 'segoeUI',
    color: '#5AAF41',
    fontSize: 18,
    textAlign: 'center'
  },
  buttonContainer: {
    width: '80%',
    height: '55%',
  },
  button: {
    position: 'absolute',
    backgroundColor: '#7553A8',
    borderRadius: 25,
    width: '100%',
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
    bottom: 5,
    shadowColor: "#000",
    shadowOffset:
    {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.15,
    shadowRadius: 3.84,
    elevation: 5,
  },
  buttonText: {
    color: 'white',
    fontFamily: 'segoeUI',
    textAlign: 'center',
    fontSize: 22,
    fontWeight: 'bold'
  }
});

export default HomeScreen;
