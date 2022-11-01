import { useGoogleLogin } from 'react-use-googlelogin';
import * as React from 'react';

const GoogleAuthContext = React.createContext()

// eslint-disable-next-line react/prop-types
export const GoogleAuthProvider = ({ children }) => {
    const googleAuth = useGoogleLogin({
        clientId: '617276136155-9bhnnnuiid1b7ahke2o6ukteto9ke4g5.apps.googleusercontent.com'
    })

    return (
        <GoogleAuthContext.Provider value={googleAuth}>
            {children}
        </GoogleAuthContext.Provider>
    )
}

export const useGoogleAuth = () => React.useContext(GoogleAuthContext)

