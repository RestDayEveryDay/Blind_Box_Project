import axios from 'axios';

const request = axios.create({
  baseURL: 'http://localhost:3001/api', // 注意端口号和后端一致
  timeout: 5000,
});

export default request;
