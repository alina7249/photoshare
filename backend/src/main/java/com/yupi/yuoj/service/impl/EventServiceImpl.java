package com.yupi.yuoj.service.impl;

import com.baomidou.mybatisplus.extension.service.impl.ServiceImpl;
import com.yupi.yuoj.mapper.EventMapper;
import com.yupi.yuoj.model.entity.Event;
import com.yupi.yuoj.service.EventService;
import org.springframework.stereotype.Service;

@Service
public class EventServiceImpl extends ServiceImpl<EventMapper, Event> implements EventService {
}