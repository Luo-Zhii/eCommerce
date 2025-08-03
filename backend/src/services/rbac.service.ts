import { BadRequestError } from "../core/error.response";
import { IResource, IResourceList, IRoleList } from "../interface/interface";
import resource from "../models/resource.model";
import role from "../models/role.model";

class RbacService {
  async createResource({ name, slug, description }: IResource) {
    try {
      return await resource.create({
        src_name: name,
        src_slug: slug,
        src_description: description,
      });
    } catch (error) {
      console.error(error);
      throw new BadRequestError("Error creating resource");
    }
  }

  async resourceList({
    userId = 0,
    limit = 30,
    offset = 0,
    search = "",
  }: IResourceList) {
    try {
      if (userId === 0) {
        return await resource.aggregate([
          // {
          //   $match: {
          //     $regex: search,
          //     $options: "i",
          //   },
          // },
          {
            $skip: offset,
          },
          {
            $limit: limit,
          },
          {
            $project: {
              _id: 0,
              name: "$src_name",
              slug: "$src_slug",
              description: "$src_description",
              resourceId: "$_id",
              createAt: 1,
            },
          },
        ]);
      }
      throw new BadRequestError(
        "User don't have permission to access this resource"
      );
    } catch (error) {
      console.error(error);
    }
  }

  async createRole({
    name = "shop",
    slug = "s00001",
    description = "extend from shop or user",
    grants = [],
  }) {
    try {
      return await role.create({
        rol_name: name,
        rol_slug: slug,
        rol_description: description,
        rol_grants: grants,
      });
    } catch (error) {
      console.error(error);
      throw new BadRequestError("Error creating role");
    }
  }

  async roleList({
    userId = 0,
    limit = 30,
    offset = 0,
    search = "",
  }: IRoleList) {
    try {
      return await role.aggregate([
        {
          $skip: offset,
        },
        {
          $limit: limit,
        },
        {
          $unwind: "$rol_grants",
        },
        {
          $lookup: {
            from: "Resources",
            localField: "rol_grants.resource",
            foreignField: "_id",
            as: "resource",
          },
        },
        {
          $unwind: "$resource",
        },
        {
          $project: {
            role: "$rol_name",
            resource: "$resource.src_name",
            action: "$rol_grants.action",
            attributes: "$rol_grants.attributes",
            _id: 0,
          },
        },
        {
          $unwind: "$action",
        },
      ]);
    } catch (error) {
      console.error(error);
    }
  }
}

const rbacService = new RbacService();
export default rbacService;
