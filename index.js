const twilio = require('twilio');
const PLUGIN_ID = 'signalk-twilio-notifications';
const PLUGIN_NAME = 'Signalk twilio notifications';
var unsubscribes = [];
module.exports = function(app) {
  var plugin = {};

  plugin.id = PLUGIN_ID;
  plugin.name = PLUGIN_NAME;
  plugin.description = 'A plugin to send sms notifications when an event occurs';

  plugin.start = function(options, restartPlugin) {
    app.debug('Plugin started');
    plugin.options = options;

    let accountSid = options.account.Sid;
    let authToken = options.account.token;
    let from = options.account.from;
    let client = twilio(accountSid, authToken);
    options.notifications.forEach(option => listen(option, client, from, options.name));

    app.setPluginStatus('Running');


  };

  function listen(option, client, from, name) {
    let _notify = function(event) {
      option.recipients.forEach(recipient => {
        client.messages
          .create({
            body: `Alert from ${name}: ${option.message}`,
            from: from,
            to: recipient
          })
          .then(message => console.log(message.sid));
      });
    };
    app.on(option.event, _notify);
    unsubscribes.push(() => {
      app.removeListener(option.event, _notify);
    });
  }


  plugin.stop = function() {
    // Here we put logic we need when the plugin stops
    app.debug('Plugin stopped');
    unsubscribes.forEach(f => f());
    app.setPluginStatus('Stopped');
  };

  plugin.schema = {
    title: PLUGIN_NAME,
    type: 'object',
    properties: {
      name: {
        type: 'string',
        title: 'sender name'
      },
      account: {
        type: 'object',
        required: ['Sid', 'token', 'from'],
        properties: {
          Sid: {
            type: 'string',
            title: 'Account Sid'
          },
          token: {
            type: 'string',
            title: 'Token'
          },
          from: {
            type: 'string',
            title: 'Sender'
          }
        }
      },
      notifications: {
        type: 'array',
        title: 'notifications',
        items: {
          type: 'object',
          properties: {
            event: {
              type: 'string',
              title: 'event'
            },
            message: {
              type: 'string',
              title: 'message'
            },
            recipients: {
              type: 'array',
              title: 'Recipients',
              items: {
                type: 'string',
                title: 'phone number'
              }
            }
          }
        }
      }
    }

  };

  return plugin;
};
