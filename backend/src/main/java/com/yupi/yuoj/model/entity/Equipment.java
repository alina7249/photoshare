package com.yupi.yuoj.model.entity;

import com.baomidou.mybatisplus.annotation.*;
import java.io.Serializable;
import java.math.BigDecimal;
import java.util.Date;
import lombok.Data;

@TableName(value = "equipment")
@Data
public class Equipment implements Serializable {

    @TableId(type = IdType.ASSIGN_ID)
    private Long id;

    private String equipId;
    private String name;
    private String type;
    private String brand;
    private BigDecimal price;
    private String image;
    private String specs;
    private String performance;
    private String pros;
    private String cons;
    private String suitableFor;
    private BigDecimal rating;
    private Integer reviewCount;
    private String tags;
    private BigDecimal rentalDaily;
    private BigDecimal rentalWeekly;
    private BigDecimal rentalMonthly;
    private Integer rentalAvailable;
    private String secondHandLink;
    private Integer isHot;
    private Date createTime;
    private Date updateTime;

    @TableLogic
    private Integer isDelete;

    @TableField(exist = false)
    private static final long serialVersionUID = 1L;
}