import { MenuItem, TextField } from "@mui/material";
import { PostGenre } from "../../../posts/types";
import { CreatePostDataToValidateKeysType, EditPostDataToValidateKeysType } from "./validation";

export default function getSwitchedTextField<
  PostKeyType extends CreatePostDataToValidateKeysType | EditPostDataToValidateKeysType
>(postkey: PostKeyType) {
  let resultTextFieldGetter: (field: any) => JSX.Element;
  switch (postkey) {
    case "category":
      resultTextFieldGetter = function (field: any) {
        return (
          <TextField
            required
            select
            helperText="Please select a category"
            label={postkey}
            {...field}
            variant="standard"
          >
            {Object.values(PostGenre).map((genre) => (
              <MenuItem key={genre} value={genre}>
                {genre}
              </MenuItem>
            ))}
          </TextField>
        );
      };

      break;
    default:
      resultTextFieldGetter = function (field: any) {
        return (
          <TextField
            fullWidth
            multiline={postkey === "description"}
            minRows={postkey === "description" ? 3 : 1}
            required
            label={postkey}
            {...field}
            variant="standard"
          />
        );
      };

      break;
  }

  return resultTextFieldGetter;
}
