import { FC, useEffect, useState } from "react";
import { Button, Col, DatePicker, Flex, Form, Row, Select } from "antd";
import dayjs from "dayjs";
import Title from "antd/es/typography/Title";
import { useTranslation } from "react-i18next";
import TextArea from "antd/lib/input/TextArea";
import { gql, useLazyQuery, useMutation } from "@apollo/client";
import { useNavigate } from "react-router-dom";

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

const groupCreate = gql`
      mutation scheduleMessage($input:  ScheduleMessageInput!) {
        scheduleMessage(input: $input) {
          boolean
        }
      }
  `;

interface IProps {}

export const CreateNewsletter: FC<IProps> = (): JSX.Element => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [ groups, setGroups ] = useState<any[]>([]);
  const [ executeSearch ] = useLazyQuery(EXCHANGE_RATES);
  const [ create ] = useMutation(groupCreate);
  const handleCreate = (body: any) => {
    create({
      variables: {
        input: {
          command: {
            phoneNumbers: groups.find((i) => i.value === body.group).data,
            text: body.text,
            triggerAt: new Date(body.triggerAt),
          },
        },
      },
    }).then(() => {
      navigate("/newsletter/all");
    });
  };

  useEffect(() => {
    executeSearch().then((data) => {
      setGroups(data.data.userGroups.map(({ id, title, usersPhoneNumbers }:any) => ({
        value: id,
        label: title + ` (${usersPhoneNumbers.length})`,
        data: usersPhoneNumbers,
      })));
    });
  }, []);

  const initialValues = {
    group: null,
    text: null,
    triggerAt: null,
  };

  // eslint-disable-next-line arrow-body-style
  const disabledDate = (current: any) => {
    // Can not select days before today and today
    return current && current < dayjs().endOf("day");
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

            <Form.Item name="group" label="Group" rules={[ { required: true } ]}>
              <Select
                placeholder="Select a group"
                allowClear
              >
                {groups.map(({ value, label }) => {
                  return <Option value={value}>{label}</Option>;
                })}

              </Select>
            </Form.Item>
            <Form.Item required name="text" label={"content"} rules={[ { required: true } ]}>
              <TextArea rows={2} />
            </Form.Item>
            <Form.Item name="triggerAt" label="Schedule Time" rules={[ { required: true } ]}>
              <DatePicker
                disabledDate={disabledDate}
                showTime format="YYYY-MM-DD HH:mm:ss"
              />
            </Form.Item>
            <Flex gap={"small"} vertical style={{ width: "100%" }}>
              <Form.Item>
                <Button htmlType="submit">{t("Schedule")}</Button>
              </Form.Item>
            </Flex>
          </Form>
        </Col>
      </Row>
    </Flex>
  );
};