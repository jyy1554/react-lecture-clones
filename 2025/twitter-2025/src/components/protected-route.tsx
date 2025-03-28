import { Navigate } from "react-router-dom";
import { auth } from "../firebase";

export default function ProtectedRoute({children}: {children:React.ReactNode;}) {
  const user = auth.currentUser;  // firebase.ts에서 가져온 것

  if(user === null) {
    return <Navigate to="/login" />
  }
  return children;
}