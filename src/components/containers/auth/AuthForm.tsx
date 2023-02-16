import { Field, Form, Formik } from "formik";
import { Button, FormControl, FormErrorMessage, FormLabel, Input } from "@chakra-ui/react";
import { useTranslation } from "next-i18next";
import { Card, CardBody } from "@chakra-ui/card";
import useAuth from "./useAuth";
import { FirebaseError } from "@firebase/app";

interface IProps {
  onSuccess: () => void;
}

export default function AuthForm({ onSuccess }: IProps) {
  const { t } = useTranslation();
  const { signIn } = useAuth();
  const onSubmit = async ({ email, password }: { email: string, password: string }, actions: any) => {
    try {
      await signIn(email, password);
      actions.setSubmitting(false);
      onSuccess();
    } catch (err) {
      if (err instanceof FirebaseError) {
        if (err.code === "auth/user-not-found" || err.code === "auth/wrong-password") {
          actions.setStatus({ login: "auth.error.user" });
          return;
        }
      }
      actions.setStatus({ login: "auth.error.unknown" });
    }
  };
  const validateLength = (fieldName: string) => {
    return (value: string) => {
      if (!value) return t("auth.lengthError").replace("%", t(fieldName));
      return undefined;
    };
  };

  return (
    <Card top={10} size={"lg"}>
      <CardBody>
        <Formik initialValues={{ email: "", password: "" }} onSubmit={onSubmit}>
          {
            ({ isSubmitting, status }) => (
              <Form style={{ display: "flex", flexDirection: "column", gap: 20 }}>
                <Field name="email" validate={validateLength("auth.email")}>
                  {
                    ({ field, form }: { field: any, form: any }) => (
                      <FormControl isInvalid={form.errors.email && form.touched.email}>
                        <FormLabel>{t("auth.email")}</FormLabel>
                        <Input type={"email"} {...field} placeholder={t("auth.emailPlaceholder")} />
                        <FormErrorMessage>{form.errors.email}</FormErrorMessage>
                      </FormControl>
                    )
                  }
                </Field>
                <Field name="password" validate={validateLength("auth.password")}>
                  {
                    ({ field, form }: { field: any, form: any }) => (
                      <FormControl isInvalid={form.errors.password && form.touched.password}>
                        <FormLabel>{t("auth.password")}</FormLabel>
                        <Input type={"password"} {...field} placeholder="********" />
                        <FormErrorMessage>{form.errors.password}</FormErrorMessage>
                      </FormControl>
                    )
                  }
                </Field>
                {
                  !!status && (
                    <FormControl isInvalid={!!status}>
                      <FormErrorMessage>{t(status.login)}</FormErrorMessage>
                    </FormControl>
                  )
                }
                <Button type="submit" isLoading={isSubmitting} colorScheme="orange">
                  {t("auth.login")}
                </Button>
              </Form>
            )
          }
        </Formik>
      </CardBody>
    </Card>
  );
}
