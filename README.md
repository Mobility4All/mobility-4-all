## Mobility-4-All

Mobility 4 All (MO) is a mobile web application ride service built to meet the needs of people with disabilities and other special needs. A rider can share accessibility needs with their driver and drivers are trained to provide a high touch service that creates comfort, trust, and a true door-to-door service. It is intended to serve those that are normally served by Metro Mobility services while using an on demand Uber or Lyft-like model, tailored to the individual user. This new service will also link to other transport options to assist MO users with their various transport needs around the Twin Cities.

## Built With

SEAN Stack Postgresql, Express, AngularJS, Node.js

Angular Materials
Google Maps JavaScript API
HTML5 Geolocation API
Google Maps Distance Matrix API
Google Places JavaScript API
Twilio
Filestack
PostGIS
apiDoc
Socket.IO
ng-map
Heroku

## Getting Started

These instructions will get you a copy of the project up and running on your local machine for development and testing purposes. See deployment for notes on how to deploy the project on a live system.

## Prerequisites

Dependencies used to create Mobility-4-All:

--"@google/maps": "^0.4.3",
--"angular": "^1.6.4",
--"angular-animate": "^1.6.6",
--"angular-aria": "^1.6.6",
--"angular-material": "^1.1.4",
--"angular-material-icons": "^0.7.1",
--"angular-messages": "^1.6.6",
--"angular-route": "^1.6.4",
--"bcrypt": "^1.0.2",
--"body-parser": "^1.13.3",
--"bootstrap": "^3.3.5",
--"express": "^4.13.1",
--"express-session": "^1.13.0",
--"jquery": "^2.1.4",
--"material-design-icons": "^3.0.1",
--"ngmap": "^1.18.4",
--"passport": "^0.2.2",
--"passport-local": "^1.0.0",
--"path": "^0.11.14",
--"pg": "^7.1.0",
--"socket.io": "^2.0.3",
--"twilio": "^3.6.4"

## Steps to get the development environment running.

-- Create database first with below command (this version used Postico as a database manager)

```SQL
CREATE DATABASE "mobility_4_all";
```

-- Install PostGIS to make db friendlier for geolocation (if Homebrew is install)

```git
brew install postgis
```

--(for reference PostGIS download http://postgis.net/install/)
--then run this in Postico--

```SQL
CREATE EXTENSION postgis;
```

-- Navigate into database and use the below data to create tables

```SQL
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
  "driver_photo_url" VARCHAR(100),
  "vehicle_photo_url" VARCHAR(100),
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
```

## Scope Documentation

https://docs.google.com/a/blueraven.digital/document/d/1AbO3lkl4REHFTjR3A7ODtleKVPRqGV6_8psrfLbrPhM/edit?usp=sharing

## Completed Features

High level list of items completed.

-[x] Create two separate views: Rider/Caregiver and Driver
-[x] Create a register Rider/Caregiver path that includes checkboxes to match rider disabilities with drivers that can accommodate those needs.
-[x] Create a register Driver path includes same checkboxes to match with Riders that they are able to accommodate for. Includes a picture of the driver and driver's vehicle.

### Rider View:

-[x] Create On demand or Scheduled pickup (Scheduled pickups are a stretch goal)
-[x] Create a view for Rider purpose of trip.
-[x] Create a view to input starting and ending location and ability to call for a ride.
-[x] Create dialog boxes to alert rider when a driver has matched with them, the driver has arrived, and the driver has dropped them off.
-[x] Create a Twilio alert to text the Caregiver that the rider has been picked up and has been dropped off at their location.

### Driver View:

-[x] Create a default landing page for Driver.
-[x] Create a matching query when a driver comes online searching for fares and only matches with riders that they can accommodate.
-[x] Add show/hide buttons that the driver will push when they accept a ride, arrive for rider, pickup rider, and drop off rider.
-[x] Add feature for navigation for driver to get directions from their current location to the location of the rider.  After pickup add feature to navigate driver from pickup to rider's final destination.

## Finishing up:

-[x] Wrote API docs
-[x] code comments throughout
-[x] finish Readme

## Images

![alt text](/server/public/images/home.png)
--home page

![alt text](/server/public/images/rider_signup.png)
--rider and driver register

![alt text](/server/public/images/rider_profile.png)
--rider profile

![alt text](/server/public/images/driver_profile.png)
--driver profile

![alt text](/server/public/images/driver_default_view.png)
--driver default

![alt text](/server/public/images/driver_go_live.png)
--driver go live

![alt text](/server/public/images/ride_now.png)
--rider ride now

![alt text](/server/public/images/rider_trip_purpose.png)
--rider trip purpose

![alt text](/server/public/images/rider_start-end_location.png)
--rider start/end destination

![alt text](/server/public/images/driver_ride_request.png)
--driver ride accept

![alt text](/server/public/images/ride_on_the_way.png)
--ride on the way

![alt text](/server/public/images/driver_arrival.png)
--driver arrival for pick up

![alt text](/server/public/images/rider_ride_is_here.png)
--rider ride is here

![alt text](/server/public/images/driver_directions.png)
--driver directions

![alt text](/server/public/images/driver_dropoff.png)
--driver drop off

![alt text](/server/public/images/rider_payment.png)
--rider payment


## Next Steps:

-[] Adding a brokerage feature
-[] Adding an admin register feature to approve drivers before allowing them to use the app.
-[] Scheduled ride request
-[] Incorporating Metro Transit API data for price comparison
-[] Adding a driver to a your favorite list in your profile
-[] 5 star rating system after ride is completed




## Authors

*James P. Leary III
*Catherine Yanish
*David Krueger
*Peter Prentiss
*Tom Brossart
