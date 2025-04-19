import React, { useState, useEffect } from 'react';
import { 
  Table, 
  Card, 
  Button, 
  Space, 
  Tag, 
  Image, 
  Modal, 
  Typography, 
  Input,
  Badge,
  notification,
  Popconfirm,
  Divider,
  Descriptions
} from 'antd';
import { 
  EditOutlined, 
  DeleteOutlined, 
  EyeOutlined, 
  PlusOutlined,
  SearchOutlined 
} from '@ant-design/icons';
import AddProduct from './AddProduct';
import axios from 'axios';

const { Title, Text } = Typography;

const ProductList = () => {
  const [modalVisible, setModalVisible] = useState(false);
  const [detailModalVisible, setDetailModalVisible] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [searchText, setSearchText] = useState('');
  const [selectedRowKeys, setSelectedRowKeys] = useState([]);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);

  // Fetch products from API
  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    setLoading(true);
    try {
      const response = await axios.get('http://localhost:5000/api/products');
      setProducts(response.data);
    } catch (error) {
      console.error('Error fetching products:', error);
      notification.error({
        message: 'Error',
        description: 'Failed to load products',
      });
    } finally {
      setLoading(false);
    }
  };

  const handleAddSuccess = () => {
    fetchProducts();
    setModalVisible(false);
    notification.success({
      message: 'Success',
      description: 'Product added successfully',
    });
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(`http://localhost:5000/api/products/${id}`);
      fetchProducts();
      notification.success({
        message: 'Success',
        description: 'Product deleted successfully',
      });
    } catch (error) {
      console.error('Error deleting product:', error);
      notification.error({
        message: 'Error',
        description: 'Failed to delete product',
      });
    }
  };

  const handleSearch = (value) => {
    setSearchText(value);
  };

  const filteredProducts = products.filter((product) =>
    Object.values(product).some(
      (val) =>
        typeof val === 'string' &&
        val.toLowerCase().includes(searchText.toLowerCase())
    )
  );

  const onSelectChange = (newSelectedRowKeys) => {
    setSelectedRowKeys(newSelectedRowKeys);
  };

  const rowSelection = {
    selectedRowKeys,
    onChange: onSelectChange,
  };

  const hasSelected = selectedRowKeys.length > 0;

  const handleDeleteSelected = async () => {
    try {
      await Promise.all(
        selectedRowKeys.map(id => 
          axios.delete(`http://localhost:5000/api/products/${id}`)
        )
      );
      fetchProducts();
      setSelectedRowKeys([]);
      notification.success({
        message: 'Success',
        description: `Deleted ${selectedRowKeys.length} products`,
      });
    } catch (error) {
      console.error('Error deleting products:', error);
      notification.error({
        message: 'Error',
        description: 'Failed to delete selected products',
      });
    }
  };

  const showProductDetails = (product) => {
    setSelectedProduct(product);
    setDetailModalVisible(true);
  };

  const columns = [
    {
      title: 'Image',
      dataIndex: 'imageUrls',
      key: 'image',
      render: (imageUrls) => (
        <Image 
          src={imageUrls?.[0] || 'https://via.placeholder.com/50'} 
          width={50} 
          style={{ borderRadius: 4 }} 
        />
      ),
    },
    {
      title: 'Name',
      dataIndex: 'name',
      key: 'name',
      sorter: (a, b) => a.name.localeCompare(b.name),
      render: (text) => <Text strong>{text}</Text>,
    },
    {
      title: 'Category',
      dataIndex: 'category',
      key: 'category',
      filters: [
        { text: 'Electronics', value: 'Electronics' },
        { text: 'Other', value: 'Other' },
      ],
      onFilter: (value, record) => record.category === value,
      render: (category) => <Tag color="blue">{category}</Tag>,
    },
    {
      title: 'Price',
      dataIndex: 'price',
      key: 'price',
      render: (price) => (
        <Text strong style={{ color: '#1890ff' }}>
          {price.toLocaleString()} Ks
        </Text>
      ),
      sorter: (a, b) => a.price - b.price,
    },
    {
      title: 'Rating',
      dataIndex: 'rating',
      key: 'rating',
      render: (rating) => (
        <Badge 
          count={rating} 
          style={{ backgroundColor: rating >= 4 ? '#52c41a' : rating >= 3 ? '#faad14' : '#f5222d' }} 
        />
      ),
      sorter: (a, b) => a.rating - b.rating,
    },
    {
      title: 'Stock',
      dataIndex: 'stock',
      key: 'stock',
      render: (stock) => (
        <Badge 
          count={stock} 
          style={{ 
            backgroundColor: stock > 10 ? '#52c41a' : stock > 0 ? '#faad14' : '#f5222d' 
          }} 
        />
      ),
      sorter: (a, b) => a.stock - b.stock,
    },
    {
      title: 'Actions',
      key: 'actions',
      render: (_, record) => (
        <Space size="small">
          <Button 
            type="text" 
            icon={<EyeOutlined style={{ color: '#1890ff' }} />} 
            size="small"
            title="View"
            onClick={() => showProductDetails(record)}
          />
          <Button 
            type="text" 
            icon={<EditOutlined style={{ color: '#52c41a' }} />} 
            size="small"
            title="Edit"
          />
          <Popconfirm
            title="Are you sure to delete this product?"
            onConfirm={() => handleDelete(record._id)}
            okText="Yes"
            cancelText="No"
          >
            <Button 
              type="text" 
              danger 
              icon={<DeleteOutlined />} 
              size="small"
              title="Delete"
            />
          </Popconfirm>
        </Space>
      ),
    },
  ];

  return (
    <div className="product-list-container">
      <Card
        title={
          <div className="flex justify-between items-center">
            <Title level={4} style={{ margin: 0 }}>
              Product Management
            </Title>
            <div className="flex space-x-2">
              <Input
                placeholder="Search products..."
                prefix={<SearchOutlined />}
                onChange={(e) => handleSearch(e.target.value)}
                style={{ width: 250 }}
                allowClear
              />
              <Button
                type="primary"
                icon={<PlusOutlined />}
                onClick={() => setModalVisible(true)}
              >
                Add Product
              </Button>
            </div>
          </div>
        }
        bordered={false}
        className="shadow-sm"
      >
        <div style={{ marginBottom: 16 }}>
          <Space>
            <Popconfirm
              title="Are you sure to delete selected products?"
              onConfirm={handleDeleteSelected}
              disabled={!hasSelected}
              okText="Yes"
              cancelText="No"
            >
              <Button 
                danger 
                disabled={!hasSelected}
                icon={<DeleteOutlined />}
              >
                Delete Selected
              </Button>
            </Popconfirm>
            <span style={{ marginLeft: 8 }}>
              {hasSelected ? `Selected ${selectedRowKeys.length} items` : ''}
            </span>
          </Space>
        </div>

        <Table
          columns={columns}
          dataSource={filteredProducts}
          rowKey="_id"
          rowSelection={rowSelection}
          loading={loading}
          pagination={{
            pageSize: 10,
            showSizeChanger: true,
            showQuickJumper: true,
            showTotal: (total) => `Total ${total} products`,
          }}
          scroll={{ x: 'max-content' }}
        />
      </Card>

      {/* Add Product Modal */}
      <Modal
        // title={
        //   <div className="flex items-center">
        //     <PlusOutlined style={{ color: '#1890ff', marginRight: 8 }} />
        //     <span>Add New Product</span>
        //   </div>
        // }
        visible={modalVisible}
        onCancel={() => setModalVisible(false)}
        footer={null}
        width={800}
        destroyOnClose
        centered
      >
        <AddProduct onSuccess={handleAddSuccess} onCancel={() => setModalVisible(false)} />
      </Modal>

      {/* Product Detail Modal */}
      <Modal
        title="Product Details"
        visible={detailModalVisible}
        onCancel={() => setDetailModalVisible(false)}
        footer={null}
        width={700}
        centered
      >
        {selectedProduct && (
          <div>
            <div className="flex mb-6">
              <Image
                src={selectedProduct.imageUrls?.[0] || 'https://via.placeholder.com/200'}
                width={200}
                style={{ borderRadius: 8 }}
              />
              <div className="ml-6">
                <Title level={4}>{selectedProduct.name}</Title>
                <Space size="middle">
                  <Tag color="blue">{selectedProduct.category}</Tag>
                  <Text strong style={{ color: '#1890ff', fontSize: 18 }}>
                    {selectedProduct.price.toLocaleString()} Ks
                  </Text>
                </Space>
                <Divider />
                <Space size="middle">
                  <Badge 
                    count={`Rating: ${selectedProduct.rating}`} 
                    style={{ backgroundColor: '#52c41a' }} 
                  />
                  <Badge 
                    count={`Reviews: ${selectedProduct.reviews}`} 
                    style={{ backgroundColor: '#1890ff' }} 
                  />
                  <Badge 
                    count={`Stock: ${selectedProduct.stock}`} 
                    style={{ 
                      backgroundColor: selectedProduct.stock > 10 
                        ? '#52c41a' 
                        : selectedProduct.stock > 0 
                          ? '#faad14' 
                          : '#f5222d'
                    }} 
                  />
                </Space>
              </div>
            </div>

            <Descriptions title="Product Information" bordered column={1}>
              <Descriptions.Item label="Description">
                {selectedProduct.description}
              </Descriptions.Item>
              <Descriptions.Item label="Features">
                <ul>
                  {selectedProduct.features?.map((feature, index) => (
                    <li key={index}>{feature}</li>
                  ))}
                </ul>
              </Descriptions.Item>
              <Descriptions.Item label="Specifications">
                {selectedProduct.specs && (
                  <div className="grid grid-cols-2 gap-4">
                    {Object.entries(selectedProduct.specs).map(([key, value]) => (
                      <div key={key}>
                        <Text strong className="capitalize">{key}:</Text> {value}
                      </div>
                    ))}
                  </div>
                )}
              </Descriptions.Item>
            </Descriptions>
          </div>
        )}
      </Modal>

      <style jsx global>{`
        .product-list-container .ant-table-thead > tr > th {
          font-weight: 600;
          background-color: #fafafa;
        }
        .product-list-container .ant-card-head {
          border-bottom: none;
          padding: 16px 24px;
        }
        .product-list-container .ant-card-body {
          padding: 0 24px 24px;
        }
        .product-list-container .ant-descriptions-item-label {
          font-weight: 500;
          width: 150px;
        }
      `}</style>
    </div>
  );
};

export default ProductList;