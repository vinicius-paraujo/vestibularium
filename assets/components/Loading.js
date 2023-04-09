import React from 'react';
import { View, Text, Image } from 'react-native';

export function LoadingScreen() {
    return (
        <View style={{
            justifyContent: "center",
            alignItems: "center",
            flex: 1
        }}>
        <Image source={require("../adaptive-icon.png")} style={{
            width: 200,
            height: 200
        }} />
        </View>
    )
}