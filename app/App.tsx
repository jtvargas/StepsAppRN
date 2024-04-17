/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 */

import React from 'react';
import {
  SafeAreaView,
  StatusBar,
  StyleSheet,
  useColorScheme,
  View,
  Button,
} from 'react-native';
import {Colors} from 'react-native/Libraries/NewAppScreen';

// Hooks
import useHealthKit from './hooks/useHealthKit';

// Components
import Section from '@app/components/Section';

function App(): React.JSX.Element {
  const isDarkMode = useColorScheme() === 'dark';
  const {stepsCount, walkingDistance, isAvailable, refreshData} =
    useHealthKit();

  const backgroundStyle = {
    backgroundColor: isDarkMode ? Colors.darker : Colors.lighter,
    flex: 1,
  };

  return (
    <SafeAreaView style={backgroundStyle}>
      <StatusBar
        barStyle={isDarkMode ? 'light-content' : 'dark-content'}
        backgroundColor={backgroundStyle.backgroundColor}
      />
      <View
        style={[
          styles.healthStatusContainer,
          {backgroundColor: isDarkMode ? Colors.darker : Colors.lighter},
        ]}>
        <Section title="Steps Today">{stepsCount}</Section>
        <Section title="Distance Walking">
          {walkingDistance?.toFixed?.(2)} mile
        </Section>

        <Button onPress={refreshData} title="Refresh" />
      </View>
      <Section title="Health Kit Available?">{`${isAvailable}`}</Section>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  healthStatusContainer: {
    justifyContent: 'center',
    flex: 1,
  },
});

export default App;
