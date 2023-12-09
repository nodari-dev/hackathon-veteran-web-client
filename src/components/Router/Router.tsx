import { FC } from "react";
import { HashRouter, Route, Routes } from "react-router-dom";
import { Auth as AuthLayout, System as SystemLayout } from "../../layouts";
import {
  Analytics,
  CreateGroup,
  CreateNewsletter,
  Dashboard,
  Group,
  Groups,
  Newsletter,
  Newsletters,
  NotFound,
  Profile,
  SignIn,
  User,
  Users,
} from "../../pages";
import { withCheckAuthorization } from "../../hocs";
import { useAuthorization } from "../../hooks";

interface IProps {}

export const Router: FC<IProps> = (): JSX.Element => {
  const { isAuthorized } = useAuthorization();

  const PageDashboardWithCheckAuthorization = withCheckAuthorization(Dashboard);
  const PageUsersWithCheckAuthorization = withCheckAuthorization(Users);
  const PageUserWithCheckAuthorization = withCheckAuthorization(User);
  const PageGroupsWithCheckAuthorization = withCheckAuthorization(Groups);
  const PageNewslettersWithCheckAuthorization = withCheckAuthorization(Newsletters);
  const PageNewsletterWithCheckAuthorization = withCheckAuthorization(Newsletter);
  const PageCreateNewslettersWithCheckAuthorization = withCheckAuthorization(CreateNewsletter);
  const PageGroupWithCheckAuthorization = withCheckAuthorization(Group);
  const PageCreateGroupWithCheckAuthorization = withCheckAuthorization(CreateGroup);
  const PageUserAnalyticsWithCheckAuthorization = withCheckAuthorization(Analytics);
  const PageProfileWithCheckAuthorization = withCheckAuthorization(Profile);

  return (
    <HashRouter>
      {isAuthorized ? <SystemLayout>
          <Routes>
            <Route path="/" element={<PageDashboardWithCheckAuthorization />} />
            <Route path="/users" element={<PageUsersWithCheckAuthorization />} />
            <Route path="/user/:userId" element={<PageUserWithCheckAuthorization />} />
            <Route path="/group/all" element={<PageGroupsWithCheckAuthorization />} />
            <Route path="/group/:groupId" element={<PageGroupWithCheckAuthorization />} />
            <Route path="/group/create" element={<PageCreateGroupWithCheckAuthorization />} />
            <Route path="/analytics" element={<PageUserAnalyticsWithCheckAuthorization />} />
            <Route path="/newsletter/all" element={<PageNewslettersWithCheckAuthorization />} />
            <Route path="/newsletter/:id" element={<PageNewsletterWithCheckAuthorization />} />
            <Route path="/newsletter/create" element={<PageCreateNewslettersWithCheckAuthorization />} />
            <Route path="/profile" element={<PageProfileWithCheckAuthorization />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </SystemLayout>
        :
        <AuthLayout>
          <Routes>
            <Route path="/" element={<PageDashboardWithCheckAuthorization />} />
            <Route path="/sign-in" element={<SignIn />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </AuthLayout>
      }
    </HashRouter>
  );
};
