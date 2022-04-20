import React, { useContext, useEffect, useState } from "react";
import { useDeleteUserMutation, useGetUserQuery, useUpdateUserMutation } from "../usersApi";
import TextField from "@mui/material/TextField";
import { Alert, Button } from "@mui/material";
import { useForm, Controller, SubmitHandler } from "react-hook-form";
import { UpdateUserDto } from "../types";
import { joiResolver } from "@hookform/resolvers/joi";
import { Link, Outlet, useNavigate, useParams } from "react-router-dom";
import { CircularIndeterminate } from "../mui-components/Loader";
import { userUpdateSchema } from "./validation";
import DeleteIcon from "@mui/icons-material/Delete";
import { DeleteUserInfoContext, DeleteUserInfoType } from "./context";

export const UpdateUser = () => {
  const [deleteUserInfoData, setUpdateDeleteUserInfo] = useState<DeleteUserInfoType>({
    isSuccessFullDelete: null,
    deleteMessage: "",
  });
  const passedValue = { deleteUserInfoData, setUpdateDeleteUserInfo };

  return (
    <DeleteUserInfoContext.Provider value={passedValue}>
      <Outlet></Outlet>
    </DeleteUserInfoContext.Provider>
  );
};

export const UpdateUserContainer = () => {
  const { userId } = useParams();

  const {
    data: user,
    isLoading,
    isSuccess,
    isError,
  } = useGetUserQuery(userId!, {
    refetchOnMountOrArgChange: true,
    skip: false,
  });

  if (isLoading) return <CircularIndeterminate />;

  if (!user && (isSuccess || isError)) return <div>user with id {userId} was not found</div>;
  const { createdAt, numberOfArticles, articleIds, role, ...updateUserDto } = user!;

  return <UpdateUserInner user={updateUserDto!} />;
};

export const UpdateUserInner = ({ user }: { user: UpdateUserDto }) => {
  const { control, handleSubmit, watch } = useForm<UpdateUserDto>({
    resolver: joiResolver(userUpdateSchema),
    defaultValues: user,
  });

  const [updateUserMutation, { isLoading, isError, isSuccess }] = useUpdateUserMutation();
  const [deleteUserMutation] = useDeleteUserMutation();

  const navigate = useNavigate();

  const [response, setResponse] = useState("");
  const [isOpenResult, setIsOpenResult] = useState(false);

  const onSubmit: SubmitHandler<UpdateUserDto> = async (data: UpdateUserDto) => {
    const result = await updateUserMutation({
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
      const validateResult = userUpdateSchema.validate(value);
      const { error } = validateResult;
      setIsValid(!Boolean(error) && !isLoading);
    });

    return () => subscription.unsubscribe();
  }, [watch, isLoading]);

  const { setUpdateDeleteUserInfo } = useContext(DeleteUserInfoContext);

  return (
    <div className="container-sm">
      <div className="row">
        <div className="row">
          <h4>Edit user</h4>
        </div>

        <div className="row">
          <div className="col-auto d-flex align-items-end">
            <Link className="text-dark text-decoration-none" to={`/users/${user.id}`}>
              go to user page
            </Link>
          </div>
        </div>

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
          <div className="col-12 d-flex justify-content-end">
            <Button disabled={!schemaIsValid} variant="contained" type="submit">
              Save user
            </Button>
          </div>
        </form>
        <div className="row">{isOpenResult && saveResult}</div>
      </div>
      <div className="row">
        <div className="col-12">
          <p>You can delete this user</p>
        </div>
        <div className="col-12">
          <Button
            variant="outlined"
            startIcon={<DeleteIcon />}
            onClick={async () => {
              const deleteRes = await deleteUserMutation(user.id).unwrap();
              if (deleteRes.data.deletedCount) {
                setUpdateDeleteUserInfo({
                  deleteMessage: deleteRes.message,
                  isSuccessFullDelete: true,
                });

                navigate("deleteResult");
              }
            }}
          >
            Delete
          </Button>
        </div>
      </div>
    </div>
  );
};
