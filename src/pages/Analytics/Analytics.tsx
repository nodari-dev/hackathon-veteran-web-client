import {FC, useEffect, useState} from "react";
import { Card, Col, Flex, Result, Row, Select, Skeleton } from "antd";
import Title from "antd/es/typography/Title";
import { useTranslation } from "react-i18next";
import { FileSearchOutlined } from "@ant-design/icons";
import { constants } from "../../styles/constants";
import {gql, useLazyQuery} from "@apollo/client";
import {ColumnChart, LineChart, PieChart} from "../../components";

interface IProps {}

const GROUPS = gql`
  query UserGroups($where: UserGroupEntityFilterInput, $order: [UserGroupEntitySortInput!]) {
      userGroups(
        where: $where
        order: $order
      ) {
         title
         id
         usersPhoneNumbersCount
         usersPhoneNumbers
      }
    }
`;

const USERS = gql`
  query Users($where: UserEntityFilterInput, $order: [UserEntitySortInput!]) {
      users(where: $where, order: $order) {
        fullName
        region
        registrationDate
        type
        botTypes
        age
      }
  }
`

export const Analytics: FC<IProps> = (): JSX.Element => {
  const { t } = useTranslation();
  const [ group, setGroup ] = useState<any>();
  const [ selected, setSelected ] = useState(null);
  const [ getGroups, {data} ] = useLazyQuery(GROUPS);
  const [getUSERs, { data: users }] = useLazyQuery(USERS);


  const loading = !data;

  useEffect(() => {
    getGroups();
  }, [])

  useEffect(() => {
    const selectedGroup = data?.userGroups?.find((group:any) => group?.id === selected)
    setGroup(selectedGroup)

    if(selected != null){
      getUSERs({ variables: {
          where: {
            phoneNumber: {
              in: selectedGroup?.usersPhoneNumbers
            }
          }
        }})
    }
  }, [selected])

  const handleChange = (id: any) => {
    setSelected(id);
  };

  const getLineChartData = () => {
    return users?.users?.map((user:any) => {
      const newArray = [...user.botTypes]
      newArray.sort()
      return {...user, botTypes: newArray}
    })
  }

  return (
    <Flex gap="small" vertical>
      <Flex vertical>
        <Title>{t("analytics.users.title")}</Title>
        <Flex align={"center"} justify={"space-between"} gap={"middle"}>
          <Select
            placeholder={t("analytics.selectPlaceholder")}
            style={{ width: "280px" }}
            onChange={handleChange}
            value={selected}
            options={data?.userGroups?.map((group:any) => ({value: group?.id, label: group?.title}))}
          />
          {selected && <Title style={{ margin: 0 }} level={5}>{t("analytics.usersInGroup")}: {group?.usersPhoneNumbersCount}</Title>}
        </Flex>
      </Flex>

      {data?.userGroups?.length && users?.users?.length ? <Row gutter={[ 16, 16 ]}>
        <Skeleton loading={loading} active={true}>
          <Col xs={24} sm={12} md={12} lg={12} xl={12}>
            <Card title="Вік користувачів">
              <LineChart data={users?.users} keyword={"age"} />
            </Card>
          </Col>
        </Skeleton>
        <Skeleton loading={loading} active={true}>
          <Col xs={24} sm={12} md={12} lg={12} xl={12}>
            <Card title={t("analytics.recommendationDay")}>
              <LineChart data={getLineChartData()} keyword={"botTypes"} />
            </Card>
          </Col>
        </Skeleton>
        <Skeleton loading={loading} active={true}>
          <Col xs={24} sm={12} md={12} lg={12} xl={12}>
            <Card title={t("analytics.conversationState")}>
              <ColumnChart data={users?.users} keyword={"age"} />
            </Card>
          </Col>
        </Skeleton>
        <Skeleton loading={loading} active={true}>
          <Col xs={24} sm={12} md={12} lg={12} xl={12}>
            <Card title="Тип користувачів">
              <PieChart data={users?.users} keyword={"type"} />
            </Card>
          </Col>
        </Skeleton>
      </Row> : <Result
        icon={< FileSearchOutlined color={constants.black} />}
        title={selected ? "Please select another group" : "Please select a group"}
      />}
    </Flex>
  );
};