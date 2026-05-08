# Xello Senior Web Dev Takehome Web

Welcome, intrepid applicant! You have been chosen to embark on a journey through the wilds of Angular, NgRx, and CSS. Your mission, should you choose to accept it (and you must, because you opened this repo), is to whip this codebase into shape and prove your senior developer prowess.

## Start From This Template

This is a template repository. Click **Use this template > Create a new repository** to create your own copy, then complete the assignment in that new repository. Please do not open a pull request against this repository.

## A Note on AI Usage

Please limit the use of AI tools in your submission. We are interested in reviewing your thinking, judgment, tradeoffs, and problem-solving approach, not an AI-generated solution. If you do use AI for small assists, please mention where and how you used it in your submission notes.

## Your Quest

### 1. Fix Performance Issues with Scrolling
- The app currently loads **all 25,000 colleges** into the DOM. If your laptop sounds like a jet engine, that's not a feature.
- There are also some... let's call them "creative" uses of NgRx and change detection. Find and fix the memory leaks, unnecessary re-renders, and any other performance faux pas.

### 2. Implement Deep Linking
- When a user navigates to `/college/:id`, the app should display the details for that college, even if they refresh the page or paste the link into a new tab.
- If you see a blank page or the wrong college, that's your cue to shine.

### 3. Fix Responsive Issue with Side Scrolling on Smaller Resolutions
- On mobile, the table rows become cards. But wait! There's a sneaky horizontal scrollbar lurking in the shadows. Hunt it down and banish it.
- Bonus points for making the cards look extra snazzy on small screens.

### 4. Implement the Filter Feature
- There's a filter input for school name, but it's just for show. Make it actually filter the list of colleges as the user types.
- If you see a mysterious `filterByName` pipe in the template, that's your starting point. (Hint: it doesn't exist yet.)

## How to Run


This project uses node `18.20.8`. We use [volta](https://volta.sh/) to manage our node versions automatically.

1. `npm install`
2. `npm start`
3. Open [http://localhost:4200](http://localhost:4200) and prepare for adventure.

## What We're Looking For
- Clean, maintainable code
- Sensible use of Angular and NgRx best practices
- Responsive, user-friendly UI
- The ability to spot and fix subtle bugs (and not-so-subtle ones)

## Bonus Points
- Include a note with your submission about anything you found particularly fun, tricky, or rage-inducing.
- If you add tests, we will send you a virtual high five.

Good luck, and may your stack traces be short and your builds be green!

## Other optional Tasks

1. Add Unit and Integration Tests
Write tests for reducers, effects, selectors, and components.
Add tests for the filter feature and navigation.

2. Implement Pagination or Virtual Scrolling
Loading and rendering 25,000 records is not practical. Implement pagination or virtual scroll for better performance.

3. Improve Accessibility
Ensure the app is accessible: use semantic HTML, ARIA labels, keyboard navigation, and proper color contrast.

4. Add Error Handling and User Feedback
Show user-friendly error messages if the college data fails to load.
Add loading spinners or skeleton screens for better UX.

5. Add Sorting
Allow users to sort the college list by columns (e.g., name, city, tuition).

6. Enhance the College Details Page
Add a "Back to List" button.

7. Refactor for Code Quality
Remove any remaining anti-patterns or dead code.
Use best practices for NgRx (e.g., avoid unnecessary subscriptions, use feature modules).
Upgrade more legacy angular uses to their more modern equivalents.

8. Use lazy loading for routes and optimize imports.

9. Improve Mobile Experience

10. Make the UI more touch-friendly and ensure all interactive elements are easily tappable.
