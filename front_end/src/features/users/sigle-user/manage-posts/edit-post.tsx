import { Typography } from "@mui/material";
import React from "react";
import { AuthContext } from "../../../../app-component/auth-provider/auth-provider";
import { useParams } from "react-router-dom";
import { useUpdatePostMutation } from "./user-manage-posts.api";

//TODO: wait untill login and user is fetched or set
export default function EditPostForUser() {
  const { userId } = useParams();
  const auth = React.useContext(AuthContext);

  const [addPostMutation, { isLoading, isError, isSuccess }] = useUpdatePostMutation();

  return (
    <div>
      <Typography variant="h4">edit post for user </Typography>
      <Typography>user {auth.user?.userResponse.username} protected page</Typography>
    </div>
  );
}
