# Purpose
This repo is for a challenge that was issued as part of an interview process.  

# Task
Given a full list of matches for the Premier League 2016/2017, create a script to generate the full league table(as JSON). 
The league table should contain the following information, sorted by rank:
- rank
- team name
- total wins
- total draws
- total defeats
- goals for
- goals against
- goal difference
- points

Rank is determined by points, then goal difference, then goals scored.

# Dependencies
Complete list of Premier League 2016/2017 matches available at https://github.com/openfootball/football.json/blob/master/2016-17/en.1.json  

# Thinking
Task will be completed in multiple steps
1) Parse given data and create a map (key = teamName) storing:
	- [x] games played
	- [x] wins 
	- [x] draws
	- [x] goals for
	- [x] goals against
2) Create an array of obj sorted by ranking from map above
3) Creat output JSON from sorted array

# Result verification
A completed table may be found here:  
http://www.espn.com/soccer/standings/_/league/ENG.1/season/2016
