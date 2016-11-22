# Get top backlinks from a SERP

This module allows to execute a search on Google and get the most important backlinks from the domains's SERP.

# Installation

``` bash
$ npm install backlinks-serp
```

# Example

```javascript

var serp = require("backlinks-serp");

var options = {

  host : "google.com",
  num : 100,
  jar: true,
  qs : {
    q : "blackfriday",
    pws : "0"
  },
  apiKey : process.env.MAJESTIC_API_KEY,
  datasource : "fresh",
  showDomainInfo : true

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

```

# Options

The 'options' json structure can contain the following paramaters :

**For executing the request/scrape on Google :**
- For google.com, the param host is not necessary.
- qs can contain the usual Google search parameters : https://moz.com/ugc/the-ultimate-guide-to-the-google-search-parameters.
- options.qs.q is the keyword or an array of keywords.
- num is the number of desired results (defaut is 10).
- The options object can also contain [Request](https://github.com/request/request) parameters like http headers, ...
- The user agent is not mandatory. Default value will be : 'Mozilla/5.0 (Windows NT 6.1; WOW64; rv:40.0) Gecko/20100101 Firefox/40.1'
- delay : delay in ms between each HTTP request on Google (default : 0 ms).
- retry : number of retry if an HTTP request fails (error or HTTP status != 200).

**For Checking the domains :**
- apiKey : your majestic key API,
- datasource : the majestic datasource (fresh or historic)
- showDomainInfo : add extra info on the domain 
