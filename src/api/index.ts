// src/api/index.ts
import request from '../utils/request';

export const drawBox = (userId: number) => {
  return request.post('/api/draw', { userId });
};

export const getAllBoxes = () => {
  return request.get('/api/boxes');
};

export const getBoxDetail = (boxId: number) => {
  return request.get(`/api/box/${boxId}`);
};

export const login = (username: string, password: string) => {
  return request.post('/api/login', { username, password });
};

export const register = (username: string, password: string) => {
  return request.post('/api/register', { username, password });
};

// 更多接口可在此继续添加…
