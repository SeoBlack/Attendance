export type Lecture = {
  id: number | undefined;
  courseId: number;
  joinCode: string | undefined;
  description: string;
  startDate: string;
  endDate: string;
}

export default Lecture;
