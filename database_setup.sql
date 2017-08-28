-- Create databse first with below command

CREATE DATABASE "mobility_4_all";

-- Navigate into database and use the below data to create tables

CREATE TABLE "drivers" (
  "id" serial PRIMARY KEY,
  "first_name" VARCHAR(30),
  "last_name" VARCHAR(30),
  "email" VARCHAR(30),
  "phone" VARCHAR(15),
  "username" VARCHAR(80) NOT NULL UNIQUE,
  "password" VARCHAR(240) NOT NULL,
  "city" VARCHAR(25),
  "state" VARCHAR(2),
  "make" VARCHAR(20),
  "model" VARCHAR(30),
  "license_num" VARCHAR(10),
  "driver_photo_url" VARCHAR(100),
  "vehicle_photo_url" VARCHAR(100),
  "live" BOOLEAN DEFAULT FALSE,
  "location" VARCHAR(100),
  "wheelchair" BOOLEAN DEFAULT FALSE,
  "service_animal" BOOLEAN DEFAULT FALSE,
  "oxygen" BOOLEAN DEFAULT FALSE,
  "cpr" BOOLEAN DEFAULT FALSE,
  "complete" BOOLEAN DEFAULT FALSE
);

CREATE TABLE "riders" (
  "id" serial PRIMARY KEY,
  "username" VARCHAR(80) NOT NULL UNIQUE,
  "password" VARCHAR(240) NOT NULL,
  "rider_first" VARCHAR(20),
  "rider_last" VARCHAR(20),
  "rider_photo_url" VARCHAR(200),
  "rider_cell" VARCHAR(15),
  "rider_email" VARCHAR(50),
  "rider_street" VARCHAR(50),
  "rider_city" VARCHAR(30),
  "rider_state" VARCHAR(2),
  "rider_addtl_info" VARCHAR(500),
  "cg_first" VARCHAR(20),
  "cg_last" VARCHAR(20),
  "cg_cell" VARCHAR(15),
  "cg_email" VARCHAR(50),
  "cg_relationship" VARCHAR(20),
  "cg_orders_rides" BOOLEAN,
  "cg_notifications" BOOLEAN,
  "credit_card_num" VARCHAR(15),
  "credit_cvc" VARCHAR(15),
  "credit_expdate" VARCHAR(10),
  "med_id" VARCHAR(15),
  "metmo_id" VARCHAR(15),
  "wheelchair" BOOLEAN DEFAULT FALSE,
  "service_animal" BOOLEAN DEFAULT FALSE,
  "oxygen" BOOLEAN DEFAULT FALSE,
  "complete" BOOLEAN DEFAULT FALSE
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
