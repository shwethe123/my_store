import React, { useState } from 'react';
import { Card, Table, Button, Modal, Form, Input, Space, Tag, message } from 'antd';
import { PlusOutlined, EditOutlined, DeleteOutlined } from '@ant-design/icons';

const Categories = () => {
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [form] = Form.useForm();
  const [editingCategory, setEditingCategory] = useState(null);

  // Sample categories data
  const [categories, setCategories] = useState([
    { id: 1, name: 'Electronics', description: 'Electronic devices and accessories', productCount: 150 },
    { id: 2, name: 'Clothing', description: 'Fashion and apparel', productCount: 200 },
    { id: 3, name: 'Books', description: 'Books and publications', productCount: 80 },
  ]);

  const columns = [
    {
      title: 'Name',
      dataIndex: 'name',
      key: 'name',
      render: (text) => <Tag color="blue">{text}</Tag>,
    },
    {
      title: 'Description',
      dataIndex: 'description',
      key: 'description',
    },
    {
      title: 'Products',
      dataIndex: 'productCount',
      key: 'productCount',
      render: (count) => <Tag color="green">{count} items</Tag>,
    },
    {
      title: 'Actions',
      key: 'actions',
      render: (_, record) => (
        <Space>
          <Button 
            icon={<EditOutlined />} 
            onClick={() => handleEdit(record)}
          />
          <Button 
            danger 
            icon={<DeleteOutlined />} 
            onClick={() => handleDelete(record.id)}
          />
        </Space>
      ),
    },
  ];

  const handleEdit = (category) => {
    setEditingCategory(category);
    form.setFieldsValue(category);
    setIsModalVisible(true);
  };

  const handleDelete = (id) => {
    setCategories(categories.filter(cat => cat.id !== id));
    message.success('Category deleted successfully');
  };

  const handleSubmit = (values) => {
    if (editingCategory) {
      setCategories(categories.map(cat => 
        cat.id === editingCategory.id ? { ...cat, ...values } : cat
      ));
      message.success('Category updated successfully');
    } else {
      const newCategory = {
        id: categories.length + 1,
        ...values,
        productCount: 0,
      };
      setCategories([...categories, newCategory]);
      message.success('Category added successfully');
    }
    setIsModalVisible(false);
    form.resetFields();
    setEditingCategory(null);
  };

  return (
    <>
      <Card
        title="Product Categories"
        extra={
          <Button 
            type="primary" 
            icon={<PlusOutlined />}
            onClick={() => {
              setEditingCategory(null);
              form.resetFields();
              setIsModalVisible(true);
            }}
          >
            Add Category
          </Button>
        }
      >
        <Table 
          columns={columns} 
          dataSource={categories}
          rowKey="id"
        />
      </Card>

      <Modal
        title={editingCategory ? "Edit Category" : "Add New Category"}
        open={isModalVisible}
        onCancel={() => {
          setIsModalVisible(false);
          form.resetFields();
          setEditingCategory(null);
        }}
        onOk={form.submit}
      >
        <Form
          form={form}
          layout="vertical"
          onFinish={handleSubmit}
        >
          <Form.Item
            name="name"
            label="Category Name"
            rules={[{ required: true, message: 'Please input category name!' }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            name="description"
            label="Description"
            rules={[{ required: true, message: 'Please input category description!' }]}
          >
            <Input.TextArea rows={4} />
          </Form.Item>
        </Form>
      </Modal>
    </>
  );
};

export default Categories;