package com.yupi.yuoj.model.dto.equipment;

import com.yupi.yuoj.common.PageRequest;
import java.io.Serializable;
import lombok.Data;
import lombok.EqualsAndHashCode;

@Data
@EqualsAndHashCode(callSuper = true)
public class EquipmentQueryRequest extends PageRequest implements Serializable {
    private String type;
    private String brand;
    private String searchText;

    private static final long serialVersionUID = 1L;
}