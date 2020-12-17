/**
 * @file cypress/tests/functional/Classic.spec.js
 *
 * Copyright (c) 2014-2020 Simon Fraser University
 * Copyright (c) 2000-2020 John Willinsky
 * Distributed under the GNU GPL v2. For full terms see the file docs/COPYING.
 *
 */

describe('Theme plugin tests', function() {
	it('Enables and selects the theme', function() {
		cy.login('admin', 'admin', 'publicknowledge');

		cy.get('nav[class="app__nav"] ul a[class="app__navItem"]:contains("Website")').click();
		cy.get('button[id="plugins-button"]').click();

		// Find and enable the plugin
		cy.get('input[id^="select-cell-classicthemeplugin-enabled"]').click();
		cy.get('div:contains(\'The plugin "Classic Theme" has been enabled.\')');
		cy.reload();

		// Select the Classic theme
		cy.get('button[id="appearance-button"]').click();
		cy.get('select[id="theme-themePluginPath-control"]').select('classic');
		cy.get('div[id="theme"] button').contains('Save').click();
		cy.get('div[id="theme"] [role="status"]').contains('Saved');
	});
});
