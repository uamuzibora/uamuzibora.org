---
layout: page
title: Data
header: Our data
section: Data
---

<p class="lead">As an electronic medical record, Uamuzi Bora inherently captures and stores patient identifiable information. Here we explain how we collect, store, protect, and use the data to calculate our indicators. Further, we now share aggregated data with selected partners using an API.</p>

## Data collection and storage

Our system consists of a physical server located in Kakamega, Kenya, using WiMAX to connect to a Virtual Private Network (VPN) running across the internet to a number of client machines in different clinics in the region.

Client machines are usually Google Chromebooks, which use a 3G mobile internet connection to connect directly with the VPN. The 3G mobile internet connection does not permit access to the internet, and Wifi and Ethernet networking on the client machines is disabled.

We use customised version of [OpenMRS](http://www.openmrs.org): an [Apache Tomcat](http://tomcat.apache.org) Java web application, using [MySQL](http://dev.mysql.com) as a database server, and run behind [Nginx](http://nginx.org) as a reverse proxy server, on a server running [Ubuntu Linux](http://ubuntu.com).

Clinicians and medical record clerks use the client machines to search, view, edit and create electronic patient records within the OpenMRS web application.

## Data protection

### Protecting data in transit

Connections between the client machines and the server use exclusively HTTPS over an [IPsec VPN](http://en.wikipedia.org/wiki/IPsec).

Core Uamuzi Bora staff can also connect to the server from the internet using public-key authenticated SSH over the IPsec VPN.

All connections and connection attempts to the server are logged and audited.

### Protecting data at rest

Our server is physically secured in a locked office in Kakamega, Kenya, and physical access is limited to select Uamuzi Bora staff.

Patient identifiable information (such as the MySQL database) is stored on an [encrypted filesystem](http://www.saout.de/misc/dm-crypt/) that is decrypted at boot time using a USB key, which is then stored in a different secure physical location to the server.

Regular backups are made of patient identifiable data. These backups are encrypted using [GnuPG](http://www.gnupg.org) to a private key which is split between four lead Uamuzi Bora staff using [Shamir's Secret Sharing](http://en.wikipedia.org/wiki/Shamir's_Secret_Sharing) in a (3,4)-threshold scheme.

Encrypted backups are transferred to long-term storage on [Amazon Glacier](http://aws.amazon.com/glacier/) over the VPN and are only accessed in the event of disaster recovery.

#### Anonymised and aggregated data

In addition to regular backups, regular anonymised versions of our database are created automatically by the server which contain no patient identifiable data.

We consider patient identification numbers, names, data of birth, relations, first line of address and free-text fields to represent patient identifiable data and these are deleted as part of the anonymisation process, apart from date of birth which is rounded to the nearest year.

The anonymous database is used to create aggregated data that is transferred over a VPN to our public webserver for use in our dashboard indicators and our API, which allows selected partners access to our aggregated data.

## Calculation of dashboard indicators

We define a number of indicators to monitor our progress in our [HIV](/data/hiv) and [MCH](/data/mch) dashboards. We provide a comprehensive explanation of what these indicators represent and how they are calculated below.

### HIV

All **percentage change** indicators are calculated from our [HIV project](/projects/hiv) start date of 5th October 2012.

#### Patients Enrolled

 - Total number of patients enrolled
 - Percentage change in the number of patients enrolled since the start date

$$PercentageChange = \frac{(PatientsEnrolled_{start})-(PatientsEnrolled_{today})}{PatientsEnrolled_{start}}\times100$$

#### On ART

 - Total number of patients receiving ART
 - Percentage change in the total number of patients receiving ART since the start date

$$PercentageChange = \frac{(OnART_{start})-(OnART_{today})}{OnART_{start}}\times100$$

#### Eligible not on ART

 - Total number of patients who are eligible for ART, but are not receiving ART
 - Percentage change in the fraction of eligible patients not receiving ART since the start date

$$PercentageChange = \frac{\frac{EligibleNotOnART_{start}}{EligibleForART_{start}}-\frac{EligibleNotOnART_{today}}{EligibleForART_{today}}}{\frac{EligibleNotOnART_{start}}{EligibleForART_{start}}}\times100$$

#### Lost to Follow Up

 - Number of People lost to follow up
 - Percentage change of the fraction of patients who are lost to follow up since the start date

$$PercentageChange = \frac{\frac{LostToFollowUp_{start}}{PatientsEnrolled_{start}}-\frac{LostToFollowUp_{today}}{PatientsEnrolled_{today}}}{\frac{LostToFollowUp_{start}}{PatientsEnrolled_{start}}}\times100$$

#### Followed Up

 - Patients lost to follow up who have been contact

#### Complete Records

 - Number of records without missing data
 - Percentage change in the fraction of records that are complete since the start date

$$PercentageChange = \frac{\frac{CompleteRecords_{start}}{PatientsEnrolled_{start}}-\frac{CompleteRecords_{today}}{PatientsEnrolled_{today}}}{\frac{CompleteRecords_{start}}{PatientsEnrolled_{start}}}\times100$$

###MCH

All **percentage change** indicators are calculated from our [MCH project](/projects/mch) start date of 2nd April 2013.

#### Women Enrolled

 - Total number of pregnant women enrolled
 - Percentage change in the total number of pregnant women enrolled from the start date

$$PercentageChange = \frac{WomenEnrolled_{start}-WomenEnrolled_{today}}{Women Enrolled_{start}}\times100$$

#### Deliveries

 - Number of deliveries recorded
 - Percent change in the fraction of enrolled women with a recorded delivery from the start date

$$PercentageChange = \frac{\frac{Deliveries_{start}}{WomenEnrolled_{start}}-\frac{Deliveries_{today}}{WomenEnrolled_{today}}}{\frac{Deliveries_{start}}{WomenEnrolled_{start}}}\times100$$

#### Children Enrolled

 - Total number of Children
 - Percentage change in the number of enrolled children from the start date

$$PercentageChange = \frac{ChildrenEnrolled_{start}-ChildrenEnrolled_{today}}{ChildrenEnrolled_{start}}\times100$$

#### Women on ART

 - Total number of HIV+ women on ART
 - Percentage change in the fraction of HIV positive women who receive ART since the start date

$$PercentageChange = \frac{\frac{WomenOnART_{start}}{WomenHIVPositive_{start}}-\frac{WomenOnART_{today}}{WomenHIVPositive_{today}}}{\frac{WomenOnART_{start}}{WomenHIVPositive_{start}}}\times100$$

#### Malaria Prophylaxis

 - Number of women receiving Malaria Prophylaxis
 - Percent change in the fraction of enrolled women receiving a complete course of Malaria Prophylaxis sicne the start date

$$PercentageChange = \frac{\frac{CompletedMalariaProphylaxis_{start}}{WomenEnrolled_{start}}-\frac{CompletedMalariaProphylaxis_{today}}{WomenEnrolled_{today}}}{\frac{CompletedMalariaProphylaxis_{start}}{WomenEnrolled_{start}}}\times100$$

#### Complete Records

 - Number of records without missing data
 - Percentage change in the fraction of records that are complete since the start date

$$PercentageChange = \frac{\frac{CompleteRecords_{start}}{WomenEnrolled_{start}}-\frac{CompleteRecords_{today}}{WomenEnrolled_{today}}}{\frac{CompleteRecords_{start}}{WomenEnrolled_{start}}}\times100$$

## Our API

We have created an [application programming interface (API)](http://en.wikipedia.org/wiki/Application_programming_interface) so that our data can be accessed programmatically. An API key is required to access certain data. Please [email us](mailto:team@uamuzibora.org) if you would like a key.

### Root URL

All methods should be appended to our API root URL:

`https://uamuzibora.org/api`

Unless otherwise specified, all data are returned in JSON format.

### Available methods

#### Methods available without an API key

`/locations/hiv` returns a list of all the locations in the HIV database

`/hiv/all` returns all the aggregated data required by the [HIV dashboard](/data/hiv)

`/mch/all` returns all the aggregated data required by the [MCH dashboard](/data/mch)

`/hiv/total_patients` returns the total number of HIV patients

`/mch/total_patients` returns the total number of MCH patients


### Methods requiring an API key

Access to the following methods requires an API key. You should include your API key as part of your request as a `GET` variable e.g.:

`https://uamuzibora.org/api/performance/hiv?api-key=your_api_key`

Please note that a separate API key is required for the HIV and MCH databases. An incorrect or unauthorised API key will return HTTP Error 401 (Access Forbidden).

`/performance/hiv` returns a JSON object with a list of how many forms each user has entered each day into the HIV database

`/performance/hiv/[date]` returns a JSON object with a list of how many forms each user has entered each week since \[date\](in ISO format: YYYY:MM:DD) in the HIV database. The data can be requested in CSV format by appending `type=csv` to the request.

`performance/hiv` returns a JSON object with a list of how many forms each user has entered each day in the MCH database

`/performance/hiv/[date]` returns a JSON object with a list of how many forms each user has entered each week since \[date\](in ISO format: YYYY:MM:DD) in the MCH database. The data can be requested in CSV format by appending `type=csv` to the request.

`/patients/mch` returns a JSON object with a line for each patient with data from the MCH database. The data can be requested in CSV format by appending `type=csv` to the request.

`/patients/hiv` returns a JSON object with a line for each patient with data from the HIV database. The data can be requested in CSV format by appending `type=csv` to the request.
