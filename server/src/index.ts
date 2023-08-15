/* eslint-disable @typescript-eslint/no-explicit-any */
import * as fs from 'fs';
import * as path from 'path';
import {parse} from 'csv-parse';

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

const keys = [
  INTRO,
  COMPANY_STORY,
  PRODUCT_DESIGN,
  INSPECTION,
  PRICING,
  OBJECTION_HANDLING,
  CLOSING,
];

const overallScores: Map<string, number> = new Map<string, number>();
for (const key of keys) {
  overallScores.set(key, 0);
}

type Scorecard = {
  conversation_id: number;
  user_name: string;
  date: string;
  Intro: string;
  CompanyStory: string;
  ProductDemo: string;
  Inspection: string;
  Pricing: string;
  ObjectionHandling: string;
  Closing: string;
};

class ScorecardWithAverage {
  conversation_id: number;
  user_name: string;
  scorecard_average: number;
  scores: Map<string, number> = new Map<string, number>();

  constructor(scorecard: Scorecard) {
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
      } else {
        overallScores.set(question, score);
      }
      sum += score;
    }
    this.scorecard_average = sum / this.scores.size;
  }
}

let scorecards: Scorecard[] = [];
const scorecardAverages: ScorecardWithAverage[] = [];

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

  const fileContent = fs.readFileSync(csvFilePath, {encoding: 'utf-8'});

  parse(
    fileContent,
    {
      delimiter: ',',
      columns: headers,
    },
    (error, result: Scorecard[]) => {
      if (error) {
        console.error(error);
      }
      scorecards = result;
      for (const scorecard of scorecards) {
        if (scorecard.conversation_id >= 1) {
          scorecardAverages.push(new ScorecardWithAverage(scorecard));
        }
      }
    }
  );
})();

function getScorecardAveragePerRep(username: string): string {
  const averages: number[] = [];
  let sum = 0;
  for (const scorecardAverage of scorecardAverages) {
    if (scorecardAverage.user_name === username) {
      averages.push(scorecardAverage.scorecard_average);
      sum += scorecardAverage.scorecard_average;
    }
  }
  return (sum / averages.length).toString();
}

function getScorecardAveragePerQuestion(question: string): string {
  // standardize input
  const category = question.replace(' ', '').toLowerCase();
  const sum = overallScores.get(category);
  if (sum) {
    return (sum / scorecardAverages.length).toString();
  } else {
    throw Error('could not calculate sum of question scores successfully');
  }
}

// health check to see if server is running
app.get('/healthCheck', (req: any, res: any) => {
  res.json({message: 'Server is up and running!'});
});

// get raw scorecard data (from csv)
app.get('/scorecard', (req: any, res: any) => {
  res.send(scorecards);
});

// scorecard averages formatted for easy access on frontend
app.get('/scorecardAverages', (req: any, res: any) => {
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
app.get('/scorecardAveragesPerRep', (req: any, res: any) => {
  const username = req.query.username;
  res.send(getScorecardAveragePerRep(username));
});

// Overall average score for each category across all reps
app.get('/scorecardAveragesPerQuestion', (req: any, res: any) => {
  const question = req.query.question;
  res.send(getScorecardAveragePerQuestion(question));
});

app.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});
