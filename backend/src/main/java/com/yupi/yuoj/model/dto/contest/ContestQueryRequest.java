package com.yupi.yuoj.model.dto.contest;

import com.yupi.yuoj.common.PageRequest;
import java.io.Serializable;
import lombok.Data;
import lombok.EqualsAndHashCode;

@Data
@EqualsAndHashCode(callSuper = true)
public class ContestQueryRequest extends PageRequest implements Serializable {
    private String type;
    private String status;
    private String searchText;

    private static final long serialVersionUID = 1L;
}