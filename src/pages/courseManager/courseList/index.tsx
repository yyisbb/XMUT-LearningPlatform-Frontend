import React, { useState, useEffect, useMemo, ReactNode, useRef } from 'react';
import {
  Card,
  DatePicker,
  Form,
  Input,
  Message,
  Modal,
  Pagination,
  PaginationProps,
  Space,
  Typography,
  Upload,
} from '@arco-design/web-react';
import { Button } from '@arco-design/web-react';

import { Grid } from '@arco-design/web-react';
import { IconPlus } from '@arco-design/web-react/icon';
import CourseCard from '@/pages/courseManager/courseList/courseCard';
import { addCourse, getTeacherAllCourse } from '@/api/course';
import { FormInstance } from '@arco-design/web-react/es/Form';
import { uploadFile } from '@/api/file';

const Row = Grid.Row;
const Col = Grid.Col;
const TextArea = Input.TextArea;

interface Course {
  courseList: {
    list: Array<any>;
    total: number;
  };
  user: any;
}

function CourseList() {
  const [data, setData] = useState<Course>({
    courseList: {
      list: [],
      total: 0,
    },
    user: {},
  });
  const [loading, setLoading] = useState(true);
  const [current, setCurrent] = useState(1);
  const [total, setTotal] = useState(0);
  const [pageSize, setPageSize] = useState(8);
  const [visible, setVisible] = React.useState(false);
  const formRef = useRef<FormInstance>();
  const [fileList, setFileList] = useState([]);
  const [fileUrl, setFileUrl] = useState('');
  useEffect(() => {
    fetchData();
  }, [current]);

  const fetchData = () => {
    setLoading(true);
    getTeacherAllCourse({ current, pageSize })
      .then((res) => {
        setData(res);
        setTotal(res.courseList.total);
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

  const onOk = () => {
    formRef.current.validate().then((values) => {
      if (!fileUrl) {
        Message.error('请上传课程封面');
        return;
      }
      const { time, name, description } = values;
      const [startTime, endTime] = time;
      setLoading(true);
      addCourse({ name, startTime, description, endTime, cover: fileUrl })
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
          onClick={addCourseBtn}
          icon={<IconPlus style={{ width: '20px', height: '20px' }} />}
        />
        <Typography.Title heading={6}>课程列表</Typography.Title>

        <Row gutter={20}>
          {data.courseList.list.length !== 0 ? (
            data.courseList.list.map((item, index) => (
              <Col span={6} key={item.id}>
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
      </Card>
    </Space>
  );
}

export default CourseList;
