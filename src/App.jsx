import React, { useState } from 'react';
import {
  MenuFoldOutlined,
  MenuUnfoldOutlined,
  UploadOutlined,
  UserOutlined,
  VideoCameraOutlined,
  DashboardOutlined,
  ShoppingOutlined,
} from '@ant-design/icons';
import { Layout, Menu, Button, theme, Card, Row, Col, Table, Statistic } from 'antd';
import { Line } from '@ant-design/charts';

const { Header, Sider, Content } = Layout;
import ProductList from './components/products/ProductList';

// Add this import
import Login from './components/auth/Login';
import ShoppingCart from './components/cart/ShoppingCart';
import { ShoppingCartOutlined } from '@ant-design/icons';
import Categories from './components/categories/Categories';
import { AppstoreOutlined } from '@ant-design/icons';

function App() {
  const [collapsed, setCollapsed] = useState(false);
  const [selectedKey, setSelectedKey] = useState('1');
  const {
    token: { colorBgContainer },
  } = theme.useToken();

  // Sample data for charts
  const chartData = [
    { year: '2020', value: 3 },
    { year: '2021', value: 4 },
    { year: '2022', value: 6 },
    { year: '2023', value: 9 },
  ];

  // Sample data for table
  const tableData = [
    { key: '1', product: 'Product A', price: '$100', stock: 50 },
    { key: '2', product: 'Product B', price: '$150', stock: 30 },
    { key: '3', product: 'Product C', price: '$200', stock: 20 },
  ];

  const columns = [
    { title: 'Product', dataIndex: 'product', key: 'product' },
    { title: 'Price', dataIndex: 'price', key: 'price' },
    { title: 'Stock', dataIndex: 'stock', key: 'stock' },
  ];

  // Render content based on selected menu item
  const renderContent = () => {
    switch (selectedKey) {
      case '1': // Dashboard
        return (
          <>
            <Row gutter={[16, 16]}>
              <Col span={8}>
                <Card>
                  <Statistic title="Total Sales" value={112893} prefix="$" />
                </Card>
              </Col>
              <Col span={8}>
                <Card>
                  <Statistic title="Total Orders" value={1528} />
                </Card>
              </Col>
              <Col span={8}>
                <Card>
                  <Statistic title="Active Users" value={892} />
                </Card>
              </Col>
            </Row>

            <Row gutter={[16, 16]} style={{ marginTop: '20px' }}>
              <Col span={16}>
                <Card title="Sales Overview">
                  <Line
                    data={chartData}
                    height={300}
                    xField="year"
                    yField="value"
                    point={{ size: 5, shape: 'diamond' }}
                    label={{ style: { fill: '#aaa' } }}
                  />
                </Card>
              </Col>
              <Col span={8}>
                <Card title="Recent Products">
                  <Table dataSource={tableData} columns={columns} pagination={false} size="small" />
                </Card>
              </Col>
            </Row>
          </>
        );
      case '5': // Products
        return <ProductList />;
      case '6': // Login
        return <Login />;
      case '7': // Shopping Cart
        return <ShoppingCart />;
      case '8':
        return <Categories />;
      default:
        return <div>Content</div>;
    }
  };

  return (
    <Layout style={{ minHeight: '100vh' }}>
      <Sider trigger={null} collapsible collapsed={collapsed}>
        <div className="demo-logo-vertical" />
        <Menu
          theme="dark"
          mode="inline"
          defaultSelectedKeys={['1']}
          selectedKeys={[selectedKey]}
          onSelect={({ key }) => setSelectedKey(key)}
          items={[
            {
              key: '1',
              icon: <DashboardOutlined />,
              label: 'Dashboard',
            },
            {
              key: '2',
              icon: <UserOutlined />,
              label: 'Users',
            },
            {
              key: '3',
              icon: <VideoCameraOutlined />,
              label: 'Media',
            },
            {
              key: '4',
              icon: <UploadOutlined />,
              label: 'Upload',
            },
            {
              key: '5',
              icon: <ShoppingOutlined />,
              label: 'Products',
            },
            {
              key: '6',
              icon: <UserOutlined />,
              label: 'Login',
            },
            {
              key: '7',
              icon: <ShoppingCartOutlined />,
              label: 'Cart',
            },
            // Add new menu item in items array
            {
              key: '8',
              icon: <AppstoreOutlined />,
              label: 'Categories',
            },
          ]}
        />
      </Sider>
      <Layout>
        <Header style={{ padding: 0, background: colorBgContainer }}>
          <Button
            type="text"
            icon={collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
            onClick={() => setCollapsed(!collapsed)}
            style={{
              fontSize: '16px',
              width: 64,
              height: 64,
            }}
          />
        </Header>
        <Content
          style={{
            margin: '24px 16px',
            padding: 24,
            minHeight: 280,
            background: colorBgContainer,
          }}
        >
          {renderContent()}
        </Content>
      </Layout>
    </Layout>
  );
}

export default App;
