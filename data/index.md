---
layout: page
title: Data
header: Our data
section: Data
---

<p class="lead">As a electronic medical record, Uamuzi Bora inherently captures and stores patient identifiable information. Here we explain how we collect, store, protect, and use the data to calculate our indicators. Further, we now share aggregated data with selected partners using an API.</p>

## Our infrastructure: how we collect and store our data

Our system consists of a physical server running located in Kakamega using WiMAX to connect to a Virtual Private Network (VPN) running across the internet to a number of client machines in different clinics in the region.

Client machines are usually Google Chromebooks, which use a 3G mobile internet connection to connect directly with the VPN. The 3G mobile internet connection does not permit access to the internet, and Wifi and Ethernet networking on the client machines is disabled.

We use customised version of [OpenMRS](http://www.openmrs.org): an [Apache Tomcat](http://tomcat.apache.org) Java web application, using [MySQL](http://dev.mysql.com) as a database server, and run behind [Nginx](http://nginx.org) as a reverse proxy server, on a server running [Ubuntu Linux](http://ubuntu.com).

Clinicians and medical record clerks use the client machines to search, view, edit and create electronic patient records within the OpenMRS web application.

## Data protection: how we protect our data

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

## Our dashboard: how we calculate our indicators

## Our API: how we make data available to partners
