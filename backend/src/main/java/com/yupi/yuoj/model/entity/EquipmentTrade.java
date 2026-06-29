package com.yupi.yuoj.model.entity;

import com.baomidou.mybatisplus.annotation.*;
import java.io.Serializable;
import java.math.BigDecimal;
import java.util.Date;
import lombok.Data;

@TableName(value = "equipment_trade")
@Data
public class EquipmentTrade implements Serializable {

    @TableId(type = IdType.ASSIGN_ID)
    private Long id;

    private String tradeId;
    private String name;
    private String type;
    private String brand;
    private BigDecimal price;
    private BigDecimal originalPrice;
    private String image;
    private String tradeType;
    private String condition;
    private String usageTime;
    private Integer shutterCount;
    private String repairHistory;
    private String accessories;
    private String sellerName;
    private String sellerAvatar;
    private String sellerLocation;
    private BigDecimal sellerRating;
    private Integer sellerTransactions;
    private Integer sellerIsOfficial;
    private String description;
    private String tags;
    private String warranty;
    private Date createTime;
    private Date updateTime;

    @TableLogic
    private Integer isDelete;

    @TableField(exist = false)
    private static final long serialVersionUID = 1L;
}