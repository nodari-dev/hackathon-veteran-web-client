import { FC } from "react";
import { Card, Col, Row, Skeleton } from "antd";
import Title from "antd/es/typography/Title";

interface IProps {
  data: any;
}

const cartStyles: any = {
  width: "100%",
};

const cartContentStyles: any = {
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
};

export const AnalyticsBar: FC<IProps> = ({ data }: any) => {
  return (
    <Skeleton loading={!data} active style={cartContentStyles}>
      <Row gutter={[ 16, 16 ]}>
        <Col xs={24} sm={12} md={8} lg={8} xl={8}>
          <Card title="Загальна кількість користувачів" style={cartStyles}>
            <Title level={2}>
              {data?.length}
            </Title>
          </Card>
        </Col>,
      </Row>
    </Skeleton>
  );
};