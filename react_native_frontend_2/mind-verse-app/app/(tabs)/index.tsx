import {StyleSheet, TextInput, Button, Alert, ScrollView} from 'react-native';

import EditScreenInfo from '@/components/EditScreenInfo';
import { Text, View } from '@/components/Themed';
import {useState} from "react";

export default function TabOneScreen() {
  const [entry, setEntry] = useState('');
  const [emotions, setEmotions] = useState<Array<{label: String, score: Number}>>([]);

    const handleSubmit = async () => {
        try {
            console.log("Starting requestik")

            const response = await fetch('http://192.168.0.109:8000/classify', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ text: entry }),
            });

            console.log("Response:", response);

            const data = await response.json();

            console.log("Response:", data);
            setEmotions(data.results); // assuming backend returns { emotions: ... }

            Alert.alert('Success', 'Journal entry sent successfully!');
        } catch (error) {
            console.error('Error sending entry:', error);
            Alert.alert('Error', 'Failed to send entry.');
        }
    };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>Tab One</Text>
      <Text style={styles.title}>Amogus</Text>
      <Text style={styles.title}>You entered: { entry }</Text>
        <Text>Amogus</Text>
      <Text style={styles.title}>Your emotion analysis: { emotions.map(emotion => `${emotion.label} - ${emotion.score.toFixed(5)} \n`) }</Text>
      {/* Input field */}
      <TextInput
          style={styles.input}
          placeholder="Type your journal entry..."
          value={entry}
          onChangeText={setEntry}
      />


        {/* Submit button */}
        <View style={styles.buttonContainer}>
            <Button title="Send Entry" onPress={handleSubmit} />
        </View>
      <View style={styles.separator} lightColor="#eee" darkColor="rgba(255,255,255,0.1)" />
      <EditScreenInfo path="app/(tabs)/index.tsx" />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  input: {
    width: '80%',
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 8,
    padding: 10,
    marginTop: 20,
    color: 'white'
  },
  buttonContainer: {
    marginTop: 20,
    width: '100%',
  },
  separator: {
    marginVertical: 30,
    height: 1,
    width: '80%',
  },
});
