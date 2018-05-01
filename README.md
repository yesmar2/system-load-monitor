# CPU Load Monitor

Web application to monitor CPU utilization on a windows machine.

## Screenshot

![Screenshot](https://github.com/teopalva/simple-load-monitor/blob/master/public/img/screenshot.png)

## Run locally

`git clone https://github.com/yesmar2/system-load-monitor.git`
`cd system-load-monitor`
`npm run server`
`npm run client`

Go to http://localhost:3000/.

### Development

`npm run dev`

### Unit testing

`npm run test`

## Functionality

*   Monitors CPU utilization on a windows machine in 10 second intervals for 10 minutes.
*   When the % utilization reaches 70% or greater on average for the last 2 minutes an alert is triggered.
*   When the % utilization falls below 70% on average for the last 2 minutes a recovery alert is triggered.

## Future improvements

*   Add d3.js gauge visualizations to show the user the average cpu utilization for the last 2, 5, and 10 minutes.
*   Add ability for user to configure alert threshold.
*   Improve responsiveness when user resizes window. Currently a re-render doesn't occur when the window resizes.
*   Update line chart to become a more re-usable component for future use.
*   As the web application scales might need to re-think using react-faux-dom due to potential performance issues due the manipulation of multiple virtual DOMs. One possible approach would be to use React for the DOM, D3 for the math approach.
*   Utilize css modules.
*   Add cross-platform compatibility so that user could view load time on linux based machines.
*   Add SMS/email notifications.
