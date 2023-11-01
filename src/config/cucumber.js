  const path = require('path');


  console.log(__dirname,'.......................dir')
  var reporter = require('cucumber-html-reporter');
  var options = {
          theme: 'bootstrap',
          jsonFile: path.join(__dirname, 'features/report/cucumber_report.json'), 
          output: path.join(__dirname, 'features/report/cucumber_report.html'), 
          reportSuiteAsScenarios: true,
          scenarioTimestamp: true,
          launchReport: false,
          metadata: {
            "App Version":"0.1",
            "Test Environment": "test",
            "Browser": "Chrome",
            "Platform": "Ubuntu 20.4"
          },
          failedSummaryReport: true,
      };
  
      reporter.generate(options);
      

      module.exports = {
        default: `--format-options '{"snippetInterface": "synchronous"}'`
    }
     