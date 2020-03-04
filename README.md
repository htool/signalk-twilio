# SignalK Twilio notification plugin

This package is designed to send an SMS notification when an event occurs on the server

## Installation

To install this package clone it from git and run npm link.

```
git clone https://github.com/codekilo/signalk-twilio.git
cd signalk-twilio
sudo npm link
```

Then go to the SignalK configuration directory (probably `~/.signalk`)  and link the module again:

```
$ cd .signalk 
$ npm link signalk-twilio
```

## configuration

The plugin has the following required options: 

#### Account Sid
The SID of your twilio account

#### Token
The auth Token for your twilio account

#### Sender
The phone number or Sender ID to use for sending notifications

For each notification the following settings are needed:

#### Event
The name of the event to subscribe to

#### Message 
The message to send with the notifications

#### Recipients
A list of phone numbers to notify when this event occurs


## use

