// 图片URL处理工具函数

/**
 * 生成本地占位符图片 (Data URL)
 * @param {number} width - 宽度
 * @param {number} height - 高度  
 * @param {string} text - 显示文字
 * @param {string} bgColor - 背景色 (hex)
 * @param {string} textColor - 文字色 (hex)
 * @returns {string} - Data URL格式的图片
 */
export const generatePlaceholder = (width = 200, height = 200, text = '盲盒', bgColor = '#E5E7EB', textColor = '#9CA3AF') => {
  const canvas = document.createElement('canvas');
  const ctx = canvas.getContext('2d');
  
  canvas.width = width;
  canvas.height = height;
  
  // 绘制背景
  ctx.fillStyle = bgColor;
  ctx.fillRect(0, 0, width, height);
  
  // 绘制文字
  ctx.fillStyle = textColor;
  ctx.font = `${Math.min(width, height) / 8}px Arial`;
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillText(text, width / 2, height / 2);
  
  return canvas.toDataURL('image/png');
};

/**
 * 将图片URL转换为适合前端使用的格式
 * 处理各种URL格式，确保能通过Vite代理正确访问
 * @param {string} imageUrl - 原始图片URL
 * @returns {string} - 处理后的图片URL
 */
export const processImageUrl = (imageUrl) => {
  if (!imageUrl) return '';
  
  // 如果是绝对URL (包含 localhost:3001)，转换为相对路径
  if (imageUrl.includes('localhost:3001')) {
    const urlParts = imageUrl.split('localhost:3001');
    return urlParts[1]; // 返回 /images/... 部分
  }
  
  // 如果已经是相对路径且格式正确，直接返回
  if (imageUrl.startsWith('/images/')) {
    return imageUrl;
  }
  
  // 如果是相对路径但缺少开头的斜杠，补上
  if (imageUrl.startsWith('images/')) {
    return '/' + imageUrl;
  }
  
  // 如果是HTTP/HTTPS绝对URL，直接返回
  if (imageUrl.startsWith('http://') || imageUrl.startsWith('https://')) {
    return imageUrl;
  }
  
  // 其他情况，假设是相对路径，补上前缀
  if (imageUrl && !imageUrl.startsWith('/')) {
    return '/images/' + imageUrl;
  }
  
  return imageUrl;
};

/**
 * 为图片URL添加错误处理
 * @param {string|object} imageUrl - 图片URL 或包含图片URL字段的对象
 * @returns {string} - 带有错误处理的图片URL
 */
export const getImageUrlWithFallback = (imageUrl) => {
  let url = imageUrl;
  
  // 如果传入的是对象，尝试从多个字段获取图片URL
  if (typeof imageUrl === 'object' && imageUrl !== null) {
    url = imageUrl.image_url || imageUrl.imageUrl || '';
  }
  
  const processedUrl = processImageUrl(url);
  
  // 如果没有图片URL，返回本地生成的占位符
  if (!processedUrl) {
    return generatePlaceholder(200, 200, '盲盒', '#E5E7EB', '#9CA3AF');
  }
  
  return processedUrl;
};

/**
 * 获取不同尺寸的占位符图片
 */
export const getPlaceholderImage = {
  // 盲盒卡片 (200x200)
  box: () => generatePlaceholder(200, 200, '盲盒', '#E5E7EB', '#9CA3AF'),
  
  // 物品图片 (64x64, 80x80, 96x96)
  item64: () => generatePlaceholder(64, 64, '物品', '#F3F4F6', '#6B7280'),
  item80: () => generatePlaceholder(80, 80, '盲盒', '#F3F4F6', '#6B7280'),
  item96: () => generatePlaceholder(96, 96, '物品', '#F3F4F6', '#6B7280'),
  
  // 上传失败 (128x128)
  uploadFailed: () => generatePlaceholder(128, 128, '加载失败', '#FEE2E2', '#DC2626'),
  
  // 动态图片 (300x200)
  moment: (text = '图片') => generatePlaceholder(300, 200, text, '#F0F9FF', '#0369A1')
};