BEGIN;

TRUNCATE
  "word",
  "language",
  "user";

INSERT INTO "user" ("id", "username", "name", "password")
VALUES
  (
    1,
    'admin',
    'Dunder Mifflin Admin',
    -- password = "pass"
    '$2a$10$fCWkaGbt7ZErxaxclioLteLUgg4Q3Rp09WW0s/wSLxDKYsaGYUpjG'
  );

INSERT INTO "language" ("id", "name", "user_id")
VALUES
  (1, 'Italian', 1);

INSERT INTO "word" ("id", "language_id", "original", "translation", "next")
VALUES
  (1, 1, 'Si', 'Yes', 2),
  (2, 1, 'No', 'No', 3),
  (3, 1, 'Per favore', 'Please', 4),
  (4, 1, 'Grazie', 'Thank you', 5),
  (5, 1, 'Prego', 'You''re welcome', 6),
  (6, 1, 'Mi scusi', 'Excuse me', 7),
  (7, 1, 'Mi dispiace', 'I am sorry', 8),
  (8, 1, 'Buon giorno', 'Good morning', 9),
  (9, 1, 'Buona sera', ' Good evening', 10),
  (10, 1, 'Buona notte', 'Good night', null);

UPDATE "language" SET head = 1 WHERE id = 1;

-- because we explicitly set the id fields
-- update the sequencer for future automatic id setting
SELECT setval('word_id_seq', (SELECT MAX(id) from "word"));
SELECT setval('language_id_seq', (SELECT MAX(id) from "language"));
SELECT setval('user_id_seq', (SELECT MAX(id) from "user"));

COMMIT;