# ec2 vpc (aws linux) install package (mysql)

-- sudo dnf install mariadb105-server -y

sudo systemctl enable mariadb
sudo systemctl start mariadb

ALTER USER root@'localhost' IDENTIFIED BY '123456'

# Import mysql local to ec2

scp -i "~/.ssh/mysql-shop-ecommerce-key-pair.pem" /home/luozhi/Downloads/Sample-SQL-File-1000-Rows.sql ec2-user@ec2-13-251-103-215.ap-southeast-1.compute.amazonaws.com:~

# create usser and privileges

# localhost

create user 'user1'@'localhost' IDENTIFIED BY '123456'
grant all privileges on users.\* to 'user1'@'localhost'

# remote

create user 'user_remote'@'%' IDENTIFIED BY '123456'
grant all privileges on \*.\* to 'user_remote'@'localhost'

-- dbeaver: sign in throught IPv4: 13.251.103.215
