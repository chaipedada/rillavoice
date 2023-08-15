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

# Files to Note

- src/index.ts

## Starting the client

1. `cd client/my-app`

2. Install necessary npm packages `npm install`

3. Start the client `npm start`

4. Go to http://localhost:3000/

5. Main features are as following:
   - Query for overal user scorecard average
   - Query for overall category average score
   - View all scorecard averages in Table format and drill down to scorecard breakdown in modal view.

# Files to Note

- src/App.js
- src/Scorecard.js
- src/BreakdownModal.js


## Screenshots

<img width="1066" alt="Screen Shot 2023-08-15 at 12 34 07 AM" src="https://github.com/chaipedada/rillavoice/assets/29969961/4ec17acb-5beb-4ce0-be71-717279854f23">
<img width="653" alt="Screen Shot 2023-08-15 at 12 34 17 AM" src="https://github.com/chaipedada/rillavoice/assets/29969961/0aac616d-4896-4b64-bc18-457407220661">
<img width="548" alt="Screen Shot 2023-08-15 at 12 35 14 AM" src="https://github.com/chaipedada/rillavoice/assets/29969961/bace7905-ba79-47b5-b06a-3cc42c817593">
<img width="553" alt="Screen Shot 2023-08-15 at 12 35 28 AM" src="https://github.com/chaipedada/rillavoice/assets/29969961/8061cb51-e721-4af9-95dc-86a3b504132f">


