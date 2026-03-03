export type Attendance = {
  attendanceId: {
    userId: number;
    lectureId: number;
  };
  scannedAt: string;
}

export default Attendance;
