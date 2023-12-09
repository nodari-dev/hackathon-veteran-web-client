import { FC, useEffect, useState } from "react";
import { Descriptions, Flex, Skeleton, Table } from "antd";
import Title from "antd/es/typography/Title";
import { useParams } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { gql, useLazyQuery } from "@apollo/client";

interface IProps {}

const USER = gql`
  query users($id: String!) {
  pagedUsers(
    where: {
      phoneNumber: {eq: $id}
    }
  ) {
    totalCount
    items {
      age
      botTypes
      fullName
      phoneNumber
      region
      registrationDate
      type
    }
  }
}
`;

const USER_MSG = gql`
  query pagedUserMessages($id: String!, $pageSize: Int, $offset: Int) {
  pagedUserMessages(
    skip: $offset
    take: $pageSize
    where: {
      userPhoneNumber: {eq: $id}
    }
  ) {
    pageInfo {
      hasNextPage
      hasPreviousPage
    }
    totalCount
    items {
      botType
      isQuestion
      text
      timestamp
    }
  }
}
`;

const tableData: any = {
  fullName: "fullName",
  phoneNumber: "phoneNumber",
  age: "age",
  botTypes: "botTypes",
  region: "region",
  type: "type",
  registrationDate: "registrationDate",
};

export const User: FC<IProps> = (): JSX.Element => {
  const { userId } = useParams();
  const { t } = useTranslation();
  const [ user, setUser ] = useState<any>();
  const [ userMSG, setUserMSG ] = useState<any>();
  const [ executeSearch ] = useLazyQuery(USER);
  const [ executeUserMSG ] = useLazyQuery(USER_MSG);
  const [ total, setTotal ] = useState<number>();
  const [ params, setParams ] = useState<any>({
    pagination: {
      page: 1,
      pageSize: 10,
    },
    sorters: {},
  });

  useEffect(() => {
    const variables: any = {
      id: userId,
      pageSize: params.pagination.pageSize,
      offset: params.pagination.pageSize * (params.pagination.page - 1),
    };

    executeUserMSG({ variables }).then((res) => {
      setUserMSG(res.data.pagedUserMessages.items);
      setTotal(res.data.pagedUserMessages.totalCount);
    });
  }, [ params ]);

  useEffect(() => {
    if (userId) {
      executeSearch({ variables: { id: userId } }).then((data) => {
        setUser(data.data.pagedUsers.items[0]);
      });
      executeUserMSG({ variables: { id: userId } }).then((data) => {
        setUserMSG(data.data.pagedUserMessages.items);
      });
    }
  }, [ userId ]);

  const items = user
    ? Object.keys(tableData).map((key: any) => ({
      key,
      label: tableData[key],
      children: user[key],
    }))
    : [];

  const config: any = [
    {
      title: "is Question",
      dataIndex: "isQuestion",
      key: "isQuestion",
      render: (record:any) => record ? "Yes" : "No",
    },
    {
      title: "Bot Type",
      dataIndex: "botType",
      key: "botType",
    },
    {
      title: "Text",
      dataIndex: "text",
      key: "text",
    },
    {
      title: "Timestamp",
      dataIndex: "timestamp",
      key: "timestamp",
      render: (record:any) => (new Date(record)).toLocaleString(),
    },
  ];

  const onPaginationChange = (page: number, pageSize: number): void => {
    setParams({ ...params, pagination: { page, pageSize } });
  };

  return (
    <Flex gap="small" vertical>
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

        <Title level={5}>Messages</Title>
        <Table
          loading={!userMSG?.length}
          columns={config}
          dataSource={userMSG || []}
          pagination={{ ...params.pagination, total, onChange: onPaginationChange }}
        />
      </Skeleton>
    </Flex>
  );
};