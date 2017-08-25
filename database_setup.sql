CREATE DATABASE mobility_4_all;

-- Navigate into database

CREATE TABLE "drivers" (
  "id" serial PRIMARY KEY,
  "first_name" VARCHAR(30),
  "last_name" VARCHAR(30),
  "email" VARCHAR(30),
  "phone" INT,
  "username" VARCHAR(80) NOT NULL UNIQUE,
  "password" VARCHAR(240) NOT NULL,
  "city" VARCHAR(25) NOT NULL,
  "state" VARCHAR(2),
  "make" VARCHAR(20),
  "model" VARCHAR(30),
  "license_num" VARCHAR(10),
  "driver_photo_url" VARCHAR(100),
  "vehicle_photo_url" VARCHAR(100),
  "live" BOOLEAN,
  "location" VARCHAR(100)
);

CREATE TABLE "riders" (
  "id" serial PRIMARY KEY,
  "username" VARCHAR(80) NOT NULL UNIQUE,
  "password" VARCHAR(240) NOT NULL,
  "rider_first" VARCHAR(20) NOT NULL,
  "rider_last" VARCHAR(20) NOT NULL,
  "rider_photo_url" VARCHAR(200),
  "rider_cell" INT,
  "rider_email" VARCHAR(50),
  "rider_street" VARCHAR(50),
  "rider_city" VARCHAR(30),
  "rider_state" VARCHAR(2),
  "rider_addtl_info" VARCHAR(500),
  "cg_first" VARCHAR(20),
  "cg_last" VARCHAR(20),
  "cg_cell" INT,
  "cg_email" VARCHAR(50),
  "cg_relationship" VARCHAR(20),
  "credit_card_num" INT,
  "credit_cvc" INT,
  "credit_expdate" VARCHAR(10),
  "med_id" INT,
  "metmo_id" INT
);

CREATE TABLE "trips" (
  "id" serial PRIMARY KEY,
  "driver_id" INT,
  "rider_id" INT,
  "start_location" VARCHAR(100),
  "end_location" VARCHAR(100),
  "rider_note" VARCHAR(200),
  "accept" BOOLEAN default false,
  "pickup" BOOLEAN default false,
  "complete" BOOLEAN default false,
  "fare_amt" VARCHAR(10)
);

CREATE TABLE "needs" (
  "id" serial PRIMARY KEY,
  "need" VARCHAR(30) NOT NULL
)

CREATE TABLE "rider_needs" (
  "id" serial PRIMARY KEY,
  "rider_id" INT,
  "need_id" INT
)

CREATE TABLE "driver_needs" (
  "id" serial PRIMARY KEY,
  "driver_id" INT,
  "need_id" INT
)
