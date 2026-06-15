-- 1. Regionen mit numerischer ID
CREATE TABLE regions
(
    id      INTEGER PRIMARY KEY AUTOINCREMENT, -- Das ist die fehlende 'id'
    name    varchar(200) NOT NULL,
    slug    varchar(200) NOT NULL UNIQUE,
    country varchar(200) NOT NULL
);

-- 2. Wanderwege mit Verknüpfung zur ID
CREATE TABLE trails
(
    id          INTEGER PRIMARY KEY AUTOINCREMENT,
    name        varchar(200) NOT NULL,
    slug        varchar(200) NOT NULL UNIQUE,
    distance    float,
    region_id   int NOT NULL,
    description text,
    FOREIGN KEY (region_id) REFERENCES regions (id)
);

-- Daten einfügen
INSERT INTO regions (name, slug, country)
VALUES ('Schwarzwald', 'schwarzwald', 'Deutschland'),
       ('Berner Oberland', 'berner-oberland', 'Schweiz'),
       ('Harz', 'harz', 'Deutschland'),
       ('Dolomiten', 'dolomiten', 'Italien');

INSERT INTO trails (name, slug, distance, region_id, description)
VALUES ('Westweg', 'westweg', 285.0, 1, 'Der Klassiker im Schwarzwald von Pforzheim nach Basel.'),
       ('Eiger Trail', 'eiger-trail', 6.0, 2, 'Spektakulärer Weg direkt unter der Eiger-Nordwand.'),
       ('Brockenaufstieg', 'brockenaufstieg', 12.5, 3, 'Der beliebteste Weg auf den höchsten Gipfel im Norden.'),
       ('Tre Cime Runde', 'tre-cime-runde', 9.5, 4, 'Einmal um die berühmten Drei Zinnen in Südtirol.');