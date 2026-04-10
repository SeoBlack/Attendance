export type Course = {
  id: number | undefined;
  courseName: string;
  description: string;
  /** Locale of the name/description being saved (en | ar | ru). Upserts that row in `course_translation`. */
  defaultLocale?: string;
  instructionLanguage?: string | null;
};

export default Course;
