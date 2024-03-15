/* eslint-disable react/react-in-jsx-scope */
import {useRef, useState} from 'react';
import {
  SafeAreaView,
  Text,
  View,
  TextInput,
  Button,
  StyleSheet,
  DimensionValue,
} from 'react-native';
import WebView, {WebViewMessageEvent, WebViewProps} from 'react-native-webview';

interface Props extends WebViewProps {
  width?: DimensionValue;
  height?: DimensionValue;
}

export const WebViewNative = ({
  source,
  width = '100%',
  height = 200,
  ...rest
}: Props) => {
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
    
    window.postMessage(
      {
        action: 'msg',
        data: "${textString}"
      },
      '*',
    );
  })();`;

  /**
   * Function receive post message in parent HTML and send post message
   */
  const INJECTED_JAVASCRIPT_RECEIVE = `(function() {
    window.addEventListener('message', event => {
      window.ReactNativeWebView.postMessage(event.data);
    }, true);
  })();`;

  /**
   * Run JS logic when press button
   */
  const onPress = () => {
    webViewRef.current?.injectJavaScript(INJECTED_JAVASCRIPT);
  };

  return (
    <SafeAreaView>
      <Text style={styles.title}>Integration Webview</Text>
      <View style={{width, height}}>
        <WebView
          ref={webViewRef}
          javaScriptEnabled
          source={source}
          onMessage={onMessage}
          injectedJavaScriptBeforeContentLoaded={INJECTED_JAVASCRIPT_RECEIVE}
          {...rest}
        />
      </View>
      <View style={styles.nativeContainer}>
        <Text style={styles.textNative}>
          Enter the text to send post message
        </Text>
        <TextInput
          style={[styles.input]}
          value={textString}
          onChangeText={setTextString}
        />
      </View>
      <Button color={'red'} title="SUBMIT" onPress={onPress} />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  title: {
    fontSize: 20,
    textAlign: 'center',
    marginTop: 20,
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
    width: '50%',
    alignSelf: 'center',
    paddingHorizontal: 10,
  },
});
