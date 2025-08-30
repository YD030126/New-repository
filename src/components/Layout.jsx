import React, { useState } from 'react';
import { Layout, Menu, Avatar, Typography, Badge } from 'antd';
import { UserOutlined, HomeOutlined, DatabaseOutlined, ToolOutlined, LineChartOutlined, BellOutlined, SettingOutlined, LogoutOutlined, MenuFoldOutlined, MenuUnfoldOutlined } from '@ant-design/icons';
import { Link, useLocation } from 'react-router-dom';
import { MENU_ITEMS } from '../utils/config';
import './Layout.css';

const { Header, Sider, Content } = Layout;
const { Title } = Typography;

const LayoutComponent = ({ children }) => {
  const [collapsed, setCollapsed] = useState(false);
  const location = useLocation();

  // 获取当前路径对应的菜单项key
  const getCurrentKey = () => {
    const currentPath = location.pathname;
    const menuItem = MENU_ITEMS.find(item => item.path === currentPath);
    return menuItem ? menuItem.key : 'dashboard';
  };

  // 切换侧边栏折叠状态
  const toggleCollapsed = () => {
    setCollapsed(!collapsed);
  };

  // 根据图标名获取antd图标组件
  const getIconByType = (iconType) => {
    const iconMap = {
      home: <HomeOutlined />,
      database: <DatabaseOutlined />,
      tool: <ToolOutlined />,
      'line-chart': <LineChartOutlined />,
    };
    return iconMap[iconType] || <HomeOutlined />;
  };

  return (
    <Layout className="app-layout">
      <Sider
        width={250}
        theme="light"
        collapsible
        collapsed={collapsed}
        onCollapse={(value) => setCollapsed(value)}
        className="app-sider"
      >
        <div className="app-logo">
          <Title level={4} className="logo-text">
            {collapsed ? 'OA' : '办公OA系统'}
          </Title>
        </div>
        <Menu
          mode="inline"
          selectedKeys={[getCurrentKey()]}
          className="app-menu"
          style={{ borderRight: 0, padding: '20px 0' }}
        >
          {MENU_ITEMS.map((item) => (
            <Menu.Item
              key={item.key}
              icon={getIconByType(item.icon)}
              className="menu-item"
            >
              <Link to={item.path}>{item.label}</Link>
            </Menu.Item>
          ))}
        </Menu>
      </Sider>
      <Layout className="app-main-layout">
        <Header className="app-header">
          <div className="header-left">
            <button
              type="button"
              className="toggle-btn"
              onClick={toggleCollapsed}
            >
              {collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
            </button>
          </div>
          <div className="header-right">
            <Badge count={3} className="notification-badge">
              <BellOutlined className="header-icon" />
            </Badge>
            <SettingOutlined className="header-icon" />
            <div className="user-info">
              <Avatar className="user-avatar">
                <UserOutlined />
              </Avatar>
              <span className="user-name">管理员</span>
              <LogoutOutlined className="header-icon logout-icon" />
            </div>
          </div>
        </Header>
        <Content className="app-content">
          <div className="content-wrapper">
            {children}
          </div>
        </Content>
      </Layout>
    </Layout>
  );
};

export default LayoutComponent;