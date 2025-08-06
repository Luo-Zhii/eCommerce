import { ITemplate } from "../interface/interface";
import template from "../models/template.model";
import htmlEmailToken from "../utils/template/tem.html";

class TemplateService {
  async newTemplate({ name, _id, html }: ITemplate) {
    const newTemplate = await template.create({
      tem_name: name,
      tem_id: _id,
      tem_html: htmlEmailToken(),
    });
    return newTemplate;
  }

  async getTemplate({ name }: ITemplate) {
    const foundTemplate = await template.findOne({ tem_name: name });
    return foundTemplate;
  }
}

const templateService = new TemplateService();
export default templateService;
