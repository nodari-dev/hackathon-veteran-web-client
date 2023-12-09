import { FC, useEffect, useState } from "react";
import { Button, Flex, Skeleton, Table } from "antd";
import { useNavigate, useParams } from "react-router-dom";
import Title from "antd/es/typography/Title";
import { useTranslation } from "react-i18next";
import { gql, useLazyQuery } from "@apollo/client";

interface IProps {}

const GROUP = gql`
  query pagedUserGroups($id: UUID!) {
  pagedUserGroups(
    where: {
      id: {eq: $id}
    }
  ) {
    totalCount
    items {
      title
      id
      usersPhoneNumbers
      usersPhoneNumbersCount
    }
  }
}
`;

export const Group: FC<IProps> = (): JSX.Element => {
  const { groupId } = useParams();
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [ groupData, setGroupData ] = useState<any>();
  const [ executeSearch ] = useLazyQuery(GROUP);

  useEffect(() => {
    if (groupId) {
      executeSearch({ variables: { id: groupId } }).then((data) => {
        setGroupData(data.data.pagedUserGroups.items[0]);
      });
    }
  }, [ groupId ]);

  const items:any[] = groupData
    ? groupData.usersPhoneNumbers.map((i:any) => ({ phoneNumber: i }))
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
        <Title level={3}>{groupData?.title}</Title>
        <Title level={5}>Users ({groupData?.usersPhoneNumbersCount})</Title>
        <Table
          columns={config}
          dataSource={items}
          pagination={{ total: groupData?.usersPhoneNumbersCount }}
        />
      </Skeleton>
    </Flex>
  );
};