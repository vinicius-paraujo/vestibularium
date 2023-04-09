// react
import React, { createContext, useContext, useState } from 'react';
import { StyleSheet, Text, View, Alert, ScrollView, TouchableOpacity, Image } from 'react-native';

// expo
import Ionicons from '@expo/vector-icons/Ionicons';
import { StatusBar } from 'expo-status-bar';

import themeContext from '../theme/themeContext';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { ErrContext } from '../context/ErrContext';
import { NextQuestion } from '../components/NextQuestion';
import { QuestionContext } from '../context/QuestionContext';

export function Question({route, navigation}) {
  const theme = useContext(themeContext);

  const {questionData} = useContext(QuestionContext);
  // about next question
  const [response, setResponse] = useState(null);
  const [alertaQ, setAlertQ] = useState(false);

  const [userData, setDataUser] = useState({});
  const [imgData, setImgData] = useState(null);
  const [rating, setURating] = useState(0);
  // mysql
  const { errCode, setErrCode, alertShow, setAlert, errMessage, setErrMessage } = useContext(ErrContext);

  // cronômetro
  const [seconds, setSeconds] = useState(0);
  const [minutes, setMin] = useState(0);
  const [hours, setHours] = useState(0);
  const [customInterval, setCustomInterval] = useState();
  const [isRunning, setRunning] = useState();

  const getUserData = async () => {
    console.log(route.mode);
    const u = await AsyncStorage.getItem("userData");
    const u2 = await AsyncStorage.getItem("userRating");

    const udata = JSON.parse(u);
    await setDataUser(udata);
    await setURating(u2);
  };
  const startTime = () => {
    setCustomInterval(
      setInterval(() => {
        changeTime();
      }, 1000),
    )
  }

  const stopTimer = () => {
    if (customInterval) {
      clearInterval(customInterval);
    }
  }

  const clear = () => {
    stopTimer();
    setSeconds(0);
    setMin(0);
  }

  const addMin = () => {
    setMin((prevState) => {
      if (prevState + 1 == 60) {
        setHours((prevState) => {
          if (prevState + 1 == 60) {
            return 0;
          }
          return prevState + 1;
        });
        return 0;
      }
      return prevState + 1;
    })
  }

  const changeTime = () => {
    setSeconds((prevState) => {
      if (prevState + 1 == 60) {
        addMin();
        return 0;
      }
      return prevState + 1;
    })
  };

  if (!isRunning) {
    setRunning(true);
    startTime();
    getUserData();

    if (questionData.image !== null) {
      Image.getSize(questionData.image, (width, height) => {
        setImgData({
          width: width,
          height: height
        })
      });
    }
  }

  // gerar questão com base no rating mais próximo da questão
  var counts = [1, 3, 5, 6, 8, 13, 20, 25],
  goal = 17;

  var closest = counts.reduce(function(prev, curr) {
    return (Math.abs(curr - goal) < Math.abs(prev - goal) ? curr : prev);
  });

  
  // style
  const styles = StyleSheet.create({
    container: {
      flex: 1,
        textAlign: 'right',
        alignSelf: 'center',
        alignItems: 'center',
        flexDirection: 'column',
        justifyContent: 'center',
        position: 'relative',
        padding: 30,
        backgroundColor: theme.backgroundColor
      },
      buttonStyle: {
        flex: 1,
        backgroundColor: theme.mainCol,
        padding: 30,
        justifyContent: "center",
        width: "90%",
        borderRadius: 10,
        margin: 10,
      },
      textButton: {
        color: theme.textButtonColor,
        fontFamily: "MADETOMMY",
        fontSize: 16,
      },
      right: {
        flex: .12,
        justifyContent: 'center',
        alignItems: "center",
        alignSelf: 'center',
      },
      left: {
        flex: 1,
        width: '100%',
        alignItems: "center",
        justifyContent: 'flex-start',
      },
  });

  function showQ() {
    function formatarString(str) {
      var partes = str.split(/\s+/g); // separamos a string em partes (palavras)
      var resultado = ""; // aqui será armazenado o resultado final
      
      for (var i = 0; i < partes.length; i++) {
        if (/[A-Z]/.test(partes[i].charAt(0))) {
          resultado += "|" + partes[i].charAt(0) + ":" + partes[i].substring(1);
        } else {
          resultado += " " + partes[i];
        }
      }
      return resultado.substring(1);
    }

    function formatarString2(str) {
      if (str !== null) {
        // retirar quebras de linhas no texto
        const rQuebraLinha = str.replace(/(\r\n|\n|\r)/gm, " ");
        // caso tenha divisas
        if (rQuebraLinha.includes("|")) {
          var formatado = rQuebraLinha.split("|");

          if (formatado.length <= 3) {
            let texto = formatado[0];
            let rodape = formatado[1];
            let comando = formatado[2];

            return (
            <View>
              <Text style={{
                fontFamily: 'MADETOMMY',
                fontSize: 15,
                textAlign: 'justify',
                color: theme.tColor
              }}>
                {texto}
              </Text>
              <Text style={{
                fontFamily: 'MADETOMMY',
                fontSize: 12,
                textAlign: 'right',
                marginLeft: 15,
                color: theme.tColor
              }}>
                {rodape}
              </Text>
              <Text style={{
                fontFamily: 'MADETOMMY',
                fontSize: 15,
                textAlign: 'justify',
                color: theme.tColor,
                marginTop: 5,
              }}>
                {comando}
              </Text>
              </View>
            )
          }
        // caso não tenha "|"
        } else {
          return (
            <Text style={{
              fontFamily: 'MADETOMMY',
              fontSize: 15,
              textAlign: 'justify',
              color: theme.tColor
            }}>
              {rQuebraLinha}
            </Text>
          )
        }
      }
    }

    let sep1 = formatarString(questionData.alternativas);
    let sep = sep1.split("|");
    let a = sep[0].split("A:");
    let b = sep[1].split("B:");
    let c = sep[2].split("C:");
    let d = sep[3].split("D:");
    let e = sep[4].split("E:");
    return(
        <View>
          {questionData.image !== null && imgData !== null ? <Image style={{width: (imgData.width*.65), height: (imgData.height*.65), justifyContent: 'center', alignSelf: 'center'}} source={{ uri: questionData.image }} /> : null}
          {formatarString2(questionData.texto)}
          <View style={{flexDirection: "column", flex: 1}}>
            <TouchableOpacity key={1+100} onPress={async () => {
                await setResponse("A");
                setAlertQ(true);
                stopTimer();
            }} style={styles.buttonStyle}>
              <Text style={styles.textButton}>A){a}</Text>
            </TouchableOpacity>

            <TouchableOpacity key={25} onPress={() => {
              setResponse("B");
              setAlertQ(true);
              stopTimer();
            }} style={styles.buttonStyle}>
              <Text style={styles.textButton}>B){b}</Text>
            </TouchableOpacity>

            <TouchableOpacity key={26} onPress={() => {
              setResponse("C");
              setAlertQ(true);
              stopTimer();
            }} style={styles.buttonStyle}>
              <Text style={styles.textButton}>C){c}</Text>
            </TouchableOpacity>

            <TouchableOpacity key={27} onPress={() => {
              setResponse("D");
              setAlertQ(true);
              stopTimer();
            }} style={styles.buttonStyle}>
              <Text style={styles.textButton}>D){d}</Text>
            </TouchableOpacity>

            <TouchableOpacity key={28} onPress={() => {
              setResponse("E");
              setAlertQ(true);
              stopTimer();
            }} style={styles.buttonStyle}>
              <Text style={styles.textButton}>E){e}</Text>
            </TouchableOpacity>
          </View>
        </View>
    )
  }

  return (
      <View style={styles.container}>
        <NextQuestion navigation={navigation} route={route} userData={userData} certa={questionData.certa} questionId={questionData.id} response={response} setResponse={setResponse} alertaQ={alertaQ} setAlertQ={setAlertQ} vale={questionData.vale}/>
        <View style={styles.right}>
          <Text style={{fontFamily: "MADETOMMY", color: theme.mainCol, textAlign: 'center'}}>{questionData.origem}</Text>

          <Text style={{textAlign: "left", fontFamily: "MADETOMMY", fontSize: 18, color: theme.tColor}}>{rating}</Text>
          <View style={{
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'center'
          }}>
            <Ionicons name={"time-outline"} size={15} color={theme.tColor} style={{marginRight: 5}} />
            <Text style={{fontFamily: "MADETOMMY", color: theme.mainCol, fontSize: 14}}>
              {hours < 10 ? "0" + hours : hours}:
              {minutes < 10 ? "0" + minutes : minutes}:
              {seconds < 10 ? "0" + seconds : seconds}
            </Text>
          </View>
          
        </View> 

        <View style={styles.left}>
        <ScrollView>
          {showQ()}
        </ScrollView>
        </View>

        <StatusBar style="auto" />
      </View>
  );
}