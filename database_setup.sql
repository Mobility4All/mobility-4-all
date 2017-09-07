-- Create databse first with below command

CREATE DATABASE "mobility_4_all";


-- Install PostGIS to make db friendlier for geolocation
brew install postgis
--(for reference PostGIS download http://postgis.net/install/)
--then run this in Postico--
CREATE EXTENSION postgis;



-- Navigate into database and use the below data to create tables

CREATE TABLE "drivers" (
  "id" serial PRIMARY KEY,
  "driver_socket" VARCHAR(30),
  "first_name" VARCHAR(30),
  "last_name" VARCHAR(30),
  "email" VARCHAR(30),
  "phone" VARCHAR(15),
  "username" VARCHAR(80) NOT NULL UNIQUE,
  "password" VARCHAR(240) NOT NULL,
  "street" VARCHAR(50),
  "city" VARCHAR(25),
  "state" VARCHAR(2),
  "make" VARCHAR(20),
  "model" VARCHAR(30),
  "license_num" VARCHAR(10),
  "driver_photo_url" VARCHAR(200) DEFAULT 'https://image.freepik.com/free-icon/user-silhouette_318-79814.jpg',
  "vehicle_photo_url" VARCHAR(200) DEFAULT 'https://image.freepik.com/free-icon/car-fill-from-frontal-view_318-72875.jpg',
  "live" BOOLEAN DEFAULT FALSE,
  "location" geography(Point,4326),
  "elec_wheelchair" BOOLEAN DEFAULT FALSE,
  "col_wheelchair" BOOLEAN DEFAULT FALSE,
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
  "rider_photo_url" VARCHAR(200) DEFAULT 'https://image.freepik.com/free-icon/user-silhouette_318-79814.jpg',
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
  "cg_financial_auth" BOOLEAN,
  "cg_notifications" BOOLEAN,
  "credit_card_num" VARCHAR(15),
  "credit_cvc" VARCHAR(15),
  "credit_expdate" VARCHAR(10),
  "med_id" VARCHAR(15),
  "metmo_id" VARCHAR(15),
  "elec_wheelchair" BOOLEAN DEFAULT FALSE,
  "col_wheelchair" BOOLEAN DEFAULT FALSE,
  "service_animal" BOOLEAN DEFAULT FALSE,
  "oxygen" BOOLEAN DEFAULT FALSE,
  "complete" BOOLEAN DEFAULT FALSE
);

CREATE TABLE "trips" (
  "id" serial PRIMARY KEY,
  "driver_id" INT,
  "rider_id" INT,
  "purpose" VARCHAR(10),
  "start_location" geography(Point,4326) NOT NULL,
  "end_location" geography(Point,4326) NOT NULL,
  "rider_note" VARCHAR(200),
  "accept" BOOLEAN default false,
  "pickup" BOOLEAN default false,
  "complete" BOOLEAN default false,
  "fare_amt" VARCHAR(10)
);
