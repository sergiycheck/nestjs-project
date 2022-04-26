import React from "react";
import { joiResolver } from "@hookform/resolvers/joi";
import { useForm, Controller, SubmitHandler } from "react-hook-form";
import { Link, Typography } from "@mui/material";
import { userLoginSchema } from "../manage-user/validation";
import { LoginUserDto } from "../types";
import { useLoginUserMutation } from "../usersApi";
import TextField from "@mui/material/TextField";
import { Alert, Button } from "@mui/material";
import { Location, useLocation, useNavigate } from "react-router-dom";

type StateOfLocationType = Location & { from: Location };

export const LoginUser = () => {
  const navigate = useNavigate();
  const location = useLocation();

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
      navigate(from, { replace: true });
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
      {/* login form */}
      <div className="row justify-content-center">
        <div className="col-5">
          <Typography variant="h4" sx={{ textAlign: "center", marginBottom: "1em" }}>
            Sign in form
          </Typography>
          <form className="row gy-2" onSubmit={handleSubmit(onSubmit)}>
            <div className="col-12 d-flex justify-content-center">
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
            <div className="col-12 d-flex justify-content-center">
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
                sign in
              </Button>
            </div>
          </form>
          <div className="row">{isOpenResult && saveResult}</div>
        </div>
      </div>
      {/* links */}
      <div className="row justify-content-center mt-2">
        <div className="col-auto">
          <Link href="/register">Dont have an account? Sign up</Link>
        </div>
      </div>
    </div>
  );
};
