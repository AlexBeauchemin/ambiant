App.helpers = (function () {
    var Helpers = {
        /**
         * Public functions
         */
        canSkip(radio) {
            if (Session.get('currentRadioOwner') === true) return true;
            return (radio.skip === "all");
        },

        validateAccountCreation(fields) {
            let data = fields,
              errors = [];

            this.removeFieldError('email');
            if (!this.validateEmail(data.email) || !this.validateString(data.email)) {
                errors.push('email');
                this.addFieldError('email');
            }

            if (Meteor.isClient) {
                if (!data.profile.name) data.profile.name = data.email;
                data.profile.name = data.profile.name.substr(0,50);

                //Can't validate password length server side, password is served as bcrypt hash
                this.removeFieldError('password');
                if (!this.validateString(data.password, 4)) {
                    errors.push('password');
                    this.addFieldError('password');
                }

                if (errors.length) Session.set('signup-error', 'error shake');
                else Session.set('signup-error', null);
            }

            return {
                data: data,
                errors: errors
            };
        },

        /**
         * Private Functions
         */
        addFieldError(field) {
            if (Meteor.isClient) {
                Session.set('error.' + field, 'error');
            }
        },
        removeFieldError(field) {
            if (Meteor.isClient) {
                Session.set('error.' + field, null);
            }
        },
        validateEmail(email) {
            var re = /^([\w-]+(?:\.[\w-]+)*)@((?:[\w-]+\.)*\w[\w-]{0,66})\.([a-z]{2,6}(?:\.[a-z]{2})?)$/i;
            return re.test(email);
        },
        validateString(text, minLength, maxLength) {
            if (!minLength) minLength = 1;
            if (!maxLength) maxLength = 100;
            if (!text || text.length < minLength || text > maxLength) {
                return false;
            }

            return text;
        }
    };

    return {
        canSkip: Helpers.canSkip.bind(Helpers),
        validateAccountCreation: Helpers.validateAccountCreation.bind(Helpers)
    };
})();
