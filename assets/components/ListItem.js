import React, { useContext } from 'react';
import { Image, TouchableOpacity } from 'react-native';
import { View, Text, StyleSheet } from 'react-native';

import themeContext from '../theme/themeContext';

import Ionicons from '@expo/vector-icons/Ionicons';
import { AuthContext } from '../context/AuthContext';
import { QuestionContext } from '../context/QuestionContext';

export default function ListItem({icon, title, n, mode, filter}) {
    const theme = useContext(themeContext);

    const {questionMode, setQuestionMode, questionFilter, setFilter, findQuestion} = useContext(QuestionContext);

    const styles = StyleSheet.create({
        container: {
            flexDirection: 'row',
            alignItems: 'center',
            flex: 1
        }
    });

    return (
        <View style={{
            flex: 1,
            flexDirection: "row",
            justifyContent: "space-between",
            alignItems: "center",
            marginBottom: 20,
        }}>
            <View style={styles.container}>
                <TouchableOpacity style={{
                    flex: .9,
                    alignItems: "center",
                    alignSelf: "center",
                    margin: 5,
                    backgroundColor: theme.backgroundColor,
                    borderColor: theme.borderColor,
                    padding: 5,
                    borderWidth: 2,
                    borderRadius: 5,
                }}> 
                    <Ionicons name={icon} size={40} color={theme.mainCol} />
                </TouchableOpacity>
            </View>

            <View style={{
                flex: 2,
                flexShrink: 1,
                justifyContent: "flex-start",
                alignSelf: "center"
            }}>
                <Text style={{
                    fontFamily: "MADETOMMY",
                    fontSize: 15,
                    color: theme.tColor
                }}>
                    {title}
                </Text>
            </View>

            <TouchableOpacity onPress={() => {
                setQuestionMode(mode);
                setFilter(filter);
                console.log(`${mode} e ${filter}`)
                findQuestion(mode, filter, n);
            }} style={{
                backgroundColor: theme.mainCol,
                padding: 10,
                width: 90,
                borderRadius: 10
            }}>
                <Text style={{
                    fontFamily: "MADETOMMY",
                    textAlign: "center",
                    color: "#fff",
                    fontSize: 15
                }}>Iniciar</Text>
            </TouchableOpacity>
        </View>
    )
};