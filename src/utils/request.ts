import axios from 'axios';

const request = axios.create({
  // 移除硬编码的baseURL，使用Vite代理
  timeout: 5000,
});

export default request;
