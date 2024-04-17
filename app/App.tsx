/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 */

import React from 'react';
import type {PropsWithChildren} from 'react';
import {
  SafeAreaView,
  StatusBar,
  StyleSheet,
  Text,
  useColorScheme,
  View,
  Button,
} from 'react-native';
import {Colors} from 'react-native/Libraries/NewAppScreen';

// Hooks
import useHealthKit from './hooks/useHealthKit';

type SectionProps = PropsWithChildren<{
  title: string;
}>;

function Section({children, title}: SectionProps): React.JSX.Element {
  const isDarkMode = useColorScheme() === 'dark';
  return (
    <View style={styles.sectionContainer}>
      <Text
        style={[
          styles.ibmPlexMedium,
          styles.sectionTitle,
          {
            color: isDarkMode ? Colors.white : Colors.black,
          },
        ]}>
        {title}
      </Text>
      <Text
        style={[
          styles.ibmPlexBold,
          styles.sectionDescription,
          {
            color: isDarkMode ? Colors.light : Colors.dark,
          },
        ]}>
        {children}
      </Text>
    </View>
  );
}

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
  sectionContainer: {
    marginTop: 32,
    paddingHorizontal: 24,
    justifyContent: 'center',
    textAlignVertical: 'center',
    alignItems: 'center',
  },
  sectionTitle: {
    fontSize: 24,
  },
  sectionDescription: {
    marginTop: 8,
    fontSize: 36,
  },
  healthStatusContainer: {
    justifyContent: 'center',
    flex: 1,
  },
  highlight: {
    fontWeight: '700',
  },
  ibmPlexBold: {
    fontFamily: 'IBMPlexMono-Bold',
    fontSize: 36,
  },
  ibmPlexRegular: {
    fontFamily: 'IBMPlexMono-Regular',
    fontSize: 20,
  },
  ibmPlexMedium: {
    fontFamily: 'IBMPlexMono-Medium',
    fontSize: 20,
  },
});

export default App;
