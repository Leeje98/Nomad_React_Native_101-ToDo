import { StatusBar } from "expo-status-bar";
import { useState } from "react";
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  TouchableHighlight,
  TouchableWithoutFeedback,
  Pressable,
  TextInput,
} from "react-native";
// TouchableOpacity : 누르는 순간 투명하게 애니메이션을 준다 - 투명도 조절 가능
// TouchableHighlight : 누르는 순간 옵션을 이용하여 애니메이션을 다양하게 줄 수 있다
// TouchableWithoutFeedback : 누르는 순간을 인식하나 UI(화면)상으론 아무것도 하지 않는다
// Pressable : 누르는 순간의 상호작용 / 엄지손가락의 부피를 고려하여 글자주변을 터치해도 인식 되도록 한다(new)
import { theme } from "./colors";

export default function App() {
  const [working, setWorking] = useState(true);
  const [text, setText] = useState("");
  const [toDos, setToDos] = useState({});
  const travel = () => setWorking(false);
  const work = () => setWorking(true);
  const onChangeText = (payload) => setText(payload); // 페이로드는 전송되는 데이터 자체를 지칭 / JSON형태
  const addToDo = () => {
    if (text === "") {
      return; // 비어있다면 아무것도 하지않고 반환
    }
    const newToDos = Object.assign(  // Object.assign : 객체를 합치는 기능
      {},   // 비어있는 오브젝트(기준)
      toDos, {  // 기존 객체
      [Date.now()]: { text, work: working },  // 새로운 객체
      // [Date.now()]:key | text: value | work: working : 할일인지 여행인지 카테고리구분 
    });
    setToDos(newToDos);
    setText(""); // 인풋란 비워주기
  };
  console.log(toDos);
  return (
    <View style={styles.container}>
      <Text>Open up App.js to start working on your app!</Text>
      <StatusBar style="auto" />
      <View style={styles.header}>
        <TouchableOpacity onPress={work}>
          <Text
            style={{ ...styles.btnText, color: working ? "white" : theme.grey }}
          >
            Work
          </Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={travel}>
          <Text
            style={{
              ...styles.btnText,
              color: !working ? "white" : theme.grey,
            }}
          >
            Travel
          </Text>
        </TouchableOpacity>
      </View>
      <TextInput
        onSubmitEditing={addToDo}
        onChangeText={onChangeText}
        // returnKeyType='done'  // 리턴키의 모양을 결정
        returnKeyLabel="previous" // 리턴키의 모양을 결정(안드로이드) // 왜인지모르겠지만 적용안됨
        value={text}
        // placeholderTextColor='blue'
        // returnKeyType='send'
        // keyboardType="number-pad"  // 키보드 번호타입
        placeholder={working ? "Add a To Do" : "Where do you want to go?"}
        style={styles.input}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.bg,
    paddingHorizontal: 20,
  },
  header: {
    justifyContent: "space-between",
    flexDirection: "row",
    marginTop: 50,
  },
  btnText: {
    fontSize: 38,
    fontWeight: "600",
  },
  input: {
    backgroundColor: "white",
    paddingVertical: 10, // 패딩 수직
    paddingHorizontal: 20, //  패딩 가로
    borderRadius: 30,
    fontSize: 18,
  },
});
