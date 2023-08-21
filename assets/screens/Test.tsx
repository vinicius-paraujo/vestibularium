import React, { useEffect, useState } from 'react';
import { View, Button } from 'react-native';
import { useInterstitialAd, TestIds } from 'react-native-google-mobile-ads';

export default function Test({ navigation }) {
  const { isLoaded, isClosed, load, show } = useInterstitialAd(TestIds.INTERSTITIAL, {
    requestNonPersonalizedAdsOnly: true,
  });
  const [buttonPressCount, setButtonPressCount] = useState(0);
  const [adDisplayed, setAdDisplayed] = useState(false);

  useEffect(() => {
    // Start loading the interstitial straight away
    load();
  }, [load]);

  useEffect(() => {
    if (buttonPressCount % 5 === 0 && isLoaded && !adDisplayed) {
      show();
      setAdDisplayed(true);
    }
  }, [buttonPressCount, isLoaded, show, adDisplayed]);

  useEffect(() => {
    if (isClosed) {
      setAdDisplayed(false);
      navigation.navigate('Home');
    }
  }, [isClosed, navigation]);

  return (
    <View>
      <Button
        title="Navigate to next screen"
        onPress={() => {
          setButtonPressCount(buttonPressCount + 1);
        }}
      />
    </View>
  );
}