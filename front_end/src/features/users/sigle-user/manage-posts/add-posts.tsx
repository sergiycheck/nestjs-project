import React from 'react';
import { useAddPostMutation } from './user-manage-posts.api';
import { useForm, Controller, SubmitHandler } from 'react-hook-form';
import { CreatePostReqType } from './types';
import { joiResolver } from '@hookform/resolvers/joi';
import {
  createPostSchema,
  createPostDataToValidate,
  CreatePostDataToValidateKeysType,
} from './validation';
import { Alert, Button, Typography } from '@mui/material';
import { useParams } from 'react-router-dom';
import { useAppSelector } from '../../../../app/hooks';
import { selectIsAuthUser } from '../../../shared/authSlice';
import getSwitchedTextField from './get-rendered-form-field-item';

export default function AddPostForUser() {
  const { userId } = useParams();

  const authUser = useAppSelector(selectIsAuthUser);

  const [addPostMutation, { isLoading, isError, isSuccess }] = useAddPostMutation();
  const {
    control,
    handleSubmit,
    watch,
    reset,
    formState: { isSubmitSuccessful },
  } = useForm<CreatePostReqType>({
    resolver: joiResolver(createPostSchema),
    defaultValues: {
      ownerId: userId!,
    },
  });

  const [response, setResponse] = React.useState('');
  const [isOpenResult, setIsOpenResult] = React.useState(false);

  React.useEffect(() => {
    if (isSubmitSuccessful) {
      reset();
    }
  }, [isSubmitSuccessful, reset]);

  const onSubmit: SubmitHandler<CreatePostReqType> = async (data: CreatePostReqType) => {
    const result = await addPostMutation({
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

  React.useEffect(() => {
    const timeOutId = setTimeout(() => {
      setIsOpenResult(false);
    }, 2000);

    return () => {
      clearTimeout(timeOutId);
    };
  }, [isOpenResult]);

  const [schemaIsValid, setIsValid] = React.useState(false);

  React.useEffect(() => {
    const subscription = watch((value, { name, type }) => {
      const { error } = createPostSchema.validate(value);
      setIsValid(!Boolean(error) && !isLoading);
    });

    return () => subscription.unsubscribe();
  }, [watch, isLoading]);

  const renderedFormFields = Object.keys(createPostDataToValidate)
    .filter((k) => k !== 'ownerId')
    .map((postKeyStr, i) => {
      let postkey = postKeyStr as unknown as CreatePostDataToValidateKeysType;

      const resultTextFieldGetter = getSwitchedTextField<CreatePostDataToValidateKeysType>(postkey);

      return (
        <div key={i} className="col-12">
          <Controller
            name={postkey}
            control={control}
            defaultValue=""
            render={({ field }) => resultTextFieldGetter(field)}
          />
        </div>
      );
    });

  return (
    <div className="container-md">
      <div className="row justify-content-center">
        <div className="col-auto">
          <Typography variant="h4">add post for user </Typography>
          <Typography>user {authUser?.username} protected page</Typography>
        </div>
      </div>

      <div className="row justify-content-center">
        <div className="col-6">
          <form className="row gy-2" autoComplete="off" onSubmit={handleSubmit(onSubmit)}>
            {renderedFormFields}

            <div className="col-12 d-flex justify-content-end">
              <Button disabled={!schemaIsValid} variant="outlined" type="submit">
                Save post
              </Button>
            </div>
          </form>
          <div className="row">{isOpenResult && saveResult}</div>
        </div>
      </div>
    </div>
  );
}
