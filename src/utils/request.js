import axios from 'axios';
import { API_BASE_URL, MOCK_DATA_CONFIG } from './config';

// 创建axios实例
const request = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
});

// 请求拦截器
request.interceptors.request.use(
  (config) => {
    // 可以在这里添加token等认证信息
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// 响应拦截器
request.interceptors.response.use(
  (response) => {
    return response.data;
  },
  (error) => {
    console.error('API请求错误:', error);
    return Promise.reject(error);
  }
);

// 模拟数据生成器
const mockDataGenerator = {
  // 模拟出入库记录数据
  generateInventoryData: () => {
    const items = [
      { id: 1, itemName: '笔记本电脑', category: '电子设备', type: '入库', quantity: 10, date: '2023-08-01', remarks: '新项目启动' },
      { id: 2, itemName: '办公桌椅', category: '办公家具', type: '入库', quantity: 5, date: '2023-08-05', remarks: '新员工入职' },
      { id: 3, itemName: '投影仪', category: '电子设备', type: '出库', quantity: 1, date: '2023-08-10', remarks: '会议使用' },
      { id: 4, itemName: '打印纸', category: '办公用品', type: '入库', quantity: 20, date: '2023-08-15', remarks: '日常消耗' },
      { id: 5, itemName: '服务器', category: 'IT设备', type: '入库', quantity: 2, date: '2023-08-20', remarks: '系统升级' },
      { id: 6, itemName: '键盘鼠标套装', category: '电子设备', type: '出库', quantity: 3, date: '2023-08-25', remarks: '设备更换' },
    ];
    return { code: 0, data: items, message: 'success' };
  },

  // 模拟项目资源数据
  generateResourceData: () => {
    const resources = [
      { id: 1, name: '张三', role: '项目经理', department: '技术部', available: true, allocation: '项目A 80%', skills: '项目管理,团队协作' },
      { id: 2, name: '李四', role: '前端开发', department: '技术部', available: false, allocation: '项目B 100%', skills: 'React,Vue,JavaScript' },
      { id: 3, name: '王五', role: '后端开发', department: '技术部', available: true, allocation: '项目A 50%', skills: 'Java,SpringBoot,MySQL' },
      { id: 4, name: '赵六', role: 'UI设计师', department: '设计部', available: true, allocation: '项目C 30%', skills: 'Photoshop,Figma,设计系统' },
      { id: 5, name: '钱七', role: '测试工程师', department: '测试部', available: false, allocation: '项目B 100%', skills: '自动化测试,性能测试' },
    ];
    return { code: 0, data: resources, message: 'success' };
  },

  // 模拟项目进展数据
  generateProgressData: () => {
    const projects = [
      { id: 1, name: '项目A', startDate: '2023-08-01', endDate: '2023-12-31', progress: 45, status: '进行中', responsible: '张三', budget: 500000 },
      { id: 2, name: '项目B', startDate: '2023-07-15', endDate: '2023-11-15', progress: 80, status: '进行中', responsible: '李四', budget: 300000 },
      { id: 3, name: '项目C', startDate: '2023-09-01', endDate: '2024-01-15', progress: 20, status: '进行中', responsible: '王五', budget: 400000 },
      { id: 4, name: '项目D', startDate: '2023-06-01', endDate: '2023-09-30', progress: 100, status: '已完成', responsible: '赵六', budget: 200000 },
      { id: 5, name: '项目E', startDate: '2023-10-01', endDate: '2024-03-31', progress: 5, status: '进行中', responsible: '钱七', budget: 600000 },
    ];
    return { code: 0, data: projects, message: 'success' };
  },
};

// 模拟API请求
const mockRequest = (generator) => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(generator());
    }, MOCK_DATA_CONFIG.mockDelay);
  });
};

// 导出封装的API请求方法
export const api = {
  // 出入库记录相关API
  inventory: {
    list: () => {
      if (MOCK_DATA_CONFIG.enableMock) {
        return mockRequest(mockDataGenerator.generateInventoryData);
      }
      return request.get('/inventory/list');
    },
    add: (data) => {
      if (MOCK_DATA_CONFIG.enableMock) {
        return mockRequest(() => ({ code: 0, message: '添加成功' }));
      }
      return request.post('/inventory/add', data);
    },
    update: (id, data) => {
      if (MOCK_DATA_CONFIG.enableMock) {
        return mockRequest(() => ({ code: 0, message: '更新成功' }));
      }
      return request.put(`/inventory/update/${id}`, data);
    },
    delete: (id) => {
      if (MOCK_DATA_CONFIG.enableMock) {
        return mockRequest(() => ({ code: 0, message: '删除成功' }));
      }
      return request.delete(`/inventory/delete/${id}`);
    },
  },

  // 项目资源相关API
  resources: {
    list: () => {
      if (MOCK_DATA_CONFIG.enableMock) {
        return mockRequest(mockDataGenerator.generateResourceData);
      }
      return request.get('/resources/list');
    },
    update: (id, data) => {
      if (MOCK_DATA_CONFIG.enableMock) {
        return mockRequest(() => ({ code: 0, message: '更新成功' }));
      }
      return request.put(`/resources/update/${id}`, data);
    },
  },

  // 项目进展相关API
  progress: {
    list: () => {
      if (MOCK_DATA_CONFIG.enableMock) {
        return mockRequest(mockDataGenerator.generateProgressData);
      }
      return request.get('/progress/list');
    },
    update: (id, data) => {
      if (MOCK_DATA_CONFIG.enableMock) {
        return mockRequest(() => ({ code: 0, message: '更新成功' }));
      }
      return request.put(`/progress/update/${id}`, data);
    },
  },
};

export default request;