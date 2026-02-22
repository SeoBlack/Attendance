import { createContext, useContext, useState, useCallback, type ReactNode } from 'react';
import type { Lecture } from '../entities/lecture';

interface LectureContextValue {
  lectures: Lecture[];
  addLecture: (lecture: Lecture) => void;
  removeLecture: (id: number) => void;
  setLectures: (lectures: Lecture[]) => void;
  getLectureById: (id: number) => Lecture | undefined;
}

const LectureContext = createContext<LectureContextValue | null>(null);

export function LectureProvider({ children }: { children: ReactNode }) {
  const [lectures, setLecturesState] = useState<Lecture[]>([]);

  const addLecture = useCallback((lecture: Lecture) => {
    setLecturesState((prev) => {
      const idx = prev.findIndex((l) => l.id === lecture.id);
      if (idx >= 0) {
        const updated = [...prev];
        updated[idx] = lecture;
        return updated;
      }
      return [...prev, lecture];
    });
  }, []);

  const removeLecture = useCallback((id: number) => {
    setLecturesState((prev) => prev.filter((l) => l.id !== id));
  }, []);

  const setLectures = useCallback((lectures: Lecture[]) => {
    setLecturesState(lectures);
  }, []);

  const getLectureById = useCallback(
    (id: number) => lectures.find((l) => l.id === id),
    [lectures]
  );

  return (
    <LectureContext.Provider value={{ lectures, addLecture, removeLecture, setLectures, getLectureById }}>
      {children}
    </LectureContext.Provider>
  );
}

export function useLectureContext(): LectureContextValue {
  const ctx = useContext(LectureContext);
  if (!ctx) {
    throw new Error('useLectureContext must be used within a LectureProvider');
  }
  return ctx;
}
