package com.yupi.yuoj.service.impl;

import com.baomidou.mybatisplus.extension.service.impl.ServiceImpl;
import com.yupi.yuoj.mapper.ContestMapper;
import com.yupi.yuoj.model.entity.Contest;
import com.yupi.yuoj.service.ContestService;
import org.springframework.stereotype.Service;

@Service
public class ContestServiceImpl extends ServiceImpl<ContestMapper, Contest> implements ContestService {
}