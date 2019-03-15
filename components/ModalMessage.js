import React, { Component } from 'react';
import {Modal,TouchableHighlight, StyleSheet, View, ScrollView, Button,TouchableOpacity, TouchableWithoutFeedback, Text } from 'react-native';

export default class ModalMessage extends Component {
  constructor(props) {
    super(props);
    this.state = {
      title : this.props.title,
      description : this.props.description,
      buttonText : this.props.buttonText,
      modalVisible: false,
    }

  }
  setModalVisible = (visible) => {
    this.setState({modalVisible: visible});
  }

  render() 
  {
    let activeOpacity = 0.8;

    return (
      <Modal
      animationType="slide"
      transparent={true}
      visible={this.state.modalVisible}
      onRequestClose={() => {
        this.setModalVisible(false);
      }}>
      <View style={styles.modal}>
        <View style={{position: 'absolute',  top: '2%'}}>
          <Text style={styles.ResultFont}>{this.state.title}</Text>
          </View>
            <ScrollView  style={{position: 'absolute', top: '12%', height: '75%'}}>
              <ScrollView>
                <TouchableWithoutFeedback>
                  <View>
                    <Text style={styles.normalTextStyle}>{this.state.description}</Text>
                  </View>
                </TouchableWithoutFeedback>
              </ScrollView>
            </ScrollView>
          <View style={{ position: 'absolute',  bottom: 0}}>
            <TouchableHighlight activeOpacity={activeOpacity}
                onPress={() => {this.setModalVisible(!this.state.modalVisible);}}>
              <View style = {styles.buttonStyle}>
                <Text style={styles.headerTextStyle}>{this.state.buttonText}</Text>
              </View>
            </TouchableHighlight>
          </View>
        </View>
      </Modal>
    )
  }

}
const styles = StyleSheet.create({
  modal: {
    position: 'relative',
    flex: 1,
    backgroundColor: '#7553A8',
    borderRadius: 35, 
    alignItems: 'center',
    marginVertical: 22,
    marginHorizontal: 22,
        
    shadowColor: "#000",
  
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.15,
    shadowRadius: 3.84,
    elevation: 5,
  },

  ResultFont: {
    fontFamily: 'segoeUI',
    fontWeight: 'bold',
    fontSize: 30,
    margin: 5,
    color: "white",
    textAlign: 'center'
  },

  normalTextStyle: {
    fontFamily: 'segoeUI',
    fontWeight: 'normal',
    fontSize: 18,
    margin: 10,
    color: "white",
    textAlign: 'center'
  },

  headerTextStyle: {
    fontFamily: 'segoeUI',
    fontWeight: 'bold',
    fontSize: 20,
    margin: 10,
    color: "white",
    textAlign: 'center'
  },

  buttonStyle: {
    paddingTop: 0,
    paddingBottom: 0, 
    paddingRight: 5, 
    paddingLeft: 5, 
    borderRadius: 100, 
    borderColor: "#5AAF41", 
    backgroundColor:"#5AAF41", 
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
