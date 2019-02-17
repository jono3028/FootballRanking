/**
 * League Table Generator
 * ~~~~~~~~~~~~~~~~~~~~~~~~~
 * Task: Given the full list of matches for the Premier league 2016/17 Season (https://github.com/openfootball/football.json/blob/master/2016-17/en.1.json), create a script to generate the full league table (as JSON).
 */

 import JSONData from "./en.1.json"; 

interface Team {
    key: string;
    name: string;
    code: string;
}

interface Match {
    date: string;
    team1: Team;
    team2: Team;
    score1: number;
    score2: number;
}

interface Round {
    name: string;
    matches: Match[];
}

interface InputData {
    name: string;
    rounds: Round[];
}

interface TeamMap {
    [key: string]: TeamData;
}

class TeamData {
    private ptsWin: number = 3;
    private ptsDraw: number = 1;

    public name: string;
    public gamesPlayed: number;
    public wins: number;
    public draws: number;
    public goalsFor: number;
    public goalsAgainst: number;

    constructor(name: string) {
        this.name = name;
        this.gamesPlayed = 0;
        this.wins = 0;
        this.draws = 0;
        this.goalsFor = 0;
        this.goalsAgainst = 0;
    }

    public addMatch(goalsFor: number, goalsAgainst: number) {
        if (goalsFor === goalsAgainst) {
            this.draws++;
        } else if (goalsFor > goalsAgainst) {
            this.wins++;
        }
    
        this.goalsFor += goalsFor;
        this.goalsAgainst += goalsAgainst;
        this.gamesPlayed++;
    }

    public goalDiff(): number {
        return this.goalsFor - this.goalsAgainst;
    }

    public losses(): number {
        return this.gamesPlayed - this.wins - this.draws;
    } 

    public points(): number {
        return (this.wins * this.ptsWin) + (this.draws * this.ptsDraw);
    }
}

function createTeamMap(rounds: Round[]): TeamMap {
    
    let map: TeamMap = {};

    for (let round of rounds) {
        let matches = round.matches;

        for (let match of matches) {
            const key1: string = match.team1.code;
            const key2: string = match.team2.code; 

            if (map[key1] === undefined) {
                map[key1] = new TeamData(match.team1.name);
            }
            if (map[key2] === undefined) {
                map[key2] = new TeamData(match.team2.name);
            }
            map[key1].addMatch(match.score1, match.score2);
            map[key2].addMatch(match.score2, match.score1);
        }
    }

    return map;
}
 
/** TODO:
 *  - Move above code out of Main.ts into leagueTableGenerator.ts
 *  - Create new Array of strings containing map keys in rank order
 *  - Move sample JSON data to ./Data folder
 */
createTeamMap(JSONData.rounds);