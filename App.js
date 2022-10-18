import AsyncStorage from "@react-native-async-storage/async-storage";

import { StatusBar } from "expo-status-bar";
import { useEffect, useState } from "react";
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  TouchableHighlight,
  TouchableWithoutFeedback,
  Pressable,
  TextInput,
  ScrollView,
  Alert,
} from "react-native";
// TouchableOpacity : 누르는 순간 투명하게 애니메이션을 준다 - 투명도 조절 가능
// TouchableHighlight : 누르는 순간 옵션을 이용하여 애니메이션을 다양하게 줄 수 있다
// TouchableWithoutFeedback : 누르는 순간을 인식하나 UI(화면)상으론 아무것도 하지 않는다
// Pressable : 누르는 순간의 상호작용 / 엄지손가락의 부피를 고려하여 글자주변을 터치해도 인식 되도록 한다(new)
import { theme } from "./colors";
import { Fontisto } from '@expo/vector-icons';

const STORAGE_KEY = "@toDos";

export default function App() {
  const [working, setWorking] = useState(true);
  const [text, setText] = useState("");
  const [toDos, setToDos] = useState({});
  useEffect(() => {
    loadToDos();
  }, []);
  const travel = () => setWorking(false);
  const work = () => setWorking(true);
  const onChangeText = (payload) => setText(payload); // 페이로드는 전송되는 데이터 자체를 지칭 / JSON형태
  const saveToDos = async (toSave) => {
    // 현재 존재하는 toDos를 string으로 변환 // toDos를 toSave라는 형태로 받겠다
    await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(toDos)); // JSON.stringify() 사용하여 오브젝트를 스트링으로 변환한다
  }; // key, value
  const loadToDos = async () => {
    try {
      const s = await AsyncStorage.getItem(STORAGE_KEY);
      // JSON.parse(s)
      // console.log(JSON.parse(s));
      setToDos(JSON.parse(s));
    } catch (e) {
      // saving error
      <Text>error</Text>;
    }
  };

  const addToDo = async () => {
    if (text === "") {
      return; // 비어있다면 아무것도 하지않고 반환
    }
    // const newToDos = Object.assign(  // Object.assign : 객체를 합치는 기능
    //   {},   // 비어있는 오브젝트(기준)
    //   toDos, {  // 기존 객체
    //   [Date.now()]: { text, work: working },  // 새로운 객체
    //   // [Date.now()]:key | text: value | work: working : 할일인지 여행인지 카테고리구분
    // });       // 첫번째 - Object.assign를 사용해서 객체를 추가하는 방법
    const newToDos = {
      ...toDos,
      [Date.now()]: { text, working },
    }; // 두번째 - 스프레드 연산자를 이용해서 객체를 추가하는 방법
    setToDos(newToDos); // 목록 업데이트
    await saveToDos(newToDos); // 저장소 저장
    setText(""); // 인풋란 비워주기
  };

  const deleteToDo = (key) => {
    Alert.alert("Delete To Do", "Are you sure?", [
      { text: "Cancel" },
      {
        text: "I'm Sure",
        style: "destructive",
        onPress: () => {
          const newToDos = { ...toDos };
          delete newToDos[key];
          setToDos(newToDos);
          saveToDos(newToDos);
        },
      },
    ]);
  };

  // console.log(toDos);
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
      <ScrollView>
        {Object.keys(toDos).map(
          (key) =>
            toDos[key].working === working ? (
              <View style={styles.toDo} key={key}>
                <Text style={styles.toDoText}>{toDos[key].text}</Text>
                <TouchableOpacity onPress={() => deleteToDo(key)}>
                  <Fontisto name="trash" size={18} color={theme.gray} />
                </TouchableOpacity>
              </View>
            ) : null // 카테고리별로 항목 노출 하게하는 필터링 기능
        )}
      </ScrollView>
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
    marginVertical: 20,
    fontSize: 18,
  },
  toDo: {
    backgroundColor: theme.grey,
    marginBottom: 10,
    paddingVertical: 20,
    paddingHorizontal: 20,
    borderRadius: 15,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  toDoText: {
    color: "white",
    fontSize: 16,
    fontWeight: "500",
  },
});
