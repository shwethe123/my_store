import React, { useState } from 'react';
import { Table, Card, Button, Space, Tag, Image, Modal } from 'antd';
import { EditOutlined, DeleteOutlined, EyeOutlined } from '@ant-design/icons';
import AddProduct from './AddProduct';

const ProductList = () => {
  const [showAddProduct, setShowAddProduct] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  // Sample data
  const products = [
    {
      key: '1',
      name: 'iPhone 13 Pro',
      image: 'https://picsum.photos/100',
      category: 'Electronics',
      price: 999,
      stock: 50,
      status: 'In Stock',
    },
    {
      key: '2',
      name: 'Samsung Galaxy S21',
      image: 'https://picsum.photos/100',
      category: 'Electronics',
      price: 799,
      stock: 30,
      status: 'Low Stock',
    },
    {
      key: '3',
      name: 'MacBook Pro',
      image: 'https://picsum.photos/100',
      category: 'Electronics',
      price: 1299,
      stock: 0,
      status: 'Out of Stock',
    },
    {
      key: '4',
      name: 'MacBook Pro',
      image: 'https://picsum.photos/100',
      category: 'Electronics',
      price: 1299,
      stock: 0,
      status: 'Out of Stock',
    },
  ];

  const columns = [
    {
      title: 'Image',
      dataIndex: 'image',
      key: 'image',
      render: (image) => <Image src={image} width={50} />,
    },
    {
      title: 'Name',
      dataIndex: 'name',
      key: 'name',
      sorter: (a, b) => a.name.localeCompare(b.name),
    },
    {
      title: 'Category',
      dataIndex: 'category',
      key: 'category',
      filters: [
        { text: 'Electronics', value: 'Electronics' },
        { text: 'Clothing', value: 'Clothing' },
      ],
      onFilter: (value, record) => record.category === value,
    },
    {
      title: 'Price',
      dataIndex: 'price',
      key: 'price',
      render: (price) => `$${price}`,
      sorter: (a, b) => a.price - b.price,
    },
    {
      title: 'Stock',
      dataIndex: 'stock',
      key: 'stock',
      sorter: (a, b) => a.stock - b.stock,
    },
    {
      title: 'Status',
      key: 'status',
      dataIndex: 'status',
      render: (status) => {
        let color =
          status === 'In Stock'
            ? 'green'
            : status === 'Low Stock'
            ? 'orange'
            : 'red';
        return <Tag color={color}>{status}</Tag>;
      },
    },
    {
      title: 'Actions',
      key: 'actions',
      render: (_, record) => (
        <Space size="middle">
          <Button type="primary" icon={<EyeOutlined />} size="small" />
          <Button type="default" icon={<EditOutlined />} size="small" />
          <Button type="default" danger icon={<DeleteOutlined />} size="small" />
        </Space>
      ),
    },
  ];

  const handleCancel = () => {
    setModalVisible(false);
  };

  return (
    <>
      <Card
        title="Product List"
        extra={
          <Button type="primary" onClick={() => setModalVisible(true)}>
            Add New Product
          </Button>
        }
      >
        <Table
          columns={columns}
          dataSource={products}
          pagination={{
            pageSize: 10,
            showSizeChanger: true,
            showTotal: (total) => `Total ${total} items`,
          }}
        />
      </Card>

      <Modal
        title="Add New Product"
        visible={modalVisible}
        onCancel={handleCancel}
        footer={null}
        width={800}
        
      >
        <AddProduct onBack={handleCancel} />
      </Modal>
    </>
  );
};

export default ProductList;
