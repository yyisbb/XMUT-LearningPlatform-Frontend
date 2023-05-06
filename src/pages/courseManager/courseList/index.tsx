import React, { useState, useEffect, useMemo, ReactNode, useRef } from 'react';
import {
  Card,
  DatePicker,
  Form,
  Input,
  Message,
  Modal,
  Pagination,
  Select,
  Space,
  Typography,
  Upload,
} from '@arco-design/web-react';
import { Button } from '@arco-design/web-react';

import { Grid } from '@arco-design/web-react';
import { IconCopy, IconPlus } from '@arco-design/web-react/icon';
import CourseCard from '@/pages/courseManager/courseList/courseCard';
import { addCourse, getTeacherAllCourse } from '@/api/course';
import { FormInstance } from '@arco-design/web-react/es/Form';
import { uploadFile } from '@/api/file';
import { Tabs } from '@arco-design/web-react';

const TabPane = Tabs.TabPane;
const Option = Select.Option;

const Row = Grid.Row;
const Col = Grid.Col;
const TextArea = Input.TextArea;

interface Course {
  courseListDTO: {
    nowCourseList: {
      list: Array<any>;
      total: number;
    };
    beforeCourseList: {
      list: Array<any>;
      total: number;
    };
  };
  user: any;
}

function CourseList() {
  const [data, setData] = useState<Course>({
    courseListDTO: {
      nowCourseList: {
        list: [],
        total: 0,
      },
      beforeCourseList: {
        list: [],
        total: 0,
      },
    },
    user: {},
  });
  const [loading, setLoading] = useState(true);
  const [current, setCurrent] = useState(1);
  const [total, setTotal] = useState(0);
  const [pageSize, setPageSize] = useState(8);
  const [visible, setVisible] = React.useState(false);
  const [copyVisible, setCopyVisible] = React.useState(false);
  const formRef = useRef<FormInstance>();
  const copyFormRef = useRef<FormInstance>();
  const [fileList, setFileList] = useState([]);
  const [groupId, setGroupId] = useState('');
  const [fileUrl, setFileUrl] = useState('');
  const [activeTab, setActiveTab] = useState('1');

  useEffect(() => {
    fetchData();
  }, [current, activeTab]);

  const fetchData = () => {
    setLoading(true);
    getTeacherAllCourse({ current, pageSize })
      .then((res) => {
        setData(res);
        setTotal(res.courseListDTO.nowCourseList.total);
      })
      .catch((e) => {
        Message.error('新增失败: ' + e);
      })
      .finally(() => {
        setLoading(false);
      });
  };

  const addCourseBtn = () => {
    setVisible(true);
    setFileList([]);
    setFileUrl('');
  };

  const copyCourseBtn = () => {
    setCopyVisible(true);
  };

  const onOk = () => {
    formRef.current.validate().then((values) => {
      if (!fileUrl) {
        Message.error('请上传课程封面');
        return;
      }
      const { time, name, className, description } = values;
      const [startTime, endTime] = time;
      setLoading(true);
      addCourse({
        name,
        startTime,
        className,
        description,
        endTime,
        cover: fileUrl,
      })
        .then((res) => {
          Message.success('新增成功');
          fetchData();
          setVisible(false);
        })
        .catch((e) => {
          Message.error('新增失败: ' + e);
        })
        .finally(() => {
          setLoading(false);
          setFileList([]);
          setFileUrl('');
        });
    });
  };
  const onCancel = () => {
    setVisible(false);
    setFileList([]);
    setFileUrl('');
  };

  const onCopyOk = () => {
    copyFormRef.current.validate().then((values) => {
      const { className } = values;
      setLoading(true);
      addCourse({
        className,
        groupId,
      })
        .then((res) => {
          Message.success('新增成功');
          fetchData();
          setCopyVisible(false);
        })
        .catch((e) => {
          Message.error('新增失败: ' + e);
        })
        .finally(() => {
          setLoading(false);
        });
    });
  };

  const onCopyCancel = () => {
    setCopyVisible(false);
  };

  useEffect(() => {
    return () => {
      setVisible(false);
      setFileList([]);
      setFileUrl('');
      setLoading(false);
    };
  }, []);

  const handleUpload = async (file) => {
    const formData = new FormData();
    formData.append('file', file.originFile);
    uploadFile(formData)
      .then((res) => {
        const newFileList = [...fileList, { uid: res, url: res }];
        setFileList(newFileList);
        setFileUrl(res);
      })
      .catch((e) => {
        Message.error('失败: ' + e);
      })
      .finally(() => {
        setLoading(false);
      });
  };

  return (
    <Space size={16} direction="vertical" style={{ width: '100%' }}>
      <Card loading={loading}>
        <Modal
          title="从已有课程复制课程内容"
          visible={copyVisible}
          onOk={onCopyOk}
          onCancel={onCopyCancel}
          autoFocus={false}
          focusLock={true}
        >
          <Form ref={copyFormRef} autoComplete="off">
            <Form.Item label="课程">
              <Select
                placeholder="已自动合并同类课程"
                onChange={(value) => {
                  setGroupId(value);
                }}
                style={{ width: '100%' }}
              >
                {data.courseListDTO.nowCourseList.list.map((option) => (
                  <Option key={option.id} value={option.groupId}>
                    {option.name}
                  </Option>
                ))}
              </Select>
            </Form.Item>
            <Form.Item
              rules={[{ required: true }]}
              field={'className'}
              label="班级名"
            >
              <Input allowClear placeholder="请输入班级名..." />
            </Form.Item>
          </Form>
        </Modal>
        <Modal
          title="添加课程"
          visible={visible}
          onOk={onOk}
          onCancel={onCancel}
          autoFocus={false}
          focusLock={true}
        >
          <Form ref={formRef} autoComplete="off">
            <Form.Item
              rules={[{ required: true }]}
              field={'name'}
              label="课程名"
            >
              <Input allowClear placeholder="请输入课程名..." />
            </Form.Item>
            <Form.Item
              rules={[{ required: true }]}
              field={'className'}
              label="班级名"
            >
              <Input allowClear placeholder="请输入班级名..." />
            </Form.Item>
            <Form.Item
              rules={[{ required: true }]}
              field={'description'}
              label="课程描述"
            >
              <TextArea
                placeholder="请输入课程描述..."
                style={{ minHeight: 100 }}
              />
            </Form.Item>
            <Form.Item
              rules={[{ required: true }]}
              field={'time'}
              label="课程时间"
            >
              <DatePicker.RangePicker allowClear />
            </Form.Item>
            <Form.Item label="课程封面">
              <Upload
                listType="picture-card"
                multiple
                imagePreview
                accept={'.jpeg,.png,.webp,.jpg'}
                limit={1}
                onRemove={(file, fileList) => {
                  setFileList([]);
                  setFileUrl('');
                }}
                fileList={fileList}
                onChange={(files) => handleUpload(files[0])}
              ></Upload>
            </Form.Item>
          </Form>
        </Modal>
        <Button
          style={{
            right: '30px',
            bottom: '30px',
            position: 'fixed',
            zIndex: 100,
            width: '60px',
            height: '60px',
          }}
          shape="circle"
          type="primary"
          onClick={copyCourseBtn}
          icon={<IconCopy style={{ width: '20px', height: '20px' }} />}
        />
        <Button
          style={{
            right: '30px',
            bottom: '100px',
            position: 'fixed',
            zIndex: 100,
            width: '60px',
            height: '60px',
          }}
          shape="circle"
          type="primary"
          onClick={addCourseBtn}
          icon={<IconPlus style={{ width: '20px', height: '20px' }} />}
        />
        <Typography.Title heading={6}>课程列表</Typography.Title>

        <Tabs activeTab={activeTab} onChange={setActiveTab}>
          <TabPane key="1" title="在授课程">
            <Row gutter={20}>
              {data.courseListDTO.nowCourseList.list.length !== 0 ? (
                data.courseListDTO.nowCourseList.list.map((item, index) => (
                  <Col span={4} key={item.id}>
                    <CourseCard user={data.user} item={item} />
                  </Col>
                ))
              ) : (
                <CourseCard user={data.user} />
              )}
            </Row>
            <Pagination
              onChange={(pageNumber, pageSize) => {
                setCurrent(pageNumber);
                setPageSize(pageSize);
              }}
              current={current}
              pageSize={pageSize}
              total={total}
              style={{
                marginTop: '5px',
                display: 'flex',
                justifyContent: 'center',
              }}
            />
          </TabPane>
          {data.courseListDTO.beforeCourseList.list.length !== 0 ? (
            <TabPane key="2" title="归档课程">
              <Row gutter={20}>
                {data.courseListDTO.beforeCourseList.list.length !== 0 ? (
                  data.courseListDTO.beforeCourseList.list.map(
                    (item, index) => (
                      <Col span={4} key={item.id}>
                        <CourseCard user={data.user} item={item} />
                      </Col>
                    )
                  )
                ) : (
                  <CourseCard user={data.user} />
                )}
              </Row>
            </TabPane>
          ) : (
            ''
          )}
        </Tabs>
      </Card>
    </Space>
  );
}

export default CourseList;
