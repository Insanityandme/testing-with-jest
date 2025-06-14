const { Builder, By, until } = require('selenium-webdriver');
require('geckodriver');

const fileUnderTest = 'file://' + __dirname.replace(/ /g, '%20') + '/../dist/index.html';
const defaultTimeout = 10000;
let driver;
jest.setTimeout(1000 * 60 * 5); // 5 minuter

// Det här körs innan vi kör testerna för att säkerställa att Firefox är igång
beforeAll(async () => {
console.log(fileUnderTest);
    driver = await new Builder().forBrowser('firefox').build();
    await driver.get(fileUnderTest);
});

// Allra sist avslutar vi Firefox igen
afterAll(async() => {
    await driver.quit();
}, defaultTimeout);

test('The stack should be empty in the beginning', async () => {
	let stack = await driver.findElement(By.id('top_of_stack')).getText();
	expect(stack).toEqual("n/a");
});

describe('Clicking "Pusha till stacken"', () => {
	it('should open a prompt box', async () => {
		let push = await driver.findElement(By.id('push'));
		await push.click();
		let alert = await driver.switchTo().alert();
		await alert.sendKeys("Bananer");
		await alert.accept();
	});
});

describe('Clicking "Poppa stacken!"', () => {
    it('should push to stack and then pop to stack', async () => {
		let push = await driver.findElement(By.id('push'));
		await push.click();
		let pushAlert = await driver.switchTo().alert();
		await pushAlert.sendKeys('10');
		await pushAlert.accept();

		let pop = await driver.findElement(By.id('pop'));
		await pop.click();
		let popAlert = await driver.switchTo().alert();

        let popText = await popAlert.getText();

        expect(popText).toEqual("Tog bort 10"); 

        await popAlert.accept();
    });
});
