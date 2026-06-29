package com.yupi.yuoj.controller;

import com.baomidou.mybatisplus.extension.plugins.pagination.Page;
import com.yupi.yuoj.common.BaseResponse;
import com.yupi.yuoj.common.ErrorCode;
import com.yupi.yuoj.common.ResultUtils;
import com.yupi.yuoj.constant.ApiPathConstant;
import com.yupi.yuoj.exception.BusinessException;
import com.yupi.yuoj.exception.ThrowUtils;
import com.yupi.yuoj.model.dto.studygroup.StudyGroupAddRequest;
import com.yupi.yuoj.model.dto.studygroup.StudyGroupEditRequest;
import com.yupi.yuoj.model.dto.studygroup.StudyGroupQueryRequest;
import com.yupi.yuoj.model.entity.StudyGroup;
import com.yupi.yuoj.service.StudyGroupService;
import javax.annotation.Resource;
import org.springframework.beans.BeanUtils;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping(ApiPathConstant.GROUP_PREFIX)
public class GroupController {

    @Resource
    private StudyGroupService studyGroupService;

    @GetMapping("/list")
    public BaseResponse<Page<StudyGroup>> listStudyGroup(StudyGroupQueryRequest queryRequest) {
        long current = queryRequest.getCurrent();
        long size = queryRequest.getPageSize();
        Page<StudyGroup> page = studyGroupService.page(new Page<>(current, size));
        return ResultUtils.success(page);
    }

    @GetMapping("/detail/{id}")
    public BaseResponse<StudyGroup> getStudyGroupDetail(@PathVariable Long id) {
        if (id <= 0) {
            throw new BusinessException(ErrorCode.PARAMS_ERROR);
        }
        StudyGroup studyGroup = studyGroupService.getById(id);
        ThrowUtils.throwIf(studyGroup == null, ErrorCode.NOT_FOUND_ERROR);
        return ResultUtils.success(studyGroup);
    }

    @PostMapping("/add")
    public BaseResponse<Long> addStudyGroup(@RequestBody StudyGroupAddRequest request) {
        if (request == null) {
            throw new BusinessException(ErrorCode.PARAMS_ERROR);
        }
        StudyGroup studyGroup = new StudyGroup();
        BeanUtils.copyProperties(request, studyGroup);
        boolean result = studyGroupService.save(studyGroup);
        ThrowUtils.throwIf(!result, ErrorCode.OPERATION_ERROR);
        return ResultUtils.success(studyGroup.getId());
    }

    @PostMapping("/edit")
    public BaseResponse<Boolean> editStudyGroup(@RequestBody StudyGroupEditRequest request) {
        if (request == null || request.getId() == null) {
            throw new BusinessException(ErrorCode.PARAMS_ERROR);
        }
        StudyGroup studyGroup = studyGroupService.getById(request.getId());
        ThrowUtils.throwIf(studyGroup == null, ErrorCode.NOT_FOUND_ERROR);
        BeanUtils.copyProperties(request, studyGroup);
        boolean result = studyGroupService.updateById(studyGroup);
        return ResultUtils.success(result);
    }
}