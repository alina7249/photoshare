package com.yupi.yuoj.controller;

import com.baomidou.mybatisplus.extension.plugins.pagination.Page;
import com.yupi.yuoj.common.BaseResponse;
import com.yupi.yuoj.common.ErrorCode;
import com.yupi.yuoj.common.ResultUtils;
import com.yupi.yuoj.constant.ApiPathConstant;
import com.yupi.yuoj.exception.BusinessException;
import com.yupi.yuoj.exception.ThrowUtils;
import com.yupi.yuoj.model.dto.equipmenttrade.EquipmentTradeAddRequest;
import com.yupi.yuoj.model.dto.equipmenttrade.EquipmentTradeEditRequest;
import com.yupi.yuoj.model.dto.equipmenttrade.EquipmentTradeQueryRequest;
import com.yupi.yuoj.model.entity.EquipmentTrade;
import com.yupi.yuoj.service.EquipmentTradeService;
import javax.annotation.Resource;
import org.springframework.beans.BeanUtils;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping(ApiPathConstant.TRADE_PREFIX)
public class TradeController {

    @Resource
    private EquipmentTradeService equipmentTradeService;

    @GetMapping("/list")
    public BaseResponse<Page<EquipmentTrade>> listEquipmentTrade(EquipmentTradeQueryRequest queryRequest) {
        long current = queryRequest.getCurrent();
        long size = queryRequest.getPageSize();
        Page<EquipmentTrade> page = equipmentTradeService.page(new Page<>(current, size));
        return ResultUtils.success(page);
    }

    @GetMapping("/detail/{id}")
    public BaseResponse<EquipmentTrade> getEquipmentTradeDetail(@PathVariable Long id) {
        if (id <= 0) {
            throw new BusinessException(ErrorCode.PARAMS_ERROR);
        }
        EquipmentTrade equipmentTrade = equipmentTradeService.getById(id);
        ThrowUtils.throwIf(equipmentTrade == null, ErrorCode.NOT_FOUND_ERROR);
        return ResultUtils.success(equipmentTrade);
    }

    @PostMapping("/add")
    public BaseResponse<Long> addEquipmentTrade(@RequestBody EquipmentTradeAddRequest request) {
        if (request == null) {
            throw new BusinessException(ErrorCode.PARAMS_ERROR);
        }
        EquipmentTrade equipmentTrade = new EquipmentTrade();
        BeanUtils.copyProperties(request, equipmentTrade);
        boolean result = equipmentTradeService.save(equipmentTrade);
        ThrowUtils.throwIf(!result, ErrorCode.OPERATION_ERROR);
        return ResultUtils.success(equipmentTrade.getId());
    }

    @PostMapping("/edit")
    public BaseResponse<Boolean> editEquipmentTrade(@RequestBody EquipmentTradeEditRequest request) {
        if (request == null || request.getId() == null) {
            throw new BusinessException(ErrorCode.PARAMS_ERROR);
        }
        EquipmentTrade equipmentTrade = equipmentTradeService.getById(request.getId());
        ThrowUtils.throwIf(equipmentTrade == null, ErrorCode.NOT_FOUND_ERROR);
        BeanUtils.copyProperties(request, equipmentTrade);
        boolean result = equipmentTradeService.updateById(equipmentTrade);
        return ResultUtils.success(result);
    }
}