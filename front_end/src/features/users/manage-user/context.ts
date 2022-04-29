import React from 'react';

export type DeleteUserInfoType = {
  isSuccessFullDelete: boolean | null;
  deleteMessage: string;
};
const deleteUserInfoData: DeleteUserInfoType = {
  isSuccessFullDelete: false,
  deleteMessage: '',
};

type UpdateDeleteUserInfoType = React.Dispatch<React.SetStateAction<DeleteUserInfoType>>;
const DeleteUserInfoUpdate: UpdateDeleteUserInfoType = () => {};

const deleteUserInfoInitial = {
  deleteUserInfoData: deleteUserInfoData,
  setUpdateDeleteUserInfo: DeleteUserInfoUpdate,
};
export const DeleteUserInfoContext = React.createContext(deleteUserInfoInitial);
