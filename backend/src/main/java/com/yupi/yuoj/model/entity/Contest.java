package com.yupi.yuoj.model.entity;

import com.baomidou.mybatisplus.annotation.*;
import java.io.Serializable;
import java.util.Date;
import lombok.Data;

@TableName(value = "contest")
@Data
public class Contest implements Serializable {

    @TableId(type = IdType.ASSIGN_ID)
    private Long id;

    private String contestId;
    private String title;
    private String type;
    private String organizer;
    private String image;
    private String deadline;
    private String status;
    private Integer entries;
    private Integer worksCount;
    private Integer participants;
    private String prizes;
    private String description;
    private String categories;
    private String rules;
    private String tags;
    private Date createTime;
    private Date updateTime;

    @TableLogic
    private Integer isDelete;

    @TableField(exist = false)
    private static final long serialVersionUID = 1L;
}