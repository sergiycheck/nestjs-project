import React from "react";
import { joiResolver } from "@hookform/resolvers/joi";
import { useForm, Controller, SubmitHandler } from "react-hook-form";
import { Typography } from "@mui/material";
import { userLoginSchema } from "../manage-user/validation";
import { LoginUserDto } from "../types";
import { useLoginUserMutation } from "../usersApi";

export const LoginUser = () => {
  const [loginUserMutation, { isLoading, isError, isSuccess }] = useLoginUserMutation();
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

  const onSubmit: SubmitHandler<LoginUserDto> = async (data: LoginUserDto) => {
    const result = await loginUserMutation({
      ...data,
    }).unwrap();
    setResponse(result.message);
    setIsOpenResult(true);
  };

  return (
    <div className="container-md">
      <div className="row">
        <div className="col">
          <Typography variant="h4">login form</Typography>
          <form></form>
        </div>
      </div>
    </div>
  );
};
