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

CREATE FUNCTION sessions_update() RETURNS TRIGGER AS $$
BEGIN
  UPDATE sessions SET expire = true where "userid" = NEW.id;
  RETURN new;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER users_update_trigger
AFTER UPDATE ON users
FOR EACH ROW
WHEN (NEW.disable = true)
EXECUTE FUNCTION sessions_update();

update users set disable = true where id = 2;

drop trigger users_update_trigger on users;
drop function sessions_update;

delete from migrations where name = '20240827_04_add_expire_column.js';