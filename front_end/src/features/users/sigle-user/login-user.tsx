import React from "react";
import { joiResolver } from "@hookform/resolvers/joi";
import { useForm, Controller, SubmitHandler } from "react-hook-form";
import { Typography } from "@mui/material";
import { userLoginSchema } from "../manage-user/validation";
import { LoginUserDto } from "../types";
import { useLoginUserMutation } from "../usersApi";
import TextField from "@mui/material/TextField";
import { Alert, Button } from "@mui/material";
import { Location, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../../../app-component/auth-provider/auth-provider";

type StateOfLocationType = Location & { from: Location };

export const LoginUser = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const auth = useAuth();
  const stateOfLocation = location.state as StateOfLocationType;
  const from = stateOfLocation?.from?.pathname || "/";

  const [loginUserMutation, { isLoading }] = useLoginUserMutation();
  const {
    control,
    handleSubmit,
    watch,
    reset,
    formState: { isSubmitSuccessful },
  } = useForm<LoginUserDto>({
    resolver: joiResolver(userLoginSchema),
  });

  const [response, setResponse] = React.useState("");
  const [isOpenResult, setIsOpenResult] = React.useState(false);
  const [isSuccessAuth, setIsSuccessAuth] = React.useState<boolean | null>(null);

  const onSubmit: SubmitHandler<LoginUserDto> = async (data: LoginUserDto) => {
    const result = await loginUserMutation({
      ...data,
    }).unwrap();

    setResponse(result.message);
    setIsOpenResult(true);
    setIsSuccessAuth(result.successfulAuth);

    if (result.successfulAuth) {
      auth.signIn(result, () => {
        //send them back to the page they tried to visit when they were
        // redirected to the login page. Use {replace: true} so we don't create
        //another entry in the history stack for the login page. This means that
        // when they got to the protected page and click the back button, they
        // won't end up back on the login page, which is also really nice for
        // the user experience.
        setTimeout(() => {
          navigate(from, { replace: true });
        }, 1000);
      });
    } else {
    }
  };
  const [schemaIsValid, setIsValid] = React.useState(false);
  React.useEffect(() => {
    const subscription = watch((value, { name, type }) => {
      const { error } = userLoginSchema.validate(value);
      setIsValid(!Boolean(error) && !isLoading);
    });

    return () => subscription.unsubscribe();
  }, [watch, isLoading]);

  let saveResult;
  if (isSuccessAuth) {
    saveResult = <Alert severity="success">{response}</Alert>;
  } else if (isSuccessAuth === false) {
    saveResult = <Alert severity="warning">{response}</Alert>;
  }

  React.useEffect(() => {
    if (isSubmitSuccessful) {
      reset();
    }
  }, [isSubmitSuccessful, reset]);

  return (
    <div className="container-md">
      <div className="row">
        <div className="col">
          <Typography variant="h4">login form</Typography>
          <form onSubmit={handleSubmit(onSubmit)}>
            <div className="col-12">
              <Controller
                name="username"
                control={control}
                defaultValue=""
                render={({ field }) => (
                  <TextField
                    required
                    label="username"
                    {...field}
                    variant="standard"
                    autoComplete="username"
                  />
                )}
              />
            </div>
            <div className="col-12">
              <Controller
                name="password"
                control={control}
                defaultValue=""
                render={({ field }) => (
                  <TextField
                    required
                    label="Password"
                    {...field}
                    variant="standard"
                    type="password"
                    autoComplete="current-password"
                  />
                )}
              />
            </div>
            <div className="col-12 d-flex justify-content-end">
              <Button disabled={!schemaIsValid} variant="contained" type="submit">
                Save user
              </Button>
            </div>
          </form>
          <div className="row">{isOpenResult && saveResult}</div>
        </div>
      </div>
    </div>
  );
};
