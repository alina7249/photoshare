package com.yupi.yuoj.service.impl;

import com.baomidou.mybatisplus.extension.service.impl.ServiceImpl;
import com.yupi.yuoj.mapper.StudyGroupMapper;
import com.yupi.yuoj.model.entity.StudyGroup;
import com.yupi.yuoj.service.StudyGroupService;
import org.springframework.stereotype.Service;

@Service
public class StudyGroupServiceImpl extends ServiceImpl<StudyGroupMapper, StudyGroup> implements StudyGroupService {
}