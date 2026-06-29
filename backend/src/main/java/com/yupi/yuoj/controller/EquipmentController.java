package com.yupi.yuoj.controller;

import com.baomidou.mybatisplus.extension.plugins.pagination.Page;
import com.yupi.yuoj.common.BaseResponse;
import com.yupi.yuoj.common.ErrorCode;
import com.yupi.yuoj.common.ResultUtils;
import com.yupi.yuoj.constant.ApiPathConstant;
import com.yupi.yuoj.exception.BusinessException;
import com.yupi.yuoj.exception.ThrowUtils;
import com.yupi.yuoj.model.dto.equipment.EquipmentAddRequest;
import com.yupi.yuoj.model.dto.equipment.EquipmentEditRequest;
import com.yupi.yuoj.model.dto.equipment.EquipmentQueryRequest;
import com.yupi.yuoj.model.entity.Equipment;
import com.yupi.yuoj.service.EquipmentService;
import javax.annotation.Resource;
import org.springframework.beans.BeanUtils;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping(ApiPathConstant.EQUIPMENT_PREFIX)
public class EquipmentController {

    @Resource
    private EquipmentService equipmentService;

    @GetMapping("/list")
    public BaseResponse<Page<Equipment>> listEquipment(EquipmentQueryRequest queryRequest) {
        long current = queryRequest.getCurrent();
        long size = queryRequest.getPageSize();
        Page<Equipment> page = equipmentService.page(new Page<>(current, size));
        return ResultUtils.success(page);
    }

    @GetMapping("/detail/{id}")
    public BaseResponse<Equipment> getEquipmentDetail(@PathVariable Long id) {
        if (id <= 0) {
            throw new BusinessException(ErrorCode.PARAMS_ERROR);
        }
        Equipment equipment = equipmentService.getById(id);
        ThrowUtils.throwIf(equipment == null, ErrorCode.NOT_FOUND_ERROR);
        return ResultUtils.success(equipment);
    }

    @PostMapping("/add")
    public BaseResponse<Long> addEquipment(@RequestBody EquipmentAddRequest request) {
        if (request == null) {
            throw new BusinessException(ErrorCode.PARAMS_ERROR);
        }
        Equipment equipment = new Equipment();
        BeanUtils.copyProperties(request, equipment);
        boolean result = equipmentService.save(equipment);
        ThrowUtils.throwIf(!result, ErrorCode.OPERATION_ERROR);
        return ResultUtils.success(equipment.getId());
    }

    @PostMapping("/edit")
    public BaseResponse<Boolean> editEquipment(@RequestBody EquipmentEditRequest request) {
        if (request == null || request.getId() == null) {
            throw new BusinessException(ErrorCode.PARAMS_ERROR);
        }
        Equipment equipment = equipmentService.getById(request.getId());
        ThrowUtils.throwIf(equipment == null, ErrorCode.NOT_FOUND_ERROR);
        BeanUtils.copyProperties(request, equipment);
        boolean result = equipmentService.updateById(equipment);
        return ResultUtils.success(result);
    }
}