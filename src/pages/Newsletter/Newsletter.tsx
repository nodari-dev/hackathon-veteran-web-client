import { FC, useEffect, useState } from "react";
import { Button, Descriptions, Flex, Skeleton, Table } from "antd";
import { useNavigate, useParams } from "react-router-dom";
import Title from "antd/es/typography/Title";
import { useTranslation } from "react-i18next";
import { gql, useLazyQuery } from "@apollo/client";

interface IProps {}

const line = gql`
  query pagedScheduledMessages($id: UUID!) {
  pagedScheduledMessages(
    where: {
      id: {eq: $id}
    }
  ) {
    totalCount
    items {
      id
      isTriggered
      phoneNumbers
      text
      triggerAt
    }
  }
}
`;

export const Newsletter: FC<IProps> = (): JSX.Element => {
  const { id } = useParams();
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [ groupData, setGroupData ] = useState<any>();
  const [ executeSearch ] = useLazyQuery(line);

  useEffect(() => {
    if (id) {
      executeSearch({ variables: { id } }).then((data) => {
        setGroupData(data.data.pagedScheduledMessages.items[0]);
      });
    }
  }, [ id ]);

  const items = groupData
    ? groupData.phoneNumbers.map((i: any) => ({ phoneNumber: i }))
    : [];

  const config: any = [
    {
      title: "ID",
      dataIndex: "phoneNumber",
      key: "phoneNumber",
    },
    {
      title: t("users.actions"),
      dataIndex: "",
      key: "x",
      fixed: "right",
      width: "100px",
      align: "center",
      render: (record: any) => <Button
        onClick={() => navigate("/user/" + record.phoneNumber)}
      >{t("users.view")}</Button>,
    },
  ];

  return (
    <Flex vertical>
      <Skeleton loading={!groupData} active={true}>
        <Descriptions title={t(`Newsletter info`)}>
          <Descriptions.Item key={groupData?.id} label={t(`Id`)}>
            {groupData?.id}
          </Descriptions.Item>
          <Descriptions.Item key={groupData?.text} label={t(`Text`)}>
            {groupData?.text}
          </Descriptions.Item>
          <Descriptions.Item key={"Is Triggered"} label={t(`Is Triggered`)}>
            {groupData?.isTriggered ? "Yes" : "No"}
          </Descriptions.Item>
          <Descriptions.Item key={"Trigger At"} label={t(`Trigger At`)}>
            {(new Date(groupData?.triggerAt)).toLocaleString()}
          </Descriptions.Item>
        </Descriptions>
        <Title level={5}>Users ({groupData?.phoneNumbers.length})</Title>
        <Table
          columns={config}
          dataSource={items}
          pagination={{ total: groupData?.phoneNumbers.length }}
        />
      </Skeleton>
    </Flex>
  );
};