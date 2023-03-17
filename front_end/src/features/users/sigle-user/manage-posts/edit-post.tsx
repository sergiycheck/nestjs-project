import { Typography } from '@mui/material';
import React from 'react';
import { useParams } from 'react-router-dom';
import { useUpdatePostMutation } from './user-manage-posts.api';
import { useGetPostQuery } from '../../../posts/postsApi';
import { CircularIndeterminate } from '../../../shared/mui-components/Loader';
import { UpdatePostReqType } from './types';
import { useForm, Controller, SubmitHandler } from 'react-hook-form';
import { joiResolver } from '@hookform/resolvers/joi';
import {
  editPostDataToValidate,
  updatePostSchema,
  EditPostDataToValidateKeysType,
} from './validation';
import { Alert, Button } from '@mui/material';
import { useAppSelector } from '../../../../app/hooks';
import { selectIsAuthUser } from '../../../shared/authSlice';
import getSwitchedTextField from './get-rendered-form-field-item';

export default function EditPostForUser() {
  const { userId, postId } = useParams();

  const authUser = useAppSelector(selectIsAuthUser);

  const { data, isLoading, isSuccess, isError } = useGetPostQuery(postId!, {
    refetchOnMountOrArgChange: true,
  });

  if (isLoading) return <CircularIndeterminate />;

  if (!data && (isSuccess || isError)) return <div>post with id {postId} was not found</div>;

  const { createdAt, updatedAt, ...postDataToUpdate } = data!;

  return (
    <div className="container-md">
      <div className="row justify-content-center">
        <div className="col-auto">
          <Typography variant="h4">user {authUser?.username} protected page</Typography>
        </div>
        <div className="row justify-content-center">
          <EditPostContent post={postDataToUpdate} ownerId={userId!} />
        </div>
      </div>
    </div>
  );
}

function EditPostContent({ post, ownerId }: { post: UpdatePostReqType; ownerId: string }) {
  const [addPostMutation, { isLoading, isError, isSuccess }] = useUpdatePostMutation();

  const { control, handleSubmit, watch } = useForm<UpdatePostReqType>({
    resolver: joiResolver(updatePostSchema),
    defaultValues: post,
  });

  const [response, setResponse] = React.useState('');
  const [isOpenResult, setIsOpenResult] = React.useState(false);

  const onSubmit: SubmitHandler<UpdatePostReqType> = async (data: UpdatePostReqType) => {
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

  const [schemaIsValid, setIsValid] = React.useState(false);
  React.useEffect(() => {
    const subscription = watch((value, { name, type }) => {
      const { error } = updatePostSchema.validate(value);
      setIsValid(!Boolean(error) && !isLoading);
    });

    return () => subscription.unsubscribe();
  }, [watch, isLoading]);

  const renderedFormFields = Object.keys(editPostDataToValidate)
    .filter((k) => k !== 'ownerId' && k !== 'id')
    .map((postKeyStr, i) => {
      let postkey = postKeyStr as unknown as EditPostDataToValidateKeysType;
      const resultTextFieldGetter = getSwitchedTextField<EditPostDataToValidateKeysType>(postkey);

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
  );
}
