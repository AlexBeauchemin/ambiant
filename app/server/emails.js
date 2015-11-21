Meteor.methods({
  sendEmail: function (name, from, subject, text) {
    if (!subject || !text) {
      throw new Meteor.Error("Please fill required (*) fields");
    }

    if (!App.config.mailgunApiKey) {
      throw new Meteor.Error("Mailgun api key cannot be found.");
    }

    // Let other method calls from the same client start running,
    // without waiting for the email sending to complete.
    this.unblock();

    var options = {
      apiKey: App.config.mailgunApiKey,
      domain: 'ambiant.io'
    };

    var data = {
      to: 'alexbeauchemin01@gmail.com',
      from: from || 'postman@ambiant.io',
      subject: 'Ambiant: ' + subject,
      text: text + '\n\n' + '- ' + name
    };

    var email = new Mailgun(options);
    email.send(data);
  }
});