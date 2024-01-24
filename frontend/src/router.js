import { createBrowserRouter, createRoutesFromElements, Route } from "react-router-dom";
import App from "./App";
import LoginPage from "./pages/LoginPage";
import NoteList from "./pages/NotesPage";
import SigninPage from "./pages/SigninPage";

const router = createBrowserRouter(
  createRoutesFromElements(
    <Route path="/" element={<App />}>
      <Route path="/" element={<NoteList/>} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/signin" element={<SigninPage/>} />
    </Route>
  )
);

export default router;