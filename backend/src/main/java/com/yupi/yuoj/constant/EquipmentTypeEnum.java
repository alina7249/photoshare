package com.yupi.yuoj.constant;

import java.util.Arrays;
import java.util.List;
import java.util.stream.Collectors;
import org.apache.commons.lang3.ObjectUtils;

/**
 * 器材类型枚举
 */
public enum EquipmentTypeEnum {

    CAMERA("相机", "相机"),
    LENS("镜头", "镜头"),
    TRIPOD("三脚架", "三脚架"),
    STABILIZER("稳定器", "稳定器"),
    MICROPHONE("麦克风", "麦克风"),
    MEMORY_CARD("存储卡", "存储卡"),
    BAG("摄影包", "摄影包"),
    FLASH("闪光灯", "闪光灯"),
    DRONE("无人机", "无人机");

    private final String value;
    private final String description;

    EquipmentTypeEnum(String value, String description) {
        this.value = value;
        this.description = description;
    }

    public static List<String> getValues() {
        return Arrays.stream(values()).map(item -> item.value).collect(Collectors.toList());
    }

    public static EquipmentTypeEnum getEnumByValue(String value) {
        if (ObjectUtils.isEmpty(value)) {
            return null;
        }
        for (EquipmentTypeEnum anEnum : EquipmentTypeEnum.values()) {
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