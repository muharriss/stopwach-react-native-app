import React from "react";
import { SafeAreaView, Text, View, StyleSheet } from "react-native";
import Stopwatch from "./page/Stopwatch";
import PushNotif from "./page/PushNotif";

const App = () =>  {
  return (
    <View >
      <Stopwatch/>
      {/* <PushNotif/> */}
    </View>
  );
}

export default App;
