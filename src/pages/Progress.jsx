import React, { useState, useEffect } from 'react';
import { Table, Button, Modal, Form, Input, DatePicker, InputNumber, Tag, Card, Typography, Space, Row, Col } from 'antd';
import { Progress as AntProgress } from 'antd';
import { PlusOutlined, EditOutlined, SearchOutlined, ReloadOutlined, BarChartOutlined } from '@ant-design/icons';
import { api } from '../utils/request';
import moment from 'moment';
import './Progress.css';

const { Title } = Typography;
const { Option } = Select;
const { RangePicker } = DatePicker;

const ProjectProgress = () => {
  const [dataSource, setDataSource] = useState([]);
  const [loading, setLoading] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [currentProject, setCurrentProject] = useState(null);
  const [editForm] = Form.useForm();
  const [searchForm] = Form.useForm();
  const [chartVisible, setChartVisible] = useState(false);

  // 加载项目数据
  const loadData = async () => {
    setLoading(true);
    try {
      const response = await api.progress.list();
      setDataSource(response.data);
    } catch (error) {
      console.error('获取项目数据失败:', error);
    } finally {
      setLoading(false);
    }
  };

  // 初始加载
  useEffect(() => {
    loadData();
  }, []);

  // 打开编辑模态框
  const showEditModal = (record) => {
    setCurrentProject(record);
    editForm.setFieldsValue({
      ...record,
      startDate: moment(record.startDate),
      endDate: moment(record.endDate),
    });
    setModalVisible(true);
  };

  // 处理保存
  const handleSave = async () => {
    try {
      const values = await editForm.validateFields();
      const formData = {
        ...values,
        startDate: values.startDate.format('YYYY-MM-DD'),
        endDate: values.endDate.format('YYYY-MM-DD'),
      };
      
      await api.progress.update(currentProject.id, formData);
      setModalVisible(false);
      loadData();
    } catch (error) {
      console.error('保存失败:', error);
    }
  };

  // 搜索功能
  const handleSearch = async (values) => {
    setLoading(true);
    try {
      // 模拟搜索逻辑
      const filteredData = dataSource.filter(item => {
        const matchesName = !values.name || item.name.includes(values.name);
        const matchesStatus = !values.status || item.status === values.status;
        // 日期范围搜索（模拟）
        let matchesDate = true;
        if (values.dateRange && values.dateRange.length === 2) {
          const itemStartDate = moment(item.startDate);
          matchesDate = itemStartDate.isBetween(values.dateRange[0], values.dateRange[1], null, '[]');
        }
        return matchesName && matchesStatus && matchesDate;
      });
      setDataSource(filteredData);
    } catch (error) {
      console.error('搜索失败:', error);
    } finally {
      setLoading(false);
    }
  };

  // 重置搜索
  const handleReset = () => {
    searchForm.resetFields();
    loadData();
  };

  // 获取项目状态标签
  const getStatusTag = (status) => {
    switch (status) {
      case '已完成':
        return <Tag color="green">已完成</Tag>;
      case '进行中':
        return <Tag color="blue">进行中</Tag>;
      case '已暂停':
        return <Tag color="orange">已暂停</Tag>;
      case '未开始':
        return <Tag color="gray">未开始</Tag>;
      default:
        return <Tag>其他</Tag>;
    }
  };

  // 获取进度条颜色
  const getProgressColor = (progress) => {
    if (progress === 100) {
      return '#52c41a';
    } else if (progress >= 50) {
      return '#1890ff';
    } else if (progress >= 20) {
      return '#faad14';
    } else {
      return '#ff4d4f';
    }
  };

  // 表格列定义
  const columns = [
    {
      title: '项目名称',
      dataIndex: 'name',
      key: 'name',
      sorter: (a, b) => a.name.localeCompare(b.name),
    },
    {
      title: '开始日期',
      dataIndex: 'startDate',
      key: 'startDate',
      sorter: (a, b) => new Date(a.startDate) - new Date(b.startDate),
    },
    {
      title: '结束日期',
      dataIndex: 'endDate',
      key: 'endDate',
      sorter: (a, b) => new Date(a.endDate) - new Date(b.endDate),
    },
    {
      title: '进度',
      dataIndex: 'progress',
      key: 'progress',
      render: (progress) => (
        <div className="progress-cell">
          <AntProgress 
            percent={progress} 
            size="small" 
            strokeColor={getProgressColor(progress)}
            className="progress-bar"
          />
          <span className="progress-text">{progress}%</span>
        </div>
      ),
      sorter: (a, b) => a.progress - b.progress,
    },
    {
      title: '状态',
      dataIndex: 'status',
      key: 'status',
      render: (status) => getStatusTag(status),
      filters: [
        { text: '已完成', value: '已完成' },
        { text: '进行中', value: '进行中' },
        { text: '已暂停', value: '已暂停' },
        { text: '未开始', value: '未开始' },
      ],
      onFilter: (value, record) => record.status === value,
    },
    {
      title: '负责人',
      dataIndex: 'responsible',
      key: 'responsible',
      sorter: (a, b) => a.responsible.localeCompare(b.responsible),
    },
    {
      title: '预算',
      dataIndex: 'budget',
      key: 'budget',
      render: (budget) => `¥${budget.toLocaleString()}`,
      sorter: (a, b) => a.budget - b.budget,
    },
    {
      title: '操作',
      key: 'action',
      width: 100,
      render: (_, record) => (
        <Button
          type="link"
          icon={<EditOutlined />}
          onClick={() => showEditModal(record)}
          size="small"
        >
          编辑
        </Button>
      ),
    },
  ];

  // 状态选项
  const statusOptions = [
    { value: '已完成', label: '已完成' },
    { value: '进行中', label: '进行中' },
    { value: '已暂停', label: '已暂停' },
    { value: '未开始', label: '未开始' },
  ];

  return (
    <div className="progress-page">
      <Title level={4} className="page-title">项目实施进展管理</Title>

      {/* 搜索和操作区域 */}
      <Card className="search-card">
        <Form
          form={searchForm}
          layout="horizontal"
          onFinish={handleSearch}
          className="search-form"
        >
          <Row gutter={16}>
            <Col xs={24} sm={12} md={6}>
              <Form.Item name="name" label="项目名称" labelCol={{ span: 8 }} wrapperCol={{ span: 16 }}>
                <Input placeholder="请输入项目名称" />
              </Form.Item>
            </Col>
            <Col xs={24} sm={12} md={6}>
              <Form.Item name="status" label="项目状态" labelCol={{ span: 8 }} wrapperCol={{ span: 16 }}>
                <Select placeholder="请选择状态" allowClear>
                  {statusOptions.map((option) => (
                    <Option key={option.value} value={option.value}>{option.label}</Option>
                  ))}
                </Select>
              </Form.Item>
            </Col>
            <Col xs={24} sm={12} md={6}>
              <Form.Item name="dateRange" label="开始日期范围" labelCol={{ span: 8 }} wrapperCol={{ span: 16 }}>
                <RangePicker />
              </Form.Item>
            </Col>
          </Row>
          <Row gutter={16} className="search-actions">
            <Col>
              <Space>
                <Button type="primary" htmlType="submit" icon={<SearchOutlined />}>
                  搜索
                </Button>
                <Button onClick={handleReset}>
                  重置
                </Button>
                <Button type="link" onClick={loadData} icon={<ReloadOutlined />}>
                  刷新
                </Button>
                <Button onClick={() => setChartVisible(true)} icon={<BarChartOutlined />}>
                  进度图表
                </Button>
              </Space>
            </Col>
            <Col className="add-button-container">
              <Button type="primary" onClick={() => {
                setCurrentProject(null);
                editForm.resetFields();
                setModalVisible(true);
              }} icon={<PlusOutlined />}>
                新增项目
              </Button>
            </Col>
          </Row>
        </Form>
      </Card>

      {/* 数据表格 */}
      <Card className="table-card" style={{ marginTop: 16 }}>
        <Table
          columns={columns}
          dataSource={dataSource}
          rowKey="id"
          loading={loading}
          pagination={{
            showSizeChanger: true,
            showQuickJumper: true,
            pageSizeOptions: ['10', '20', '50', '100'],
            showTotal: (total) => `共 ${total} 条记录`,
          }}
          scroll={{ x: 'max-content' }}
        />
      </Card>

      {/* 编辑/新增模态框 */}
      <Modal
        title={currentProject ? '编辑项目进展' : '新增项目'} 
        open={modalVisible}
        onOk={handleSave}
        onCancel={() => setModalVisible(false)}
        okText="保存"
        cancelText="取消"
        width={600}
      >
        <Form
          form={editForm}
          layout="vertical"
          className="edit-form"
        >
          <Row gutter={16}>
            <Col span={24}>
              <Form.Item
                label="项目名称"
                name="name"
                rules={[{ required: true, message: '请输入项目名称' }]}
              >
                <Input placeholder="请输入项目名称" />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                label="开始日期"
                name="startDate"
                rules={[{ required: true, message: '请选择开始日期' }]}
              >
                <DatePicker style={{ width: '100%' }} />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                label="结束日期"
                name="endDate"
                rules={[{ required: true, message: '请选择结束日期' }]}
              >
                <DatePicker style={{ width: '100%' }} />
              </Form.Item>
            </Col>
            <Col span={24}>
              <Form.Item
                label="进度"
                name="progress"
                rules={[{ required: true, message: '请输入进度' }]}
              >
                <InputNumber min={0} max={100} style={{ width: '100%' }} placeholder="请输入进度百分比" />
              </Form.Item>
            </Col>
            <Col span={24}>
              <Form.Item
                label="状态"
                name="status"
                rules={[{ required: true, message: '请选择状态' }]}
              >
                <Select placeholder="请选择状态">
                  {statusOptions.map((option) => (
                    <Option key={option.value} value={option.value}>{option.label}</Option>
                  ))}
                </Select>
              </Form.Item>
            </Col>
            <Col span={24}>
              <Form.Item
                label="负责人"
                name="responsible"
                rules={[{ required: true, message: '请输入负责人' }]}
              >
                <Input placeholder="请输入负责人姓名" />
              </Form.Item>
            </Col>
            <Col span={24}>
              <Form.Item
                label="预算"
                name="budget"
                rules={[{ required: true, message: '请输入预算' }]}
              >
                <InputNumber min={0} style={{ width: '100%' }} placeholder="请输入预算金额" />
              </Form.Item>
            </Col>
          </Row>
        </Form>
      </Modal>
    </div>
  );
};

export default ProjectProgress;