import React, { useContext } from "react";
import { Alert } from "@mui/material";
import { DeleteUserInfoContext } from "./context";

export const UserInfoDeleteResultComponent = () => {
  const { deleteUserInfoData } = useContext(DeleteUserInfoContext);

  let renderedDeleteMessage;
  if (deleteUserInfoData.isSuccessFullDelete) {
    renderedDeleteMessage = <Alert severity="info">{deleteUserInfoData.deleteMessage}</Alert>;
  } else if (deleteUserInfoData.isSuccessFullDelete === false) {
    renderedDeleteMessage = <Alert severity="warning">something went wrong</Alert>;
  } else {
    renderedDeleteMessage = <Alert severity="error">unknown result</Alert>;
  }

  return (
    <div className="container-md">
      <div className="row">
        <div className="col-12">{renderedDeleteMessage}</div>
      </div>
    </div>
  );
};
