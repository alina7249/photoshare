package generator.service.impl;

import com.baomidou.mybatisplus.extension.service.impl.ServiceImpl;
import generator.domain.Contest;
import generator.service.ContestService;
import generator.mapper.ContestMapper;
import org.springframework.stereotype.Service;

/**
* @author 24402
* @description 针对表【contest(竞赛)】的数据库操作Service实现
* @createDate 2025-07-02 09:06:31
*/
@Service
public class ContestServiceImpl extends ServiceImpl<ContestMapper, Contest>
    implements ContestService{

}




