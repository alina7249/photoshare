package com.yupi.yuoj.model.dto.studygroup;

import com.yupi.yuoj.common.PageRequest;
import java.io.Serializable;
import lombok.Data;
import lombok.EqualsAndHashCode;

@Data
@EqualsAndHashCode(callSuper = true)
public class StudyGroupQueryRequest extends PageRequest implements Serializable {
    private String category;
    private String searchText;

    private static final long serialVersionUID = 1L;
}