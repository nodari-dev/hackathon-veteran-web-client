import {FC, useEffect} from "react";
import {useTranslation} from "react-i18next";
import {Card, Col, Flex, Row, Skeleton} from "antd";
import Title from "antd/es/typography/Title";
import {AnalyticsBar} from "./components/AnalyticsBar";
import {ColumnChart, LineChart, PieChart} from "../../components";
import {gql, useLazyQuery} from "@apollo/client";

interface IProps {}

export const Dashboard: FC<IProps> = (): JSX.Element => {
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

  const [getUsers, { data }] = useLazyQuery(usersGQL);

  useEffect(() => {
    getUsers()
  }, [])

  const getLineChartData = () => {
    return data?.users?.map((user:any) => {
      const newArray = [...user.botTypes]
      newArray.sort()
      return {...user, botTypes: newArray}
    })
  }

  const loading = !data;

  return (

    <Flex gap={"small"} vertical>
      <Title>{t("home.title")}</Title>
      <AnalyticsBar data={data?.users} />
      <Row gutter={[ 16, 16 ]}>
        <Col xs={24} sm={12} md={12} lg={8} xl={8}>
          <Card title="Типи користувачів" style={{ width: "100%" }}>
            <Skeleton loading={loading} active={true}>
              <PieChart data={data?.users} keyword={"type"} />
            </Skeleton>
          </Card>
        </Col>
        <Col xs={24} sm={12} md={12} lg={8} xl={8}>
          <Card title="Користувачі по платформах" style={{ width: "100%" }}>
            <Skeleton loading={loading} active={true}>
              <LineChart data={loading ? [] : getLineChartData()} keyword={"botTypes"} />
            </Skeleton>
          </Card>
        </Col>
        <Col xs={24} sm={12} md={12} lg={8} xl={8}>
          <Card title="Користувачі по віку" style={{ width: "100%" }}>
            <Skeleton loading={loading} active={true}>
              <ColumnChart data={data?.users} keyword={"age"} />
            </Skeleton>
          </Card>
        </Col>
      </Row>
    </Flex>

  );
};