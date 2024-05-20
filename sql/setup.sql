\c postgres

DROP DATABASE IF EXISTS memo_wall;
CREATE DATABASE memo_wall;

\c memo_wall 

CREATE TABLE users (
    id serial primary key,
    email varchar(64) unique,
    username varchar(64) unique,
    password varchar(64),
    created_at timestamp with time zone DEFAULT now(),
    updated_at timestamp with time zone DEFAULT now()
);

CREATE TABLE memos (
    id serial primary key,
    content text not null,
    image varchar(64),
    created_at timestamp with time zone DEFAULT now(),
    updated_at timestamp with time zone DEFAULT now()
);

CREATE TABLE user_like_memo(
    id serial primary key,
    user_id integer,
    memo_id integer,
    foreign key (user_id) references users(id) ON DELETE CASCADE,
    foreign key (memo_id) references memos(id) ON DELETE CASCADE
)



