package com.yupi.yuoj.model.dto.event;

import com.yupi.yuoj.common.PageRequest;
import java.io.Serializable;
import lombok.Data;
import lombok.EqualsAndHashCode;

@Data
@EqualsAndHashCode(callSuper = true)
public class EventQueryRequest extends PageRequest implements Serializable {
    private String type;
    private String category;
    private String searchText;

    private static final long serialVersionUID = 1L;
}