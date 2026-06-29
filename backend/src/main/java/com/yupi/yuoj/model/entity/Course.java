package com.yupi.yuoj.model.entity;

import com.baomidou.mybatisplus.annotation.*;
import java.io.Serializable;
import java.math.BigDecimal;
import java.util.Date;
import lombok.Data;

@TableName(value = "course")
@Data
public class Course implements Serializable {

    @TableId(type = IdType.ASSIGN_ID)
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
    private Date createTime;
    private Date updateTime;

    @TableLogic
    private Integer isDelete;

    @TableField(exist = false)
    private static final long serialVersionUID = 1L;
}