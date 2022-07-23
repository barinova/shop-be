create table if not exists products (
	"id" uuid primary key default uuid_generate_v4() unique,
	"description" text not null,
	"price" integer not null,
	"title" text not null
);

insert into products (id, description, price, title) values
('7567ec4b-b10c-48c5-9345-fc73c48a80aa', 'Classic pork - onion leaves, chashu, mayu, nori, pickled egg.', '10', 'Tonkotsu Ramen'),
('7567ec4b-b10c-48c5-9345-fc73c48a80a1', 'A classic of two broths from the capital - fried pork neck, onion leaves, menma, pickled egg.', '9','Tokio Ramen'),
('7567ec4b-b10c-48c5-9345-fc73c48a80a2', 'Kimchi, soybean sprouts, onion leaves, pickled carrot, padron pepper, menma.',  '8', 'Veggie Ramen'),
('7567ec4b-b10c-48c5-9345-fc73c48a80a3', 'Our special Ramen - duck breast, padron pepper, onion leaves, shiitake mushrooms, pickled egg.', '10', 'SG7 Ramen'),
('7567ec4b-b10c-48c5-9345-fc73348a80a4', 'Chicken thighs, shiitake mushrooms, onion leaves, pickled egg and chicken broth.', '8', 'Tori Ramen'),
('7567ec4b-b10c-48c5-9445-fc73c48a80a5', 'Chicken thighs, pea pods, soybean sprouts, onion leaves, corn on the cob, pickled egg.', '10', 'Sriracha Ramen'),
('7567ec4b-b10c-45c5-9345-fc73c48a80a6', 'Fried pork neck and chashu, onion leaves, menma, pickled egg, corn, soybean sprouts.', '13', 'Sapporo Ramen');

