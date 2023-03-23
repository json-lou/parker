CREATE TABLE lines (
	id SERIAL PRIMARY KEY,
	name TEXT NOT NULL,
	fare FLOAT NOT NULL
);

CREATE TABLE stations (
	name TEXT NOT NULL,
	PRIMARY KEY (name)
);

CREATE TABLE cards (
	number INT NOT NULL PRIMARY KEY,
	amount NUMERIC(5, 2) NOT NULL
);

CREATE TABLE trainlines (
	line_id INT NOT NULL,
	station_name TEXT NOT NULL,
	sequence INT NOT NULL,
	PRIMARY KEY (line_id, station_name),
	CONSTRAINT fk_line FOREIGN KEY(line_id) REFERENCES lines(id),
	CONSTRAINT fk_station FOREIGN KEY(station_name) REFERENCES stations(name)
);

CREATE TABLE rides (
	id SERIAL PRIMARY KEY,
	card_number INT NOT NULL,
	entry_station_name TEXT NOT NULL,
	exit_station_name TEXT,
	fare FLOAT,
	CONSTRAINT fk_entry_station FOREIGN KEY(entry_station_name) REFERENCES stations(name),
	CONSTRAINT fk_exit_station FOREIGN KEY(exit_station_name) REFERENCES stations(name),
	CONSTRAINT fk_card FOREIGN KEY(card_number) REFERENCES cards(number)
);
