import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import HomeScreen from './components/screens/HomeScreen';
import SignUpScreen from "./components/screens/SignUpScreen";
import LogInScreen from './components/screens/LogInScreen';
import InviteFriends from './components/invite/InviteFriends';
import LogIn from './components/trial/LogIn';
import SignUp from './components/trial/SignUp';

const Stack = createNativeStackNavigator();


export default function App() {
  return(
    <NavigationContainer>
      <Stack.Navigator initialRouteName="LogIn">
        <Stack.Screen options = {{headerShown: false}} name="Login" component={LogInScreen} />
        <Stack.Screen options = {{headerShown: false}} name="Signup" component={SignUpScreen} />
        <Stack.Screen name="HomeScreen" component={HomeScreen} />
        <Stack.Screen options = {{headerShown: false}} name="LogIn" component={LogIn} /> 
        <Stack.Screen options = {{headerShown: false}} name="SignUp" component={SignUp} />
        <Stack.Screen options = {{headerShown: false}} name="Invite" component={InviteFriends} /> 
        
        
      </Stack.Navigator>
    </NavigationContainer>
  )
}






