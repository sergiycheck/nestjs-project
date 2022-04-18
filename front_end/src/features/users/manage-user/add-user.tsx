import React, { useEffect, useState } from "react";
import { useAddUserMutation } from "../usersSlice";
import TextField from "@mui/material/TextField";
import { Alert, Button } from "@mui/material";
import { useForm, Controller, SubmitHandler } from "react-hook-form";
import { CreateUserDto } from "../types";
import { joiResolver } from "@hookform/resolvers/joi";
import { userAddSchema } from "./validation";

// TODO: check is username is accessible
export const AddUser = () => {
  const [addUserMutation, { isLoading, isError, isSuccess }] = useAddUserMutation();

  const {
    control,
    handleSubmit,
    watch,
    reset,
    formState: { isSubmitSuccessful },
  } = useForm<CreateUserDto>({
    resolver: joiResolver(userAddSchema),
  });

  const [response, setResponse] = useState("");
  const [isOpenResult, setIsOpenResult] = useState(false);

  useEffect(() => {
    if (isSubmitSuccessful) {
      reset();
    }
  }, [isSubmitSuccessful, reset]);

  const onSubmit: SubmitHandler<CreateUserDto> = async (data: CreateUserDto) => {
    const result = await addUserMutation({
      ...data,
    }).unwrap();
    setResponse(result.message);
    setIsOpenResult(true);
  };

  let saveResult;
  if (isSuccess) {
    saveResult = <Alert severity="success">{response}</Alert>;
  } else if (isError) {
    saveResult = <Alert severity="warning">{response}</Alert>;
  }

  useEffect(() => {
    const timeOutId = setTimeout(() => {
      setIsOpenResult(false);
    }, 2000);

    return () => {
      clearTimeout(timeOutId);
    };
  }, [isOpenResult]);

  const [schemaIsValid, setIsValid] = useState(false);
  useEffect(() => {
    const subscription = watch((value, { name, type }) => {
      const { error } = userAddSchema.validate(value);
      setIsValid(!Boolean(error) && !isLoading);
    });

    return () => subscription.unsubscribe();
  }, [watch, isLoading]);

  return (
    <section className="sticky-sm-top">
      <h4>Add user</h4>
      <form className="row gy-2" autoComplete="off" onSubmit={handleSubmit(onSubmit)}>
        <div className="col-12">
          <Controller
            name="username"
            control={control}
            defaultValue=""
            render={({ field }) => (
              <TextField required label="username" {...field} variant="standard" />
            )}
          />
        </div>
        <div className="col-12">
          <Controller
            name="firstName"
            control={control}
            defaultValue=""
            render={({ field }) => (
              <TextField required label="firstName" {...field} variant="standard" />
            )}
          />
        </div>
        <div className="col-12">
          <Controller
            name="lastName"
            control={control}
            defaultValue=""
            render={({ field }) => (
              <TextField required label="lastName" {...field} variant="standard" />
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
    </section>
  );
};
