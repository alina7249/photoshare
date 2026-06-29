package com.yupi.yuoj.model.entity;

import com.baomidou.mybatisplus.annotation.*;
import java.io.Serializable;
import java.util.Date;
import lombok.Data;

@TableName(value = "study_group")
@Data
public class StudyGroup implements Serializable {

    @TableId(type = IdType.ASSIGN_ID)
    private Long id;

    private String groupId;
    private String name;
    private String category;
    private String description;
    private String coverImage;
    private Integer memberCount;
    private Integer postCount;
    private String rules;
    private String tags;
    private Date createTime;
    private Date updateTime;

    @TableLogic
    private Integer isDelete;

    @TableField(exist = false)
    private static final long serialVersionUID = 1L;
}