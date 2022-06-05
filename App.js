import { StyleSheet, Text, View,Button } from 'react-native';
import { useState } from 'react';
import { Avatar } from '@rneui/themed';
import * as ImagePicker from 'expo-image-picker';

export default function App() {
  const[image, setImage] = useState(null);

  const handleImagePicker = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.All,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    if (!result.cancelled) {
      setImage(result.uri);
    }
  };

  const uploadImage = async () => {
    const data = new FormData();
    data.append('file', {
      uri: image,
      name: 'image.jpg',
      type: 'image/jpg',
      });
    data.append('upload_preset', 'UploadPreset');

    const response = await fetch('https://api.cloudinary.com/v1_1/CloudName/image/upload', {
      method: 'POST',
      body: data,
    });

    const responseData = await response.json();

    if(response.ok) {
      console.log("-----UPLOAD SUCCESS-----");
      console.log("URL for API: ",("v"+responseData.version+"/"+responseData.public_id+"."+responseData.format));
      console.log("full URL: ",responseData.secure_url);
    }else{
      console.log("-----UPLOAD FAILED-----");
      console.log("Error: ",responseData.error);
    }
  };
    
  return (
    <View style={styles.container}>
      {image && <Avatar size={100} rounded source={{ uri: image }} />}
      <Button title='Pick an Image' onPress={() =>handleImagePicker()} />
      <Button title='Upload Image' onPress={() =>uploadImage()} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
