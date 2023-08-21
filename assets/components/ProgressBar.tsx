import React, { useContext } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import themeContext from '../theme/themeContext';
import Ionicons from '@expo/vector-icons/Ionicons';

const ProgressBar = ({ valueA, valueB }) => {
  const theme = useContext(themeContext);
  const total = valueA + valueB;
  const percentA = Math.round((valueA / total) * 100);
  const percentB = Math.round((valueB / total) * 100);

  const colA = theme.theme == 'light' ? '#ae00ef' : "#28a24b";
  const colE = theme.theme == 'light' ? '#7a7a7a' : "#9e2121";

  const styles = StyleSheet.create({
    container: {
      height: 20,
      borderRadius: 10,
      backgroundColor: colE,
    },
    bar: {
      height: '100%',
      borderRadius: 10,
      top: 0,
      left: 0,
    },
    labelContainer: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      paddingHorizontal: 10,
    },
    labelE: {
      color: colE,
      fontFamily: 'MADETOMMY'
    },
    labelA: {
      color: colA,
      fontFamily: 'MADETOMMY'
    }
  });

  return (
    <View>
      <View style={styles.labelContainer}>
        <View style={{flexDirection: 'row', alignItems: 'center'}}>
          <Ionicons name="checkmark-circle" size={25} color={colA} style={{marginRight: 5}}/>
          <Text style={{fontFamily: 'MADETOMMY', fontSize: 25, color: colA}}>{`${valueA}`}</Text>
        </View>

        <View style={{flexDirection: 'row', alignItems: 'center'}}>
          <Ionicons name="remove-circle" size={25} color={colE} style={{marginRight: 5}}/>
          <Text style={{fontFamily: 'MADETOMMY', fontSize: 25, color: colE}}>{`${valueB}`}</Text>
        </View>
      </View>

      <View style={styles.container}>
        <View style={[styles.bar, { width: `${percentA}%`, backgroundColor: colA }]} />

        <View style={styles.labelContainer}>
          <Text style={styles.labelA}>{`${percentA}% Acerto`}</Text>
          <Text style={styles.labelE}>{`${percentB}% Erro`}</Text>
        </View>
      </View>
    </View>
  );
};

export default ProgressBar;