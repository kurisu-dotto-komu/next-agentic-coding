## FEATURE:

A simple audience engagement app that allows visitors to express their opinion at any time based on holding down a button to signal a Maro or Batsu (or no vote).

The intention is that users vote on their phones but see a display of all votes in realtime on the desktop view.

Use viewport to to show a mobile and a desktop view.

Inspired by the Nintendo Wii Mii characters.

All data will be stored in convex and streamed realtime.

The mobile view will show:

- A unique randomly generated character avatar for that user, the user session should persist across refreshes
- Two buttons: to vote for the "O" or "X" characters (japanese Maru and Batsu)
- when the user touches one of the buttons, the character raises a little whiteboard with the symbol of the character they voted for
- the character will lower the whiteboard after a short delay upon release of the button
- users can freely touch buttons to vote for either character at any time, or not vote at all

On the desktop view:

- Show the presence of all the users, even if they are not currently voting, represented by their avatar.
- If they are voting, show the symbol of the character they voted for.
- Above everyone is a bar that shows the proportion of X and O votes, and a transprent gap for unvoted users.
- The bar should be animated to show the proportion of votes.
- The bar should be updated in realtime as votes are cast.
- The bar should be updated in realtime as users join and leave.
- The crowd sholuld automatically shuffle and resize to fit the number of users.
- A QR code appears in the top right corner showing the app's URL, which can be scanned to open the app on a phone.

## EXAMPLES:

No specific examples, just follow existing codebase for patterns.

## DOCUMENTATION:

N/A - research as needed.

## OTHER CONSIDERATIONS:

Find a library online for character generation.
Use a local convex dev server for development.
Clean up the existing next boilerplate, this feature will appear on the landing page.
