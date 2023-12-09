import { FC, useEffect, useState } from "react";
import { Descriptions, Flex, Select, Skeleton, Table } from "antd";
import { useNavigate, useParams } from "react-router-dom";
import { IGroup } from "../../models/group";
import Title from "antd/es/typography/Title";
import { useTranslation } from "react-i18next";
import { gql, useLazyQuery } from "@apollo/client";

const { Option } = Select;

interface IProps {}

const GROUP = gql`
  query pagedUserGroups($id: String!) {
  pagedUserGroups(
    where: {
      phoneNumber: {eq: $id}
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

const getDate = (date: any) => new Date(date).toLocaleDateString(
  "en-US",
  { year: "numeric", month: "2-digit", day: "numeric" },
);

const tableData: any = {
  id: "id",
  title: "title",
  usersPhoneNumbersCount: "users",
};

export const Group: FC<IProps> = (): JSX.Element => {
  const { groupId } = useParams();
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [ groupData, setGroupData ] = useState<IGroup>();
  const [ executeSearch ] = useLazyQuery(GROUP);

  useEffect(() => {
    if (groupId) {
      executeSearch({ variables: { id: userId } }).then((data) => {
        setGroupData(data.data.pagedUserGroups.items[0]);
      });
    }
  }, [ groupId ]);

  const items = groupData
    ? Object.keys(tableData).map((key: any) => ({
      key,
      label: tableData[key],
      children: groupData[key],
    }))
    : [];

  // const config: any = [
  //   {
  //     title: "ID",
  //     dataIndex: "id",
  //     sorter: (a: any, b: any) => a.id - b.id,
  //     key: "id",
  //   },
  //   {
  //     title: t(`user-info.name`),
  //     dataIndex: "name",
  //     sorter: true,
  //     key: "name",
  //   },
  //   {
  //     title: t(`user-info.age`),
  //     dataIndex: "age",
  //     align: "center",
  //     sorter: (a: any, b: any) => a.age - b.age,
  //     key: "age",
  //   },
  //   {
  //     title: t(`user-info.preschoolStatus`),
  //     dataIndex: "preschoolStatus",
  //     key: "preschoolStatus",
  //     align: "center",
  //   },
  // ];

  return (
    <Flex vertical>
      <Skeleton loading={!user} active={true}>
        <Descriptions title={t(`user-info.title`)}>
          {items.map((item) => {

            if (item.key.includes("Date")) {
              return (
                <Descriptions.Item key={item.key} label={t(`user-info.${item.key}`)}>
                  {new Date(item.children).toLocaleString()}
                </Descriptions.Item>
              );
            }

            return (
              <Descriptions.Item key={item.key} label={t(`user-info.${item.key}`)}>
                {item.children}
              </Descriptions.Item>
            );
          })}
        </Descriptions>

        <Title level={3} style={{ margin: 0 }}>{t("users.title")}</Title>
        {/*<Table*/}
        {/*  loading={!groupData?.usersPhoneNumbers?.length}*/}
        {/*  columns={config}*/}
        {/*  dataSource={groupData?.usersPhoneNumbers || []}*/}
        {/*/>*/}
      </Skeleton>
    </Flex>
  );
};