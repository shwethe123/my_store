import React from 'react';
import { Card, List, Button, InputNumber, Space, Typography, Divider } from 'antd';
import { DeleteOutlined } from '@ant-design/icons';

const { Text } = Typography;

const ShoppingCart = () => {
  const cartItems = [
    {
      id: 1,
      name: 'iPhone 13 Pro',
      price: 999,
      quantity: 1,
      image: 'https://picsum.photos/100',
    },
    {
      id: 2,
      name: 'Samsung Galaxy S21',
      price: 799,
      quantity: 1,
      image: 'https://picsum.photos/100',
    },
  ];

  const total = cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);

  return (
    <Card title="Shopping Cart">
      <List
        itemLayout="horizontal"
        dataSource={cartItems}
        renderItem={(item) => (
          <List.Item
            actions={[
              <Button icon={<DeleteOutlined />} danger type="text" />,
            ]}
          >
            <List.Item.Meta
              avatar={<img src={item.image} alt={item.name} width={50} />}
              title={item.name}
              description={`$${item.price}`}
            />
            <Space>
              <InputNumber 
                min={1} 
                defaultValue={item.quantity}
                onChange={(value) => console.log(value)}
              />
            </Space>
          </List.Item>
        )}
      />
      <Divider />
      <div style={{ textAlign: 'right' }}>
        <Text strong>Total: ${total}</Text>
        <Button type="primary" style={{ marginLeft: 16 }}>
          Checkout
        </Button>
      </div>
    </Card>
  );
};

export default ShoppingCart;