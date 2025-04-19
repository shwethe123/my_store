// src/components/orders/OrderList.jsx
import React, { useEffect, useState } from 'react';
import { Table, Tag, Typography, Collapse, Space, message, Spin } from 'antd';

const { Title, Text } = Typography;
const { Panel } = Collapse;

const OrderList = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchOrders = async () => {
      setLoading(true);
      try {
        const res = await fetch('http://localhost:5000/api/order');
        if (!res.ok) {
          throw new Error(`HTTP error! status: ${res.status}`);
        }
        const data = await res.json();
        setOrders(data);
      } catch (err) {
        console.error('Fetch error:', err);
        message.error('Failed to load orders. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, []);

  const columns = [
    {
      title: 'Customer',
      key: 'customer',
      render: (_, record) => (
        <Text strong>{`${record.firstName} ${record.lastName}`}</Text>
      ),
    },
    {
      title: 'City',
      dataIndex: 'city',
      key: 'city',
      render: (city) => city || '-',
    },
    {
      title: 'Phone',
      dataIndex: 'phone',
      key: 'phone',
      render: (phone) => phone || '-',
    },
    {
      title: 'Payment',
      dataIndex: 'paymentMethod',
      key: 'paymentMethod',
      render: (method) => (
        <Tag color={method === 'cash' ? 'green' : 'blue'}>
          {method ? method.toUpperCase() : 'N/A'}
        </Tag>
      ),
    },
    {
      title: 'Total',
      dataIndex: 'total',
      key: 'total',
      render: (total) => (
        <Text strong>฿{typeof total === 'number' ? total.toLocaleString() : '0'}</Text>
      ),
    },
    {
      title: 'Date',
      dataIndex: 'createdAt',
      key: 'createdAt',
      render: (date) => (
        <Text type="secondary">
          {date ? new Date(date).toLocaleString() : '-'}
        </Text>
      ),
    },
    {
        title: 'Status',
        dataIndex: 'status',
        key: 'status',
        render: (status) => {
          const statusText = status || 'Waiting';
          let color = '';
          
          if (statusText.toLowerCase() === 'success') {
            color = 'green';
          } else if (statusText.toLowerCase() === 'waiting') {
            color = 'gold';
          } else if (statusText.toLowerCase() === 'failed') {
            color = 'red';
          } else {
            color = 'blue'; // default color for other statuses
          }
      
          return (
            <Tag color={color} style={{ textTransform: 'capitalize' }}>
              {statusText}
            </Tag>
          );
        },
      }
  ];

  const expandedRowRender = (record) => {
    if (!record.cartItems || record.cartItems.length === 0) {
      return <Text type="secondary">No items in this order</Text>;
    }

    return (
      <Collapse defaultActiveKey={['1']} ghost>
        <Panel header={`Ordered Items (${record.cartItems.length})`} key="1">
          <Space direction="vertical" style={{ width: '100%' }}>
            {record.cartItems.map((item, index) => (
              <div 
                key={item.id || index} 
                style={{ 
                  display: 'flex', 
                  justifyContent: 'space-between',
                  marginBottom: 8,
                  padding: 8,
                  backgroundColor: index % 2 === 0 ? '#f9f9f9' : 'transparent'
                }}
              >
                <div>
                  <Text strong>{item.name}</Text>
                  <div style={{ marginTop: 4 }}>
                    <Text type="secondary" style={{ fontSize: 12 }}>
                      Qty: {item.quantity || 1}
                    </Text>
                    {item.address && (
                      <Text 
                        type="secondary" 
                        style={{ 
                          display: 'block', 
                          fontSize: 12,
                          marginTop: 4
                        }}
                      >
                        Address: {item.address}
                      </Text>
                    )}
                  </div>
                </div>
                <Text strong>฿{(item.price * (item.quantity || 1)).toFixed(2)}</Text>
              </div>
            ))}
            <div style={{ 
              display: 'flex', 
              justifyContent: 'flex-end',
              marginTop: 16,
              paddingTop: 8,
              borderTop: '1px dashed #ddd'
            }}>
              <Text strong style={{ fontSize: 16 }}>
                Order Total: ฿{record.total?.toLocaleString() || '0'}
              </Text>
            </div>
            <div>
                <Text>ဝယ်သူလိပ်စာ : <span className='text-orange-600'>{record.address}</span></Text>
            </div>
          </Space>
        </Panel>
      </Collapse>
    );
  };

  return (
    <div style={{ padding: 24 }}>
      <Title level={3} style={{ marginBottom: 24 }}>All Orders</Title>
      <Spin spinning={loading}>
        <Table
          dataSource={orders}
          columns={columns}
          rowKey={(record) => record._id}
          expandable={{ expandedRowRender }}
          pagination={{ 
            pageSize: 10,
            showSizeChanger: true,
            pageSizeOptions: ['10', '20', '50']
          }}
          bordered
          scroll={{ x: true }}
        />
      </Spin>
    </div>
  );
};

export default OrderList;