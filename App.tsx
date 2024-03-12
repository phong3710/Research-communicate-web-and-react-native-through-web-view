import React, {useRef, useState} from 'react';
import {
  Button,
  Dimensions,
  SafeAreaView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import {WebView, WebViewMessageEvent} from 'react-native-webview';

const DIMENSION = {
  width: Dimensions.get('screen').width,
  height: Dimensions.get('screen').height / 2,
};
function App(): React.JSX.Element {
  const webViewRef = useRef<WebView>(null);
  const [textString, setTextString] = useState('');

  /**
   *  Handle receive post message in native
   * @param event
   */
  const onMessage = (event: WebViewMessageEvent) => {
    const value = String(event.nativeEvent.data);
    setTextString(value);
  };

  /**
   * Function send post message original JS
   */
  const INJECTED_JAVASCRIPT = `(function() {
    window.postMessage("${textString}", "*");
  })();`;

  /**
   * Function receive post message in parent HTML and send post message
   */
  const INJECTED_JAVASCRIPT_RECEIVE = `(function() {
    window.addEventListener('message', event => {
      window.ReactNativeWebView.postMessage(event.data);
    }, true);
  })();`;

  const onPress = () => {
    webViewRef.current?.injectJavaScript(INJECTED_JAVASCRIPT);
  };

  return (
    <SafeAreaView>
      <Text style={styles.title}>Integration Webview</Text>
      <View style={styles.webViewContainer}>
        <WebView
          scrollEnabled={false}
          ref={webViewRef}
          javaScriptEnabled
          source={require('./assets/parent-index.html')}
          onMessage={onMessage}
          injectedJavaScriptBeforeContentLoaded={INJECTED_JAVASCRIPT_RECEIVE}
        />
      </View>
      <View style={styles.nativeContainer}>
        <Text style={styles.textNative}>
          Enter the text to send post message
        </Text>
        <TextInput
          style={styles.input}
          value={textString}
          onChangeText={setTextString}
        />
      </View>
      <Button color={'red'} title="SUBMIT" onPress={onPress} />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  title: {
    fontSize: 20,
    textAlign: 'center',
    marginTop: 20,
  },
  webViewContainer: {
    width: DIMENSION.width,
    height: DIMENSION.height,
  },
  nativeContainer: {
    gap: 10,
  },
  textNative: {
    textAlign: 'center',
  },
  input: {
    height: 30,
    borderRadius: 10,
    borderWidth: 1,
    width: DIMENSION.width - 60,
    alignSelf: 'center',
    paddingHorizontal: 10,
  },
});

export default App;
