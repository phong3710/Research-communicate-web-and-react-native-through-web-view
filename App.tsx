import React from 'react';
import {Dimensions, StyleSheet, View} from 'react-native';
import {WebViewNative} from './component/WebViewNative';

const DIMENSION = {
  width: Dimensions.get('screen').width,
  height: Dimensions.get('screen').height - 250,
};

function App(): React.JSX.Element {
  const {width, height} = DIMENSION;
  return (
    <View style={styles.container}>
      <WebViewNative
        source={require('./assets/html/parent-index.html')}
        width={width}
        height={height}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    gap: 10,
  },
});

export default App;
