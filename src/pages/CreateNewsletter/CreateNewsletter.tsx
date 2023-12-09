import { FC, useEffect, useState } from "react";
import { Button, Col, Flex, Form, Row, Select } from "antd";
import Title from "antd/es/typography/Title";
import { useTranslation } from "react-i18next";
import TextArea from "antd/lib/input/TextArea";
import { gql, useLazyQuery } from "@apollo/client";

const { Option } = Select;

const EXCHANGE_RATES = gql`
  query userGroups($where: UserGroupEntityFilterInput) {
  userGroups(where:$where) {
      title
      id
      usersPhoneNumbers
  }
}
`;

interface IProps {}

export const CreateNewsletter: FC<IProps> = (): JSX.Element => {
  const { t } = useTranslation();
  const [ groups, setGroups ] = useState<any[]>([]);
  const [ executeSearch ] = useLazyQuery(EXCHANGE_RATES);

  const handleCreate = (body: any) => {
    console.log(body);
  };

  useEffect(() => {
    executeSearch().then((data) => {
      setGroups(data.data.userGroups.map(({ id, title, usersPhoneNumbers }) => ({
        value: id,
        label: title,
        data: usersPhoneNumbers,
      })));
    });
  }, []);

  const initialValues = {
    Group: null,
    Text: null,
  };

  return (
    <Flex gap="small" vertical>
      <Row gutter={[ 24, 24 ]} justify={"center"}>
        <Col xs={24} sm={24} md={24} lg={16} xl={8}>
          <Form
            layout="vertical"
            onFinish={handleCreate}
            initialValues={initialValues}
          >
            <Title>Create newsletter</Title>

            <Form.Item name="Group" label="Group" rules={[ { required: true } ]}>
              <Select
                placeholder="Select a group"
                allowClear
              >
                {groups.map(({ value, label }) => {
                  return <Option value={value}>{label}</Option>;
                })}

              </Select>
            </Form.Item>
            <Form.Item required name="Text" label={"content"} rules={[ { required: true } ]}>
              <TextArea rows={2} />
            </Form.Item>
            <Flex gap={"small"} vertical style={{ width: "100%" }}>
              <Form.Item>
                <Button htmlType="submit">{t("send")}</Button>
              </Form.Item>
            </Flex>
          </Form>
        </Col>
      </Row>
    </Flex>
  );
};