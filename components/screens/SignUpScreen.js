import { useState } from 'react';

import AuthContent from '../Authenticate/ContentAuth';
import LoadingOverlay from '../ui/LoadingOverlay';
import { createUser } from '../util/auth';

function Signup() {
  const [isAuthenticating, setIsAuthenticating] = useState(false);

  async function signupHandler({ email, name,  password }) {
    setIsAuthenticating(true);
    await createUser(email, name, password);
    setIsAuthenticating(false);
  }

  if (isAuthenticating) {
    return <LoadingOverlay message="Creating user..." />;
  }

  return <AuthContent onAuthenticate={signupHandler} />;
}

export default Signup;