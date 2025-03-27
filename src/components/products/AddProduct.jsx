import React, { useState } from 'react';
import {
  Form,
  Input,
  InputNumber,
  Upload,
  Select,
  Button,
  message,
} from 'antd';
import { UploadOutlined } from '@ant-design/icons';

const { TextArea } = Input;

const AddProduct = ({ onBack }) => {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);

  const onFinish = (values) => {
    setLoading(true);
    console.log('Form values:', values);
    // Here you can add API call to save product
    setTimeout(() => {
      message.success('Product added successfully!');
      form.resetFields();
      setLoading(false);
      onBack(); // Close modal after success
    }, 1000);
  };

  const categories = [
    'Electronics',
    'Clothing',
    'Books',
    'Home & Garden',
    'Toys',
    'Sports',
  ];

  const uploadProps = {
    name: 'file',
    action: 'https://run.mocky.io/v3/435e224c-44fb-4773-9faf-380c5e6a2188',
    headers: {
      authorization: 'authorization-text',
    },
    onChange(info) {
      if (info.file.status === 'done') {
        message.success(`${info.file.name} file uploaded successfully`);
      } else if (info.file.status === 'error') {
        message.error(`${info.file.name} file upload failed.`);
      }
    },
  };

  return (
        <Form form={form} layout="vertical" onFinish={onFinish} autoComplete="off">
          <Form.Item
            name="name"
            label="Product Name"
            rules={[{ required: true, message: 'Please input product name!' }]}
          >
            <Input placeholder="Enter product name" />
          </Form.Item>

          <Form.Item
            name="category"
            label="Category"
            rules={[{ required: true, message: 'Please select category!' }]}
          >
            <Select placeholder="Select category">
              {categories.map((category) => (
                <Select.Option key={category} value={category}>
                  {category}
                </Select.Option>
              ))}
            </Select>
          </Form.Item>

          <Form.Item
            name="price"
            label="Price"
            rules={[{ required: true, message: 'Please input price!' }]}
          >
            <InputNumber prefix="$" style={{ width: '100%' }} placeholder="Enter price" />
          </Form.Item>

          <Form.Item
            name="stock"
            label="Stock Quantity"
            rules={[{ required: true, message: 'Please input stock quantity!' }]}
          >
            <InputNumber style={{ width: '100%' }} placeholder="Enter stock quantity" />
          </Form.Item>

          <Form.Item
            name="description"
            label="Description"
            rules={[{ required: true, message: 'Please input description!' }]}
          >
            <TextArea rows={4} placeholder="Enter product description" />
          </Form.Item>

          <Form.Item
            name="images"
            label="Product Images"
            rules={[{ required: true, message: 'Please upload at least one image!' }]}
          >
            <Upload {...uploadProps} listType="picture">
              <Button icon={<UploadOutlined />}>Upload Images</Button>
            </Upload>
          </Form.Item>

          <Form.Item>
            <Button type="primary" htmlType="submit" loading={loading} block>
              Add Product
            </Button>
          </Form.Item>
      </Form>
  );
};

export default AddProduct;
