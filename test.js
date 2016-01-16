var webdriver = require('selenium-webdriver'), By = require('selenium-webdriver').By, until = require('selenium-webdriver').until;

var fs = require('fs');

var screenNum = 0;
var screenName;
var sleeptime = 2000;
var loginSleepTime = 1000;
//var sleeptime = 1;
var request = require('request');
var displayText = [];
displayTextCount = 0;
var testUsers = [
/*
{xh : "2009980013",xslx : "yx",sfxs : "yes"}//院系
//, {xh : "1985990089",xslx : "yx",sfxs : "yes"} //院系


{xh : "2000990330",xslx : "js",sfxs : "yes"},//导师 2015211059
{xh : "1991990098",xslx : "js",sfxs : "yes"},  //导师 2015310556
{xh : "1996990290",xslx : "js",sfxs : "yes"}, //导师 2015211059
*/


 /* */
 {
	xh : "2015010245",
	xslx : "bks",
	sfxs : "是"
}
 ,

 {
 	xh : "2014013295",
 	xslx : "bks",
 	sfxs : "否"
 }
 , {
	xh : "2015211059",
	xslx : "yjs",
	sfxs : "是"
}, 
 {
	xh : "2015310556",
	xslx : "yjs",
	sfxs : "是"
}

, {
	xh : "2014212099",
	xslx : "yjs",
	sfxs : "否"
}
, {
	xh : "2014310401",
	xslx : "yjs",
	sfxs : "否"
}
,{xh : "2015400536",xslx : "jxs",sfxs : "是"} //进修生


 ];

var data_url = 'http://node.jprda.com';
var currentXnxq = "2015-2016-1";
var currentCxkg = "关";
var driver;
var s_testCases;
var s_grades;
var url = "http://test.zhjw.syx.thcic.cn:21122/";
var saveFilePath = "C:\\Users\\zhong\\Desktop\\screen\\";

request.get({
	url : data_url + "/grade/",
	json : true,
	"encoding" : "utf-8"
}, function(e, r, gs) {
	// console.log(students);
	s_grades = gs;

	request.get({
		url : data_url + "/testCase/?sort=xh%20ASC",
		json : true,
		"encoding" : "utf-8"
	}, function(e, r, testCases) {
		// console.log(testCases);
		s_testCases = testCases;
		start();
	});

});

function loign(xh) {

	if (enableBrowser) {
		driver.get(url + "login.do");
		console.log('login.do>>>' + xh);
		driver.findElement(By.name('j_username')).clear();
		driver.findElement(By.name('j_username')).sendKeys(xh);
		driver.findElement(By.name('j_password')).clear();
		driver.findElement(By.name('j_password')).sendKeys('123');
		driver.findElement(By.name('bt')).click();
		driver.sleep(loginSleepTime);
		// driver.wait(until.titleIs('综合教务'), 1000);
	}

}

var enableBrowser = true;
// var enableBrowser = false;

function clickLink(link) {
	// link.click();
	console.log('clickLink>>>' + link);
}

function start() {
	if (enableBrowser) {
		driver = new webdriver.Builder().forBrowser('chrome').build();
		//driver = new webdriver.Builder().forBrowser(webdriver.Browser.INTERNET_EXPLORER).build();
		
		driver.get(url + "xklogin.do");
		driver.sleep(loginSleepTime);
	}
	
	var folder_exists = fs.existsSync(saveFilePath);
	 if(folder_exists == true)
	 {
	      var dirList = fs.readdirSync(saveFilePath);
	  
	     dirList.forEach(function(fileName)
	      {
	    	 console.log("del......" + saveFilePath + fileName);
	         fs.unlinkSync(saveFilePath + fileName);
	    });
	 }

	for ( var testUsersIdx in testUsers) {
		var testUser = testUsers[testUsersIdx];
		console.log('testUser>>>' + testUser.xh);
		loign(testUser.xh);
		for ( var testCaseIdx in s_testCases) {
			var testCase = s_testCases[testCaseIdx];

			if (testCase.xslx != testUser.xslx) {
				console.log('xxxx ' + testCase.xh + ' testCase>>>'
						+ testCase.url + " " + testCase.xslx);
				continue;
			}
			console.log('testCase>>>' + testCase.url + " " + testCase.xslx);

			if (enableBrowser) {
				driver.get(testCase.url);
				screenNumName = testCase.xh;

				// driver.findElement(By.xpath("//body")).sendKeys(webdriver.Key.KEY_PAGE_DOWN);
				driver.sleep(sleeptime);
				
				
				displayText[displayText.length] = testCase.title;
				
				driver.takeScreenshot(1).then(
						function(data) {
							
							var base64Data = data.replace(
									/^data:image\/png;base64,/, "")
							// + testUser.xh + "-" + screenNumName + "-"
									var txt = "";
							txt +=displayText[displayTextCount];
							fs.writeFile(saveFilePath  
									+ screenNum + "-"+ txt.replace('\t','') +".png", base64Data,
									'base64', function(err) {
										if (err)
											console.log(err);
									});
							screenNum++;
							displayTextCount++;

						});
				// driver.wait(until.titleIs(testCase.title), 1000);
				// var target =
				// driver.findElement(By.xpath("//table//tr[0]/td[2]"));
				// driver.wait(driver.findElement(By.xpath("//table//tr[0]/td[2]")),2000).then(clickLink);
				// console.log(target);
			}
			for ( var gradeIdx in s_grades) {
				var grade = s_grades[gradeIdx];
				// console.log('grade >>>' + grade);
				if (grade.xslx == testCase.xslx) {

					// driver.findElement(By. .name('j_password'))
					// by.xpath=
				}
			}
		}

	}
	console.log("finish");
	driver.quit(); 

}
