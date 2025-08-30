// 全局配置文件
export const API_BASE_URL = '/api';
export const APP_NAME = '办公OA系统';

export const MENU_ITEMS = [
  {
    key: 'dashboard',
    label: '首页',
    icon: 'home',
    path: '/',
  },
  {
    key: 'inventory',
    label: '出入库记录',
    icon: 'database',
    path: '/inventory',
  },
  {
    key: 'resources',
    label: '项目资源管理',
    icon: 'tool',
    path: '/resources',
  },
  {
    key: 'progress',
    label: '项目实施进展',
    icon: 'line-chart',
    path: '/progress',
  },
];

// 模拟数据的初始配置
export const MOCK_DATA_CONFIG = {
  // 是否启用模拟数据
  enableMock: true,
  // 模拟数据延迟（毫秒）
  mockDelay: 300,
};