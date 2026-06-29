package com.yupi.yuoj.constant;

import java.util.Arrays;
import java.util.List;
import java.util.stream.Collectors;
import org.apache.commons.lang3.ObjectUtils;

/**
 * 交易类型枚举
 */
public enum TradeTypeEnum {

    NEW("new", "全新"),
    USED("used", "二手");

    private final String value;
    private final String description;

    TradeTypeEnum(String value, String description) {
        this.value = value;
        this.description = description;
    }

    public static List<String> getValues() {
        return Arrays.stream(values()).map(item -> item.value).collect(Collectors.toList());
    }

    public static TradeTypeEnum getEnumByValue(String value) {
        if (ObjectUtils.isEmpty(value)) {
            return null;
        }
        for (TradeTypeEnum anEnum : TradeTypeEnum.values()) {
            if (anEnum.value.equals(value)) {
                return anEnum;
            }
        }
        return null;
    }

    public String getValue() {
        return value;
    }

    public String getDescription() {
        return description;
    }
}