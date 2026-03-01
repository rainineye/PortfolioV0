# 图片优化说明 | Image Optimization for Deployment

## 当前状态
- 主站图片：`assets/optimized/`（PNG 格式），运行 `npm run download-images`
- Trillion 项目：`assets/trillion/`（WebP 格式，已优化），运行 `npm run download-trillion`
- `006_Trillion.html` 使用本地路径 `assets/trillion/*.webp`

## 进一步优化建议（可选）

### 1. 下载图片到本地
将 Figma 中的项目缩略图导出到 `assets/projects/` 目录，按项目编号命名，如：
```
assets/projects/
  01-savvy-defi-1.webp
  01-savvy-defi-2.webp
  01-savvy-defi-3.webp
  02-evmos-1.webp
  ...
```

### 2. 推荐尺寸（每张缩略图）
- 宽度：464px（左） / 472px（中右）
- 高度：268px
- 格式：WebP（质量 80–85）
- 备用：JPEG（质量 75–80）

### 3. 使用 sharp 批量处理示例
```js
// optimize-images.mjs
import sharp from 'sharp';
import { readdir, mkdir } from 'fs/promises';
import path from 'path';

const SIZES = { width: 472, height: 268 };
const OUTPUT = './assets/optimized';

await mkdir(OUTPUT, { recursive: true });
// 遍历 assets/projects 中的原图，输出 WebP 到 assets/optimized
```

### 4. 更新 index.html
将 `src` 从 Figma URL 改为本地路径：
```html
<img src="assets/optimized/01-1.webp" ...>
```

### 5. 可选：响应式图片
```html
<picture>
  <source srcset="img.webp" type="image/webp">
  <img src="img.jpg" alt="..." width="472" height="268" loading="lazy">
</picture>
```
