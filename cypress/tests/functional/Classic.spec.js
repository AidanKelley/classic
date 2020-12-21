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
	const pages = [
		'issue/current',
		'issue/archive',
		'issue/view/1',
		'article/view/17',
		'article/view/17/3',
		'about',
		'about/editorialTeam',
		'about/submissions',
		'about/contact',
		'about/privacy',
		'information/readers',
		'information/authors',
		'information/librarians'
	];
	const [month, day, year] = new Date()
		.toLocaleDateString('en-US', {
			month: 'numeric',
			day: 'numeric',
			year: 'numeric'
		})
		.split('/');

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
		cy.url().should('match',/index/);
		pages.forEach(page => {
			cy.visit(path + '/' + page);
		});
	});

	it('Search an article', function () {
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
});
