const cheerio = require("cheerio");
const fetchService = require("../services/fetch_html_service.js");
const Team = require("../models/team");
const he = require('he');
const decode = require('unescape');

const baseURL = "https://totalsportekplus.com/";

const path = {
    all: "football-19",
    highLight: "football-25",
    englandChampionShip: '?tournament_id=1411',
}

const get_schedules = function (req, res) {
    let results = [];
    let url = baseURL + path.all;

    if (req.params.path) {
        url = decodeURIComponent(req.params.path);
    }
    else {
        pathRoute = path.all;
    }
    fetchService.get_html(url, function (error, response, html) {

        if (!error) {
            try {
                let $ = cheerio.load(html);
                $(".matches div.matches_by_day").each(function (index, element) {
                    const date = $(element).find("h3.mddate").attr("data-date");
                    const matches = [];
                    $(element).children("a").each(function (index, ele) {
                        const isHotMatch = $(ele).find("div.match_item.hot-match");
                        
                        const league = $(ele).find("div.match_item .team.team_1 div.team_name").attr("data-text");

                        let hotMatch = false;
                        
                        if (isHotMatch.hasClass("hot-match")) {
                            hotMatch = true;
                        }

                        // else {
                        //     hotMatch = false;
                        // }

                        const time = $(ele).find("div.match_item div.match_info").data("time");
                        const isMatchPlaying = $(ele).find("div.match_item div.match_info div.match_is_playing");



                        let isLive = false;
                        if (isMatchPlaying.hasClass("match_is_playing")) {
                            isLive = true;
                        }
                        else {
                            isLive = false;
                        }

                        const id = $(ele).attr("href").replace(baseURL, "");

                        // team one
                        const teamOne = new Team();

                        teamOne.name = $(ele).find("div.match_item .team.team_1 div.team_logo img").attr("alt").trim();
                        teamOne.logo = baseURL + $(ele).find("div.match_item .team.team_1 div.team_logo img").attr("src");


                        // team two
                        const teamTwo = new Team();

                        teamTwo.name = $(ele).find("div.match_item .team.team_2 div.team_logo img").attr("alt").trim();
                        teamTwo.logo = baseURL + $(ele).find("div.match_item .team.team_2 div.team_logo img").attr("src");

                        // match time
                        matches.push({ id, league, time, isLive, hotMatch, teamOne, teamTwo });

                        return true;


                    });

                    results[index] = { date, matches };
                });

                let prevPage = "";
                let nextPage = "";

                if ($("div#item-list ul > li.pager-prev a").attr("href")) {
                    prevPage = encodeURIComponent(baseURL + $("div#item-list ul > li.pager-prev a").attr("href"))
                }
                if ($("div#item-list ul > li.pager-next a").attr("href")) {
                    nextPage = encodeURIComponent(baseURL + $("div#item-list ul > li.pager-next a").attr("href"));
                }


                res.status(200).json({
                    code: response.statusCode, message: response.statusMessage, data: results, link: {
                        prevPage,
                        nextPage,
                    }
                });
            } catch (e) {
                res.status(404).json({ code: response.statusCode, message: response.statusMessage, });
            }
        }
    });

}

const get_match_details = function (req, res) {
    let url = ""
    let servers = [];
    if (req.params.id) {
        url = baseURL + req.params.id;

        fetchService.get_html(url, function (error, response, html) {
            if (!error) {
                try {
                    let $ = cheerio.load(html);

                    let title = $('div.content_detail h1.featured_title').text();

                    $('div.live_navigator_bottom ul.live_video_backup').children().map((index, element) => {

                        let serverLink = $(element).find('li a').attr('data-src');

                        servers[index] = { serverLink };
                    });

                    res.status(200).json({
                        code: response.statusCode, message: response.statusMessage, data: { title, servers },
                    });
                } catch (e) {
                    res.status(500).json({ code: response.statusCode, message: response.statusMessage, });
                }
            }
        });

    }
    else {
        res.status(404).json({ code: "404", message: "Not found!" })
    }
}

const get_highlights = function (req, res) {
    let highlights = [];
    fetchService.get_html(baseURL + path.highLight, function (error, response, html) {
        if (!error) {
            try {
                let $ = cheerio.load(html);

                $("div.highlight_video_item_wrap").map(function (index, element) {

                    const link = $(element).find('div.highlight_video_item a').attr('href');

                    const image = baseURL + $(element).find('div.highlight_video_item a div.highlight_video_image div.img_wrap img').attr('src');

                    const id = he.unescape($(element).find('div.highlight_video_item a div.highlight_video_info div.highlight_video_match_name').text()).trim();

                    const league_and_date = $(element).find('div.highlight_video_item a div.highlight_video_info div.highlight_video_match_info').text().trim();

                    highlights[index] = { id, image, link, league_and_date };
                });

                res.status(200).json({
                    code: response.statusCode, message: response.statusMessage, data: highlights,
                });
            } catch (err) {
                res.status(500).json({ code: response.statusCode, message: err, });
            }
        } else {
            res.status(404).json({ code: response.statusCode, message: response.statusMessage, });
        }
    });
}



module.exports = {
    get_schedules,
    get_match_details,
    get_highlights,
   
}