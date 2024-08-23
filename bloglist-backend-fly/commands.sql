flyctl postgres connect -a bloglistbackendpostgres
postgres=# \d

CREATE TABLE blogs (
    id SERIAL PRIMARY KEY,
    author text,
    url text NOT NULL,
    title text NOT NULL,
    likes integer DEFAULT 0
);


insert into blogs (author, url, title, likes) values ('Dan Abramov', 'www.dan.com', 'On let vs const', 0);
insert into blogs (author, url, title, likes) values ('Laurenz Albe', 'www.laurenz.com', 'Gaps in sequences in PostgreSQL', 0);
insert into blogs (author, url, title, likes) values ('Henry Wu', 'www.happy.com', 'Merry Christmas', 6);
insert into blogs (author, url, title, likes) values ('Billie', 'www.billie.com', 'Happy Birthday', 17);