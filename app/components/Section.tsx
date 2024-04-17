import React from 'react';
import type {PropsWithChildren} from 'react';
import {StyleSheet, Text, useColorScheme, View} from 'react-native';
import {Colors} from 'react-native/Libraries/NewAppScreen';

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
  ibmPlexBold: {
    fontFamily: 'IBMPlexMono-Bold',
    fontSize: 36,
  },
  ibmPlexMedium: {
    fontFamily: 'IBMPlexMono-Medium',
    fontSize: 20,
  },
});

export default Section;
