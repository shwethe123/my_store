import { useState, useEffect } from 'react';
import { 
  Form, 
  Input, 
  InputNumber, 
  Select, 
  Button, 
  Upload, 
  Card, 
  Row, 
  Col, 
  Space,
  Divider,
  Image,
  Typography,
  message
} from 'antd';
import { PlusOutlined, UploadOutlined } from '@ant-design/icons';
import axios from 'axios';

const { TextArea } = Input;
const { Title } = Typography;

const ProductForm = () => {
  const [form] = Form.useForm();
  const [categories, setCategories] = useState([]);
  const [imageUrl, setImageUrl] = useState('');
  const [loading, setLoading] = useState(false);
  const [fileList, setFileList] = useState([]);

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      const response = await axios.get('http://localhost:5000/api/categories');
      setCategories(response.data);
    } catch (error) {
      console.error('Error fetching categories:', error);
      message.error('Failed to load categories');
    }
  };

  const onFinish = async (values) => {
    setLoading(true);
    const formData = new FormData();
    
    // Append all form values to formData
    Object.entries(values).forEach(([key, value]) => {
      if (key === 'features') {
        formData.append(key, JSON.stringify(value.filter(f => f.trim() !== '')));
      } else if (key === 'specs') {
        formData.append(key, JSON.stringify(value));
      } else if (key === 'image') {
        // Image will be handled by upload component
      } else {
        formData.append(key, value);
      }
    });

    // Append the actual image file
    if (fileList.length > 0) {
      formData.append('image', fileList[0].originFileObj);
    }

    try {
      await axios.post('http://localhost:5000/api/products', formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });
      message.success('Product added successfully!');
      form.resetFields();
      setImageUrl('');
      setFileList([]);
    } catch (error) {
      console.error('Error creating product:', error);
      message.error(error.response?.data?.message || 'Failed to add product');
    } finally {
      setLoading(false);
    }
  };

  const beforeUpload = (file) => {
    const isImage = file.type.startsWith('image/');
    if (!isImage) {
      message.error('You can only upload image files!');
      return Upload.LIST_IGNORE;
    }
    const isLt5M = file.size / 1024 / 1024 < 5;
    if (!isLt5M) {
      message.error('Image must be smaller than 5MB!');
      return Upload.LIST_IGNORE;
    }
    return false; // Return false to handle upload manually
  };

  const handleUploadChange = ({ fileList: newFileList }) => {
    setFileList(newFileList);
    if (newFileList.length > 0 && newFileList[0].originFileObj) {
      setImageUrl(URL.createObjectURL(newFileList[0].originFileObj));
    } else {
      setImageUrl('');
    }
  };

  return (
    <div style={{ padding: '24px' }}>
      <Card 
        title={
          <Title level={4} style={{ margin: 0 }}>
            Add New Product
          </Title>
        }
        bordered={false}
      >
        <Form
          form={form}
          layout="vertical"
          onFinish={onFinish}
          autoComplete="off"
          validateTrigger="onBlur"
        >
          <Row gutter={16}>
            <Col xs={24} md={12}>
              <Form.Item
                label="Product Name"
                name="name"
                rules={[
                  { required: true, message: 'Please enter product name' },
                  { max: 100, message: 'Name cannot exceed 100 characters' }
                ]}
              >
                <Input 
                  placeholder="e.g. Premium Wireless Headphones" 
                  showCount 
                  maxLength={100} 
                />
              </Form.Item>
            </Col>
            <Col xs={24} md={12}>
              <Form.Item
                label="Category"
                name="category"
                rules={[{ required: true, message: 'Please select category' }]}
              >
                <Select placeholder="Select a category">
                  {categories.map(category => (
                    <Select.Option key={category._id} value={category.name}>
                      {category.name}
                    </Select.Option>
                  ))}
                </Select>
              </Form.Item>
            </Col>
          </Row>

          <Row gutter={16}>
            <Col xs={24} md={8}>
              <Form.Item
                label="Price (Ks)"
                name="price"
                rules={[
                  { required: true, message: 'Please enter price' },
                  { type: 'number', min: 100, message: 'Minimum price is 100 Ks' },
                  { type: 'number', max: 10000000, message: 'Maximum price is 10,000,000 Ks' }
                ]}
              >
                <InputNumber 
                  style={{ width: '100%' }}
                  formatter={value => `Ks ${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                  parser={value => value.replace(/Ks\s?|(,*)/g, '')}
                  min={100}
                  max={10000000}
                />
              </Form.Item>
            </Col>
            <Col xs={24} md={8}>
              <Form.Item
                label="Stock Quantity"
                name="stock"
                rules={[
                  { required: true, message: 'Please enter stock quantity' },
                  { type: 'number', min: 0, message: 'Stock cannot be negative' },
                  { type: 'number', max: 10000, message: 'Maximum stock is 10,000' }
                ]}
              >
                <InputNumber style={{ width: '100%' }} min={0} max={10000} />
              </Form.Item>
            </Col>
            <Col xs={24} md={8}>
              <Form.Item
                label="Rating (1-5)"
                name="rating"
                rules={[
                  { required: true, message: 'Please enter rating' },
                  { type: 'number', min: 0, max: 5, message: 'Rating must be between 0-5' }
                ]}
              >
                <InputNumber 
                  style={{ width: '100%' }} 
                  min={0} 
                  max={5} 
                  step={0.1} 
                  precision={1}
                />
              </Form.Item>
            </Col>
          </Row>

          <Form.Item
            label="Description"
            name="description"
            rules={[
              { required: true, message: 'Please enter description' },
              { min: 20, message: 'Description should be at least 20 characters' },
              { max: 1000, message: 'Description cannot exceed 1000 characters' }
            ]}
          >
            <TextArea 
              rows={4} 
              placeholder="Detailed product description..." 
              showCount 
              maxLength={1000} 
            />
          </Form.Item>

          <Divider orientation="left">Features</Divider>
          <Form.List 
            name="features"
            rules={[
              {
                validator: async (_, features) => {
                  if (!features || features.filter(f => f.trim() !== '').length < 1) {
                    return Promise.reject(new Error('Please add at least one feature'));
                  }
                },
              },
            ]}
          >
            {(fields, { add, remove }, { errors }) => (
              <>
                {fields.map(({ key, name, ...restField }) => (
                  <Space key={key} style={{ display: 'flex', marginBottom: 8 }} align="baseline">
                    <Form.Item
                      {...restField}
                      name={[name]}
                      rules={[
                        { required: true, message: 'Please enter feature' },
                        { max: 100, message: 'Feature cannot exceed 100 characters' }
                      ]}
                    >
                      <Input placeholder="Feature" maxLength={100} />
                    </Form.Item>
                    <Button type="dashed" onClick={() => remove(name)} danger>
                      Remove
                    </Button>
                  </Space>
                ))}
                <Form.Item>
                  <Button type="dashed" onClick={() => add()} block icon={<PlusOutlined />}>
                    Add Feature
                  </Button>
                  <Form.ErrorList errors={errors} />
                </Form.Item>
              </>
            )}
          </Form.List>

          <Divider orientation="left">Specifications</Divider>
          <Row gutter={16}>
            <Col xs={24} md={12}>
              <Form.Item 
                label="Brand" 
                name={['specs', 'Brand']}
                rules={[
                  { required: true, message: 'Please enter brand' },
                  { max: 50, message: 'Brand cannot exceed 50 characters' }
                ]}
              >
                <Input placeholder="e.g. Apple" maxLength={50} />
              </Form.Item>
              <Form.Item 
                label="Model" 
                name={['specs', 'Model']}
                rules={[
                  { required: true, message: 'Please enter model' },
                  { max: 50, message: 'Model cannot exceed 50 characters' }
                ]}
              >
                <Input placeholder="e.g. iPhone 13 Pro" maxLength={50} />
              </Form.Item>
            </Col>
            <Col xs={24} md={12}>
              <Form.Item 
                label="Color" 
                name={['specs', 'Color']}
                rules={[
                  { required: true, message: 'Please enter color' },
                  { max: 30, message: 'Color cannot exceed 30 characters' }
                ]}
              >
                <Input placeholder="e.g. Space Gray" maxLength={30} />
              </Form.Item>
              <Form.Item 
                label="Weight" 
                name={['specs', 'Weight']}
                rules={[
                  { required: true, message: 'Please enter weight' },
                  { max: 20, message: 'Weight cannot exceed 20 characters' }
                ]}
              >
                <Input placeholder="e.g. 204g" maxLength={20} />
              </Form.Item>
            </Col>
          </Row>

          <Divider orientation="left">Product Image</Divider>
          <Form.Item
            name="image"
            rules={[{ required: true, message: 'Please upload product image' }]}
          >
            <Upload
              listType="picture-card"
              fileList={fileList}
              beforeUpload={beforeUpload}
              onChange={handleUploadChange}
              accept="image/*"
              maxCount={1}
            >
              {fileList.length >= 1 ? null : (
                <div>
                  <UploadOutlined />
                  <div style={{ marginTop: 8 }}>Upload (Max 5MB)</div>
                </div>
              )}
            </Upload>
          </Form.Item>

          {imageUrl && (
            <Image
              src={imageUrl}
              alt="preview"
              style={{ maxWidth: '200px', marginBottom: '16px', display: 'block' }}
              preview={false}
            />
          )}

          <Form.Item>
            <Button 
              type="primary" 
              htmlType="submit" 
              loading={loading} 
              size="large"
              style={{ width: '200px' }}
            >
              Submit Product
            </Button>
          </Form.Item>
        </Form>
      </Card>
    </div>
  );
};

export default ProductForm;