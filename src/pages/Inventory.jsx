import React, { useState, useEffect } from 'react';
import { Table, Button, Modal, Form, Input, Select, DatePicker, InputNumber, message, Row, Col, Card, Typography, Space, Tag } from 'antd';
import { PlusOutlined, SearchOutlined, EditOutlined, DeleteOutlined, ReloadOutlined } from '@ant-design/icons';
import { api } from '../utils/request';
import moment from 'moment';
import './Inventory.css';

const { Title } = Typography;
const { Option } = Select;
const { RangePicker } = DatePicker;

const Inventory = () => {
  const [dataSource, setDataSource] = useState([]);
  const [loading, setLoading] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [confirmModalVisible, setConfirmModalVisible] = useState(false);
  const [currentRecord, setCurrentRecord] = useState(null);
  const [modalType, setModalType] = useState('add'); // 'add' 或 'edit'
  const [searchForm] = Form.useForm();
  const [editForm] = Form.useForm();
  const [deleteId, setDeleteId] = useState(null);

  // 加载数据
  const loadData = async () => {
    setLoading(true);
    try {
      const response = await api.inventory.list();
      setDataSource(response.data);
    } catch (error) {
      message.error('获取数据失败');
      console.error('获取出入库记录失败:', error);
    } finally {
      setLoading(false);
    }
  };

  // 初始加载
  useEffect(() => {
    loadData();
  }, []);

  // 搜索功能
  const handleSearch = async (values) => {
    setLoading(true);
    try {
      // 模拟搜索，实际项目中应调用API
      const filteredData = dataSource.filter(item => {
        const matchesName = !values.itemName || item.itemName.includes(values.itemName);
        const matchesCategory = !values.category || item.category === values.category;
        const matchesType = values.type !== 'all' && values.type !== undefined ? item.type === values.type : true;
        // 日期范围搜索（模拟）
        let matchesDate = true;
        if (values.dateRange && values.dateRange.length === 2) {
          const itemDate = moment(item.date);
          matchesDate = itemDate.isBetween(values.dateRange[0], values.dateRange[1], null, '[]');
        }
        return matchesName && matchesCategory && matchesType && matchesDate;
      });
      setDataSource(filteredData);
    } catch (error) {
      message.error('搜索失败');
    } finally {
      setLoading(false);
    }
  };

  // 重置搜索
  const handleReset = () => {
    searchForm.resetFields();
    loadData();
  };

  // 打开添加模态框
  const showAddModal = () => {
    setModalType('add');
    setCurrentRecord(null);
    editForm.resetFields();
    setModalVisible(true);
  };

  // 打开编辑模态框
  const showEditModal = (record) => {
    setModalType('edit');
    setCurrentRecord(record);
    editForm.setFieldsValue({
      ...record,
      date: moment(record.date),
    });
    setModalVisible(true);
  };

  // 打开删除确认模态框
  const showDeleteConfirm = (id) => {
    setDeleteId(id);
    setConfirmModalVisible(true);
  };

  // 处理提交
  const handleSubmit = async () => {
    try {
      const values = await editForm.validateFields();
      const formData = {
        ...values,
        date: values.date.format('YYYY-MM-DD'),
      };

      if (modalType === 'add') {
        // 添加记录
        await api.inventory.add(formData);
        message.success('添加成功');
      } else {
        // 编辑记录
        await api.inventory.update(currentRecord.id, formData);
        message.success('更新成功');
      }
      setModalVisible(false);
      loadData();
    } catch (error) {
      console.error('提交失败:', error);
      message.error('提交失败');
    }
  };

  // 处理删除
  const handleDelete = async () => {
    try {
      await api.inventory.delete(deleteId);
      message.success('删除成功');
      setConfirmModalVisible(false);
      loadData();
    } catch (error) {
      console.error('删除失败:', error);
      message.error('删除失败');
    }
  };

  // 表格列定义
  const columns = [
    {
      title: '物品名称',
      dataIndex: 'itemName',
      key: 'itemName',
      sorter: (a, b) => a.itemName.localeCompare(b.itemName),
    },
    {
      title: '分类',
      dataIndex: 'category',
      key: 'category',
      filters: [
        { text: '电子设备', value: '电子设备' },
        { text: '办公家具', value: '办公家具' },
        { text: '办公用品', value: '办公用品' },
        { text: 'IT设备', value: 'IT设备' },
      ],
      onFilter: (value, record) => record.category === value,
    },
    {
      title: '类型',
      dataIndex: 'type',
      key: 'type',
      render: (type) => (
        <Tag color={type === '入库' ? 'green' : 'red'}>
          {type}
        </Tag>
      ),
      filters: [
        { text: '入库', value: '入库' },
        { text: '出库', value: '出库' },
      ],
      onFilter: (value, record) => record.type === value,
    },
    {
      title: '数量',
      dataIndex: 'quantity',
      key: 'quantity',
      sorter: (a, b) => a.quantity - b.quantity,
    },
    {
      title: '日期',
      dataIndex: 'date',
      key: 'date',
      sorter: (a, b) => new Date(a.date) - new Date(b.date),
    },
    {
      title: '备注',
      dataIndex: 'remarks',
      key: 'remarks',
    },
    {
      title: '操作',
      key: 'action',
      width: 120,
      render: (_, record) => (
        <Space size="middle">
          <Button
            type="link"
            icon={<EditOutlined />}
            onClick={() => showEditModal(record)}
            size="small"
          >
            编辑
          </Button>
          <Button
            type="link"
            icon={<DeleteOutlined />}
            onClick={() => showDeleteConfirm(record.id)}
            size="small"
            danger
          >
            删除
          </Button>
        </Space>
      ),
    },
  ];

  // 分类选项
  const categoryOptions = [
    { value: '电子设备', label: '电子设备' },
    { value: '办公家具', label: '办公家具' },
    { value: '办公用品', label: '办公用品' },
    { value: 'IT设备', label: 'IT设备' },
    { value: '其他', label: '其他' },
  ];

  return (
    <div className="inventory-page">
      <Title level={4} className="page-title">出入库记录管理</Title>

      {/* 搜索和操作区域 */}
      <Card className="search-card">
        <Form
          form={searchForm}
          layout="horizontal"
          onFinish={handleSearch}
          className="search-form"
        >
          <Row gutter={16}>
            <Col xs={24} sm={8} md={6}>
              <Form.Item name="itemName" label="物品名称" labelCol={{ span: 8 }} wrapperCol={{ span: 16 }}>
                <Input placeholder="请输入物品名称" />
              </Form.Item>
            </Col>
            <Col xs={24} sm={8} md={6}>
              <Form.Item name="category" label="物品分类" labelCol={{ span: 8 }} wrapperCol={{ span: 16 }}>
                <Select placeholder="请选择分类">
                  {categoryOptions.map((option) => (
                    <Option key={option.value} value={option.value}>{option.label}</Option>
                  ))}
                </Select>
              </Form.Item>
            </Col>
            <Col xs={24} sm={8} md={6}>
              <Form.Item name="type" label="记录类型" labelCol={{ span: 8 }} wrapperCol={{ span: 16 }}>
                <Select placeholder="请选择类型">
                  <Option value="all">全部</Option>
                  <Option value="入库">入库</Option>
                  <Option value="出库">出库</Option>
                </Select>
              </Form.Item>
            </Col>
            <Col xs={24} sm={8} md={6}>
              <Form.Item name="dateRange" label="日期范围" labelCol={{ span: 8 }} wrapperCol={{ span: 16 }}>
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
              </Space>
            </Col>
            <Col className="add-button-container">
              <Button type="primary" onClick={showAddModal} icon={<PlusOutlined />}>
                新增记录
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

      {/* 添加/编辑模态框 */}
      <Modal
        title={modalType === 'add' ? '新增出入库记录' : '编辑出入库记录'}
        open={modalVisible}
        onOk={handleSubmit}
        onCancel={() => setModalVisible(false)}
        okText="确定"
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
                label="物品名称"
                name="itemName"
                rules={[{ required: true, message: '请输入物品名称' }]}
              >
                <Input placeholder="请输入物品名称" />
              </Form.Item>
            </Col>
            <Col span={24}>
              <Form.Item
                label="物品分类"
                name="category"
                rules={[{ required: true, message: '请选择物品分类' }]}
              >
                <Select placeholder="请选择物品分类">
                  {categoryOptions.map((option) => (
                    <Option key={option.value} value={option.value}>{option.label}</Option>
                  ))}
                </Select>
              </Form.Item>
            </Col>
            <Col span={24}>
              <Form.Item
                label="记录类型"
                name="type"
                rules={[{ required: true, message: '请选择记录类型' }]}
              >
                <Select placeholder="请选择记录类型">
                  <Option value="入库">入库</Option>
                  <Option value="出库">出库</Option>
                </Select>
              </Form.Item>
            </Col>
            <Col span={24}>
              <Form.Item
                label="数量"
                name="quantity"
                rules={[{ required: true, message: '请输入数量' }]}
              >
                <InputNumber min={1} style={{ width: '100%' }} placeholder="请输入数量" />
              </Form.Item>
            </Col>
            <Col span={24}>
              <Form.Item
                label="日期"
                name="date"
                rules={[{ required: true, message: '请选择日期' }]}
              >
                <DatePicker style={{ width: '100%' }} />
              </Form.Item>
            </Col>
            <Col span={24}>
              <Form.Item
                label="备注"
                name="remarks"
              >
                <Input.TextArea rows={4} placeholder="请输入备注信息" />
              </Form.Item>
            </Col>
          </Row>
        </Form>
      </Modal>

      {/* 删除确认模态框 */}
      <Modal
        title="确认删除"
        open={confirmModalVisible}
        onOk={handleDelete}
        onCancel={() => setConfirmModalVisible(false)}
        okText="确认"
        cancelText="取消"
        okType="danger"
      >
        <p>确定要删除这条记录吗？此操作不可恢复。</p>
      </Modal>
    </div>
  );
};

export default Inventory;