import React, {useState} from 'react';
import {Button, StyleSheet, TouchableOpacity, View} from 'react-native';
import AwesomeAlert from 'react-native-awesome-alerts';

export default function AlertBox({s}) {
    console.log(s);
    return (
        <AwesomeAlert show={s} message="oi" />
    )
};