# Idea 3

## Title: **Walmart OPD Dashboard**

## Overview
In the backroom of Walmart, in their OPD (Online Pickup and Delivery) department, Associates manage the shopping and delivery of online order.  To improve efficency, large monitors were added to display orders that need to work on.

What I am proposing, is a system that highlights particular orders and order totes to ensure the department does not fall behind and meets our hourly targets.

*Note:*
After this has been developed should be able to be easily modified to meet other department's needs.

## Features
### Primary
- Dashboard for following tasks
    - Picking
        - How many items need to be shopped?
        - What items were missed and need to be pulled from the back?
    - Stagging
        - What orders are yet to be grouped together that are close to their pickup time?
        - Quality Checks for the hour
        - Rejected subsitutions from customers
        - Canceled orders to be returned to the floor
    - Dispensing
        - Orders that need to be prepped for dispensing
        - Orders to be dispensed to the customer

### Secondary
- Announcements
    - Tip and tricks of the trade for each area of focus
    - Reminders to complete Employee Monthly Training near the end of the month

### Tertiary
- Manager
    - Assignment of tasks to associates
    - Track skills demonstrated by associates
    - Auto assign tasks to asscociates based on skills.

## Tech Stack

- Frontend
    - HTML
    - CSS
    - Javascript (Modular)
- Backend
    - Node.js
- Database
    - MySQL Server


## Process Description

### *Setup:*

For new systems, the manager goes to the site.  They will be able to select either:
- Premade dashboards based on display screens available or
- Manually create dashboards based on preference

After dashboards are configured, manager clicks on the dashboard link to trigger its display.  Move the display tab(s) to the desired screen and let it do the rest.

### *Display system:*

Tasks will pull from the Walmart API and update the content.  Time delays till vary based on the tasks but will stay between 15-60 sec. This will utilize the JS Promise design to allow for asynchronous promises to the backend API and then timeouts for the auto-updating.

If the content to be updated does not change for a set period of time, it will diplay one of two types of announcements:

1. Full-screen announcement:
    - This will fill the full screen to grab attention
2. Small content
    - This will follow the standard small ads you see on the various websites one might visit.  Animation will be limited to not overwelm the observers.

The styling will follow a responsive layout to maximize the content being displayed; Horizonal vs Vertical display mounting.

| Grouping | Task       | Delay  | Description |
| ----     | ---        | ---    | ---|
| Manager  | Walk-in    | 15 min | Learn what you are doing for the day    |
| Picking  | Picking    | 5 min | Collecting items from the Walmart floor |
| Picking  | Exceptions | 5 min | Search backroom for item(s) not found out on the floor |
| Staging | Staging    | 5 min | Grouping totes with items based on Order or Delivery |
| Staging | Cold Carts | 5 min | Same as *Staging* but for all the cold items |
| Staging | Quality Control | 5 min | Ensure what was pick is what was planned |
| Staging | Rejection | 5 min | Remove rejected subsitution(s) from the order |
| Staging | Cancelation | 15 min | Remove order from the stagging floor and move items to the '*Go Backs*' |
| Dispensing | Prep | 1 min | Collect totes from the stagging areas in preparation of sending it out for '*Pickup*' or '*Delivery*' |
| Dispensing | Dispensing | 30 sec | Take dollies filling with totes out to 'customer' or 'delivery driver' |

### Manager Assignment

This will be a link available at the setup screen.  Here the manager can assign tasks to the Associates for the tasks to be performed for the day.

1. Update skills
    - Click on Associate and the skill
    - Indicate which sub-skills have been consistantly demonstrated
    - Click update
2. Import department Schedule to get Associates and who is working for the week
    - Auto Mode: Assign Associates to tasks based on the skills
        - High skill value will be prioritized
        - Low skill value for covering schedule lunch
        - Medium skill value for after primary Associate finishes their shift
    - Manual Mode: Assign Associates to tasks based on the day and time 