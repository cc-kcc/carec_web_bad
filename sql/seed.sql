\c memo_wall
INSERT INTO users (
        username,
        email,
        password,
        created_at,
        updated_at
    )
VALUES (
        'james9896',
        'james123@tecky.io',
        '$2a$10$AjrHAwE82hzpiR4ZrDtiIewaUPS6lRa/CyCNd16Ce/tfNyRdYArde',
        CURRENT_TIMESTAMP,
        CURRENT_TIMESTAMP
    );
INSERT INTO users (
        username,
        email,
        password,
        created_at,
        updated_at
    )
VALUES (
        'gordon9896',
        'gordon@tecky.io',
        '$2a$10$AjrHAwE82hzpiR4ZrDtiIewaUPS6lRa/CyCNd16Ce/tfNyRdYArde',
        CURRENT_TIMESTAMP,
        CURRENT_TIMESTAMP
    );
INSERT INTO users (
        username,
        email,
        password,
        created_at,
        updated_at
    )
VALUES (
        'alex9896',
        'alex@tecky.io',
        '$2a$10$AjrHAwE82hzpiR4ZrDtiIewaUPS6lRa/CyCNd16Ce/tfNyRdYArde',
        CURRENT_TIMESTAMP,
        CURRENT_TIMESTAMP
    );
INSERT INTO memos (content, image, created_at, updated_at)
VALUES (
        'i love ivy',
        'ivy.jpeg',
        CURRENT_TIMESTAMP,
        CURRENT_TIMESTAMP
    );
INSERT INTO memos (content, image, created_at, updated_at)
VALUES (
        'i love day',
        'day.jpeg',
        CURRENT_TIMESTAMP,
        CURRENT_TIMESTAMP
    );
INSERT INTO memos (content, image, created_at, updated_at)
VALUES (
        'i love candy',
        'candy_add_oil.gif',
        CURRENT_TIMESTAMP,
        CURRENT_TIMESTAMP
    );
-- james:1,alex:2,gordon:3
-- ivy:1,day:2,candy:3
-- user idol

INSERT INTO user_like_memo (user_id,memo_id) VALUES(1, 3);
INSERT INTO user_like_memo (user_id,memo_id) VALUES(1, 2);
INSERT INTO user_like_memo (user_id,memo_id) VALUES(2, 1);
INSERT INTO user_like_memo (user_id,memo_id) VALUES(2, 3);
INSERT INTO user_like_memo (user_id,memo_id) VALUES(3, 2);
