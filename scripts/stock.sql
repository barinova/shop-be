create table if not exists stocks (
	"product_id" uuid unique,
	"count" integer,
	foreign key ("product_id") references "products" ("id")
);

insert into stocks (product_id,count) values
 ('7567ec4b-b10c-48c5-9345-fc73c48a80aa', 25),
 ('7567ec4b-b10c-48c5-9345-fc73c48a80a1', 9),
 ('7567ec4b-b10c-48c5-9345-fc73c48a80a2', 10),
 ('7567ec4b-b10c-48c5-9345-fc73c48a80a3', 11),
 ('7567ec4b-b10c-48c5-9345-fc73348a80a4', 14),
 ('7567ec4b-b10c-48c5-9445-fc73c48a80a5', 7),
 ('7567ec4b-b10c-45c5-9345-fc73c48a80a6', 9);