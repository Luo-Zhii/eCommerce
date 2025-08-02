// Reverse proxy

install nginx
File:

1. Reverse Proxy Nginx

```bash
sudo apt-get install -y nginx
run ip, not wokring then htto open secirity
cd /etc/nginx/sites-available

sudo vim default

location /api/v1/ {
    rewrite ^/api/v1/(.*)$ /api/v1/$1 break;
    proxy_pass http://localhost:2050;
    proxy_set_header Host $host;
    proxy_set_header X-Real-IP $remote_addr;
    proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
}

sudo systemctl restart nginx
```

2. Add domain to nginx configuration

```bash
        server_name shop.luozhi.com www.shop.luozhi.com;

        location / {
                proxy_pass http://localhost:2050;
                proxy_http_version 1.1;
                proxy_set_header Upgrade $http_upgrade;
                proxy_set_header Connection 'upgrade';
                proxy_set_header Host $host;
                proxy_cache_bypass $http_upgrade;
        }

    # local
    sudo vim /etc/hosts
    13.213.84.91 shop.luozhi.com


```

3. add SSL to domain

```bash
sudo add-apt-repository ppa:certbot/certbot
sudo apt-get update
sudo apt-get install python3-certbot-nginx
sudo certbot --nginx -d shop.luozhi.com

#  extend while exxpired
sudo certbot renew --dry-run
sudo systemctl status certbot.timer
```
