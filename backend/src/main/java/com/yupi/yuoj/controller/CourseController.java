package com.yupi.yuoj.controller;

import com.baomidou.mybatisplus.extension.plugins.pagination.Page;
import com.yupi.yuoj.common.BaseResponse;
import com.yupi.yuoj.common.ErrorCode;
import com.yupi.yuoj.common.ResultUtils;
import com.yupi.yuoj.constant.ApiPathConstant;
import com.yupi.yuoj.exception.BusinessException;
import com.yupi.yuoj.exception.ThrowUtils;
import com.yupi.yuoj.model.dto.course.CourseAddRequest;
import com.yupi.yuoj.model.dto.course.CourseEditRequest;
import com.yupi.yuoj.model.dto.course.CourseQueryRequest;
import com.yupi.yuoj.model.entity.Course;
import com.yupi.yuoj.service.CourseService;
import javax.annotation.Resource;
import org.springframework.beans.BeanUtils;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping(ApiPathConstant.COURSE_PREFIX)
public class CourseController {

    @Resource
    private CourseService courseService;

    @GetMapping("/list")
    public BaseResponse<Page<Course>> listCourse(CourseQueryRequest queryRequest) {
        long current = queryRequest.getCurrent();
        long size = queryRequest.getPageSize();
        Page<Course> page = courseService.page(new Page<>(current, size));
        return ResultUtils.success(page);
    }

    @GetMapping("/detail/{id}")
    public BaseResponse<Course> getCourseDetail(@PathVariable Long id) {
        if (id <= 0) {
            throw new BusinessException(ErrorCode.PARAMS_ERROR);
        }
        Course course = courseService.getById(id);
        ThrowUtils.throwIf(course == null, ErrorCode.NOT_FOUND_ERROR);
        return ResultUtils.success(course);
    }

    @PostMapping("/add")
    public BaseResponse<Long> addCourse(@RequestBody CourseAddRequest request) {
        if (request == null) {
            throw new BusinessException(ErrorCode.PARAMS_ERROR);
        }
        Course course = new Course();
        BeanUtils.copyProperties(request, course);
        boolean result = courseService.save(course);
        ThrowUtils.throwIf(!result, ErrorCode.OPERATION_ERROR);
        return ResultUtils.success(course.getId());
    }

    @PostMapping("/edit")
    public BaseResponse<Boolean> editCourse(@RequestBody CourseEditRequest request) {
        if (request == null || request.getId() == null) {
            throw new BusinessException(ErrorCode.PARAMS_ERROR);
        }
        Course course = courseService.getById(request.getId());
        ThrowUtils.throwIf(course == null, ErrorCode.NOT_FOUND_ERROR);
        BeanUtils.copyProperties(request, course);
        boolean result = courseService.updateById(course);
        return ResultUtils.success(result);
    }
}