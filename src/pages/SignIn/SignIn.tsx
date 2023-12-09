import { FC } from "react";
import { useAuthorization, useLoader, useNotification } from "../../hooks";
import { Link, useNavigate } from "react-router-dom";
import { LockOutlined, MailOutlined, SmileOutlined } from "@ant-design/icons";
import { Button, Checkbox, Flex, Form, Input, Result } from "antd";
import { useTranslation } from "react-i18next";
import { constants } from "../../styles/constants";
import Title from "antd/es/typography/Title";

interface IProps {}

export const SignIn: FC<IProps> = (): JSX.Element => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const loader = useLoader();
  const notification = useNotification();
  const { isAuthorized, setAuthorization } = useAuthorization();

  const onFinish = (values: any) => {
    const signIn = loader.create(t("signIn.loader.title"));
    signIn.start();

    const ref = setTimeout(() => {
      if ((values.email === "daniel.hrovinsky@gmail.com") && (values.password === "duck")) {
        setAuthorization({
          id: 1,
          email: "daniel.hrovinsky@gmail.com",
          name: "Daniel",
          lastName: "Hrovinskyi",
          region: {
            name: "North",
          },
          role: "Admin",
        });
        navigate("/");
      } else {
        notification.error("Wrong credentials !");
      }
      signIn.stop();
      clearTimeout(ref);
    }, 2000);

  };

  return !isAuthorized ? (
    <>
      <Title level={1} style={{ color: constants.black }}>НУМО</Title>
      <Title level={3} style={{ color: constants.black }}>Login: daniel.hrovinsky@gmail.com Password: duck</Title>
      <Form
        name="normal_login"
        className="login-form"
        initialValues={{ remember: true }}
        onFinish={onFinish}
      >
        <Form.Item
          name="email"
          rules={[
            { type: "email", message: t("signIn.email.validation.email") },
            { required: true, message: t("signIn.email.validation.required") },
          ]}
        >
          <Input prefix={<MailOutlined className="site-form-item-icon" />} placeholder={t("signIn.email.title")} />
        </Form.Item>
        <Form.Item
          name="password"
          rules={[ { required: true, message: t("signIn.password.validation.required") } ]}
        >
          <Input
            prefix={<LockOutlined className="site-form-item-icon" />}
            type="password"
            placeholder={t("signIn.password.title")}
          />
        </Form.Item>
        <Form.Item>
          <Form.Item name="remember" valuePropName="checked" noStyle>
            <Checkbox>{t("signIn.remember.title")}</Checkbox>
          </Form.Item>
        </Form.Item>

        <Form.Item>
          <Flex gap="small" align="center">
            <Button
              style={{ background: constants.black }}
              type="primary"
              htmlType="submit"
              className="login-form-button"
            >
              {t("signIn.navigation.logIn")}
            </Button>
          </Flex>
        </Form.Item>
      </Form>
    </>
  ) : (
    <Flex style={{ width: "100%", height: "100%", justifyContent: "center", alignItems: "center" }}>
      <Result
        icon={<SmileOutlined style={{ color: constants.black }} />}
        title={t("signIn.authorized.title")}
        extra={
          <Link to="/"><Button
            type="primary"
            style={{ background: constants.black }}
          >{t("signIn.authorized.goHome")}</Button></Link>
        }
      />
    </Flex>
  );
};
