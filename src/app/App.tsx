import { Route, Routes } from "react-router";
import { LoginPage } from "@/features/auth/LoginPage";
import { NotesPage } from "@/features/notes/NotesPage";
import { NotFoundPage } from "./NotFoundPage";

export function App() {
  return (
    <Routes>
      <Route path="/" element={<NotesPage />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  );
}
