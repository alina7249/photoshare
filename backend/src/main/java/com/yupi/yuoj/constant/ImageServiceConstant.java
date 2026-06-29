package com.yupi.yuoj.constant;

/**
 * 图片服务常量 — 与前端 src/constants/api.ts 中 COZE_API_BASE 保持一致
 */
public class ImageServiceConstant {

    /** Coze 图床基础地址 */
    public static final String COZE_IMAGE_HOST = "https://space.coze.cn/api/coze_space/gen_image";

    /** Picsum 图片前缀 */
    public static final String PICSUM_BASE_URL = "https://picsum.photos";

    /**
     * 构建 Coze 图床图片 URL
     * @param prompt 图片生成提示词
     * @param sign 图片签名
     * @param imageSize 图片尺寸
     * @return 完整 Coze 图片 URL
     */
    public static String buildCozeImageUrl(String prompt, String sign, String imageSize) {
        StringBuilder url = new StringBuilder(COZE_IMAGE_HOST);
        url.append("?prompt=").append(prompt);
        url.append("&sign=").append(sign);
        if (imageSize != null && !imageSize.isEmpty()) {
            url.append("&image_size=").append(imageSize);
        }
        return url.toString();
    }

    private ImageServiceConstant() {
    }
}