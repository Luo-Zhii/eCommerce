import { INotification } from "../interface/interface";
import notification from "../models/notification.model";
class NotificationService {
  async pushNotificationSystem({
    type,
    received,
    sender,
    options,
  }: INotification) {
    let noti_content;
    if (type === "SHOP-001") {
      noti_content = "@@@ had add new product @@@@";
    } else {
      noti_content = "@@@ had add new vouncher @@@@";
    }

    const newNotification = await notification.create({
      noti_type: type,
      noti_receivedId: received,
      noti_senderId: sender,
      noti_content,
      noti_options: options,
    });
    return newNotification;
  }

  async listNotiByUser({
    userId = 1,
    type = "ALL",
    isRead = false,
  }: INotification) {
    const match: { [key: string]: any } = { noti_receivedId: userId };
    if (type !== "ALL") {
      match["noti_type"] = type;
    }
    return await notification.aggregate([
      {
        $match: match,
      },
      {
        $project: {
          noti_type: 1,
          noti_senderId: 1,
          noti_receivedId: 1,
          noti_content: {
            $concat: [
              {
                $substr: ["$noti_options.shop_name", 0, -1],
              },
              " just added product: ",
              {
                $substr: ["$noti_options.product_name", 0, -1],
              },
            ],
          },
          noti_options: 1,
          createAt: 1,
        },
      },
    ]);
  }
}

const notificationService = new NotificationService();
export default notificationService;
