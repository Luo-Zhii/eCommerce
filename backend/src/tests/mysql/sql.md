// CREATE TABLE

CREATE TABLE test_table (
id int not null,
name nvarchar(255) default null,
age int default null,
address nvarchar(255) default null,
primary key(id)
) ENGINE = InnoDB default CHARSET = utf8mb4;

// CREATE PROCEDURE

CREATE DEFINER=`insert`@`%` PROCEDURE `insert_data`()
BEGIN
DECLARE max_id int default 1000000;
DECLARE i int default 1;
while i <= max_id do
INSERT INTO test_table(id, name, age, address) values (i, concat('Name', i), i %100, concat('Address', i));
SET i = i + 1 ;
end while;
end
