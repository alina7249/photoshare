package com.yupi.yuoj.controller;

import com.baomidou.mybatisplus.extension.plugins.pagination.Page;
import com.yupi.yuoj.common.BaseResponse;
import com.yupi.yuoj.common.ErrorCode;
import com.yupi.yuoj.common.ResultUtils;
import com.yupi.yuoj.constant.ApiPathConstant;
import com.yupi.yuoj.exception.BusinessException;
import com.yupi.yuoj.exception.ThrowUtils;
import com.yupi.yuoj.model.dto.contest.ContestAddRequest;
import com.yupi.yuoj.model.dto.contest.ContestEditRequest;
import com.yupi.yuoj.model.dto.contest.ContestQueryRequest;
import com.yupi.yuoj.model.entity.Contest;
import com.yupi.yuoj.service.ContestService;
import javax.annotation.Resource;
import org.springframework.beans.BeanUtils;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping(ApiPathConstant.CONTEST_PREFIX)
public class ContestController {

    @Resource
    private ContestService contestService;

    @GetMapping("/list")
    public BaseResponse<Page<Contest>> listContest(ContestQueryRequest queryRequest) {
        long current = queryRequest.getCurrent();
        long size = queryRequest.getPageSize();
        Page<Contest> page = contestService.page(new Page<>(current, size));
        return ResultUtils.success(page);
    }

    @GetMapping("/detail/{id}")
    public BaseResponse<Contest> getContestDetail(@PathVariable Long id) {
        if (id <= 0) {
            throw new BusinessException(ErrorCode.PARAMS_ERROR);
        }
        Contest contest = contestService.getById(id);
        ThrowUtils.throwIf(contest == null, ErrorCode.NOT_FOUND_ERROR);
        return ResultUtils.success(contest);
    }

    @PostMapping("/add")
    public BaseResponse<Long> addContest(@RequestBody ContestAddRequest request) {
        if (request == null) {
            throw new BusinessException(ErrorCode.PARAMS_ERROR);
        }
        Contest contest = new Contest();
        BeanUtils.copyProperties(request, contest);
        boolean result = contestService.save(contest);
        ThrowUtils.throwIf(!result, ErrorCode.OPERATION_ERROR);
        return ResultUtils.success(contest.getId());
    }

    @PostMapping("/edit")
    public BaseResponse<Boolean> editContest(@RequestBody ContestEditRequest request) {
        if (request == null || request.getId() == null) {
            throw new BusinessException(ErrorCode.PARAMS_ERROR);
        }
        Contest contest = contestService.getById(request.getId());
        ThrowUtils.throwIf(contest == null, ErrorCode.NOT_FOUND_ERROR);
        BeanUtils.copyProperties(request, contest);
        boolean result = contestService.updateById(contest);
        return ResultUtils.success(result);
    }
}