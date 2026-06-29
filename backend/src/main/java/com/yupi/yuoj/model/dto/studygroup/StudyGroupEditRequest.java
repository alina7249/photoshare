package com.yupi.yuoj.model.dto.studygroup;

import java.io.Serializable;
import lombok.Data;

@Data
public class StudyGroupEditRequest implements Serializable {
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

    private static final long serialVersionUID = 1L;
}