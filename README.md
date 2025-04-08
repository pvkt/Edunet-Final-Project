# Getting Started with Create React App
original project url = https://github.com/sivamohanbabu/ecommerce-week3
i have done the modifications in this project

=========================================================
# Changes done on the project

features adding to the existing code because as a penetrator tester (ethical hacker) , i am trying to make site secure.

# changes done on the signup page  (added gender, phonenumber, confirm password, address, pincode)
1. name 
   a. min characters are 3
   b. max charcters are 15
   c. user name can have spaces   (example name : sam tej)
   d. unique username
2. gender     (added gender feature)
3. phone number  
	a. only 10 digits allowed
	b. phone number should be unique
4. email
	a. emial validation (it should have string&num@string.string)
	b. email should be unique
5. password changes:
   a. lenght should be minimum 8 chars & max 15 chars
   b. password validation ( confirm password)
   c. password is encrypted and stored in the database
   d. input should only allow A-z a-z @ # _  charcters
6. Adderess   
	a. user can enter upto 50 charactres
	b. Allowed charcters   A-z a-z , - /
7. pincode     (only 6 numbers allowed)
8. added trim function (remove spaces from front & back)
( done form validation on both frontend & backend  ) ⇒ the frontend validations can be bypassed using the burpsuite tool. so we are performing validations on both frontend and backend


reasons :
• if there is no maximum charcaters = there is a possiblity of buffer flow attacks (send large amount of data and the backend may crash , or add some paylods in buffer and send to target we can exploit)
• only limited characters =  becausing by using some symbols we can perform different attacks (ex: sql injections, cross-site-scripting(xss) attacks,...) so we used limited symbols


#changes done on the login page
1. shows error message when we enter wrong details (Invalid Credentials)
2. added forgot password feature


# added profile
1. my profile  (update the profile)
2. my orders (just show order price , date & order id)
3. settting (change password)  


=====================================================
# Changes to be done to run the code

after downloading the code
# git clone

go to each directory (/admin, /frontend, /backend) and install node modules
> cd /admin       
> npm install
and also run npm install in /frontend & /backend directories


in the backend folder .env file
change the mongodb url

backend command
# nodemon index.js

frontend command & admin command
# npm start





==================================

This project was bootstrapped with [Create React App](https://github.com/facebook/create-react-app).

## Available Scripts

In the project directory, you can run:

### `npm start`

Runs the app in the development mode.\
Open [http://localhost:3000](http://localhost:3000) to view it in your browser.

The page will reload when you make changes.\
You may also see any lint errors in the console.

### `npm test`

Launches the test runner in the interactive watch mode.\
See the section about [running tests](https://facebook.github.io/create-react-app/docs/running-tests) for more information.

### `npm run build`

Builds the app for production to the `build` folder.\
It correctly bundles React in production mode and optimizes the build for the best performance.

The build is minified and the filenames include the hashes.\
Your app is ready to be deployed!

See the section about [deployment](https://facebook.github.io/create-react-app/docs/deployment) for more information.

### `npm run eject`

**Note: this is a one-way operation. Once you `eject`, you can't go back!**

If you aren't satisfied with the build tool and configuration choices, you can `eject` at any time. This command will remove the single build dependency from your project.

Instead, it will copy all the configuration files and the transitive dependencies (webpack, Babel, ESLint, etc) right into your project so you have full control over them. All of the commands except `eject` will still work, but they will point to the copied scripts so you can tweak them. At this point you're on your own.

You don't have to ever use `eject`. The curated feature set is suitable for small and middle deployments, and you shouldn't feel obligated to use this feature. However we understand that this tool wouldn't be useful if you couldn't customize it when you are ready for it.

## Learn More

You can learn more in the [Create React App documentation](https://facebook.github.io/create-react-app/docs/getting-started).

To learn React, check out the [React documentation](https://reactjs.org/).

### Code Splitting

This section has moved here: [https://facebook.github.io/create-react-app/docs/code-splitting](https://facebook.github.io/create-react-app/docs/code-splitting)

### Analyzing the Bundle Size

This section has moved here: [https://facebook.github.io/create-react-app/docs/analyzing-the-bundle-size](https://facebook.github.io/create-react-app/docs/analyzing-the-bundle-size)

### Making a Progressive Web App

This section has moved here: [https://facebook.github.io/create-react-app/docs/making-a-progressive-web-app](https://facebook.github.io/create-react-app/docs/making-a-progressive-web-app)

### Advanced Configuration

This section has moved here: [https://facebook.github.io/create-react-app/docs/advanced-configuration](https://facebook.github.io/create-react-app/docs/advanced-configuration)

### Deployment

This section has moved here: [https://facebook.github.io/create-react-app/docs/deployment](https://facebook.github.io/create-react-app/docs/deployment)

### `npm run build` fails to minify

This section has moved here: [https://facebook.github.io/create-react-app/docs/troubleshooting#npm-run-build-fails-to-minify](https://facebook.github.io/create-react-app/docs/troubleshooting#npm-run-build-fails-to-minify)




