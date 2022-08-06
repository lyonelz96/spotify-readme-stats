# spotify-readme-stats

## What Is This?

Server made in ExpressJS that serves svg 'widgets' that contain information
about your Spotify such as Top Artists, Recently Played and Top Artists. You
can use these to prettify your github profile!

### Examples
[![Recently Played](https://spotify-readme-stats.herokuapp.com/user/o7nem2dkxnsibr6fi9w1jo9v4/recently-played)](https://spotify-readme-stats.herokuapp.com/user/o7nem2dkxnsibr6fi9w1jo9v4/recently-played)
[![Top Tracks](https://spotify-readme-stats.herokuapp.com/user/o7nem2dkxnsibr6fi9w1jo9v4/top-tracks)](https://spotify-readme-stats.herokuapp.com/user/o7nem2dkxnsibr6fi9w1jo9v4/top-tracks)
[![Top Artists](https://spotify-readme-stats.herokuapp.com/user/o7nem2dkxnsibr6fi9w1jo9v4/top-artists)](https://spotify-readme-stats.herokuapp.com/user/o7nem2dkxnsibr6fi9w1jo9v4/top-artists)

## Why?

I saw people have these fancy widgets on their github profile and I was curious
how they were getting that. Turns out they were just serving an svg through
some server and just displaying it using github markdown. Decided to give it a
go and here we are.

## How To Use
  - Go to [https://spotify-readme-stats.herokuapp.com/auth/authorize](https://spotify-readme-stats.herokuapp.com/auth/authorize)
    - This should take you through the Auth flow for Spotify
    - The scopes I require are the following:
      - user-read-recently-played
        - To get your recently played tracks
      - user-top-read
        - To get your top artists/tracks
      - user-read-private
        - To get your spotify id
   - **Once you go through the auth it should redirect you to an endpoint that returns a message and a secret. This secret is important if you want to delete your information from the database later on. (You can get a new secret by going through the authorization again)**
   - The following 3 endpoints are available for you (Replace :spotify_id with your actual spotify_id)
     - `/user/:spotify_id/recently-played`
       - Will serve the recently played svg
     - `/user/:spotify_id/top-artists`
       - Will serve the top artists svg
     - `/user/:spotify_id/top-tracks`
       - Will serve the top tracks svg
   - To use those svgs in a README.md you just have to treat it like any other img on the web
     - `![svg](svg url goes here)`
       - E.g. `![Recently Played](https://spotify-readme-stats.herokuapp.com/user/:spotify_id/recently-played)`
       - `[![Recently Played](https://spotify-readme-stats.herokuapp.com/user/:spotify_id/recently-played)](https://spotify-readme-stats.herokuapp.com/user/:spotify_id/recently-played)`
         - To go directly to the website instead of githubs camo thingy
     - You can also use an `<img>` tag
    
## How To Work With It Locally
  - You need [Docker](https://www.docker.com/) and [Node JS](https://nodejs.org/en/) installed
  - Clone repo whichever way you prefer `git clone https://github.com/lyonelz96/spotify-readme-stats.git`
  - `cd spotify-readme-stats && npm i`
  - Create a spotify app. 
    - Read more about it [here](https://developer.spotify.com/documentation/web-api/quick-start/)
  - Set up environment variables
    - Copy the .env.sample file to make a .env file `cp .env.sample .env`
    - Edit .env to your liking
  - Run `npm run startdb` to start up a docker container with a postgres and pg-admin instance
    - If you need to access the shell in the container take a look at the `dbshell` script (In package.json) and provide it the correct arguments
      - E.g. `npm run dbshell --container=container_name --user=pg_user`
    - When you are done using it you can run `npm run stopdb`
      - This will stop the containers and delete any volumes that were created
  - Run `npm run dev` to start the development server
  - Go to [localhost:3000](http://localhost:3000) and hopefully you're up and running!
  
## How To Deauthorize The App
  - Go to the app section of your Spotify Profile [https://www.spotify.com/account/apps/](https://www.spotify.com/account/apps/)
  - Look for `spotify-readme-stats` and click `Remove Access`

## How To Remove Your Account And SVGs From The Database
  - You need the secret you got when you authorized the app
  - Using curl you can send a DELETE request
    - `curl -X "DELETE" "https://spotify-readme-stats.herokuapp.com/user/:spotify_id" -H "Content-Type: application/json" -d '{"secret": "Secret Goes Here"}'`
    - Replace `:spotify_id` with your actual spotify_id and `Secret Goes Here` with the actual secret string
  - You should hopefully get a success message back, you can verify if the account is still found by going to one of the svg endpoints or to the `/user/:spotify_id` endpoint
  
## SVG Won't Load
  - I am using Heroku's free hosting at the moment and so unfortunately if the site is inactive it will go to sleep. The images won't load because the site doesn't wake up fast enough.

## How Do The Widgets Update?
  - Whenever you go to a widgets endpoint (`https://spotify-readme-stats.herokuapp.com/user/:spotify_id/recently-played` for example) one of two things will happen:
    - If the widget is updateable it will send a request to Spotify to get the newest information
    - If it isn't, the SVG stored in the database will be served

### When Is A Widget Updateable?
  - In order to not spam Spotify I put a 'time limit' where you can only request the newest information if it's been 'X' amount of time since the last time a request to Spotify has been sent
  - For the Recently Played widget that is 15 mins (Since this information is updated more often)
  - For the rest is once a day

## What Is My Spotify ID?
  - Go to [https://www.spotify.com/account/overview/](https://www.spotify.com/account/overview/)
  - Your ID should be your username (Different from your display name)
