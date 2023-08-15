"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/* eslint-disable @typescript-eslint/no-explicit-any */
const fs = require("fs");
const path = require("path");
const csv_parse_1 = require("csv-parse");
const express = require('express');
const cors = require('cors');
const app = express();
app.use(cors());
app.use(express.json());
const port = 8000;
const INTRO = 'intro';
const COMPANY_STORY = 'companystory';
const PRODUCT_DESIGN = 'productdesign';
const INSPECTION = 'inspection';
const PRICING = 'pricing';
const OBJECTION_HANDLING = 'objectionhandling';
const CLOSING = 'closing';
const CATEGORY_NOT_FOUND = 'Category not found';
const USER_NOT_FOUND = 'User not found';
const keys = [
    INTRO,
    COMPANY_STORY,
    PRODUCT_DESIGN,
    INSPECTION,
    PRICING,
    OBJECTION_HANDLING,
    CLOSING,
];
const overallScores = new Map();
for (const key of keys) {
    overallScores.set(key, 0);
}
class ScorecardWithAverage {
    constructor(scorecard) {
        this.scores = new Map();
        this.conversation_id = scorecard.conversation_id;
        this.user_name = scorecard.user_name;
        this.scores.set(INTRO, parseInt(scorecard.Intro));
        this.scores.set(COMPANY_STORY, parseInt(scorecard.CompanyStory));
        this.scores.set(PRODUCT_DESIGN, parseInt(scorecard.ProductDemo));
        this.scores.set(INSPECTION, parseInt(scorecard.Inspection));
        this.scores.set(PRICING, parseInt(scorecard.Pricing));
        this.scores.set(OBJECTION_HANDLING, parseInt(scorecard.ObjectionHandling));
        this.scores.set(CLOSING, parseInt(scorecard.Closing));
        let sum = 0;
        for (const [question, score] of this.scores) {
            const overallQuestionScore = overallScores.get(question);
            if (overallQuestionScore) {
                overallScores.set(question, overallQuestionScore + score);
            }
            else {
                overallScores.set(question, score);
            }
            sum += score;
        }
        this.scorecard_average = sum / this.scores.size;
    }
}
let scorecards = [];
const scorecardAverages = [];
(() => {
    const csvFilePath = path.resolve(__dirname, '../../scorecards.csv');
    const headers = [
        'conversation_id',
        'user_name',
        'date',
        'Intro',
        'CompanyStory',
        'ProductDemo',
        'Inspection',
        'Pricing',
        'ObjectionHandling',
        'Closing',
    ];
    const fileContent = fs.readFileSync(csvFilePath, { encoding: 'utf-8' });
    (0, csv_parse_1.parse)(fileContent, {
        delimiter: ',',
        columns: headers,
    }, (error, result) => {
        if (error) {
            console.error(error);
        }
        scorecards = result;
        for (const scorecard of scorecards) {
            if (scorecard.conversation_id >= 1) {
                scorecardAverages.push(new ScorecardWithAverage(scorecard));
            }
        }
    });
})();
function getScorecardAveragePerRep(username) {
    const averages = [];
    let sum = 0;
    for (const scorecardAverage of scorecardAverages) {
        if (scorecardAverage.user_name === username) {
            averages.push(scorecardAverage.scorecard_average);
            sum += scorecardAverage.scorecard_average;
        }
    }
    // no rep should be getting all 0s so its an indicator that the rep does not exist
    if (sum === 0) {
        throw Error(USER_NOT_FOUND);
    }
    return (sum / averages.length).toString();
}
function getScorecardAveragePerQuestion(question) {
    // standardize input
    const category = question.replace(' ', '').toLowerCase();
    if (!overallScores.has(category)) {
        throw Error(CATEGORY_NOT_FOUND);
    }
    const sum = overallScores.get(category);
    if (sum) {
        return (sum / scorecardAverages.length).toString();
    }
    else {
        throw Error('could not calculate sum of question scores successfully');
    }
}
// health check to see if server is running
app.get('/healthCheck', (req, res) => {
    res.json({ message: 'Server is up and running!' });
});
// get raw scorecard data (from csv)
app.get('/scorecard', (req, res) => {
    res.send(scorecards);
});
// scorecard averages formatted for easy access on frontend
app.get('/scorecardAverages', (req, res) => {
    const averages = scorecardAverages.map(scorecard => {
        return {
            conversationID: scorecard.conversation_id,
            username: scorecard.user_name,
            scores: [...scorecard.scores],
            scorecardAverage: scorecard.scorecard_average,
        };
    });
    res.send(averages);
});
// Overall average per rep across all their scorecards
app.get('/scorecardAveragesPerRep', (req, res) => {
    const username = req.query.username;
    res.send(getScorecardAveragePerRep(username));
});
// Overall average score for each category across all reps
app.get('/scorecardAveragesPerQuestion', (req, res) => {
    const question = req.query.question;
    res.send(getScorecardAveragePerQuestion(question));
});
app.listen(port, () => {
    console.log(`Server listening on port ${port}`);
});
//# sourceMappingURL=index.js.map