package com.yupi.yuoj.model.dto.equipment;

import java.io.Serializable;
import java.math.BigDecimal;
import lombok.Data;

@Data
public class EquipmentAddRequest implements Serializable {
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

    private static final long serialVersionUID = 1L;
}