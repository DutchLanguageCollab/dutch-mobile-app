import React, { useState } from "react";
import { Icon, Button, Card, Layout, Text, Input } from "@ui-kitten/components";
import { View, StyleSheet } from "react-native";
import { Audio } from "expo-av";
import yes from "../assets/correct.mp3";
import no from "../assets/wrong.mp3";
import md5 from "md5";
import * as FileSystem from "expo-file-system";
import { Asset } from 'expo-asset';

export default function QuestionBox(props: any) {
  //console.log(pain);
  let title: string = (props.hardMode ? "What is being said here?" : "Is it " + props.options[0] + " or " + props.options[1] + "?");
  //const shuffledOptions: string[] = props.options.sort(() => Math.random() - 0.5);
  //let titleEasy: string = "Is it " + props.options[0] + " or " + props.options[1] + "?";
  //let titleHard:string = "What is being said here";
  const [answered, setAnswered] = React.useState(0);
  const [correct, setCorrect] = React.useState();
  const [sound, setSound] = React.useState();
  const [inputText, setInputText] = React.useState("");

  const STAAL = require("../assets/audiofiles/Nl-staal.mp3");

  console.log(STAAL);
  const audioDir = FileSystem.documentDirectory;
  const generateurl = (option: string) => {
    let filename: string = "nl-" + option + ".ogg";
    let url: string = "https://upload.wikimedia.org/wikipedia/commons/" + md5(filename).substring(0, 1) + "/" + md5(filename).substring(0, 2) + "/" + filename;
    return (url);
  }




  //  const loc: string = '../assets/audiofiles/' + filename;

  async function buzz(input: string) {
    if (input === props.antwoord) {
      //const { correct } = await Audio.Sound.createAsync(
      //  require('../assets/correct.mp3')
      //);
      //} else {
      //  const { correct } = await Audio.Sound.createAsync(
      //    require('../assets/wrong.mp3')
      //  );
      //}
      //setCorrect(correct);
      //console.log(correct);
      //await correct.playAsync();

      const yes = new Audio.Sound();
      try {
        await yes.loadAsync(require('../assets/correct_soft.mp3'), false);
        await yes.playAsync();
        console.log('palyin correct');
        //await yes.unloadAsync();
        console.log('unload correct');
      } catch (error) {
        console.log(error);
      }
    } else {
      const no = new Audio.Sound();
      try {
        await no.loadAsync(require('../assets/wrong_softer.mp3'), false);
        await no.playAsync();
        console.log('palyin wrong');
        //await yes.unloadAsync();
        console.log('unload wrong');
      } catch (error) {
        console.log(error);
      }

    }

  }

  async function playSound(option: string) {
    //const { sound } = await Audio.Sound.createAsync(
    //  { uri: audioDir + "Nl-" + option + ".ogg" },
    // {uri: generateURL(option)}
    //);
    const { sound } = await Audio.Sound.createAsync(
      { uri: FileSystem.cacheDirectory + "audio/" + "Nl-" + option + ".ogg" }
    );
    setSound(sound);
    console.log('playin sound');
    await sound.playAsync();
  }

  React.useEffect(() => {
    return sound
      ? () => {
        console.log('Unloading Sound');
        sound.unloadAsync();
      }
      : undefined;
  }, [sound]);


  React.useEffect(() => {
    return correct
      ? () => {
        console.log('Unloading Sound');
        correct.unloadAsync();
      }
      : undefined;
  }, [correct]);
  //  let ding = new Audio(yes);
  //  let dong = new Audio(no);
  //  const buzzer = (option) => {
  //    (option === props.antwoord) ? ding.play() : dong.play();
  //  }

  const Header: any = () => (
    <View {...props}>
      <Text category='h6'>  {props.mode === 'spelling' ? title : "Which one is " + props.antwoord + "?"} </Text>
    </View>
  );

  const SoundIcon = (props) => (
    <Icon {...props} name='volume-up' />
  );
  const subIcon = (props) => (
    <Icon {...props} name='corner-down-left' />
  );

  const modeSwitch = () => {
    switch (props.mode) {
      case 'spelling':
        //return (<View><Text>spelling</Text></View>);
        return (
          <Card header={Header} style={{ height: 200, width: 350 }}>
            <View style={{ flex: 1, flexDirection: 'column', alignItems: 'center' }}>
              <Button style={{ height: 60 }} onPress={() => { playSound(props.antwoord) }} appearance='ghost' accessoryLeft={SoundIcon} />
              {spelling()}
            </View>
          </Card>
        );

      case 'pronunciation':
        console.log('pronuncase: ' + props.mode);
        return (
          <Card header={Header} style={{ height: 200, width: 350 }}>
            <View style={{ height: 100 }}>
              {pronunciation()}
            </View>
          </Card>
        );
      default:
        console.log("default case: " + props.mode);
        console.log(props.mode);
        return (<View><Text> Something went wronggg</Text></View>);
    }
  };

  const pronunciation = () => {
    return (
      <>
        <View style={{ flex: 1, flexDirection: 'row', alignItems: 'center' }}>
          <Button style={{ height: 60 }} onPress={() => { playSound(props.options[0]) }} appearance='ghost' accessoryLeft={SoundIcon} />
          <Button onPress={() => {
            props.selected(+(props.options[0] === props.antwoord))
            buzz(props.options[0])
          }}>1</Button>
        </View>
        <View style={{ flex: 1, flexDirection: 'row', alignItems: 'center' }}>
          <Button style={{ height: 60 }} onPress={() => { playSound(props.options[1]) }} appearance='ghost' accessoryLeft={SoundIcon} />
          <Button onPress={() => {
            props.selected(+(props.options[1] === props.antwoord))
            buzz(props.options[1])
          }}>2</Button>
        </View>
      </>
    );
  };

  const spelling = () => {
    if (props.hardMode) {
      console.log("hardmode spelling");
      return (
        <View style={{ flex: 1, flexDirection: 'row' }}>
          <Input
            placeholder='...'
            value={inputText}
            onChangeText={nextValue => setInputText(nextValue)}
            style={{ width: 180 }}
          />
          <Button
            accessoryLeft={subIcon}
            onPress={() => {
              let inp: string = inputText.trim().toLowerCase();
              props.selected(+(inp === props.antwoord));
              buzz(inp)
              console.log(inp + "<- input answer -> " + props.antwoord);
            }}
            style={{ marginRight: 'auto' }}
          />
        </View>
      );
    } else {
      return (
        <View style={{ flex: 1, flexDirection: 'row' }}>
          <Button
            // className="answerBtn"
            onPress={() => {
              props.selected(+(props.options[0] === props.antwoord));
              setAnswered(1);
              buzz(props.options[0]);
            }
            }
          >
            {props.options[0]}
          </Button>
          <Button
            //className="answerBtn"
            onPress={() => {
              props.selected(+(props.options[1] === props.antwoord));
              setAnswered(2);
              buzz(props.options[1]);
            }
            }
          >
            {props.options[1]}
          </Button>
        </View>
      );
    }
  };

  return (
    <Layout style={styles.topContainer} level='1' >
      {modeSwitch()}
    </Layout>
  );
};

const styles = StyleSheet.create({
  topContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  card: {
    flex: 1,
    margin: 2,
  },
  footerContainer: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
  },
  footerControl: {
    marginHorizontal: 2,
  },
});
