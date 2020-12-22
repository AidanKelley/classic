/**
 * @file cypress/tests/functional/Classic.spec.js
 *
 * Copyright (c) 2014-2020 Simon Fraser University
 * Copyright (c) 2000-2020 John Willinsky
 * Distributed under the GNU GPL v2. For full terms see the file docs/COPYING.
 *
 */

describe('Theme plugin tests', function() {
	const journalPath = 'publicknowledge';
	const index = 'index.php';
	const path = '/' + index + '/' + journalPath;
	const [month, day, year] = new Date()
		.toLocaleDateString('en-US', {
			month: 'numeric',
			day: 'numeric',
			year: 'numeric'
		})
		.split('/');
	const user = {
		'givenName': 'John',
		'familyName': 'Debreenik',
		'username': 'jdebreenik',
		'country': 'UA',
		'affiliation': 'Lorem Ipsum University'
	};

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

	it('Visits front-end theme pages', function() {
		cy.visit(' ');
		cy.visit(path + '/issue/current');
		cy.visit(path + '/issue/archive');
		cy.visit(path + '/issue/view/1');
		cy.visit(path + '/article/view/17');
		cy.visit(path + '/article/view/17/3');
		cy.visit(path + '/about');
		cy.visit(path + '/about/editorialTeam');
		cy.visit(path + '/about/submissions');
		cy.visit(path + '/about/contact');
		cy.visit(path + '/about/privacy');
		cy.visit(path + '/information/readers');
		cy.visit(path + '/information/authors');
		cy.visit(path + '/information/librarians');
	});

	it('Search an article', function() {
		cy.visit(path + '/' + 'search' + '/' + 'search');
		cy.get('input[id="query"]').type('Antimicrobial', {delay: 0});

		// Search from the first day of the current month till now
		cy.get('select[name="dateFromYear"]').select(year);
		cy.get('select[name="dateFromMonth"]').select(month);
		cy.get('select[name="dateFromDay"]').select('1');
		cy.get('select[name="dateToYear"]').select(year);
		cy.get('select[name="dateToMonth"]').select(month);
		cy.get('select[name="dateToDay"]').select(day);

		cy.get('input[name="authors"]').type('Vajiheh Karbasizaed', {delay: 0});
		cy.get('button[type="submit"]').click();
		cy.get('.search_results').children().should('have.length', 1);
		cy.get('.article_summary').first().click();
		cy.url().should('match', /article\/view/);
	});

	it('Register a user', function() {
		// Sign out
		cy.visit(path + '/' + 'login/signOut');
		cy.url().should('match', /login/);

		// Register; 'register' command won't work for this theme because privacyConsent label overlays input checkbox
		cy.get('a.nav-link').contains('Register').click();
		cy.url().should('match', /user\/register/);
		cy.get('#givenName').type(user.givenName, {delay: 0});
		cy.get('#familyName').type(user.familyName, {delay: 0});
		cy.get('#affiliation').type(user.affiliation, {delay: 0});
		cy.get('#country').select(user.country);
		cy.get('#username').type(user.username, {delay: 0});
		cy.get('#email').type(user.username + '@mailinator.com', {delay: 0});
		cy.get('#password').type(user.username + user.username, {delay: 0});
		cy.get('#password2').type(user.username + user.username, {delay: 0});
		cy.get('label[for="privacyConsent"]').click();
		cy.get('label[for="checkbox-reviewer-interests"]').click();
		cy.get('#tagitInput input').type('psychotherapy,neuroscience,neurobiology', {delay: 0});
		cy.get('button[type="submit"]').contains('Register').click().click(); // Cypress expects 2 clicks to submit the form
		cy.get('.registration_complete_actions a').contains('View Submissions').click();
		cy.url().should('match', /submissions/);
	});

	it('Log in/Log out', function() {
		// Sign out
		cy.visit(path + '/' + 'login/signOut');
		cy.url().should('match', /login/);
		cy.get('#username').type(user.username, {delay: 0});
		cy.get('#password').type(user.username + user.username);
		cy.get('button[type="submit"]').click();
		cy.url().should('match', /submissions/);
	});
});
