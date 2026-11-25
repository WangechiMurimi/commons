import { Route, Routes } from "react-router";
import { NotesPage } from "@/features/notes/NotesPage";
import { NotFoundPage } from "./NotFoundPage";

export function App() {
  return (
    <Routes>
      <Route path="/" element={<NotesPage />} />
      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  );
}
