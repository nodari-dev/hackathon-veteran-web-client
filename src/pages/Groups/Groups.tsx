import { FC, useEffect, useState } from "react";
import { Button, Flex, Table } from "antd";
import { useNavigate } from "react-router-dom";
import Title from "antd/es/typography/Title";
import { gql, useLazyQuery } from "@apollo/client";
import { useTranslation } from "react-i18next";

const EXCHANGE_RATES = gql`
  query pagedUserGroups($pageSize: Int, $offset: Int ) {
  pagedUserGroups(
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
      title
      usersPhoneNumbers
    }
  }
}
`;

interface IProps {}

export const Groups: FC<IProps> = (): JSX.Element => {
  const navigate = useNavigate();
  const { t } = useTranslation();
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
      setTotal(res.data.pagedUserGroups.totalCount);
    });
  }, [ params ]);

  const config: any[] = [
    {
      title: "ID",
      dataIndex: "id",
      key: "id",
    },
    {
      title: t("groups.name"),
      dataIndex: "title",
      key: "title",
    },
    {
      title: t("groups.users"),
      dataIndex: "usersPhoneNumbersCount",
      key: "usersPhoneNumbersCount",
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
          <Button onClick={() => navigate("/group/" + record.id)}>{t("groups.view")}</Button>
        </Flex>
      ),
    },
  ];

  const onPaginationChange = (page: number, pageSize: number): void => {
    setParams({ ...params, pagination: { page, pageSize } });
  };

  return (
    <Flex gap="small" vertical>
      <Title level={3} style={{ margin: 0 }}>{t("groups.title")}</Title>
      <Table
        loading={loading}
        columns={config}
        pagination={{ ...params.pagination, total, onChange: onPaginationChange }}
        dataSource={data?.pagedUserGroups?.items}
        scroll={{ x: 600 }}
      />
    </Flex>
  );
};