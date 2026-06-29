package com.yupi.yuoj.constant;

import java.util.Arrays;
import java.util.List;
import java.util.stream.Collectors;
import org.apache.commons.lang3.ObjectUtils;

/**
 * 通知类型枚举
 */
public enum NotificationTypeEnum {

    LIKE("like", "点赞"),
    COMMENT("comment", "评论"),
    FOLLOW("follow", "关注"),
    SYSTEM("system", "系统通知");

    private final String value;
    private final String description;

    NotificationTypeEnum(String value, String description) {
        this.value = value;
        this.description = description;
    }

    public static List<String> getValues() {
        return Arrays.stream(values()).map(item -> item.value).collect(Collectors.toList());
    }

    public static NotificationTypeEnum getEnumByValue(String value) {
        if (ObjectUtils.isEmpty(value)) {
            return null;
        }
        for (NotificationTypeEnum anEnum : NotificationTypeEnum.values()) {
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