import {FC} from "react";
import {Button, Flex} from "antd";
import {CheckOutlined, CloseOutlined} from "@ant-design/icons";
import {useNavigate} from "react-router-dom";
import Title from "antd/es/typography/Title";
import {List} from "../../components";
import {useUsersConfig} from "./useUsersConfig";
import {useTranslation} from "react-i18next";
import {gql, useLazyQuery, useQuery} from "@apollo/client";

interface IProps {
}

export const Users: FC<IProps> = (): JSX.Element => {
	const navigate = useNavigate();
	const {t} = useTranslation();

	const renderView = (record: any) => <Button
			onClick={() => navigate("/user/" + record.key)}>{t("users.view")}</Button>;
	const renderSubscription = (record: any) => record ? <CheckOutlined style={{color: "green"}}/> :
			<CloseOutlined style={{color: "red"}}/>;
	const config = useUsersConfig({onView: renderView, onSub: renderSubscription})

	const graphql = gql`
      query PagedUserMessages($skip: Int, $take: Int, $where: UserMessageEntityFilterInput, $order: [UserMessageEntitySortInput!]) {
      pagedUserMessages(
        skip: $skip
        take: $take
        where: $where
        order: $order
      ) {
        totalCount
        items {
          messageId
          text
          botType
          timestamp
        }
        pageInfo {
          hasNextPage
          hasPreviousPage
        }
      }
    }
    `
	const {loading, error, data} = useLazyQuery(graphql, {variables: {skip: 20, take: 10}})
  console.log(data)

	return (
			<Flex gap="small" vertical>
				<Title level={3} style={{margin: 0}}>{t("users.title")}</Title>
				<List resource="users" config={config}/>
			</Flex>
	);
};