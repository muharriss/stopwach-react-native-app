import { StyleSheet, Text, View, TextInput, TouchableWithoutFeedback, Keyboard, TouchableOpacity, Image, Alert } from 'react-native'
import React, { useState, useEffect, useRef } from 'react'

import NotifService from '../../NotifService';


const Stopwatch = () => {
  const [time, setTime] = useState(0);
  const [running, setRunning] = useState(false);
  const [isTimer, setIsTimer] = useState(false)
  const [limit, setLimit] = useState('')
  const [isLoop, setIsLoop] = useState(false)
  const textInputRef = useRef(null)
  const [textValue, setTextValue] = useState('')


  const [registerToken, setRegisterToken] = useState('')
  const [fcmRegistered, setFcmRegistered] = useState(false)

  const onRegister = (token) => {
    setRegisterToken(token.token)
    setFcmRegistered(true)
  }

  const onNotif = (notif) => {
    Alert.alert(notif.title, notif.message)
  }


  useEffect(() => {
    const notif = new NotifService(onRegister, onNotif)
    let notificationSent = false;

    if (isTimer) {
      let interval;
      if (running) {
        interval = setInterval(() => {
          setTime(prevTime => {
            if (isLoop) {
              if (prevTime <= 0) {
                return limit;
              } else {
                return prevTime - 1
              }
            } else {
              // if (prevTime <= 0) {
              //   setRunning(false)
              //   setLimit('')
              //   notif.localNotif();
              //   return 0
              // } else {
              //   return prevTime - 1
              // }

              if (prevTime <= 0 && !notificationSent) {
                notif.localNotif();
                notificationSent = true;
              }
              return prevTime - 1;
            }
          });
        }, 1000);
      } else {
        clearInterval(interval);
      }

      return () => clearInterval(interval);
    } else {
      let interval;
      if (running) {
        interval = setInterval(() => {
          setTime(prevTime => prevTime + 100);
        }, 100);
      } else {
        clearInterval(interval);
      }

      return () => clearInterval(interval);
    }

  }, [running]);

  const startStop = () => {
    Keyboard.dismiss()
    if (isTimer) {
      if (limit == '' || limit == 0 || isNaN(limit) || limit % 1 !== 0 || time == 0) {
        setRunning(false)
        setLimit('')
      } else {
        setRunning(!running)
      }
    } else {
      setRunning(!running);
    }
  };

  const reset = () => {
    setTime(0);
    setLimit('')
    setRunning(false);
    setTextValue('')
  };

  const stopwatch = () => {

    if (isTimer) {
      setIsTimer(false)
      setTime(0)
      setLimit('')
      setTextValue('')
      setRunning(false)
      Keyboard.dismiss()
    }

  }

  const timer = () => {
    if (!isTimer) {
      setIsTimer(true)
      setTime(0)
      setLimit('')
      setRunning(false)

      setTimeout(() => {
        if (textInputRef.current) {
          textInputRef.current.focus();
        }
      }, 100)
    }

  }

  const loop = () => {
    setIsLoop(!isLoop)
  }

  const handlePressOutside = () => {
    Keyboard.dismiss()
  };

  const formatTimeTimer = (time) => {
    const isNegative = time < 0;
    time = Math.abs(time); // Mengambil nilai absolut waktu

    const hours = Math.floor(time / 3600);
    const minutes = Math.floor((time % 3600) / 60);
    const seconds = time % 60;

    const formattedHours = hours.toString().padStart(2, '0');
    const formattedMinutes = minutes.toString().padStart(2, '0');
    const formattedSeconds = seconds.toString().padStart(2, '0');

    // Jika waktu negatif, tambahkan tanda minus
    const sign = isNegative ? '-' : '';

    return `${sign}${formattedHours}.${formattedMinutes}.${formattedSeconds}`;
  };

  const formatTime = milliseconds => {
    const hours = Math.floor(milliseconds / (1000 * 60 * 60));
    const minutes = Math.floor((milliseconds % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((milliseconds % (1000 * 60)) / 1000);
    const millisecondsFormatted = Math.floor((milliseconds % 1000) / 10);

    // return `${pad(hours)}:${pad(minutes)}:${pad(seconds)}:${pad(millisecondsFormatted)}`;
    return time >= 3600000 ? `${pad(hours)}.${pad(minutes)}.${pad(seconds)}.${pad(millisecondsFormatted)}` : `${pad(minutes)}.${pad(seconds)}.${pad(millisecondsFormatted)}`
  };

  const pad = number => {
    if (number < 10) {
      return '0' + number;
    }
    return number;
  };

  // const [textHours, textMinutes, textSeconds] = formatTimeTimer(time).split('.').map(Number)
  // console.log(textValue.length)

  return (
    <TouchableWithoutFeedback onPress={handlePressOutside}>
      <View style={styles.wrapper}>
        <TouchableOpacity style={{ position: 'absolute', top: 20, right: 20, opacity: 0.7 }} onPress={() => Alert.alert('Info', '~This application was created by me;)\nhttps://muharris.vercel.app\n\nemail:\nmuhharris04@gmail.com')}>
          <Image source={require('../../assets/icon/infoIcon.png')}  />
        </TouchableOpacity>
        {isTimer && (
          <TouchableOpacity onPress={loop} style={styles.loopIconWtapper} disabled={running ? true : false} >
            <View>
              <Image style={styles.loopIcon} source={isLoop ? require('../../assets/icon/repeaticon.png') : require('../../assets/icon/repeaticondark.png')} />
            </View>
          </TouchableOpacity>
        )}
        {isTimer ?
          <TouchableWithoutFeedback onPress={() => { textInputRef.current.focus(), setRunning(false) }} disabled={running ? true : false}>
            {/* {running ? <Text style={styles.count}>{formatTimeTimer(time)}</Text> :
              <View style={{ flexDirection: 'row', position: 'relative' }}>
                <View style={{ width: textValue.length == 6? 0 : 5, height: 5, backgroundColor: '#a6a6a6', position: 'absolute', top: 0, right: textValue.length == 0 ? 9 : textValue.length == 1 ? 32 : textValue.length == 2 ? 63 : textValue.length == 3 ? 86 : textValue.length == 4 ? 117 : textValue.length == 5 ? 139 : 139  }} />
                <Text style={styles.count}>{pad(textHours)}</Text>
                <Text style={{ fontSize: 40, color: 'white', fontWeight: '300' }}>.</Text>
                <Text style={styles.count}>{pad(textMinutes)}</Text>
                <Text style={{ fontSize: 40, color: 'white', fontWeight: '300' }}>.</Text>
                <Text style={styles.count}>{pad(textSeconds)}</Text>
              </View>
            } */}
            <View style={{ flexDirection: 'row', position: 'relative' }}>
              {
                !running && (
                  <View style={{ width: textValue.length == 6 ? 0 : 5, height: 5, borderRadius: 20, backgroundColor: '#a6a6a6', position: 'absolute', top: 0, right: textValue.length == 0 ? 15 : textValue.length == 1 ? 49 : textValue.length == 2 ? 97 : textValue.length == 3 ? 130 : textValue.length == 4 ? 177 : textValue.length == 5 ? 211 : 211 }} />
                )
              }
              <Text style={styles.count}>{formatTimeTimer(time)}</Text>
            </View>

            {/* <Text style={styles.count}>{formatTimeTimer(time)}</Text> */}
            {/* <Text style={styles.count}>{pad(textHours)}.{pad(textMinutes)}.{pad(textSeconds)}</Text> */}
          </TouchableWithoutFeedback>
          :
          <Text style={styles.count}>{formatTime(time)}</Text>
        }



        {/* <Text style={styles.count}>{isTimer ? formatTimeTimer(time) : formatTime(time)}</Text> */}

        {isTimer && (
          <View style={{ position: 'relative' }}>
            <View style={{ position: 'absolute', width: 92, height: 55, zIndex: 2 }} />
            <TextInput
              placeholder='Set the timer!'
              placeholderTextColor='black'
              style={styles.input}
              onChangeText={text => {
                // setLimit(text)
                // setTime(text % 1 !== 0 ? 0 : text > 359999 ? 359999 : text)

                // setTime(text % 1 !== 0 ? 0 : text)


                // // Hanya proses input yang berupa angka
                const sanitizedText = text.replace(/\D/g, ''); // Hapus semua karakter non-digit

                // Ambil 6 karakter pertama dari input
                const inputHours = sanitizedText.substring(4, 6);
                const inputMinutes = sanitizedText.substring(2, 4);
                const inputSeconds = sanitizedText.substring(0, 2);

                const formattedTime = `${inputHours.padStart(2, '0')}:${inputMinutes.padStart(2, '0')}:${inputSeconds.padStart(2, '0')}`;

                const [hours, minutes, seconds] = formattedTime.split(':').map(Number);
                const totalSeconds = (hours * 3600) + (minutes >= 59 ? 59 * 60 : minutes * 60) + (seconds >= 59 ? 59 : seconds)

                setLimit(totalSeconds)
                setTime(text % 1 !== 0 || text.includes('.') ? 0 : totalSeconds)
                setTextValue(text)

                // console.log(inputSeconds.length)

                // const one = sanitizedText.substring(0, 1)
                // const two = sanitizedText.substring(1, 2)
                // const three = sanitizedText.substring(2, 3)
                // const four = sanitizedText.substring(3, 4)
                // const five = sanitizedText.substring(4, 5)
                // const six = sanitizedText.substring(5, 6)

                // setInputText1(one == 0 ? 0 : one)
                // setInputText2(two == 0 ? 0 : two)
                // setInputText3(three == 0 ? 0 : three)
                // setInputText4(four == 0 ? 0 : four)
                // setInputText5(five == 0 ? 0 : five)
                // setInputText6(six == 0 ? 0 : six)

              }}
              value={textValue % 1 !== 0 || textValue.includes('.') ? setTextValue('') : textValue}
              inputMode='numeric'
              onPressIn={() => setRunning(false)}
              ref={textInputRef}
              maxLength={6}
            // editable={false}
            />
          </View>
        )}
        <View style={styles.btnStartResetWrapper}>
          <TouchableOpacity onPress={startStop}>
            <View style={styles.btnStartReset}>
              <Text style={styles.textBtnStartReset}>{running ? 'Stop' : 'Start'}</Text>
            </View>
          </TouchableOpacity>
          <TouchableOpacity onPress={reset}>
            <View style={styles.btnStartReset}>
              <Text style={styles.textBtnStartReset}>Reset</Text>
            </View>
          </TouchableOpacity>
        </View>
        <View style={styles.btnModeWrapper}>
          <TouchableOpacity onPress={stopwatch} disabled={running ? true : false}>
            <View >
              <Text style={isTimer ? styles.textBtn : styles.btnActive}>Stopwatch</Text>
            </View>
          </TouchableOpacity>
          <TouchableOpacity onPress={timer} disabled={running ? true : false}>
            <View >
              <Text style={isTimer ? styles.btnActive : styles.textBtn}>Timer</Text>
            </View>
          </TouchableOpacity>
        </View>
      </View>
    </TouchableWithoutFeedback>
  )

}

export default Stopwatch

const styles = StyleSheet.create({
  wrapper: {
    backgroundColor: 'black',
    width: '100%',
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
  },
  loopIconWtapper: {
    marginBottom: 24,
  },
  loopIcon: {
    height: 30,
    width: 30,

  },
  count: {
    fontSize: 60,
    color: 'white',
    fontWeight: '300',
    marginBottom: 200,

  },
  input: {
    textAlign: 'center',
    color: 'black',
    opacity: 0,
    marginTop: 6,
    // backgroundColor:'red',
    // marginBottom: 200,

  },
  buttonWrapper: {
    marginTop: 20,
    gap: 20,
    flexDirection: 'row',
  },
  btnStartResetWrapper: {
    flexDirection: 'row',
    gap: 30,
    position: 'absolute',
    bottom: "15%",
    zIndex: 3
  },
  btnStartReset: {
    justifyContent: 'center',
    alignItems: 'center',
    width: 100,
    height: 46,
    backgroundColor: '#8A2BE2',
    borderRadius: 100
  },
  textBtnStartReset: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 17,
  },
  btnModeWrapper: {
    flexDirection: 'row',
    gap: 20,
    position: 'absolute',
    bottom: '7%',
    zIndex: 3
  },
  btnActive: {
    borderBottomWidth: 2,
    borderBottomColor: 'white',
    color: 'white',
    fontSize: 17,
  },
  textBtn: {
    color: '#a6a6a6',
    fontSize: 17,
  },
  displayNone: {
    display: "none"
  }
})