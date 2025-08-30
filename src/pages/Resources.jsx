import React, { useState, useEffect } from 'react';
import { Table, Button, Modal, Form, Input, Select, Switch, Tag, Card, Typography, Space, Row, Col } from 'antd';
import { PlusOutlined, SearchOutlined, EditOutlined, ReloadOutlined, FilterOutlined } from '@ant-design/icons';
import { api } from '../utils/request';
import './Resources.css';

const { Title } = Typography;
const { Option } = Select;

const Resources = () => {
  const [dataSource, setDataSource] = useState([]);
  const [loading, setLoading] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [currentResource, setCurrentResource] = useState(null);
  const [editForm] = Form.useForm();
  const [filterModalVisible, setFilterModalVisible] = useState(false);
  const [searchParams, setSearchParams] = useState({
    name: '',
    role: '',
    department: '',
    available: '',
  });

  // 加载资源数据
  const loadData = async () => {
    setLoading(true);
    try {
      const response = await api.resources.list();
      setDataSource(response.data);
    } catch (error) {
      console.error('获取资源数据失败:', error);
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
    setCurrentResource(record);
    editForm.setFieldsValue({
      ...record,
      available: record.available ? 1 : 0,
    });
    setModalVisible(true);
  };

  // 处理保存
  const handleSave = async () => {
    try {
      const values = await editForm.validateFields();
      const formData = {
        ...values,
        available: values.available === 1,
      };
      
      await api.resources.update(currentResource.id, formData);
      setModalVisible(false);
      loadData();
    } catch (error) {
      console.error('保存失败:', error);
    }
  };

  // 搜索功能
  const handleSearch = () => {
    setLoading(true);
    try {
      // 模拟搜索逻辑
      const filteredData = dataSource.filter(item => {
        const matchesName = !searchParams.name || item.name.includes(searchParams.name);
        const matchesRole = !searchParams.role || item.role === searchParams.role;
        const matchesDepartment = !searchParams.department || item.department === searchParams.department;
        const matchesAvailable = searchParams.available !== '' ? item.available === (searchParams.available === 'true') : true;
        return matchesName && matchesRole && matchesDepartment && matchesAvailable;
      });
      setDataSource(filteredData);
    } catch (error) {
      console.error('搜索失败:', error);
    } finally {
      setLoading(false);
      setFilterModalVisible(false);
    }
  };

  // 重置搜索
  const handleReset = () => {
    setSearchParams({
      name: '',
      role: '',
      department: '',
      available: '',
    });
    loadData();
  };

  // 获取资源状态标签
  const getStatusTag = (available) => {
    return available ? (
      <Tag color="green">可用</Tag>
    ) : (
      <Tag color="red">已分配</Tag>
    );
  };

  // 表格列定义
  const columns = [
    {
      title: '姓名',
      dataIndex: 'name',
      key: 'name',
      sorter: (a, b) => a.name.localeCompare(b.name),
    },
    {
      title: '角色',
      dataIndex: 'role',
      key: 'role',
      filters: [
        { text: '项目经理', value: '项目经理' },
        { text: '前端开发', value: '前端开发' },
        { text: '后端开发', value: '后端开发' },
        { text: 'UI设计师', value: 'UI设计师' },
        { text: '测试工程师', value: '测试工程师' },
      ],
      onFilter: (value, record) => record.role === value,
    },
    {
      title: '部门',
      dataIndex: 'department',
      key: 'department',
      filters: [
        { text: '技术部', value: '技术部' },
        { text: '设计部', value: '设计部' },
        { text: '测试部', value: '测试部' },
        { text: '产品部', value: '产品部' },
        { text: '行政部', value: '行政部' },
      ],
      onFilter: (value, record) => record.department === value,
    },
    {
      title: '状态',
      dataIndex: 'available',
      key: 'available',
      render: (available) => getStatusTag(available),
      filters: [
        { text: '可用', value: true },
        { text: '已分配', value: false },
      ],
      onFilter: (value, record) => record.available === value,
    },
    {
      title: '分配情况',
      dataIndex: 'allocation',
      key: 'allocation',
    },
    {
      title: '技能',
      dataIndex: 'skills',
      key: 'skills',
      render: (skills) => {
        const skillList = skills.split(',');
        return (
          <div>
            {skillList.map((skill, index) => (
              <Tag key={index} color="blue">{skill}</Tag>
            ))}
          </div>
        );
      },
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

  // 部门选项
  const departmentOptions = [
    { value: '技术部', label: '技术部' },
    { value: '设计部', label: '设计部' },
    { value: '测试部', label: '测试部' },
    { value: '产品部', label: '产品部' },
    { value: '行政部', label: '行政部' },
  ];

  // 角色选项
  const roleOptions = [
    { value: '项目经理', label: '项目经理' },
    { value: '产品经理', label: '产品经理' },
    { value: '前端开发', label: '前端开发' },
    { value: '后端开发', label: '后端开发' },
    { value: 'UI设计师', label: 'UI设计师' },
    { value: '测试工程师', label: '测试工程师' },
    { value: '运维工程师', label: '运维工程师' },
  ];

  // 状态选项
  const statusOptions = [
    { value: '', label: '全部' },
    { value: 'true', label: '可用' },
    { value: 'false', label: '已分配' },
  ];

  return (
    <div className="resources-page">
      <Title level={4} className="page-title">项目资源管理</Title>

      {/* 搜索和操作区域 */}
      <Card className="search-card">
        <Row gutter={16} className="search-actions">
          <Col>
            <Space>
              <Button onClick={() => setFilterModalVisible(true)} icon={<FilterOutlined />}>
                筛选
              </Button>
              <Button onClick={handleReset}>
                重置
              </Button>
              <Button type="link" onClick={loadData} icon={<ReloadOutlined />}>
                刷新
              </Button>
            </Space>
          </Col>
          <Col className="add-button-container">
            <Button type="primary" onClick={() => {
              setCurrentResource(null);
              editForm.resetFields();
              setModalVisible(true);
            }} icon={<PlusOutlined />}>
              新增资源
            </Button>
          </Col>
        </Row>
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

      {/* 筛选模态框 */}
      <Modal
        title="筛选资源"
        open={filterModalVisible}
        onOk={handleSearch}
        onCancel={() => setFilterModalVisible(false)}
        okText="确定"
        cancelText="取消"
        width={500}
      >
        <Form
          layout="vertical"
          className="filter-form"
        >
          <Row gutter={16}>
            <Col span={24}>
              <Form.Item label="姓名">
                <Input
                  value={searchParams.name}
                  onChange={(e) => setSearchParams({ ...searchParams, name: e.target.value })}
                  placeholder="请输入姓名"
                />
              </Form.Item>
            </Col>
            <Col span={24}>
              <Form.Item label="角色">
                <Select
                  value={searchParams.role}
                  onChange={(value) => setSearchParams({ ...searchParams, role: value })}
                  placeholder="请选择角色"
                  allowClear
                >
                  {roleOptions.map((option) => (
                    <Option key={option.value} value={option.value}>{option.label}</Option>
                  ))}
                </Select>
              </Form.Item>
            </Col>
            <Col span={24}>
              <Form.Item label="部门">
                <Select
                  value={searchParams.department}
                  onChange={(value) => setSearchParams({ ...searchParams, department: value })}
                  placeholder="请选择部门"
                  allowClear
                >
                  {departmentOptions.map((option) => (
                    <Option key={option.value} value={option.value}>{option.label}</Option>
                  ))}
                </Select>
              </Form.Item>
            </Col>
            <Col span={24}>
              <Form.Item label="状态">
                <Select
                  value={searchParams.available}
                  onChange={(value) => setSearchParams({ ...searchParams, available: value })}
                  placeholder="请选择状态"
                >
                  {statusOptions.map((option) => (
                    <Option key={option.value} value={option.value}>{option.label}</Option>
                  ))}
                </Select>
              </Form.Item>
            </Col>
          </Row>
        </Form>
      </Modal>

      {/* 编辑/新增模态框 */}
      <Modal
        title={currentResource ? '编辑资源' : '新增资源'}
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
                label="姓名"
                name="name"
                rules={[{ required: true, message: '请输入姓名' }]}
              >
                <Input placeholder="请输入姓名" />
              </Form.Item>
            </Col>
            <Col span={24}>
              <Form.Item
                label="角色"
                name="role"
                rules={[{ required: true, message: '请选择角色' }]}
              >
                <Select placeholder="请选择角色">
                  {roleOptions.map((option) => (
                    <Option key={option.value} value={option.value}>{option.label}</Option>
                  ))}
                </Select>
              </Form.Item>
            </Col>
            <Col span={24}>
              <Form.Item
                label="部门"
                name="department"
                rules={[{ required: true, message: '请选择部门' }]}
              >
                <Select placeholder="请选择部门">
                  {departmentOptions.map((option) => (
                    <Option key={option.value} value={option.value}>{option.label}</Option>
                  ))}
                </Select>
              </Form.Item>
            </Col>
            <Col span={24}>
              <Form.Item
                label="状态"
                name="available"
                valuePropName="checked"
                rules={[{ required: true, message: '请选择状态' }]}
              >
                <Select placeholder="请选择状态">
                  <Option value={1}>可用</Option>
                  <Option value={0}>已分配</Option>
                </Select>
              </Form.Item>
            </Col>
            <Col span={24}>
              <Form.Item
                label="分配情况"
                name="allocation"
              >
                <Input placeholder="请输入分配情况，如：项目A 80%" />
              </Form.Item>
            </Col>
            <Col span={24}>
              <Form.Item
                label="技能"
                name="skills"
                rules={[{ required: true, message: '请输入技能' }]}
              >
                <Input placeholder="请输入技能，多个技能用逗号分隔" />
              </Form.Item>
            </Col>
          </Row>
        </Form>
      </Modal>
    </div>
  );
};

export default Resources;