## Starting the Server

1. `cd server`

2. Install necessary npm packages `npm install`

3. Compile the typescript code `npm run compile`

4. Run the compiled index.js `node ./build/src/index.js`

5. Endpoints can be accessed at http://localhost:8000/.
   The following endpoints are available:

   - GET health check - /healthCheck
   - GET raw scorecard data - /scorecard
   - GET overall scorecard averages - /scorecardAverages
   - GET scorecard average per user - /scorecardAveragesPerRep?username=
   - GET scorecard average per category - /scorecardAveragesPerQuestion?question=

## Starting the client

1. `cd client/my-app`

2. Install necessary npm packages `npm install`

3. Start the client `npm start`

4. Go to http://localhost:3000/

5. Main features are as following:
   - Query for overal user scorecard average
   - Query for overall category average score
   - View all scorecard averages in Table format and drill down to scorecard breakdown in modal view.
