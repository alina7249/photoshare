package com.yupi.yuoj.model.dto.contest;

import java.io.Serializable;
import lombok.Data;

@Data
public class ContestAddRequest implements Serializable {
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

    private static final long serialVersionUID = 1L;
}