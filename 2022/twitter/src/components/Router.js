import React from "react";
import { HashRouter as Router, Routes, Route } from "react-router-dom";
import Auth from "../routes/Auth";
import Home from "../routes/Home";
import Profile from "../routes/Profile";
import Navigation from "./Navigation";

const AppRouter = ({ refreshUser, isLoggedIn, userObj }) => {
    return (
        <Router>
            {isLoggedIn && <Navigation userObj={userObj} />}
            {isLoggedIn ? (
                <div
                    style={{
                        maxWidth: 890,
                        width: "100%",
                        margin: "0 auto",
                        marginTop: 80,
                        display: "flex",
                        justifyContent: "center",
                    }}
                >
                    <Routes>
                        <Route path="/" element={<Home userObj={userObj} />} />
                        <Route
                            path="/profile"
                            element={
                                <Profile
                                    refreshUser={refreshUser}
                                    userObj={userObj}
                                />
                            }
                        />
                        <Route path="*" element={<Auth to="/" replace />} />
                    </Routes>
                </div>
            ) : (
                <Routes>
                    <Route path="/" element={<Auth />} />
                    <Route path="*" element={<Auth to="/" replace />} />
                </Routes>
            )}
        </Router>
    );
};

export default AppRouter;
