DROP TABLE IF EXISTS tb_herois;

CREATE TABLE tb_herois (
  id INT GENERATED ALWAYS AS IDENTITY PRIMARY KEY NOT NULL,
  nome TEXT NOT NULL,
  poder TEXT NOT NULL
);

-- create
INSERT INTO tb_herois (nome, poder) VALUES ('Flash', 'Velocidade'), ('Aquaman', 'Falar com animais'), ('Batman', 'Dinheiro');

-- read
SELECT * FROM tb_herois;
SELECT * FROM tb_herois WHERE nome = 'Flash';

-- update
UPDATE tb_herois SET nome = 'Goku', poder = 'Deus' WHERE id = 1;

-- delete
DELETE FROM tb_herois WHERE id = 2;