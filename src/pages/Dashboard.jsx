import React, { useState, useEffect } from 'react';
import { Card, Statistic, Row, Col, Progress, List, Avatar, Tag, Button, Typography } from 'antd';
import { DatabaseOutlined, ToolOutlined, LineChartOutlined, ClockCircleOutlined, CheckCircleOutlined } from '@ant-design/icons';
import { Link } from 'react-router-dom';
import { api } from '../utils/request';

const { Title, Text } = Typography;

const Dashboard = () => {
  const [stats, setStats] = useState({
    totalInventory: 0,
    totalResources: 0,
    totalProjects: 0,
    completedProjects: 0,
  });
  const [recentProjects, setRecentProjects] = useState([]);
  const [pendingTasks, setPendingTasks] = useState([]);

  // 初始化数据
  useEffect(() => {
    loadDashboardData();
  }, []);

  // 加载仪表盘数据
  const loadDashboardData = async () => {
    try {
      // 获取库存数据
      const inventoryResponse = await api.inventory.list();
      const totalInventory = inventoryResponse.data.length;

      // 获取资源数据
      const resourcesResponse = await api.resources.list();
      const totalResources = resourcesResponse.data.length;

      // 获取项目数据
      const progressResponse = await api.progress.list();
      const totalProjects = progressResponse.data.length;
      const completedProjects = progressResponse.data.filter(project => project.progress === 100).length;

      // 最近项目（按进度排序）
      const sortedProjects = [...progressResponse.data].sort((a, b) => new Date(b.startDate) - new Date(a.startDate)).slice(0, 5);

      // 待处理任务（模拟数据）
      const tasks = [
        { id: 1, title: '审核项目A的出库申请', priority: 'high', dueDate: '2023-09-01' },
        { id: 2, title: '更新项目B的进度报告', priority: 'medium', dueDate: '2023-09-03' },
        { id: 3, title: '安排新员工培训', priority: 'low', dueDate: '2023-09-05' },
        { id: 4, title: '库存盘点', priority: 'medium', dueDate: '2023-09-10' },
        { id: 5, title: '季度预算评审', priority: 'high', dueDate: '2023-09-15' },
      ];

      setStats({
        totalInventory,
        totalResources,
        totalProjects,
        completedProjects,
      });
      setRecentProjects(sortedProjects);
      setPendingTasks(tasks);
    } catch (error) {
      console.error('加载仪表盘数据失败:', error);
    }
  };

  // 获取优先级标签样式
  const getPriorityTag = (priority) => {
    switch (priority) {
      case 'high':
        return <Tag color="red">高优先级</Tag>;
      case 'medium':
        return <Tag color="orange">中优先级</Tag>;
      case 'low':
        return <Tag color="green">低优先级</Tag>;
      default:
        return <Tag>普通</Tag>;
    }
  };

  // 获取项目状态图标
  const getProjectStatusIcon = (status) => {
    switch (status) {
      case '已完成':
        return <CheckCircleOutlined style={{ color: '#52c41a' }} />;
      case '进行中':
        return <ClockCircleOutlined style={{ color: '#1890ff' }} />;
      case '已暂停':
        return <ClockCircleOutlined style={{ color: '#faad14' }} />;
      default:
        return <ClockCircleOutlined style={{ color: '#d9d9d9' }} />;
    }
  };

  return (
    <div className="dashboard">
      <Title level={4} className="page-title">首页概览</Title>
      
      {/* 统计卡片区域 */}
      <Row gutter={[16, 16]} className="stats-row">
        <Col xs={24} sm={12} md={6}>
          <Card hoverable className="stat-card">
            <Statistic
              title="出入库记录总数"
              value={stats.totalInventory}
              prefix={<DatabaseOutlined />}
              valueStyle={{ color: '#1890ff' }}
            />
            <Text type="secondary" className="stat-desc">最近30天新增: 12</Text>
          </Card>
        </Col>
        <Col xs={24} sm={12} md={6}>
          <Card hoverable className="stat-card">
            <Statistic
              title="项目资源总数"
              value={stats.totalResources}
              prefix={<ToolOutlined />}
              valueStyle={{ color: '#52c41a' }}
            />
            <Text type="secondary" className="stat-desc">可用资源: 18</Text>
          </Card>
        </Col>
        <Col xs={24} sm={12} md={6}>
          <Card hoverable className="stat-card">
            <Statistic
              title="项目总数"
              value={stats.totalProjects}
              prefix={<LineChartOutlined />}
              valueStyle={{ color: '#faad14' }}
            />
            <Text type="secondary" className="stat-desc">进行中: {stats.totalProjects - stats.completedProjects}</Text>
          </Card>
        </Col>
        <Col xs={24} sm={12} md={6}>
          <Card hoverable className="stat-card">
            <Statistic
              title="已完成项目"
              value={stats.completedProjects}
              suffix={`/${stats.totalProjects}`}
              valueStyle={{ color: '#722ed1' }}
            />
            <Text type="secondary" className="stat-desc">完成率: {(stats.totalProjects > 0 ? Math.round((stats.completedProjects / stats.totalProjects) * 100) : 0)}%</Text>
          </Card>
        </Col>
      </Row>

      {/* 主要内容区域 */}
      <Row gutter={[16, 16]} className="main-content-row">
        {/* 最近项目 */}
        <Col xs={24} md={12}>
          <Card title="最近项目进展" className="content-card">
            <List
              itemLayout="horizontal"
              dataSource={recentProjects}
              renderItem={(project) => (
                <List.Item className="project-item">
                  <List.Item.Meta
                    avatar={
                      <Avatar>{project.name.charAt(0)}</Avatar>
                    }
                    title={
                      <div className="project-title">
                        <span>{project.name}</span>
                        <span className="project-status">{getProjectStatusIcon(project.status)} {project.status}</span>
                      </div>
                    }
                    description={
                      <div className="project-details">
                        <Text type="secondary">负责人: {project.responsible}</Text>
                        <Progress percent={project.progress} size="small" strokeColor="#1890ff" />
                        <Text type="secondary">预算: ¥{project.budget.toLocaleString()}</Text>
                      </div>
                    }
                  />
                </List.Item>
              )}
            />
            <div className="card-footer">
              <Button type="link" className="view-all-btn">
                <Link to="/progress">查看全部项目</Link>
              </Button>
            </div>
          </Card>
        </Col>

        {/* 待处理任务 */}
        <Col xs={24} md={12}>
          <Card title="待处理任务" className="content-card">
            <List
              dataSource={pendingTasks}
              renderItem={(task) => (
                <List.Item className="task-item">
                  <List.Item.Meta
                    title={
                      <div className="task-title">
                        <span>{task.title}</span>
                        {getPriorityTag(task.priority)}
                      </div>
                    }
                    description={
                      <Text type="secondary">截止日期: {task.dueDate}</Text>
                    }
                  />
                  <Button size="small" type="primary" className="handle-btn">处理</Button>
                </List.Item>
              )}
            />
            <div className="card-footer">
              <Button type="primary" className="add-task-btn">添加新任务</Button>
            </div>
          </Card>
        </Col>
      </Row>

      {/* 快速操作区域 */}
      <div className="quick-actions">
        <Title level={5} className="section-title">快速操作</Title>
        <Row gutter={[16, 16]}>
          <Col xs={24} sm={12} md={6}>
            <Link to="/inventory">
              <Button type="primary" block className="action-btn" icon={<DatabaseOutlined />}>
                新增出入库记录
              </Button>
            </Link>
          </Col>
          <Col xs={24} sm={12} md={6}>
            <Link to="/resources">
              <Button type="primary" block className="action-btn" icon={<ToolOutlined />}>
                管理项目资源
              </Button>
            </Link>
          </Col>
          <Col xs={24} sm={12} md={6}>
            <Link to="/progress">
              <Button type="primary" block className="action-btn" icon={<LineChartOutlined />}>
                更新项目进展
              </Button>
            </Link>
          </Col>
          <Col xs={24} sm={12} md={6}>
            <Button type="primary" block className="action-btn">
              生成报表
            </Button>
          </Col>
        </Row>
      </div>
    </div>
  );
};

export default Dashboard;