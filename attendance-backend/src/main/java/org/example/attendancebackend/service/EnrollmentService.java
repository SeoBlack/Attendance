package org.example.attendancebackend.service;

import org.example.attendancebackend.dto.EnrollmentUploadResult;
import org.example.attendancebackend.entity.Enrollment;
import org.example.attendancebackend.entity.EnrollmentId;
import org.example.attendancebackend.entity.User;
import org.example.attendancebackend.entity.UserRole;
import org.example.attendancebackend.repository.EnrollmentRepository;
import org.example.attendancebackend.repository.UserRepository;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.web.server.ResponseStatusException;
import org.w3c.dom.Document;
import org.w3c.dom.Element;
import org.w3c.dom.NodeList;
import org.xml.sax.SAXException;

import javax.xml.parsers.DocumentBuilderFactory;
import javax.xml.parsers.ParserConfigurationException;
import java.io.IOException;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

@Service
public class EnrollmentService {
    private final EnrollmentRepository enrollmentRepository;
    private final UserRepository userRepository;

    public EnrollmentService(EnrollmentRepository enrollmentRepository, UserRepository userRepository) {
        this.enrollmentRepository = enrollmentRepository;
        this.userRepository = userRepository;
    }

    public EnrollmentUploadResult enrollFromXml(Long courseId, MultipartFile file) {
        Document doc;
        int newEnrollments=0, newUsers=0;
        try {
            doc= DocumentBuilderFactory.newInstance()
                    .newDocumentBuilder().parse(file.getInputStream());
        } catch (ParserConfigurationException | SAXException | IOException e) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Invalid XML file: " + e.getMessage());
        }

        NodeList students = doc.getElementsByTagName("student");
        for (int i = 0; i < students.getLength(); i++) {
            Element studentEl = (Element) students.item(i);
            String firstName = studentEl.getElementsByTagName("first_name").item(0).getTextContent();
            String lastName = studentEl.getElementsByTagName("last_name").item(0).getTextContent();
            String email = studentEl.getElementsByTagName("email").item(0).getTextContent();

            Optional<User> existingUser = userRepository.findByEmailIgnoreCase(email);
            if (existingUser.isEmpty()) {
                User newUser = new User();
                newUser.setFirstName(firstName);
                newUser.setLastName(lastName);
                newUser.setEmail(email);
                newUser.setRole(UserRole.STUDENT);
                existingUser = Optional.of(userRepository.save(newUser));
                newUsers ++;
            }
            if (!enrollmentRepository.existsById(new EnrollmentId(existingUser.get().getId(), courseId))){
                enrollmentRepository.save(new Enrollment(new EnrollmentId(existingUser.get().getId(), courseId)));
                newEnrollments++;
            }

        }
        return new EnrollmentUploadResult(newEnrollments, newUsers);
    }

    public List<User> getCourseEnrollments(Long courseId) {
        return enrollmentRepository.findUsersByCourseId(courseId);
    }
}
