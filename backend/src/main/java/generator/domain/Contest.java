package generator.domain;

import com.baomidou.mybatisplus.annotation.IdType;
import com.baomidou.mybatisplus.annotation.TableField;
import com.baomidou.mybatisplus.annotation.TableId;
import com.baomidou.mybatisplus.annotation.TableName;
import java.util.Date;
import lombok.Data;

/**
 * 竞赛
 * @TableName contest
 */
@TableName(value ="contest")
@Data
public class Contest {
    /**
     * id
     */
    @TableId(type = IdType.AUTO)
    private Long id;

    /**
     * 竞赛标题
     */
    private String title;

    /**
     * 竞赛描述
     */
    private String description;

    /**
     * 竞赛类型（0 - 公开, 1 - 密码保护, 2 - 私有）
     */
    private Integer contestType;

    /**
     * 竞赛密码（如果是密码保护类型）
     */
    private String password;

    /**
     * 开始时间
     */
    private Date startTime;

    /**
     * 竞赛时长（分钟）
     */
    private Integer duration;

    /**
     * 竞赛状态（0 - 未开始, 1 - 进行中, 2 - 已结束）
     */
    private Integer status;

    /**
     * 是否可见排名（0 - 不可见, 1 - 可见）
     */
    private Integer visibleRank;

    /**
     * 罚时（分钟）
     */
    private Integer penalty;

    /**
     * 创建者用户 id
     */
    private Long userId;

    /**
     * 创建时间
     */
    private Date createTime;

    /**
     * 更新时间
     */
    private Date updateTime;

    /**
     * 是否删除
     */
    private Integer isDelete;
}