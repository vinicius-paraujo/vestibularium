import React, { useState, useEffect, useContext } from 'react';
import { useInterstitialAd, TestIds } from 'react-native-google-mobile-ads';
import { QuestionContext } from '../context/QuestionContext';

const ShowAd = ({ showAd, onAdClosed }) => {
  console.log("component show ad");
  const { setSolvedCount } = useContext(QuestionContext);

  const { isLoaded, isClosed, load, show } = useInterstitialAd("ca-app-pub-5154506787646486/7531245668", {
    requestNonPersonalizedAdsOnly: true,
  });

  const [adDisplayed, setAdDisplayed] = useState(false);

  useEffect(() => {
    if (showAd && isLoaded && !adDisplayed) {
      show();
      setAdDisplayed(true);
      setSolvedCount(0);
    }
  }, [showAd, isLoaded, show, adDisplayed]);

  useEffect(() => {
    if (isClosed) {
      setAdDisplayed(false);
      onAdClosed && onAdClosed();
    }
  }, [isClosed, onAdClosed]);

  useEffect(() => {
    load();
  }, [load]);

  return null;
};

export default ShowAd;