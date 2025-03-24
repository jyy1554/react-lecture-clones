import React, { useEffect, useState } from "react";
import AppRouter from "./Router";
import { authService } from "../fbase";
import { onAuthStateChanged, updateProfile } from "firebase/auth";

function App() {
    const [init, setInit] = useState(false);
    const [userObj, setUserObj] = useState(null);
    const [newDisplayName, setNewDisplayName] = useState(""); //displayName 렌더링을 위한 state

    useEffect(() => {
        onAuthStateChanged(authService, (user) => {
            if (user) {
                setUserObj(user);
            } else {
                setUserObj(null);
            }
            setInit(true);
        });
    }, []);
    const refreshUser = () => {
        setNewDisplayName(userObj.displayName);
    };

    return (
        <div>
            {init ? (
                <AppRouter
                    refreshUser={refreshUser}
                    isLoggedIn={Boolean(userObj)}
                    userObj={userObj}
                />
            ) : (
                "Initializing..."
            )}
        </div>
    );
}

export default App;
