import { FC, ReactElement } from "react";
import "./index.less";
import { Button, Col, Form, Modal, Row } from "antd";
import { fastRender } from "components/modal/fastRender";
export interface IProps {
  /** 弹窗模块标题 */
  title?: string;
  /** 弹窗模宽度 */
  modalWidth?: number;
  children?: any;
  /** 模块内容，通过插槽以标签内容传入，组件通过prop.children接收 */
  content?: any;
  /** 是否显示modal */
  visible: boolean;
  onCancel: () => void;
  onOk: (e: any) => any;
  footer?: boolean;
  loading?: boolean;
  searchList?: any[];
}
/** 弹窗模块 */
export const MedModal: FC<IProps> = ({
  title,
  modalWidth,
  searchList,
  visible,
  onOk,
  onCancel,
  footer,
  loading,
  children,
}): ReactElement => {
  return (
    <Modal
      width={modalWidth || 700}
      title={title}
      visible={visible}
      footer={false}
      onCancel={onCancel}
      confirmLoading={loading}
    >
      <Form
        style={{
          padding: "20px 20px 0 0",
          marginBottom: "10px",
          backgroundColor: "#fff",
        }}
        onFinish={onOk}
      >
        {searchList && (
          <Row gutter={20}>
            {searchList.map((config, index) => (
              <Col span={24} key={index}>
                {fastRender(config)}
              </Col>
            ))}
          </Row>
        )}
        {children}
        <div style={{ display: "flex", justifyContent: "flex-end" }}>
          <Button
            type="primary"
            htmlType="submit"
            style={{ marginRight: 15 }}
            loading={loading}
            // onClick={() => onCancel()}
          >
            搜索
          </Button>
        </div>
      </Form>
    </Modal>
  );
};
