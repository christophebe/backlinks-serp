var assert    = require("assert");
const util     = require('util');
var serp   = require("../index.js");
var proxyLoader = require("simple-proxies/lib/proxyfileloader");


describe('search backlinks on SERP', function() {

        var proxyList = null;


        before(function(done) {
            done();
              /*
              this.timeout(100000);
              console.log("Loading proxies ...");
              var config = proxyLoader.config().setProxyFile("./proxies.txt")
                                               .setCheckProxies(true)
                                               .setRemoveInvalidProxies(false);

              proxyLoader.loadProxyFile(config,function(error, pl){
                  if (error) {
                    done(error);
                  }
                  proxyList = pl;
                  console.log("proxies loaded");
                  done();
              });
              */

        });


        it('Should return a list of backlinks from a SERP', function(done) {
            this.timeout(100000);

            var options = {

              host : "google.be",
              num : 20,
              jar: true,
              //delay : 1500,
              qs : {
                q : "prêt personnel belgique",
                pws : "0"
              },
              apiKey : process.env.MAJESTIC_API_KEY,
              datasource : "fresh",
              showDomainInfo : true,
              proxyList

            };

            serp.searchDomainBacklinks(options, function(error, links){
                if (error) {
                  console.log("Error during retrieving domains on SERP : " + error);
                  done();
                }

                //console.log("END TEST", util.inspect(result, false, null));
                console.log("Domain,Domain TF,Domain CF,Domain Topic 1,Domain Topic 2,Domain Topic 3, Country Code,TLD," +
                            "Ext. Backlinks,Indexed URLS, Crawled URLS," +
                            "Source URL,URL TF,URL CF,Topic 1,Topic 2,Topic 3,Link Type,Anchor Text,Target URL,Redirect,Image");


                links.forEach(function(link) {
                  let output = "";
                  if (link.domain) {
                    output += link.domain.name + "," + link.domain.tf + "," + link.domain.cf + "," + link.domain.topical1 + "," +
                              link.domain.topical2 + "," + link.domain.topical3 + "," + link.domain.countryCode + "," + link.domain.tld + "," +
                              link.domain.extBacklinks + "," + link.domain.indexedURLS + "," + link.domain.crawledURLS + ",";
                  }
                  else {
                    output +=  ",,,,,,,,,,,";
                  }
                  output += link.sourceURL + "," + link.tf + "," + link.cf + "," + link.topical1 + "," + link.topical2 + "," + link.topical3 + "," +
                             link.linkType + "," + link.anchorText + "," + link.targetUrl + "," + link.flagRedirect + "," + link.flagImages;
                  console.log(output);
                });

                done();
            });
        });
});
