import { FC, useEffect, useState } from "react";
import { Button, Flex, Table } from "antd";
import Title from "antd/es/typography/Title";
import { useTranslation } from "react-i18next";
import { gql, useLazyQuery } from "@apollo/client";
import { useNavigate } from "react-router-dom";

interface IProps {}

const EXCHANGE_RATES = gql`
  query pagedScheduledMessages($pageSize: Int, $offset: Int ) {
  pagedScheduledMessages(
    skip: $offset
    take: $pageSize
  ) {
    pageInfo {
      hasNextPage
      hasPreviousPage
    }
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

export const Newsletters: FC<IProps> = (): JSX.Element => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [ total, setTotal ] = useState<number>();
  const [ executeSearch, { data, loading } ] = useLazyQuery(EXCHANGE_RATES);
  const [ params, setParams ] = useState<any>({
    pagination: {
      page: 1,
      pageSize: 10,
    },
    sorters: {},
  });

  useEffect(() => {
    const variables: any = {
      pageSize: params.pagination.pageSize,
      offset: params.pagination.pageSize * (params.pagination.page - 1),
    };

    if (Object.keys(params.sorters).length) {
      variables.sorters = params.sorters;
    }

    executeSearch({ variables }).then((res) => {
      setTotal(res.data.pagedUsers.totalCount);
    });
  }, [ params ]);

  const config: any[] = [
    {
      title: "ID",
      dataIndex: "id",
      key: "id",
    },
    {
      title: t("text"),
      dataIndex: "text",
      key: "text",
    },
    {
      title: t("Users"),
      dataIndex: "phoneNumbers",
      key: "phoneNumbers",
      render: (record:any) => record.length
    },
    {
      title: t("Is Triggered"),
      dataIndex: "isTriggered",
      key: "isTriggered",
      render: (record:any) => record ? "Yes" :"No"
    },
    {
      title: t("Trigger At"),
      dataIndex: "triggerAt",
      key: "triggerAt",
      render: (record:any) => (new Date(record).toLocaleString())
    },
    {
      title: t("groups.actions"),
      dataIndex: "",
      key: "x",
      fixed: "right",
      width: "166px",
      align: "center",
      render: (record: any) => (
        <Flex gap={8}>
          <Button onClick={() => navigate("/newsletter/" + record.id)}>{t("groups.view")}</Button>
        </Flex>
      ),
    },
  ];

  const onPaginationChange = (page: number, pageSize: number): void => {
    setParams({ ...params, pagination: { page, pageSize } });
  };


  return (
    <Flex gap="small" vertical>
      <Title level={3} style={{ margin: 0 }}>{t("Newsletter")}</Title>
      <Table
        loading={loading}
        columns={config}
        pagination={{ ...params.pagination, total, onChange: onPaginationChange }}
        dataSource={data?.pagedScheduledMessages?.items}
        scroll={{ x: 600 }}
      />
    </Flex>
  );
};