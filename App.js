import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import HomeScreen from './components/screens/HomeScreen';
import SignUpScreen from "./components/screens/SignUpScreen";
import LogInScreen from './components/screens/LogInScreen';
import InviteFriends from './components/invite/InviteFriends';

const Stack = createNativeStackNavigator();


export default function App() {
  return(
    <NavigationContainer>
      <Stack.Navigator>
       
        <Stack.Screen options = {{headerShown: false}} name="Login" component={LogInScreen} />
        <Stack.Screen  options = {{headerShown: false}} name="Signup" component={SignUpScreen} />
        <Stack.Screen name="Home" component={HomeScreen} />
        <Stack.Screen options = {{headerShown: false}} name="Invite" component={InviteFriends} />
      </Stack.Navigator>
    </NavigationContainer>
  )
}






