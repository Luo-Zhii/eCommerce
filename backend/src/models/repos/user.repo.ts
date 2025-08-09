import { IUser } from "../../interface/interface";
import user from "../user.model";

const createUser = async ({ id, name, slug, password, role, email }: IUser) => {
  const newUser = await user.create({
    usr_id: id,
    usr_slug: slug,
    usr_name: name,
    usr_password: password,
    usr_role: role,
    usr_email: email,
  });
  return newUser;
};

export { createUser };
