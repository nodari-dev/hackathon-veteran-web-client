import {FC, useState} from "react";
import { Button, Col, Flex, Form, Input, InputNumber, Row, Select } from "antd";
import Title from "antd/es/typography/Title";
import { useNotification } from "../../hooks";
import { useNavigate } from "react-router-dom";
import { useTableData } from "../Group/useTableData";
import { useTranslation } from "react-i18next";
import {gql, useLazyQuery, useMutation} from "@apollo/client";

const { Option } = Select;

interface IProps {}

export const CreateGroup: FC<IProps> = (): JSX.Element => {
  const notification = useNotification();
  const { days, tableLabels, conversationStates } = useTableData();
  const { t } = useTranslation();


  const usersGQL = gql`
      query Users($where: UserEntityFilterInput, $order: [UserEntitySortInput!]) {
        users(where: $where, order: $order) {
          phoneNumber
          fullName
          age
          region
          type
          registrationDate
          botTypes
        }
      }
  `;

  const groupCreate  = gql`
      mutation CreateUserGroup($command: CreateUserGroupCommandInput!) {
        createUserGroup(command: $command) {
          id
        }
      }
  `;

  const [getUsers, { loading, error, data }] = useLazyQuery(usersGQL);
  const [create] = useMutation(groupCreate);
  const [title, setTitle] = useState()

  const initialValues = {
    name: null,
    region: "",
    minAge: 0,
    maxAge: 100,
    bot: "",
  };

  const findUsers = (body: any) => {
    try {
      setTitle(body.name)
      getUsers({ variables: {
          where: {
            age: {
              gte: body.minAge,
              ngt: body.maxAge
            },
            region: {
              contains: body.region
            },
            type: {
              eq: body.type
            },
            botTypes: {
              some: {contains: body.bot}
            }
          },
          order: [
            {
              registrationDate: "DESC"
            }
          ]
        }});
    } catch (e: any) {
      notification.error(e);
    }
  };

  const createGroup = () => {
    if(!!data?.users){
      const phones = data?.users.map(user => user?.phoneNumber)
      create({variables: {command: {title, usersPhoneNumbers: phones }}})
    }
  }

  return (

    <Flex gap="small" vertical>
      <Row gutter={[ 24, 24 ]} justify={"center"}>
        <Col xs={24} sm={24} md={24} lg={16} xl={8}>
          <Form
            layout="vertical"
            onFinish={findUsers}
            initialValues={initialValues}
          >
            <Title>{t("groups.createTitle")}</Title>
            <Form.Item required name="name" label={tableLabels.name}>
              <Input onChage={e => setTitle(e)} />
            </Form.Item>

            <Form.Item name="bot" label={tableLabels.customerTraffics}>
              <Select
                placeholder="Select social network"
              >
                <Option value="Telegram" label="Telegram">
                  Telegram
                </Option>
                <Option value="Messenger" label="Messenger">
                  Messenger
                </Option>
                <Option value="Viber" label="Viber">
                  Viber
                </Option>
              </Select>
            </Form.Item>

            <Form.Item name="region" label="Region">
              <Input />
            </Form.Item>

            <Form.Item name="minAge" style={{width: "100%"}} label="мін. вік">
              <InputNumber min={0} max={100} style={{width: "100%"}} />
            </Form.Item>

            <Form.Item name="maxAge" style={{width: "100%"}} label="Макс. Вік">
              <InputNumber min={0} max={100} style={{width: "100%"}} />
            </Form.Item>

            <Form.Item name="type" label="Тип користувача">
              <Select
                  placeholder="Тип користувача"
              >
                <Option value="FAMILY_MEMBER" label="FAMILY_MEMBER">
                  Член сім'ї
                </Option>
                <Option value="VETERAN" label="VETERAN">
                  Ветеран
                </Option>
              </Select>
            </Form.Item>

            <Form.Item>
              <Button htmlType="submit">{t("find group")}</Button>
            </Form.Item>
          </Form>
        </Col>
      </Row>
      {!!title &&
          <Row>Found users for {title}: {data?.users?.length} <Button onClick={createGroup}>{t("create group")}</Button></Row>
      }

    </Flex>

  );
};