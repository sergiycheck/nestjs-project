import React, { useEffect, useState } from 'react';
import { useAddUserMutation } from '../usersApi';
import TextField from '@mui/material/TextField';
import { Alert, Button, Link, Typography } from '@mui/material';
import { useForm, Controller, SubmitHandler } from 'react-hook-form';
import { CreateUserDto } from '../types';
import { joiResolver } from '@hookform/resolvers/joi';
import { userAddSchema } from './validation';

type SingUpUserType = CreateUserDto & { repeat_password: string };

// TODO: check is username is accessible
export const AddUser = () => {
  const [addUserMutation, { isLoading, isError, isSuccess }] = useAddUserMutation();

  const {
    control,
    handleSubmit,
    watch,
    reset,
    formState: { isSubmitSuccessful },
  } = useForm<SingUpUserType>({
    resolver: joiResolver(userAddSchema),
  });

  const [response, setResponse] = useState('');
  const [isOpenResult, setIsOpenResult] = useState(false);

  useEffect(() => {
    if (isSubmitSuccessful) {
      reset();
    }
  }, [isSubmitSuccessful, reset]);

  const onSubmit: SubmitHandler<SingUpUserType> = async (data: SingUpUserType) => {
    const { repeat_password, ...userData } = data;
    const result = await addUserMutation({
      ...userData,
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
    <div className="container-md">
      {/* register form */}
      <div className="row justify-content-center">
        <div className="col-5">
          <Typography variant="h4" sx={{ textAlign: 'center', marginBottom: '1em' }}>
            Sing up as a new user
          </Typography>
          <form className="row gy-2" autoComplete="off" onSubmit={handleSubmit(onSubmit)}>
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
                name="firstName"
                control={control}
                defaultValue=""
                render={({ field }) => (
                  <TextField required label="firstName" {...field} variant="standard" />
                )}
              />
            </div>
            <div className="col-12 d-flex justify-content-center">
              <Controller
                name="lastName"
                control={control}
                defaultValue=""
                render={({ field }) => (
                  <TextField required label="lastName" {...field} variant="standard" />
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
            <div className="col-12 d-flex justify-content-center">
              <Controller
                name="repeat_password"
                control={control}
                defaultValue=""
                render={({ field }) => (
                  <TextField
                    required
                    label="Repeat your password"
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
                Sign up
              </Button>
            </div>
          </form>
          <div className="row">{isOpenResult && saveResult}</div>
        </div>
      </div>
      {/* links */}
      <div className="row justify-content-center mt-2">
        <div className="col-auto">
          <Link href="/login">Already have an account? Sign in</Link>
        </div>
      </div>
    </div>
  );
};
