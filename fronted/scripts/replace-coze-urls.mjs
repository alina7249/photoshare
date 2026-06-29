// scripts/replace-coze-urls.mjs
// 自动解析所有 .tsx 文件中的 Coze 图床 URL，替换为 buildCozeImageUrl() 调用
import { readFileSync, writeFileSync } from 'fs';
import { globSync } from 'glob';

const COZE_URL_RE = /["']https:\/\/space\.coze\.cn\/api\/coze_space\/gen_image\?image_size=([^&]+)&prompt=([^&]+)&sign=([^"&']+)["']/g;
const IMPORT_STMT = `import { buildCozeImageUrl } from '../constants/api';\n`;
const IMPORT_RE = /^import .+ from ['"]\.\.\/constants\/api['"];?\n?/m;

const files = globSync('src/**/*.tsx', { cwd: '/workspace/fronted' });

for (const file of files) {
  const filePath = `/workspace/fronted/${file}`;
  let content = readFileSync(filePath, 'utf8');
  let modified = false;

  content = content.replace(COZE_URL_RE, (match, imageSize, encodedPrompt, sign) => {
    modified = true;
    // decodeURIComponent 处理 %xx, replace 处理 + → 空格
    const prompt = decodeURIComponent(encodedPrompt.replace(/\+/g, ' '));
    return `buildCozeImageUrl('${prompt}', '${sign}', '${imageSize}')`;
  });

  if (modified) {
    // 如果尚未导入 buildCozeImageUrl，则在文件顶部插入 import
    if (!IMPORT_RE.test(content)) {
      content = IMPORT_STMT + content;
    }
    writeFileSync(filePath, content, 'utf8');
    console.log(`✓ ${file}`);
  }
}

console.log('\nDone. Verify with: grep -rn "space\\.coze\\.cn" src/ --include="*.tsx"');