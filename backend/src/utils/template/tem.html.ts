const htmlEmailToken = () => {
  return `<!DOCTYPE html>
<html lang="en" xmlns="http://www.w3.org/1999/xhtml">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>Xác thực địa chỉ Email</title>
  <style type="text/css">
    body, table, td, a { -webkit-text-size-adjust: 100%; -ms-text-size-adjust: 100%; }
    table, td { mso-table-lspace: 0pt; mso-table-rspace: 0pt; }
    img { -ms-interpolation-mode: bicubic; display: block; border: 0; }
    a { text-decoration: none; }
    body {
      margin: 0;
      padding: 0;
      width: 100% !important;
      height: 100% !important;
      font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Arial, sans-serif;
      background-color: #f5f7fa;
      line-height: 1.6;
    }
      .hero {
      margin: 10px auto;
      }
    .email-container {
      max-width: 600px;
      margin: 40px auto;
      background: #ffffff;
      border-radius: 12px;
      overflow: hidden;
      box-shadow: 0 4px 20px rgba(0, 0, 0, 0.05);
    }
    .email-header {
      text-align: center;
      padding: 40px 20px 30px;
      background: linear-gradient(135deg, #6366f1 0%, #a855f7 100%);
      position: relative;
      overflow: hidden;
    }
    .email-header::before {
      content: '';
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      height: 100%;
      background: url('https://www.transparenttextures.com/patterns/subtle-white-feathers.png');
      opacity: 0.1;
    }
    .email-header img.logo {
      width: 100px;
      margin-bottom: 20px;
      filter: drop-shadow(0 2px 4px rgba(0, 0, 0, 0.1));
    }
    .email-header h2 {
      color: #ffffff;
      font-size: 26px;
      font-weight: 600;
      margin: 0;
      letter-spacing: -0.5px;
    }
    .email-body {
      padding: 40px 30px;
      text-align: center;
      background: #ffffff;
    }
    .email-body img.hero {
      max-width: 100%;
      height: auto;
      margin-bottom: 24px;
      border-radius: 8px;
    }
    .email-body h1 {
      color: #1f2937;
      font-size: 28px;
      font-weight: 700;
      margin: 0 0 16px;
      letter-spacing: -0.5px;
    }
    .email-body p {
      color: #4b5563;
      font-size: 16px;
      margin: 0 0 24px;
      line-height: 1.7;
    }
    .verify-button {
      display: inline-block;
      background: linear-gradient(90deg, #6366f1 0%, #a855f7 100%);
      color: #ffffff;
      padding: 14px 32px;
      border-radius: 8px;
      font-size: 16px;
      font-weight: 600;
      transition: transform 0.2s ease, box-shadow 0.2s ease;
    }
    .verify-button:hover {
      background: linear-gradient(90deg, #5a5fe0 0%, #9b4de6 100%);
      transform: translateY(-2px);
      box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
    }
    .copy-link {
      font-size: 14px;
      color: #6b7280;
      margin-top: 24px;
      word-break: break-all;
    }
    .copy-link a {
      color: #6366f1;
      text-decoration: underline;
    }
    .email-footer {
      text-align: center;
      font-size: 13px;
      color: #6b7280;
      padding: 24px 20px;
      background: #f9fafb;
      border-top: 1px solid #e5e7eb;
    }
    .social-icons {
      margin: 16px auto;
       display: flex;
      justify-content: center;
      align-items: center;
    }
    .social-icons img {
      width: 24px;
      margin: 0 8px;
      opacity: 0.7;
      transition: opacity 0.2s ease;
    }
    .social-icons img:hover {
      opacity: 1;
    }
    @media screen and (max-width: 600px) {
      .email-container { margin: 20px; }
      .email-body { padding: 24px 16px; }
      .email-body h1 { font-size: 24px; }
      .email-body p { font-size: 15px; }
      .verify-button { padding: 12px 24px; font-size: 15px; }
      .email-header { padding: 30px 16px 20px; }
      .email-header h2 { font-size: 22px; }
    }
  </style>
</head>
<body>
  <table width="100%" bgcolor="#f5f7fa">
    <tr>
      <td align="center">
        <div class="email-container">
          <div class="email-header">
            <h2>Xác thực Email của bạn</h2>
          </div>
          <div class="email-body">
          <b class="hero">Chào mừng bạn!</b>
            <h1>Hoàn tất đăng ký của bạn</h1>
            <p>Chào mừng bạn đến với Shop RS! Vui lòng nhấn nút bên dưới để xác thực địa chỉ email và kích hoạt tài khoản của bạn.</p>
            <a href="{{link_verify}}" class="verify-button">Xác thực Ngay</a>
            <p class="copy-link">Nếu nút trên không hoạt động, sao chép và dán liên kết sau vào trình duyệt của bạn:<br>
            <a href="{{link_verify}}">{{link_verify}}</a></p>
          </div>
          <div class="email-footer">
            <p>&copy; 2025 Your Company. All rights reserved.</p>
            <div class="social-icons">
              <a href="https://facebook.com"><img src="https://img.icons8.com/color/48/000000/facebook-new.png" alt="Facebook"></a>
              <a href="https://twitter.com"><img src="https://img.icons8.com/color/48/000000/twitter.png" alt="Twitter"></a>
              <a href="https://linkedin.com"><img src="https://img.icons8.com/color/48/000000/linkedin.png" alt="LinkedIn"></a>
            </div>
          </div>
        </div>
      </td>
    </tr>
  </table>
</body>
</html>`;
};

export default htmlEmailToken;
