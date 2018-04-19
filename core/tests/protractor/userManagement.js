// Copyright 2014 The Oppia Authors. All Rights Reserved.
//
// Licensed under the Apache License, Version 2.0 (the "License");
// you may not use this file except in compliance with the License.
// You may obtain a copy of the License at
//
//      http://www.apache.org/licenses/LICENSE-2.0
//
// Unless required by applicable law or agreed to in writing, software
// distributed under the License is distributed on an "AS-IS" BASIS,
// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
// See the License for the specific language governing permissions and
// limitations under the License.

/**
 * @fileoverview End-to-end tests for user management.
 */

var general = require('../protractor_utils/general.js');
var users = require('../protractor_utils/users.js');
var workflow = require('../protractor_utils/workflow.js');
var LibraryPage = require('../protractor_utils/LibraryPage.js');
var PreferencesPage = require('../protractor_utils/PreferencesPage.js');

describe('Basic user journeys', function() {
  describe('Account creation', function() {
    var libraryPage = null;

    beforeEach(function() {
      libraryPage = new LibraryPage.LibraryPage();
    });

    it('should create users', function() {
      users.createUser(
        'ordinaryuser@userManagement.com', 'ordinaryUserManagement');

      users.login('ordinaryuser@userManagement.com');
      libraryPage.get();
      general.checkForConsoleErrors([]);

      browser.get(general.MODERATOR_URL_SUFFIX);
      general.checkForConsoleErrors([
        'Failed to load resource: the server responded with a status of 401']);
      users.logout();
    });

    it('should create moderators', function() {
      users.createModerator(
        'mod@userManagement.com', 'moderatorUserManagement');

      users.login('mod@userManagement.com');
      browser.get(general.MODERATOR_URL_SUFFIX);
      users.logout();

      general.checkForConsoleErrors([]);
    });

    // Usernames containing "admin" are not permitted.
    it('should create admins', function() {
      users.createAdmin('admin@userManagement.com', 'adm1nUserManagement');
      general.checkForConsoleErrors([]);
    });
  });

  describe('Login Flow', function() {
    beforeEach(function() {
      users.createAndLoginUser('randomuser@gmail.com', 'r4nd0m');
    });

    it('visits the links in the dropdown', function() {
      var profileDropdown = element(by.css(
        '.protractor-test-profile-dropdown'));

      var classNames = [
        '.protractor-test-profile-link',
        '.protractor-test-dashboard-link',
        '.protractor-test-preferences-link',
        '.protractor-test-notifications-link'
      ];
      classNames.forEach(function(className) {
        browser.actions().mouseMove(profileDropdown).perform();
        general.waitForSystem(100);
        profileDropdown.element(by.css(className)).click();
      });
    });

    afterEach(function() {
      general.checkForConsoleErrors([]);
      users.logout();
    });
  });

  describe('Preferences', function() {
    var preferencesPage = null;

    beforeEach(function() {
      preferencesPage = new PreferencesPage.PreferencesPage();
    });

    it('should change editor role email checkbox value', function() {
      users.createUser('alice@preferences.com', 'alicePreferences');
      users.login('alice@preferences.com');
      preferencesPage.get();
      expect(preferencesPage.isEditorRoleEmailsCheckboxSelected()).toBe(true);
      preferencesPage.toggleEditorRoleEmailsCheckbox();
      expect(preferencesPage.isEditorRoleEmailsCheckboxSelected()).toBe(false);
      browser.refresh();
      expect(preferencesPage.isEditorRoleEmailsCheckboxSelected()).toBe(false);
    });

    it('should change feedback message email checkbox value', function() {
      users.createUser('bob@preferences.com', 'bobPreferences');
      users.login('bob@preferences.com');
      preferencesPage.get();
      expect(preferencesPage.isFeedbackEmailsCheckboxSelected()).toBe(true);
      preferencesPage.toggleFeedbackEmailsCheckbox();
      expect(preferencesPage.isFeedbackEmailsCheckboxSelected()).toBe(false);
      browser.refresh();
      expect(preferencesPage.isFeedbackEmailsCheckboxSelected()).toBe(false);
    });

    afterEach(function() {
      general.checkForConsoleErrors([]);
    });
  });
});
