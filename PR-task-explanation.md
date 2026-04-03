# PR task explanation Notes for reviewer 👨🏻‍💻

## Finding || Fixes (BUgs)

- **Infinite HTTP spam**
  - Root cause: `setInterval(() => store.dispatch(loadColleges()), 1000)` in `ngOnInit`
  - Fix: Dispatch once on init
- **Memory leak #1**
  - Root cause: `private _collegesSub = this.colleges$.subscribe()` never unsubscribed
  - Fix: Removed; replaced with `takeUntil(destroy$)`
- **Memory leak #2**
  - Root cause: `setInterval` never cleared
  - Fix: No interval at all anymore
- **Broken trackBy**
  - Root cause: `item.id + Math.random()` = unique key every cycle, forces Angular to destroy/recreate all 25k rows every ChangeDetect pass in DOM
  - Fix: `return item.id`
- **Effect susceptible to race conditions**
  - Root cause: `mergeMap` allows concurrent in-flight requests
  - Fix: `exhaustMap` = ignores dispatches while one is in flight
- **Deep linking blank page**
  - Root cause: Details component had no data if store was empty on hard refresh
  - Fix: Dispatches `loadColleges` when `selectCollegesLoaded` is false
- **`CollegeDetailsComponent` in providers**
  - Root cause: Standalone components don't belong in `providers[]`
  - Fix: Removed
- **Mobile horizontal scrollbar**
  - Root cause: `overflow: hidden; overflow-x: auto` on card `<tr>` = second rule overrides first
  - Fix: Removed `overflow-x: auto`, kept `overflow: hidden`
- **Dead import**
  - Root cause: `AppComponent` imported `CollegeListComponent` it didn't use after adding router outlet
  - Fix: Removed
- **Filter disconnected**
  - Root cause: Filter input bound via `ngModel` but never applied to the list
  - Fix: Wired through `FilterByNamePipe` injected into component

## Features Added

- **Sorting** on all 8 columns (click header to toggle asc/desc, ARIA `aria-sort` set correctly)
- **Desktop pagination**: 50 records/page with Previous/Next buttons
- **Mobile infinite scroll**: starts at 50, loads +50 each time the user scrolls to within 40 rows of the bottom (via `IntersectionObserver`)
- **`FilterByNamePipe`** in `pipes/`: standalone, case-insensitive substring filter; injected into the component for use in the processing pipeline
- **Lazy-loaded routes**
- **`ChangeDetectionStrategy.OnPush`** on the list component for optimal re-render performance
- **`selectCollegesLoaded` selector** added to the selectors file
- **Added Lint and prettier for format fix**: Makes easy readability and sharing within team easy
- **Added coverage and unit test fixc**

---

## If I have more time

- Teared token's i would have setup on root (tier 1, tier2 and tier 3) current samll project = no need
- worked on TDD make coverage much higher and made it part of yml
- having design / figma for this would make design work easy
- Thankyou for spending time to go through my PR, i enjoyed it sorry beacuse of current work could not get back on early time.
