import role from "../role.model";

async function getUserRole() {
  return await role.findOne({ rol_slug: "s00003", rol_status: "active" });
}
export { getUserRole };
