import { StatusBar } from "expo-status-bar";
import React, { useState, useEffect } from "react";
import {
  StyleSheet,
  Text,
  SafeAreaView,
  TouchableOpacity,
  ImageBackground,
} from "react-native";
import Auth, { eraseUserData, getUserData } from "./screens/Auth";
import { Root } from "native-base";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import Navbar from "./screens/Navbar/Navbar";

export default function App() {
  const [isAuth, setIsAuth] = useState(false);
  const [showUpload, setShowUpload] = useState(false);

  const setAuth = () => {
    setIsAuth(true);
  };

  const disconnect = () => {
    setIsAuth(false);
  };

  useEffect(() => {
    getUserData().then((value) => {
      if (value !== "null" && value !== null) setAuth();
    });
  }, []);

  function WelcomeScreen({ navigation }) {
    return (
      <ImageBackground
        style={styles.background}
        source={require("./assets/welcome.png")}
      >
        <TouchableOpacity
          style={styles.loginButton}
          onPress={() => navigation.navigate("Authentification")}
        >
          <Text>Login</Text>
        </TouchableOpacity>
      </ImageBackground>
    );
  }

  function AuthScreen() {
    return <Root>{!isAuth && <Auth setAuth={setAuth} />}</Root>;
  }

  const Stack = createStackNavigator();
  return (
    <Root>
      {!isAuth && (
        <>
          <NavigationContainer>
            <Stack.Navigator
              initialRouteName="Welcome"
              screenOptions={{ headerShown: false }}
            >
              <Stack.Screen name="Welcome" component={WelcomeScreen} />
              <Stack.Screen name="Authentification" component={AuthScreen} />
            </Stack.Navigator>
          </NavigationContainer>
        </>
      )}
      {isAuth && (
        <SafeAreaView style={styles.container}>
          <TouchableOpacity
            onPress={() => eraseUserData().then(disconnect())}
            style={styles.t}
          >
            <Text>Logout</Text>
          </TouchableOpacity>
          <Navbar />
        </SafeAreaView>
      )}
    </Root>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "white",
    justifyContent: "center",
    paddingTop: Platform.OS === "android" ? StatusBar.currentHeight : 0,
  },

  t: {
    alignItems: "center",
    justifyContent: "center",
  },

  loginButton: {
    width: "80%",
    marginBottom: 20,
    height: 70,
    backgroundColor: "#1cb36c",
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 10,
  },
  background: {
    flex: 1,
    justifyContent: "flex-end",
    alignItems: "center",
  },
});
