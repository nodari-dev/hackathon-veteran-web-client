import { FC, useState } from "react";
import { useTranslation } from "react-i18next";
import { Card, Col, Flex, Row, Skeleton } from "antd";
import Title from "antd/es/typography/Title";
import { AnalyticsBar } from "./components/AnalyticsBar";
import { IUser } from "../../models";
import { IData } from "../../models/data";
import { ColumnChart, LineChart, PieChart } from "../../components";

interface IProps {}

export const Dashboard: FC<IProps> = (): JSX.Element => {
  const { t } = useTranslation();

  const [ data, setData ] = useState<IData>();
  const [ users, setUsers ] = useState<IUser[]>([]);

  const loading = !data;

  return (

    <Flex gap={"small"} vertical>
      <Title>{t("home.title")}</Title>
      <AnalyticsBar data={data} />
      <Row gutter={[ 16, 16 ]}>
        <Col xs={24} sm={12} md={12} lg={8} xl={8}>
          <Card title={t("dashboard.regionsChart")} style={{ width: "100%" }}>
            <Skeleton loading={loading} active={true}>
              <PieChart data={users} keyword={"region.name"} />
            </Skeleton>
          </Card>
        </Col>
        <Col xs={24} sm={12} md={12} lg={8} xl={8}>
          <Card title={t("dashboard.daysChart")} style={{ width: "100%" }}>
            <Skeleton loading={loading} active={true}>
              <LineChart data={users} keyword={"recommendationDay"} />
            </Skeleton>
          </Card>
        </Col>
        <Col xs={24} sm={12} md={12} lg={8} xl={8}>
          <Card title={t("dashboard.deviceChart")} style={{ width: "100%" }}>
            <Skeleton loading={loading} active={true}>
              <ColumnChart data={users} keyword={"botType"} />
            </Skeleton>
          </Card>
        </Col>
      </Row>
    </Flex>

  );
};