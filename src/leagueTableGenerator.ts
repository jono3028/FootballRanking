/**
 * League Table Generator
 * ~~~~~~~~~~~~~~~~~~~~~~~~~
 * Author: Jonathan Owen
 * Task: Given the full list of matches for the Premier league 2016/17 Season 
 * (https://github.com/openfootball/football.json/blob/master/2016-17/en.1.json), 
 * create a script to generate the full league table (as JSON).
 */

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

interface OutputData {
    name: string;                                                                                                                                       
    table: RankingRow[];
}

interface RankingRow {
    rank: number;
    name: string;
    gamesPlayed: number;
    wins: number;
    draws: number;
    defeats: number;
    goalsFor: number;
    goalsAgainst: number;
    goalDiff: number;
    points: number;
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
    public goalDiff = (): number =>
        this.goalsFor - this.goalsAgainst;
    public defeats = (): number =>
        this.gamesPlayed - this.wins - this.draws;
    public points = (): number =>
        (this.wins * this.ptsWin) + (this.draws * this.ptsDraw);
}

const rankingRules = (team1: RankingRow, team2: RankingRow): boolean => {
    // Sort by points, then goalDiff, then goalsScored
    let test: boolean = team1.points > team2.points;
    const pointsDraw: boolean = team1.points === team2.points;
    test = (pointsDraw && team1.goalDiff > team2.goalDiff) ? true : test;
    const goalDiffDraw: boolean = team1.goalDiff === team2.goalDiff;
    test = (pointsDraw && goalDiffDraw && team1.goalsFor > team2.goalsFor) ? true : test;

    return test;
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

function sortByRank(teams: TeamMap): RankingRow[] {
    const sorted: RankingRow[] = [];
    let rank = 0;
    for (let key in teams) {
        const team = teams[key];
        sorted.push({
            rank,
            name: team.name,
            gamesPlayed: team.gamesPlayed,
            wins: team.wins,
            draws: team.draws,
            defeats: team.defeats(),
            goalsFor: team.goalsFor,
            goalsAgainst: team.goalsAgainst,
            goalDiff: team.goalDiff(),
            points: team.points()
        })
        let idx: number = sorted.length;
        // Using bubble sort due to the small data set
        while (--idx > 0 && rankingRules(sorted[idx], sorted[idx - 1])) {
            const temp: RankingRow = sorted[idx];
            sorted[idx] = sorted[idx - 1];
            sorted[idx - 1] = temp;
        }
    }
    for (let team of sorted) {
        team.rank = ++rank;
    }

    return sorted;
}

function createJSON(data: any[], dataSetTitle?: string): string {
    const jsonOutput: OutputData = {
        name: (dataSetTitle != undefined) ? dataSetTitle : "",
        table: data
    }

    return JSON.stringify(jsonOutput);
}

export function generateLeagueTable(inputData: InputData) {
    const dataUnsorted = createTeamMap(inputData.rounds);
    const rankingTable = sortByRank(dataUnsorted);

    return createJSON(rankingTable, inputData.name);
}
