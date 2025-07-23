// src/api/index.ts
import request from '../utils/request';

// 盲盒池相关API
export const getAllPools = () => {
  return request.get('/api/pools');
};

export const getPoolPreview = (poolId: number) => {
  return request.get(`/api/pools/${poolId}/preview`);
};

export const drawFromPool = (poolId: number, userId: number) => {
  return request.post(`/api/pools/${poolId}/draw`, { user_id: userId });
};

// 盲盒相关API (旧版兼容)
export const getAllBoxes = () => {
  return request.get('/api/boxes');
};

export const drawBox = (boxId: number, userId: number) => {
  return request.post('/api/boxes/draw', { box_id: boxId, user_id: userId });
};

// 认证相关API
export const login = (username: string, password: string) => {
  return request.post('/api/auth/login', { username, password });
};

export const register = (username: string, password: string) => {
  return request.post('/api/auth/register', { username, password });
};

// 订单相关API
export const getUserOrders = (userId: number) => {
  return request.get(`/api/orders/user/${userId}`);
};

export const getOrderStats = (userId: number) => {
  return request.get(`/api/orders/stats/${userId}`);
};

// 排行榜API
export const getLuckRankings = () => {
  return request.get('/api/rankings/luck');
};

// 朋友圈相关API
export const getMoments = () => {
  return request.get('/api/moments');
};

export const createMoment = (data: { user_id: number; content: string; image_url?: string }) => {
  return request.post('/api/moments', data);
};
