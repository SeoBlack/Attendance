package org.example.attendancebackend.entity;


import jakarta.persistence.*;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.sql.Timestamp;

@Entity
@Table(name = "attendance")
@NoArgsConstructor
@AllArgsConstructor
@Data
@Builder
public class Attendance {
    @EmbeddedId
    private AttendanceId attendanceId;
    @Column(name="scanned_at")
    private Timestamp scannedAt;

}

//refer to this to understand the composite keys: https://www.baeldung.com/jpa-composite-primary-keys

