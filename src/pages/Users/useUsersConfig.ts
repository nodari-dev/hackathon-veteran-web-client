import { useTranslation } from "react-i18next";

export const useUsersConfig: any = ({ onView }: any) => {
  const { t } = useTranslation();
  return (
    [
      {
        title: "Full Name",
        dataIndex: "fullName",
        key: "fullName",
      },
      {
        title: "Phone Number",
        dataIndex: "phoneNumber",
        align: "left",
        key: "phoneNumber",
      },
      {
        title: t("users.bot"),
        dataIndex: "botTypes",
        key: "botTypes",
        render: (record: any) => record.join(", "),
      },
      {
        title: "Age",
        dataIndex: "age",
        key: "age",
      },
      {
        title: t("users.region"),
        dataIndex: "region",
        key: "region",
      },
      {
        title: "Type",
        dataIndex: "type",
        key: "type",
      },
      {
        title: t("users.actions"),
        dataIndex: "",
        key: "x",
        fixed: "right",
        width: "100px",
        align: "center",
        render: (record: any) => onView(record),
      },
    ]
  );
};