# spotify-readme-stats

## What the hell is this?

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
  - Go to [https://spotify-readme-stats.herokuapp.com/login](https://spotify-readme-stats.herokuapp.com/login)
    - This should take you through the Auth flow for Spotify
    - The scopes I require are the following:
      - user-read-recently-played
        - To get your recently played tracks
      - user-top-read
        - To get your top artists/tracks
      - user-read-private
        - To get your spotify id and your display name
   - Once you go through the auth it should redirect you to the homepage where you'll see your display name and your spotify id
   - The following 3 endpoints are available for you (Replace :spotify_id with your actual spotify_id)
     - `/user/:spotify_id/recently-played`
       - Will serve the recently played svg
     - `/user/:spotify_id/top-artists`
       - Will serve the top artists svg
     - `/user/:spotify_id/top-tracks`
       - Will serve the top tracks svg
   - To use those svgs in a README.md you just have to treat like any other img on the web
     - `![svg](svg url goes here)`
       - E.g. `![Recently Played](https://spotify-readme-stats.herokuapp.com/user/:spotify_id/recently-played)`
       - `[![Recently Played](https://spotify-readme-stats.herokuapp.com/user/:spotify_id/recently-played)](https://spotify-readme-stats.herokuapp.com/user/:spotify_id/recently-played)`
         - To go directly to the website instead of githubs camo thingy
    
  

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
  
## Future
My curiosity was satisfied with this project and I'm ready to move on to the next thing. That being said if I encounter any major bug I'll look into it and try to fix it. 

You are more than welcome to open any issues and PRs!

Here's some stuff that I may tackle at some point or I just couldn't figure it out:
  - A way to 'auto' update the widgets.
    - As of now the only way to update the widgets is to actually go to the website that serves them while being logged in/authorized. Every widget has a 'time limit' in order to not spam Spotify lol
      - Recently Played can be refreshed every 15 mins
      - Top Artists and Top Tracks can be refreshed every 4 weeks
    - If you go to the website that serves the svg while authorized and it hasn't been that long for the svg you're looking for you'll just get the one stored in the DB and not make a request to spotify
    - My original thought was to update them if possible by just visiting your github readme but I couldn't really figure out how to make an 'authorized' request from the markdown file on github to the website (I don't even know if it's possible at this point) and just gave up on figuring it out haha
    
  - Clean up some of the code
    - Specifically the user controller. I just think it's pretty ugly and there's some repetition that could be cleaned up. I just have to figure out a way to generalize the generation of the SVGS since each one needs a bit different pieces of information but the 'flow' on how it's done is essentially the same.
