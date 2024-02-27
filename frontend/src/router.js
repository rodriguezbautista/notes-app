import { createBrowserRouter, createRoutesFromElements, Route } from "react-router-dom";
import App from "./App";
import LoginPage from "./pages/LoginPage";
import NoteList from "./pages/NotesPage.tsx";
import SigninPage from "./pages/SigninPage";
import Home from "./pages/Home.tsx";

const router = createBrowserRouter(
  createRoutesFromElements(
    <Route path="/" element={<App />}>
      <Route path="/" element={<Home />} />
      <Route path="/notes" element={<NoteList />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/signin" element={<SigninPage />} />
    </Route>
  )
);

export default router;
