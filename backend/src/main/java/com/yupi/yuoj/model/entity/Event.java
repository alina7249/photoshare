package com.yupi.yuoj.model.entity;

import com.baomidou.mybatisplus.annotation.*;
import java.io.Serializable;
import java.math.BigDecimal;
import java.util.Date;
import lombok.Data;

@TableName(value = "event")
@Data
public class Event implements Serializable {

    @TableId(type = IdType.ASSIGN_ID)
    private Long id;

    private String eventId;
    private String title;
    private String type;
    private String category;
    private String image;
    private String location;
    private String date;
    private String duration;
    private String instructorName;
    private String instructorAvatar;
    private String instructorTitle;
    private String instructorExperience;
    private BigDecimal price;
    private Integer participants;
    private Integer maxParticipants;
    private String description;
    private String itinerary;
    private String inclusion;
    private String exclusion;
    private String notes;
    private String tags;
    private Date createTime;
    private Date updateTime;

    @TableLogic
    private Integer isDelete;

    @TableField(exist = false)
    private static final long serialVersionUID = 1L;
}