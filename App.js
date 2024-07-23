import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
// import LogInScreen from './components/screens/LogInScreen';
// import HomeScreen from './components/screens/HomeScreen';
// import LogIn from "./components/screens/SignUp";
import SignUp from "./components/screens/SignUp";
import LogIn from './components/screens/LogIn';
// import Invite from "./components/InviteFriends";

const Stack = createNativeStackNavigator();


export default function App() {
  return(
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen options = {{headerShown: false}} name="Signup" component={SignUp} />
        <Stack.Screen  name="Login" component={LogIn} />
        {/* <Stack.Screen name="Home" component={HomeScreen} /> */}
      </Stack.Navigator>
    </NavigationContainer>
  )
}






