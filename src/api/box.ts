import request from '../utils/request';

/**
 * 获取所有盲盒列表
 */
export const getAllBoxes = () => {
  return request.get('/api/boxes');
};

/**
 * 根据盲盒 ID 获取详情
 */
export const getBoxById = (id: number) => {
  return request.get(`/api/boxes/${id}`);
};

/**
 * 用户抽取盲盒（默认 userId 为 1）
 */
export const drawBox = (userId: number = 1) => {
  return request.post('/api/draw', { userId });
};
