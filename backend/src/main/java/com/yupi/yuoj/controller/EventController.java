package com.yupi.yuoj.controller;

import com.baomidou.mybatisplus.extension.plugins.pagination.Page;
import com.yupi.yuoj.common.BaseResponse;
import com.yupi.yuoj.common.ErrorCode;
import com.yupi.yuoj.common.ResultUtils;
import com.yupi.yuoj.constant.ApiPathConstant;
import com.yupi.yuoj.exception.BusinessException;
import com.yupi.yuoj.exception.ThrowUtils;
import com.yupi.yuoj.model.dto.event.EventAddRequest;
import com.yupi.yuoj.model.dto.event.EventEditRequest;
import com.yupi.yuoj.model.dto.event.EventQueryRequest;
import com.yupi.yuoj.model.entity.Event;
import com.yupi.yuoj.service.EventService;
import javax.annotation.Resource;
import org.springframework.beans.BeanUtils;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping(ApiPathConstant.EVENT_PREFIX)
public class EventController {

    @Resource
    private EventService eventService;

    @GetMapping("/list")
    public BaseResponse<Page<Event>> listEvent(EventQueryRequest queryRequest) {
        long current = queryRequest.getCurrent();
        long size = queryRequest.getPageSize();
        Page<Event> page = eventService.page(new Page<>(current, size));
        return ResultUtils.success(page);
    }

    @GetMapping("/detail/{id}")
    public BaseResponse<Event> getEventDetail(@PathVariable Long id) {
        if (id <= 0) {
            throw new BusinessException(ErrorCode.PARAMS_ERROR);
        }
        Event event = eventService.getById(id);
        ThrowUtils.throwIf(event == null, ErrorCode.NOT_FOUND_ERROR);
        return ResultUtils.success(event);
    }

    @PostMapping("/add")
    public BaseResponse<Long> addEvent(@RequestBody EventAddRequest request) {
        if (request == null) {
            throw new BusinessException(ErrorCode.PARAMS_ERROR);
        }
        Event event = new Event();
        BeanUtils.copyProperties(request, event);
        boolean result = eventService.save(event);
        ThrowUtils.throwIf(!result, ErrorCode.OPERATION_ERROR);
        return ResultUtils.success(event.getId());
    }

    @PostMapping("/edit")
    public BaseResponse<Boolean> editEvent(@RequestBody EventEditRequest request) {
        if (request == null || request.getId() == null) {
            throw new BusinessException(ErrorCode.PARAMS_ERROR);
        }
        Event event = eventService.getById(request.getId());
        ThrowUtils.throwIf(event == null, ErrorCode.NOT_FOUND_ERROR);
        BeanUtils.copyProperties(request, event);
        boolean result = eventService.updateById(event);
        return ResultUtils.success(result);
    }
}