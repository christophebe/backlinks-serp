var util         = require('util');
var _            = require("underscore");
var async        = require("async");
var request      = require("request");
var serp         = require("serp");
var majestic     = require("majestic-api");
//var checkDomain  = require("check-domain");
var URI          = require("crawler-ninja-uri");
var log          = require("crawler-ninja-logger").Logger;


function searchDomainBacklinks(searchOptions, callback) {

    serp.search(searchOptions, function(error, urls) {

        if (error) {
            return callback(error);
        }
        //console.log("Serp Result", urls);
        getSortedBacklinks(searchOptions, urls, callback);

    });

}

/**
 *  Get the domains with their infos (availability, MajesticInfo, ... )
 *
 * @param the options use to make the google search and to get info on the domains
 * @param a set of urls matching to a google search
 * @callback(error, domainsInfo)
 */
function getSortedBacklinks(searchOptions, urls, callback) {
    async.waterfall([
      function(callback) {
         getAllBacklinks(searchOptions, urls, callback);
      },

      // Sort the list in function of the Majestic TrustFlow
      function(majesticData, callback) {
        //console.log("Majestic data", util.inspect(majesticData, false, null));

        let domains = searchOptions.showDomainInfo ?  _.flatten(_.map(majesticData, function(r){return r.DataTables.DomainsInfo.Data; })) : [];
        //console.log("domains", util.inspect(domains, false, null));

        let sortedBacklinks = _.sortBy(_.flatten(_.map(majesticData, function(r){ return r.DataTables.BackLinks.Data;})), function(link){ return -link.SourceTrustFlow; });
        //console.log("sortedBacklinks", util.inspect(sortedBacklinks, false, null));



        //console.log("Domain,Domain TF,Domain CF,'TLD', URL Source,URL TF,URL CF,Topic 1,Topic 2,Topic 3,Link Type,Anchor Text,Target URL,Redirect,Image");
        let backlinks = [];
        sortedBacklinks.forEach(function(link){
            let sourceDomain = URI.domain(link.SourceURL);
            let domainInfo = _.find(domains, function(domain){ return domain.Domain === sourceDomain; });
            var backlink = {};

            if (domainInfo) {
              backlink.domain = {};
              backlink.domain.name =  domainInfo.Domain;
              backlink.domain.tf = domainInfo.TrustFlow;
              backlink.domain.cf = domainInfo.CitationFlow;
              backlink.domain.topical1 = domainInfo.TopicalTrustFlow_Topic_0;
              backlink.domain.topical2 = domainInfo.TopicalTrustFlow_Topic_1;
              backlink.domain.topical3 = domainInfo.TopicalTrustFlow_Topic_2;
              backlink.domain.countryCode = domainInfo.CountryCode;
              backlink.domain.tld = domainInfo.TLD;

              backlink.domain.extBacklinks = domainInfo.ExtBackLinks;
              backlink.domain.indexedURLS = domainInfo.IndexedURLs;
              backlink.domain.crawledURLS = domainInfo.CrawledURLs;

            }
            backlink.sourceURL = link.SourceURL;
            backlink.tf =  link.SourceTrustFlow;
            backlink.cf = link.SourceCitationFlow;
            backlink.topical1 = link.SourceTopicalTrustFlow_Topic_0;
            backlink.topical2 = link.SourceTopicalTrustFlow_Topic_1;
            backlink.topical3 = link.SourceTopicalTrustFlow_Topic_2;
            backlink.linkType = link.LinkType;
            backlink.anchorText = link.AnchorText;
            backlink.targetUrl = link.TargetURL;
            backlink.flagRedirect = link.FlagRedirect;
            backlink.flagImages = link.FlagImages;

            backlinks.push(backlink);
        });

        callback(null, backlinks);
      }

    ], function(error, domains) {
        if (error) {
          logError("Error during getting infos for domains", searchOptions, error);
        }
        callback(error, domains);
    });
}

/**
 * Get info on all domains
 *
 * @param the options use to make the google search and to get info on the domains
 * @param a set of urls matching to a google search
 * @callback(error, domainsInfo)
 *
 */
function getAllBacklinks(searchOptions, urls, callback) {
    var domains = [];

    if (urls.length > 100) {
        return callback(new Error("Too many domains to check (max 100)"));
    }

    urls.forEach(function(url) {
        var domain = URI.domain(url.url);
        if (URI.isValidDomain(url.url) && domains.indexOf(domain) < 0) {
          domains.push(domain);
        }
    });

    searchOptions.domains = domains;

    majestic.getBacklinks(searchOptions, function(error, result) {
          callback(error, result);
    });

}

function logInfo(message, options) {
  log.info({module : "check-domain-serp", message : message, options : options});
}

function logError(message, options, error) {
  log.error({module : "check-domain-serp", message : message, options : options, error : error });
}
module.exports.searchDomainBacklinks = searchDomainBacklinks;
