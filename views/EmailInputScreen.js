import React from 'react';
import { StyleSheet, View, Text, Alert } from 'react-native';

import EmailInput from '../components/forms/EmailInput';
import StepsDisplay from '../components/StepsDisplay'
import LoadingSpinner from '../components/loading/loader';
import HomeButton from '../components/buttons/HomeButton';
import NavButtons from '../components/buttons/NavButtons';

import API from '../api';

class EmailInputScreen extends React.Component {
  constructor(props) {
    super(props);
    jsonData = require('../data/textData.json');
    this.state = {
      email: '',
      result: null,
      loading: false,
    };
  }

  setEmail = (email) => {
    this.setState({ email: email });
  }

  validateEmail = () => {
    let reg = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/ ;
    return reg.test(this.state.email);
  }

  validateInput = () => {
    let testing = false;
    if (!testing) {
      if (this.state.email != '') {
        if (this.validateEmail()) {
          this.setState({ loading: true }, () => {
            API.get('email/' + this.state.email)
            .then((res) => {
              this.setState({resultEmail: res.data}, () => {
                console.log(this.state.resultEmail);
                this.props.navigation.navigate('PhotoInput', {resultEmail: this.state.resultEmail});
              })
            }).catch((err) => {
              Alert.alert(
                jsonData.error,
                jsonData.wortell_email,
                [
                  {text: jsonData.try_again, onPress: () => this.props.navigation.replace('Home')},
                  {text: jsonData.skip, onPress: () => this.props.navigation.navigate('PhotoInput')}
                ],
                { cancelable: false }
              );
            })
          });
        } else {
          Alert.alert(
            jsonData.error,
            jsonData.invalid_email
          );
        }
      } else {
        this.props.navigation.navigate('PhotoInput');
      }
    } else {
      this.props.navigation.navigate('PhotoInput');
    }
  }

  render() {
    const loading = this.state.loading;
    if (!loading) {
      return (
        <View style={styles.container}>
        <HomeButton navigation={this.props.navigation} />
        <View style={styles.innerContainer}>
        <View style={styles.titleContainer}>
        <Text style={styles.title}>{jsonData.email}</Text>
        </View>
        <View style={styles.subtitleContainer}>
        <Text style={styles.subtitle}>{jsonData.enter_email}</Text>
        </View>
        <View style={{width: '100%', minHeight: '60%', justifyContent: 'center', alignItems: 'center'}}>
        <EmailInput style={{top: '10%'}} getEmail={this.setEmail} />
        </View>
        <NavButtons navigation={this.props.navigation} prevDisabled={true} navNext={false} customOnPress={this.validateInput}  />
        </View>
        <StepsDisplay stepIndex={1}/>
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

export default EmailInputScreen;
