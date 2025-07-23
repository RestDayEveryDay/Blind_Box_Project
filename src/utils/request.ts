import axios from 'axios';

const request = axios.create({
  baseURL: 'http://localhost:3001', // 移除 /api 前缀，在具体请求中添加
  timeout: 5000,
});

export default request;
