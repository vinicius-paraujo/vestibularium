// react
import React, { useContext, useEffect, useState } from 'react';
import { StyleSheet, Text, View, ScrollView, TouchableOpacity, Image, ActivityIndicator, Modal, SafeAreaView } from 'react-native';

// expo
import Ionicons from '@expo/vector-icons/Ionicons';
import { StatusBar } from 'expo-status-bar';

import themeContext from '../theme/themeContext';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { NextQuestion } from '../components/NextQuestion';
import { QuestionContext } from '../context/QuestionContext';
import ImageViewer from 'react-native-image-zoom-viewer';

export function Question({route, navigation}) {
  const theme = useContext(themeContext);
  const { questionData } = useContext(QuestionContext);

  // about the question
  const [response, setResponse] = useState(null);
  const [alertaQ, setAlertQ] = useState(false);

  const [userData, setDataUser] = useState({});
  const [imgData, setImgData] = useState(null);
  const [rating, setURating] = useState(0);
  const [finalTiming, setFinalTiming] = useState("");

  const [isVisible, setIsVisible] = useState(false);
  // cronômetro
  const [seconds, setSeconds] = useState(0);
  const [minutes, setMin] = useState(0);
  const [hours, setHours] = useState(0);
  const [isRunning, setRunning] = useState(false);
  const [intervalId, setIntervalId] = useState(undefined);

  const getUserData = async () => {
    console.log(route.mode);
    const u = await AsyncStorage.getItem("userData");
    const u2 = await AsyncStorage.getItem("userRating");

    const udata = JSON.parse(u);
    setDataUser(udata);
    setURating(JSON.parse(u2));
  };

  const startTime = () => {
    const id = setInterval(() => {
      changeTime();
    }, 1000);
    setIntervalId(id);
  };

  useEffect(() => {
    return () => {
      clearInterval(intervalId);
    };
  }, [intervalId]);

  const stopTimer = () => {
    if (intervalId) {
      clearInterval(intervalId);
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
        flex: .2,
        justifyContent: 'center',
        alignItems: "center",
        alignSelf: 'center',
      },
      left: {
        flex: 1,
        width: '105%',
        alignItems: "center",
        justifyContent: 'center',
      },
  });

  function showQ() {
    function formatarString(str) {
      var regex = /[A-za-z]\)\s?/gi;
      var partes = [];
      var resultado = "";

      if (regex.test(str.substring(0, 3))) {
        partes = str.split(regex);
        resultado = "";

        for (var i = 0; i < partes.length; i++) {
          if (partes[i].length > 0) {
            var letra = String.fromCharCode(64 + i); // Obter a letra correspondente usando o código ASCII
            resultado += "|" + letra + ": " + partes[i].trim(); // Remover espaços em branco adicionais com trim()
          }
        }

        resultado = resultado.substring(1); // Remover o primeiro "|" que é adicionado em excesso
        return resultado;
      } else {
        partes = str.split(/\s+/g); // separamos a string em partes (palavras)
        resultado = ""; // aqui será armazenado o resultado final
        
        for (var i = 0; i < partes.length; i++) {
          if (/[A-Z]/.test(partes[i].charAt(0))) {
            resultado += "|" + partes[i].charAt(0) + ":" + partes[i].substring(1);
          } else {
            resultado += " " + partes[i];
          }
        }
        return resultado.substring(1);
      }
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
            <View style={{}}>
              <Text style={{
                fontFamily: 'MADETOMMY',
                fontSize: 15,
                textAlign: 'justify',
                color: theme.tColor
              }}>
                {texto}
              </Text>
              <Text style={{
                fontFamily: 'MADETOMM|Y',
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
    let e;

    if (sep[4] && sep[4].includes("E:")) {
      e = sep[4].split("E:");
    }

    // para questões da uece
    if (typeof a[1] === 'string' && a[1].startsWith(")")) {
      const conteudo = a[1].substring(a[1].indexOf(")") + 1); // obtém o conteúdo após o ")"
      const novaString = `${conteudo}`; // reescreve o conteúdo em uma nova string
      a[1] = novaString;
    }

    if (typeof b[1] === 'string' && b[1].startsWith(")")) {
      const conteudo = b[1].substring(b[1].indexOf(")") + 1); // obtém o conteúdo após o ")"
      const novaString = `${conteudo}`; // reescreve o conteúdo em uma nova string
      b[1] = novaString;
    }

    if (typeof c[1] === 'string' && c[1].startsWith(")")) {
      const conteudo = c[1].substring(c[1].indexOf(")") + 1); // obtém o conteúdo após o ")"
      const novaString = `${conteudo}`; // reescreve o conteúdo em uma nova string
      c[1] = novaString;
    }

    if (typeof d[1] === 'string' && d[1].startsWith(")")) {
      const conteudo = d[1].substring(d[1].indexOf(")") + 1); // obtém o conteúdo após o ")"
      const novaString = `${conteudo}`; // reescreve o conteúdo em uma nova string
      d[1] = novaString;
    }

    if (e && typeof e[1] === 'string' && e[1].startsWith(")")) {
      const conteudo = a[1].substring(e[1].indexOf(")") + 1); // obtém o conteúdo após o ")"
      const novaString = `${conteudo}`; // reescreve o conteúdo em uma nova string
      e[1] = novaString;
    };

    const image = {
      url: questionData.image && imgData && questionData.image,
      width: imgData && imgData.width, // largura da imagem
      height: imgData && imgData.height // altura da imagem
    }

    const handleImagePress = () => {
      setIsVisible(true);
    }

    return(
        <View>
          {questionData.image !== null && imgData !== null && 
          <View>
            <View style={{flex: 1}}>
              <TouchableOpacity onPress={handleImagePress}>
                <Image resizeMode='contain' style={{width:  imgData.width > 500 ? imgData.width*.4 : imgData.width*.60, height: imgData.height*.60, justifyContent: 'center', alignSelf: 'center', marginBottom: 10}} source={{ uri: questionData.image }} />
              </TouchableOpacity>
            </View>

            <Modal visible={isVisible} transparent={true}>
              <ImageViewer
              imageUrls={[image]}
              onCancel={() => setIsVisible(false)}
              onClick={() => setIsVisible(false)}
              enableSwipeDown={true}
              enablePreload={true}
              loadingRender={() => <ActivityIndicator />}
              />
            </Modal>
          </View>
          }
          {formatarString2(questionData.texto)}


          <View style={{flexDirection: "column", flex: 1}}>
            <TouchableOpacity key={1+100} onPress={async () => {
                setResponse("A");
                setAlertQ(true);
                setFinalTiming(`${hours}:${minutes}:${seconds}`)
                stopTimer();
            }} style={styles.buttonStyle}>
              <Text style={styles.textButton}>A){a}</Text>
            </TouchableOpacity>

            <TouchableOpacity key={25} onPress={() => {
                setResponse("B");
                setAlertQ(true);
                setFinalTiming(`${hours}:${minutes}:${seconds}`)
                stopTimer();
            }} style={styles.buttonStyle}>
              <Text style={styles.textButton}>B){b}</Text>
            </TouchableOpacity>

            <TouchableOpacity key={26} onPress={() => {
                setResponse("C");
                setAlertQ(true);
                setFinalTiming(`${hours}:${minutes}:${seconds}`)
                stopTimer();
            }} style={styles.buttonStyle}>
              <Text style={styles.textButton}>C){c}</Text>
            </TouchableOpacity>

            <TouchableOpacity key={27} onPress={() => {
                setResponse("D");
                setAlertQ(true);
                setFinalTiming(`${hours}:${minutes}:${seconds}`)
                stopTimer();
            }} style={styles.buttonStyle}>
              <Text style={styles.textButton}>D){d}</Text>
            </TouchableOpacity>

            {e &&
            <TouchableOpacity key={28} onPress={() => {
              setResponse("E");
                setAlertQ(true);
                setFinalTiming(`${hours}:${minutes}:${seconds}`)
                stopTimer();
            }} style={styles.buttonStyle}>
              <Text style={styles.textButton}>E){e}</Text>
            </TouchableOpacity>
            }
          </View>
        </View>
    )
  }

  return (
      <SafeAreaView style={styles.container}>
        {finalTiming !== "" && <NextQuestion navigation={navigation} route={route} userData={userData} certa={questionData.certa} questionId={questionData.id} response={response} setResponse={setResponse} alertaQ={alertaQ} setAlertQ={setAlertQ} time={finalTiming} />}
        
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
      </SafeAreaView>
  );
}