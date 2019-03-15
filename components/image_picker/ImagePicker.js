import React, { Component } from 'react';
import { StyleSheet, Text, View, Image, Button, TouchableOpacity, Alert } from 'react-native';
import { ImagePicker, Permissions } from 'expo';

import Icon from '../Icon.js';

const CAMERA_ICON = new Icon(require('../../assets/images/camera-icon.png'), 1, 1 );

export default class Image_Picker extends Component {
  constructor(props) {
    super(props);
    jsonData = require('../../data/textData.json');

    this.state = {
      image: null,
      placeholder: require('../../assets/images/person-placeholder.jpg'),
    };
  }

  _askPermissionCamera = async () => {
    const { CAMERA_status } = await Permissions.askAsync(Permissions.CAMERA);
    if (CAMERA_status !== 'granted') {
      await Permissions.askAsync(Permissions.CAMERA);
    }
  }

  _askPermissionCameraRoll = async () => {
    const { CAMERA_ROLL_status } = await Permissions.askAsync(Permissions.CAMERA_ROLL);
    if (CAMERA_ROLL_status !== 'granted') {
      await Permissions.askAsync(Permissions.CAMERA_ROLL);
    }
  }

  _askPermissions = async () => {
    this._askPermissionCamera();
    this._askPermissionCameraRoll();
  }

  _pickImage = async () => {
    const { status, expires, permissions } = await Permissions.getAsync(Permissions.CAMERA, Permissions.CAMERA_ROLL);
    if (status !== 'granted') {
      this._askPermissions();
    } else {
      Alert.alert(
        jsonData.choose_photo,
        jsonData.select_photo,
        [
          {text: 'Galerij', onPress: async () => {
            let result = await ImagePicker.launchImageLibraryAsync({
              mediaTypes: ImagePicker.MediaTypeOptions.Images,
              allowsEditing: true,
              aspect: [3, 3],
            });
            if (!result.cancelled) {
              this.setState(
                {
                  image: result.uri
                }, () => {
                  this.props.getImageUrl(this.state.image);
                });
              }
            }},
            {text: 'Camera', onPress: async () => {
              let result = await ImagePicker.launchCameraAsync({
                mediaTypes: ImagePicker.MediaTypeOptions.Images,
                allowsEditing: true,
                aspect: [3, 3],
              });
              if (!result.cancelled) {
                this.setState(
                  {
                    image: result.uri
                  }, () => {
                    this.props.getImageUrl(this.state.image);
                  });
                }
              }}
            ]
          );
        }
      }

      render() {
        let { image } = this.state;
        const activeOpacity = 0.8;
        return (
          <View style={styles.container}>
          <View style={{flexDirection:'row-reverse'}}>
          <View style={styles.placeholder}>
          {!image ?
            (<Image source={this.state.placeholder} style={styles.image} />)
            :
            (<Image source={{ uri: image }} style={styles.image} />)}
            <TouchableOpacity onPress={this._pickImage} style={styles.pickImage} activeOpacity={activeOpacity}>
            <Image style={styles.cameraIcon} source={CAMERA_ICON.module}  />
            </TouchableOpacity>
            </View>
            </View>
            </View>
          );
        }
      }

      const styles = StyleSheet.create({
        container: {
          padding: 10,
          paddingBottom: 30,
          alignItems: "flex-start"
        },
        placeholder: {
          width: 200,
          height: 200,
          marginTop: 10,
        },
        image: {
          width: 200,
          height: 200,
          borderRadius: 100,
        },
        pickImage: {
          position: 'absolute',
          zIndex: 999,
          bottom: 0,
          right: 0,
          padding: 10,
          backgroundColor: '#7553A8',
          borderRadius: 100
        },
        cameraIcon: {
          width: 50,
          height: 50
        }
      });
