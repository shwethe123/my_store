import React, { useState, useEffect } from 'react';
import axios from 'axios';
import {
  Card,
  Table,
  Button,
  Modal,
  Form,
  Input,
  Space,
  Tag,
  message,
} from 'antd';
import {
  PlusOutlined,
  EditOutlined,
  DeleteOutlined,
} from '@ant-design/icons';

const API = 'http://localhost:5000/api/categories';

const Categories = () => {
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [form] = Form.useForm();
  const [editingCategory, setEditingCategory] = useState(null);
  const [categories, setCategories] = useState([]);

  // Fetch categories from backend
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await axios.get(API);
        setCategories(response.data);
      } catch (error) {
        message.error('Failed to fetch categories');
        console.error(error);
      }
    };

    fetchCategories();
  }, []);

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
            onClick={() => handleDelete(record._id)}
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

  const handleDelete = async (id) => {
    try {
      // Placeholder for delete request if backend supports DELETE
      await axios.delete(`${API}/${id}`);
      setCategories(categories.filter((cat) => cat._id !== id));
      message.success('Category deleted successfully');
    } catch (error) {
      message.error('Failed to delete category');
      console.error(error);
    }
  };

  const handleSubmit = async (values) => {
    if (editingCategory) {
      try {
        // Placeholder for PUT request if backend supports updates
        const response = await axios.put(`${API}/${editingCategory._id}`, values);
        setCategories(
          categories.map((cat) =>
            cat._id === editingCategory._id ? response.data : cat
          )
        );
        message.success('Category updated successfully');
      } catch (error) {
        message.error('Failed to update category');
        console.error(error);
      }
    } else {
      try {
        const response = await axios.post(API, values);
        setCategories([...categories, response.data]);
        message.success('Category added successfully');
      } catch (error) {
        message.error('Failed to add category');
        console.error(error);
      }
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
          rowKey="_id"
          pagination={{ pageSize: 6 }}
        />
      </Card>

      <Modal
        title={editingCategory ? 'Edit Category' : 'Add New Category'}
        open={isModalVisible}
        onCancel={() => {
          setIsModalVisible(false);
          form.resetFields();
          setEditingCategory(null);
        }}
        onOk={form.submit}
        okText={editingCategory ? 'Update' : 'Create'}
      >
        <Form form={form} layout="vertical" onFinish={handleSubmit}>
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
            rules={[
              { required: true, message: 'Please input category description!' },
            ]}
          >
            <Input.TextArea rows={4} />
          </Form.Item>
        </Form>
      </Modal>
    </>
  );
};

export default Categories;
