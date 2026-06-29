package com.yupi.yuoj.model.dto.course;

import java.io.Serializable;
import java.math.BigDecimal;
import lombok.Data;

@Data
public class CourseEditRequest implements Serializable {
    private Long id;
    private String courseId;
    private String title;
    private String type;
    private String category;
    private String level;
    private String instructorName;
    private String instructorAvatar;
    private String instructorTitle;
    private Integer instructorStudents;
    private Integer instructorCourses;
    private BigDecimal instructorRating;
    private String coverImage;
    private String duration;
    private Integer lessons;
    private Integer students;
    private BigDecimal rating;
    private Integer reviews;
    private String description;
    private String tags;
    private BigDecimal price;

    private static final long serialVersionUID = 1L;
}