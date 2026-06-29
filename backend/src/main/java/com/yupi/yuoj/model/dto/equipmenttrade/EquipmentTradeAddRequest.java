package com.yupi.yuoj.model.dto.equipmenttrade;

import java.io.Serializable;
import java.math.BigDecimal;
import lombok.Data;

@Data
public class EquipmentTradeAddRequest implements Serializable {
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

    private static final long serialVersionUID = 1L;
}